import { describe, expect, it, beforeEach, vi } from 'vitest';
import type { DireitoItem, LinhaDireitoItem, MensagemChat } from '../src/tipos.js';
import { linhaParaItem } from '../src/tipos.js';
import { ordenarLinhaDaVida } from '../src/triagem.js';

// Fábrica de items para os testes. O que não passa é aquilo que a heurística
// realmente lê: id, nome, categoria_vida e prioridade_base.
function criarItem(patch: Partial<LinhaDireitoItem>): DireitoItem {
  const base: LinhaDireitoItem = {
    id: 'x',
    nome_popular: 'Item X',
    categoria_vida: 'familia_crianca',
    natureza: 'beneficio',
    criterios_elegibilidade: 'critério',
    documentos_necessarios: ['CPF'],
    canal_tipo: 'presencial',
    canal_detalhe: 'CRAS',
    passo_a_passo: ['passo 1'],
    fonte_legal: 'Lei X',
    prioridade_base: 3,
    ultima_revisao: '2026-01-01',
    abrangencia: 'federal',
  };
  return linhaParaItem({ ...base, ...patch });
}

describe('ordenarLinhaDaVida (RF04)', () => {
  it('coloca violência doméstica sempre no topo, mesmo com prioridade_base pior', () => {
    const bolsa = criarItem({ id: 'bolsa', nome_popular: 'Bolsa Família', prioridade_base: 1 });
    const violencia = criarItem({
      id: 'medida-protetiva',
      nome_popular: 'Medida protetiva',
      categoria_vida: 'violencia_domestica',
      prioridade_base: 5,
    });
    const bpc = criarItem({
      id: 'bpc',
      nome_popular: 'BPC/LOAS',
      categoria_vida: 'idoso',
      prioridade_base: 2,
    });

    const resultado = ordenarLinhaDaVida([bolsa, violencia, bpc], false);
    expect(resultado.map((i) => i.id)).toEqual(['medida-protetiva', 'bolsa', 'bpc']);
  });

  it('quando risco_imediato=true, saúde mental também vai pro topo', () => {
    const bolsa = criarItem({ id: 'bolsa', prioridade_base: 1 });
    const capsMental = criarItem({
      id: 'caps',
      categoria_vida: 'saude_mental',
      prioridade_base: 4,
    });
    // Sem risco: caps fica no meio pela prioridade_base 4
    const semRisco = ordenarLinhaDaVida([bolsa, capsMental], false);
    expect(semRisco.map((i) => i.id)).toEqual(['bolsa', 'caps']);
    // Com risco: caps vira topo
    const comRisco = ordenarLinhaDaVida([bolsa, capsMental], true);
    expect(comRisco.map((i) => i.id)).toEqual(['caps', 'bolsa']);
  });

  it('desempata por prioridade_base e depois alfabético em pt-BR', () => {
    const a = criarItem({ id: 'a', nome_popular: 'Água', prioridade_base: 3 });
    const c = criarItem({ id: 'c', nome_popular: 'Cadastro Único', prioridade_base: 3 });
    const b = criarItem({ id: 'b', nome_popular: 'Bolsa', prioridade_base: 2 });
    const z = criarItem({ id: 'z', nome_popular: 'Zerador', prioridade_base: 1 });

    const resultado = ordenarLinhaDaVida([a, c, b, z], false);
    expect(resultado.map((i) => i.id)).toEqual(['z', 'b', 'a', 'c']);
  });

  it('é puro: não muta o array de entrada', () => {
    const entrada = [
      criarItem({ id: 'a', prioridade_base: 3 }),
      criarItem({ id: 'b', prioridade_base: 1 }),
    ];
    const antes = entrada.map((i) => i.id);
    ordenarLinhaDaVida(entrada, false);
    expect(entrada.map((i) => i.id)).toEqual(antes);
  });

  it('lida com lista vazia', () => {
    expect(ordenarLinhaDaVida([], false)).toEqual([]);
  });
});

// executarTriagem depende de: busca semântica (Supabase), provedor LLM (Gemini) e
// busca de fichas por id. Todos são mockados no nível de módulo — nenhum teste toca rede.
const mockBuscarItensRelevantes = vi.fn();
const mockBuscarFichasPorIds = vi.fn();
const mockGerarTexto = vi.fn();

vi.mock('../src/busca.js', () => ({
  buscarItensRelevantes: (...args: unknown[]) => mockBuscarItensRelevantes(...args),
  buscarFichasPorIds: (...args: unknown[]) => mockBuscarFichasPorIds(...args),
  listarTodosItens: vi.fn(),
}));

vi.mock('../src/provedor-llm.js', () => ({
  obterProvedorLLM: () => ({
    nome: 'mock',
    gerarTexto: mockGerarTexto,
    gerarEmbedding: vi.fn(),
  }),
  criarProvedorLLM: vi.fn(),
}));

const { executarTriagem, ErroTriagem } = await import('../src/triagem.js');

