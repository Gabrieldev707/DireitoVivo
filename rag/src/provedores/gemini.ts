// Implementação do provedor LLM com a Google Gemini API (tier free — padrão do MVP).
import { GoogleGenAI } from '@google/genai';
import { obterEnv } from '../config.js';
import { DIMENSOES_EMBEDDING } from '../embeddings.js';
import type { ProvedorLLM } from '../provedor-llm.js';

export function criarProvedorGemini(): ProvedorLLM {
  const ai = new GoogleGenAI({ apiKey: obterEnv('GEMINI_API_KEY') });
  const modeloChat = obterEnv('GEMINI_MODELO_CHAT', 'gemini-2.5-flash');
  const modeloEmbedding = obterEnv('GEMINI_MODELO_EMBEDDING', 'gemini-embedding-001');

  return {
    nome: `gemini (${modeloChat} / ${modeloEmbedding})`,

    async gerarTexto(instrucaoSistema, mensagens, opcoes) {
      const resposta = await ai.models.generateContent({
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
      });
      const texto = resposta.text;
      if (!texto) throw new Error('O Gemini retornou resposta vazia.');
      return texto;
    },

    async gerarEmbedding(texto, finalidade) {
      const resposta = await ai.models.embedContent({
        model: modeloEmbedding,
        contents: texto,
        config: {
          taskType: finalidade === 'documento' ? 'RETRIEVAL_DOCUMENT' : 'RETRIEVAL_QUERY',
          outputDimensionality: DIMENSOES_EMBEDDING,
        },
      });
      const valores = resposta.embeddings?.[0]?.values;
      if (!valores || valores.length !== DIMENSOES_EMBEDDING) {
        throw new Error(`Embedding inválido do Gemini (dimensões: ${valores?.length ?? 0}).`);
      }
      return normalizar(valores);
    },
  };
}

// O gemini-embedding-001 só retorna vetores normalizados em 3072 dims; ao truncar
// para 768 é preciso renormalizar para a similaridade de cosseno funcionar bem.
function normalizar(vetor: number[]): number[] {
  const norma = Math.sqrt(vetor.reduce((soma, v) => soma + v * v, 0));
  if (norma === 0) return vetor;
  return vetor.map((v) => v / norma);
}
