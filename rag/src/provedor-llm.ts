// Camada de abstração de LLM (SDD seção 5): a lógica de negócio nunca fala com o SDK
// de um provedor diretamente. Trocar Gemini por Claude no futuro = implementar esta
// interface e registrar na fábrica abaixo.
import { obterEnv } from './config.js';
import { criarProvedorGemini } from './provedores/gemini.js';
import type { MensagemChat } from './tipos.js';

export interface OpcoesGeracao {
  formatoJson?: boolean;
  temperatura?: number;
}

export interface ProvedorLLM {
  nome: string;
  gerarTexto(instrucaoSistema: string, mensagens: MensagemChat[], opcoes?: OpcoesGeracao): Promise<string>;
  gerarEmbedding(texto: string, finalidade: 'documento' | 'consulta'): Promise<number[]>;
}

export function criarProvedorLLM(): ProvedorLLM {
  const provedor = obterEnv('LLM_PROVEDOR', 'gemini');
  if (provedor === 'gemini') return criarProvedorGemini();
  throw new Error(`Provedor LLM desconhecido: "${provedor}" (suportado no MVP: gemini)`);
}

let instancia: ProvedorLLM | undefined;

/** Singleton preguiçoso — evita validar a API key na subida do processo (ex: healthcheck da API). */
export function obterProvedorLLM(): ProvedorLLM {
  instancia ??= criarProvedorLLM();
  return instancia;
}