describe('executarTriagem', () => {
  beforeEach(() => {
    mockBuscarItensRelevantes.mockReset();
    mockBuscarFichasPorIds.mockReset();
    mockGerarTexto.mockReset();
  });

  it('exige que a última mensagem seja do usuário', async () => {
    const historico: MensagemChat[] = [
      { papel: 'usuario', conteudo: 'oi' },
      { papel: 'assistente', conteudo: 'olá' },
    ];
    await expect(executarTriagem(historico)).rejects.toBeInstanceOf(ErroTriagem);
  });

  it('devolve pergunta quando o LLM ainda precisa entender melhor', async () => {
    mockBuscarItensRelevantes.mockResolvedValue([]);
    mockGerarTexto.mockResolvedValue(
      JSON.stringify({ tipo: 'pergunta', mensagem: 'Qual a renda da sua família?' }),
    );

    const resposta = await executarTriagem([{ papel: 'usuario', conteudo: 'tô sem grana' }]);
    expect(resposta).toEqual({ tipo: 'pergunta', mensagem: 'Qual a renda da sua família?' });
    expect(mockBuscarFichasPorIds).not.toHaveBeenCalled();
  });

  it('não envia dados pessoais reconhecíveis para busca nem geração', async () => {
    mockBuscarItensRelevantes.mockResolvedValue([]);
    mockGerarTexto.mockResolvedValue(
      JSON.stringify({ tipo: 'pergunta', mensagem: 'Qual a renda aproximada da casa?' }),
    );

    const resposta = await executarTriagem([
      {
        papel: 'usuario',
        conteudo: 'Meu CPF é 123.456.789-09 e meu e-mail é pessoa@exemplo.com',
      },
    ]);

    expect(mockBuscarItensRelevantes).toHaveBeenCalledWith(
      'Meu CPF é [CPF REMOVIDO] e meu e-mail é [E-MAIL REMOVIDO]',
      10,
    );
    const mensagensEnviadas = mockGerarTexto.mock.calls[0][1] as MensagemChat[];
    expect(mensagensEnviadas[0].conteudo).toBe(
      'Meu CPF é [CPF REMOVIDO] e meu e-mail é [E-MAIL REMOVIDO]',
    );
    expect(JSON.stringify(mensagensEnviadas)).not.toContain('123.456.789-09');
    expect(JSON.stringify(mensagensEnviadas)).not.toContain('pessoa@exemplo.com');
    expect(resposta).toEqual({
      tipo: 'pergunta',
      mensagem: 'Qual a renda aproximada da casa?',
      aviso_dados_mascarados: true,
    });
  });

  it('devolve sem_match quando o LLM propõe id que não está entre candidatos', async () => {
    const bolsa = criarItem({ id: 'bolsa-familia', prioridade_base: 1 });
    mockBuscarItensRelevantes.mockResolvedValue([bolsa]);
    mockGerarTexto.mockResolvedValue(
      JSON.stringify({
        tipo: 'resultado',
        mensagem: 'Talvez isso ajude',
        risco_imediato: false,
        itens: [{ id: 'item-inventado', motivo: 'porque sim' }],
      }),
    );

    const resposta = await executarTriagem([{ papel: 'usuario', conteudo: 'preciso de ajuda' }]);
    expect(resposta.tipo).toBe('sem_match');
    expect(mockBuscarFichasPorIds).not.toHaveBeenCalled();
  });

  it('monta linha de vida em ordem, aplicando urgência do LLM (risco_imediato)', async () => {
    const bolsa = criarItem({ id: 'bolsa', prioridade_base: 1 });
    const caps = criarItem({
      id: 'caps',
      categoria_vida: 'saude_mental',
      prioridade_base: 4,
    });
    mockBuscarItensRelevantes.mockResolvedValue([bolsa, caps]);
    mockGerarTexto.mockResolvedValue(
      JSON.stringify({
        tipo: 'resultado',
        mensagem: 'Vamos lá',
        risco_imediato: true,
        itens: [
          { id: 'bolsa', motivo: 'renda baixa' },
          { id: 'caps', motivo: 'sinal de crise' },
        ],
      }),
    );
    mockBuscarFichasPorIds.mockResolvedValue([bolsa, caps]);

    const resposta = await executarTriagem([
      { papel: 'usuario', conteudo: 'estou muito mal, sem renda' },
    ]);

    expect(resposta.tipo).toBe('resultado');
    if (resposta.tipo !== 'resultado') return;
    // caps subiu por risco_imediato + saúde mental
    expect(resposta.itens.map((i) => i.id)).toEqual(['caps', 'bolsa']);
    expect(resposta.itens[0].posicao).toBe(1);
    expect(resposta.itens[0].motivo).toBe('sinal de crise');
    expect(resposta.itens[1].motivo).toBe('renda baixa');
  });

  it('aceita JSON envelopado em cerca de código markdown', async () => {
    const bolsa = criarItem({ id: 'bolsa', prioridade_base: 1 });
    mockBuscarItensRelevantes.mockResolvedValue([bolsa]);
    mockGerarTexto.mockResolvedValue(
      '```json\n{"tipo":"pergunta","mensagem":"e sua idade?"}\n```',
    );
    const resposta = await executarTriagem([{ papel: 'usuario', conteudo: 'ok' }]);
    expect(resposta).toEqual({ tipo: 'pergunta', mensagem: 'e sua idade?' });
  });

  it('rejeita JSON com formato inesperado', async () => {
    mockBuscarItensRelevantes.mockResolvedValue([]);
    mockGerarTexto.mockResolvedValue('{"foo":"bar"}');
    await expect(
      executarTriagem([{ papel: 'usuario', conteudo: 'oi' }]),
    ).rejects.toBeInstanceOf(ErroTriagem);
  });

  it('rejeita saída completamente fora de JSON', async () => {
    mockBuscarItensRelevantes.mockResolvedValue([]);
    mockGerarTexto.mockResolvedValue('esse texto não tem json nenhum');
    await expect(
      executarTriagem([{ papel: 'usuario', conteudo: 'oi' }]),
    ).rejects.toBeInstanceOf(ErroTriagem);
  });
});
