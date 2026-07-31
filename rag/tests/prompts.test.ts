import { describe, expect, it } from 'vitest';
import { montarPromptTriagem, MAX_PERGUNTAS } from '../src/prompts.js';
import type { ItemComSimilaridade } from '../src/tipos.js';

const candidatos: ItemComSimilaridade[] = [
  {
    id: 'bolsa-familia',
    nome_popular: 'Bolsa Família',
    categoria_vida: 'familia_crianca',
    natureza: 'beneficio',
    criterios_elegibilidade: 'renda por pessoa até R$ 218',
    documentos_necessarios: ['CPF'],
    canal_solicitacao: { tipo: 'presencial', detalhe: 'CRAS' },
    passo_a_passo: ['ir ao CRAS'],
    fonte_legal: 'Lei 14.601/2023',
    prioridade_base: 1,
    ultima_revisao: '2026-01-01',
    abrangencia: 'federal',
    similaridade: 0.8,
  },
];

describe('montarPromptTriagem', () => {
  it('lista os candidatos com id e critério — o modelo não pode inventar item', () => {
    const prompt = montarPromptTriagem(candidatos, 0);
    expect(prompt).toContain('bolsa-familia');
    expect(prompt).toContain('renda por pessoa até R$ 218');
    expect(prompt).toMatch(/só pode indicar itens da lista de CANDIDATOS/i);
  });

  it('proíbe explicitamente a coleta de dado identificável', () => {
    const prompt = montarPromptTriagem(candidatos, 0);
    expect(prompt).toMatch(/NUNCA peça nem registre nome, CPF, RG/i);
  });

  it('proíbe prometer aprovação de benefício', () => {
    const prompt = montarPromptTriagem(candidatos, 0);
    expect(prompt).toMatch(/NUNCA afirme "você VAI receber"/i);
  });

  it('informa quantas perguntas já foram feitas', () => {
    const prompt = montarPromptTriagem(candidatos, 2);
    expect(prompt).toContain(`2 de no máximo ${MAX_PERGUNTAS}`);
  });

  it('ao atingir o limite, manda fechar em vez de continuar perguntando', () => {
    const prompt = montarPromptTriagem(candidatos, MAX_PERGUNTAS);
    expect(prompt).toMatch(/JÁ atingiu o limite de perguntas/i);
    expect(prompt).not.toContain(`de no máximo ${MAX_PERGUNTAS} perguntas`);
  });

  it('define as quatro dimensões que a triagem precisa cobrir antes de fechar', () => {
    const prompt = montarPromptTriagem(candidatos, 0);
    // O critério de parada é objetivo, não "quando achar suficiente":
    // sem isso o modelo fechava na primeira resposta.
    expect(prompt).toMatch(/QUANDO PARAR DE PERGUNTAR/);
    expect(prompt).toMatch(/como ela se sustenta/i);
    expect(prompt).toMatch(/renda aproximada da casa/i);
    expect(prompt).toMatch(/quem mora junto/i);
    expect(prompt).toMatch(/saúde, deficiência ou acidente/i);
    expect(prompt).not.toMatch(/quando já tiver informação suficiente/i);
  });

  it('proíbe repetir pergunta já feita quando a pessoa responde outra coisa', () => {
    const prompt = montarPromptTriagem(candidatos, 0);
    // Observado nos perfis: o modelo repetia a mesma pergunta três vezes quando
    // a resposta não a endereçava — quem não entende a pergunta desiste.
    expect(prompt).toMatch(/NUNCA REPITA UMA PERGUNTA/);
    expect(prompt).toMatch(/mesma pergunta duas vezes, mesmo reformulada/i);
  });

  it('mantém urgência como exceção que curto-circuita as perguntas', () => {
    const prompt = montarPromptTriagem(candidatos, 0);
    expect(prompt).toMatch(/URGÊNCIA/);
    expect(prompt).toContain('190');
    expect(prompt).toContain('180');
    expect(prompt).toContain('188');
    expect(prompt).toMatch(/risco_imediato/);
  });

  it('exige resposta em JSON único, sem texto fora', () => {
    const prompt = montarPromptTriagem(candidatos, 0);
    expect(prompt).toMatch(/um único JSON válido, sem nenhum texto fora dele/i);
  });

  it('funciona sem candidatos (base vazia não quebra o prompt)', () => {
    const prompt = montarPromptTriagem([], 0);
    expect(prompt).toContain('CANDIDATOS');
    expect(prompt).toContain('[]');
  });
});
