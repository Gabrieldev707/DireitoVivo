// Motor de triagem (RF02 + RF04): orquestra RAG + LLM e monta a "linha de vida".
// Stateless por design: recebe o histórico completo a cada chamada e não persiste nada
// (privacidade por design — não existe tabela de conversa/sessão).
import { buscarFichasPorIds, buscarItensRelevantes } from './busca.js';
import { obterProvedorLLM } from './provedor-llm.js';
import { MENSAGEM_SEM_MATCH, montarPromptTriagem } from './prompts.js';
import { protegerMensagens } from './protecao-dados.js';
import type { DireitoItem, ItemLinhaDaVida, MensagemChat, RespostaTriagem } from './tipos.js';

const LIMITE_CANDIDATOS = 10;

export class ErroTriagem extends Error {}

export async function executarTriagem(mensagens: MensagemChat[]): Promise<RespostaTriagem> {
  if (mensagens.length === 0 || mensagens[mensagens.length - 1].papel !== 'usuario') {
    throw new ErroTriagem('A triagem precisa terminar com uma mensagem do usuário.');
  }

  const protecao = protegerMensagens(mensagens);
  const mensagensProtegidas = protecao.mensagens;
  const houveMascaramento = protecao.categoriasMascaradas.length > 0;

  // O "perfil" da busca é tudo que o usuário contou até aqui, já protegido.
  const relatoUsuario = mensagensProtegidas
    .filter((m) => m.papel === 'usuario')
    .map((m) => m.conteudo)
    .join('\n');

  const candidatos = await buscarItensRelevantes(relatoUsuario, LIMITE_CANDIDATOS);
  const perguntasFeitas = mensagensProtegidas.filter((m) => m.papel === 'assistente').length;

  const bruto = await obterProvedorLLM().gerarTexto(
    montarPromptTriagem(candidatos, perguntasFeitas),
    mensagensProtegidas,
    { formatoJson: true },
  );

  const saida = interpretarSaida(bruto);
  if (saida.tipo === 'pergunta') {
    return {
      tipo: 'pergunta',
      mensagem: saida.mensagem,
      ...(houveMascaramento ? { aviso_dados_mascarados: true } : {}),
    };
  }

  // Só aceita ids que existem entre os candidatos (o LLM não pode inventar item).
  const indicados = saida.itens.filter((i) => candidatos.some((c) => c.id === i.id));
  if (indicados.length === 0) {
    return {
      tipo: 'sem_match',
      mensagem: saida.mensagem || MENSAGEM_SEM_MATCH,
      ...(houveMascaramento ? { aviso_dados_mascarados: true } : {}),
    };
  }

  const fichas = await buscarFichasPorIds(indicados.map((i) => i.id));
  const motivoPorId = new Map(indicados.map((i) => [i.id, i.motivo]));
  const itens = ordenarLinhaDaVida(fichas, saida.risco_imediato).map((item, indice) => ({
    ...item,
    posicao: indice + 1,
    motivo: motivoPorId.get(item.id) ?? '',
  }));

  return {
    tipo: 'resultado',
    mensagem: saida.mensagem,
    itens,
    ...(houveMascaramento ? { aviso_dados_mascarados: true } : {}),
  };
}

/**
 * Linha de vida (RF04): urgência + facilidade.
 * Heurística simples, sem ML: risco de vida/violência sempre no topo;
 * depois `prioridade_base` (1 = mais urgente/fácil); nome como desempate estável.
 */
export function ordenarLinhaDaVida(itens: DireitoItem[], riscoImediato: boolean): DireitoItem[] {
  const grupoUrgencia = (item: DireitoItem): number => {
    if (item.categoria_vida === 'violencia_domestica') return 0;
    if (riscoImediato && item.categoria_vida === 'saude_mental') return 0;
    return 1;
  };
  return [...itens].sort(
    (a, b) =>
      grupoUrgencia(a) - grupoUrgencia(b) ||
      a.prioridade_base - b.prioridade_base ||
      a.nome_popular.localeCompare(b.nome_popular, 'pt-BR'),
  );
}

interface SaidaPergunta {
  tipo: 'pergunta';
  mensagem: string;
}
interface SaidaResultado {
  tipo: 'resultado';
  mensagem: string;
  risco_imediato: boolean;
  itens: { id: string; motivo: string }[];
}

function interpretarSaida(bruto: string): SaidaPergunta | SaidaResultado {
  const texto = extrairJson(bruto);
  let dado: unknown;
  try {
    dado = JSON.parse(texto);
  } catch {
    throw new ErroTriagem(`O modelo respondeu fora do formato esperado: ${bruto.slice(0, 200)}`);
  }
  const objeto = dado as Record<string, unknown>;
  if (objeto?.tipo === 'pergunta' && typeof objeto.mensagem === 'string') {
    return { tipo: 'pergunta', mensagem: objeto.mensagem };
  }
  if (objeto?.tipo === 'resultado' && typeof objeto.mensagem === 'string') {
    const itensBrutos = Array.isArray(objeto.itens) ? objeto.itens : [];
    return {
      tipo: 'resultado',
      mensagem: objeto.mensagem,
      risco_imediato: objeto.risco_imediato === true,
      itens: itensBrutos
        .filter((i): i is { id: string; motivo?: string } => typeof (i as { id?: unknown })?.id === 'string')
        .map((i) => ({ id: i.id, motivo: typeof i.motivo === 'string' ? i.motivo : '' })),
    };
  }
  throw new ErroTriagem(`O modelo respondeu um JSON com formato inesperado: ${texto.slice(0, 200)}`);
}

// Tolerância a cercas de código e texto ao redor: pega do primeiro '{' ao último '}'.
function extrairJson(bruto: string): string {
  const inicio = bruto.indexOf('{');
  const fim = bruto.lastIndexOf('}');
  if (inicio === -1 || fim === -1 || fim <= inicio) return bruto.trim();
  return bruto.slice(inicio, fim + 1);
}

/** Ecoado nas telas do frontend e no encerramento da triagem (RF06). */
export const TEXTO_DISCLAIMER =
  'Esta é uma triagem informativa e não substitui aconselhamento jurídico ou confirmação oficial. Sempre confirme as informações no canal oficial indicado.';
