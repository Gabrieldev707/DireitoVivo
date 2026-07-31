// Implementação do provedor LLM com a Google Gemini API (tier free — padrão do MVP).
import { GoogleGenAI } from '@google/genai';
import { obterEnv } from '../config.js';
import { DIMENSOES_EMBEDDING } from '../embeddings.js';
import type { ProvedorLLM } from '../provedor-llm.js';

const MAX_TENTATIVAS_429 = 5;

// Teto de espera somando todas as tentativas. Existe por causa da pessoa do outro
// lado: enquanto tentamos de novo, ela vê apenas "digitando…" sem explicação. Uma
// falha assumida em 25s é melhor do que dois minutos de tela parada — ela pode
// reenviar, e o frontend mantém o histórico. Sem este teto, cinco tentativas com
// retryDelay de ~11s cada passavam de um minuto.
const ORCAMENTO_RETRY_MS = 25_000;

export function criarProvedorGemini(): ProvedorLLM {
  const ai = new GoogleGenAI({ apiKey: obterEnv('GEMINI_API_KEY') });
  // Padrão em "flash-lite": no tier free ele tem cota por minuto mais folgada que
  // o "flash" cheio, e o gargalo aqui é justamente requisição por minuto — cada
  // turno de conversa gasta duas chamadas (embedding da consulta + geração).
  const modeloChat = obterEnv('GEMINI_MODELO_CHAT', 'gemini-3.5-flash-lite');
  const modeloEmbedding = obterEnv('GEMINI_MODELO_EMBEDDING', 'gemini-embedding-001');

  return {
    nome: `gemini (${modeloChat} / ${modeloEmbedding})`,

    async gerarTexto(instrucaoSistema, mensagens, opcoes) {
      const resposta = await comRetryQuota(() =>
        ai.models.generateContent({
          model: modeloChat,
          contents: mensagens.map((m) => ({
            role: m.papel === 'usuario' ? 'user' : 'model',
            parts: [{ text: m.conteudo }],
          })),
          config: {
            systemInstruction: instrucaoSistema,
            temperature: opcoes?.temperatura ?? 0.4,
            ...(opcoes?.formatoJson ? { responseMimeType: 'application/json' } : {}),
          },
        }),
      );
      const texto = resposta.text;
      if (!texto) throw new Error('O Gemini retornou resposta vazia.');
      return texto;
    },

    async gerarEmbedding(texto, finalidade) {
      const resposta = await comRetryQuota(() =>
        ai.models.embedContent({
          model: modeloEmbedding,
          contents: texto,
          config: {
            taskType: finalidade === 'documento' ? 'RETRIEVAL_DOCUMENT' : 'RETRIEVAL_QUERY',
            outputDimensionality: DIMENSOES_EMBEDDING,
          },
        }),
      );
      const valores = resposta.embeddings?.[0]?.values;
      if (!valores || valores.length !== DIMENSOES_EMBEDDING) {
        throw new Error(`Embedding inválido do Gemini (dimensões: ${valores?.length ?? 0}).`);
      }
      return normalizar(valores);
    },
  };
}

// Duas falhas transitórias distintas do Gemini, ambas recuperáveis:
//
//   429 — cota. O free tier do 2.5 Flash dá 5 req/min por modelo. Uma pessoa
//         conversando no ritmo natural não bate; rodar perfis em sequência bate.
//         A resposta traz `retryDelay` explícito, então esperamos exatamente isso.
//   503 — modelo sobrecarregado ("high demand"). Não vem com retryDelay; aqui o
//         certo é backoff exponencial com jitter, para não sincronizar as tentativas.
//
// Sem tratar o 503 o usuário via erro numa falha que se resolveria sozinha em segundos.
async function comRetryQuota<T>(operacao: () => Promise<T>): Promise<T> {
  const inicio = Date.now();
  let ultimoErro: unknown;
  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS_429; tentativa++) {
    try {
      return await operacao();
    } catch (excecao) {
      ultimoErro = excecao;
      const status = (excecao as { status?: number })?.status;
      if (status !== 429 && status !== 503) throw excecao;
      if (tentativa === MAX_TENTATIVAS_429) throw excecao;

      const espera = calcularEspera(excecao, status, tentativa);
      // Desiste se a próxima espera estourar o orçamento: melhor falhar agora,
      // com o histórico preservado para reenviar, do que prender a pessoa na tela.
      if (Date.now() - inicio + espera > ORCAMENTO_RETRY_MS) throw excecao;
      await new Promise((resolve) => setTimeout(resolve, espera));
    }
  }
  throw ultimoErro;
}

function calcularEspera(excecao: unknown, status: number, tentativa: number): number {
  if (status === 429) {
    // O servidor sabe quando a janela reabre — obedecemos.
    return extrairRetryDelayMs(excecao) ?? tentativa * 15_000;
  }
  // 503: exponencial (2s, 4s, 8s, 16s…) + jitter de até 1s.
  return 2 ** tentativa * 1000 + Math.floor(Math.random() * 1000);
}

function extrairRetryDelayMs(excecao: unknown): number | undefined {
  const mensagem = (excecao as { message?: string })?.message;
  if (typeof mensagem !== 'string') return undefined;
  // O Gemini serializa o corpo do 429 dentro da mensagem; encontramos algo como
  // "retryDelay":"11s" ou "retryDelay":"11.7s".
  const match = mensagem.match(/"retryDelay":"([\d.]+)s"/);
  if (!match) return undefined;
  const segundos = Number(match[1]);
  if (!Number.isFinite(segundos)) return undefined;
  // Pequena folga para não bater exatamente no reset.
  return Math.ceil(segundos * 1000) + 500;
}

// O gemini-embedding-001 só retorna vetores normalizados em 3072 dims; ao truncar
// para 768 é preciso renormalizar para a similaridade de cosseno funcionar bem.
function normalizar(vetor: number[]): number[] {
  const norma = Math.sqrt(vetor.reduce((soma, v) => soma + v * v, 0));
  if (norma === 0) return vetor;
  return vetor.map((v) => v / norma);
}
