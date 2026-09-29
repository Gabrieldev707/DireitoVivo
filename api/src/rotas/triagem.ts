import type { FastifyInstance } from 'fastify';
import { ErroTriagem, executarTriagem, type MensagemChat } from '@direito-vivo/rag';

// Limites defensivos: conversa curta por natureza (máx. 6 perguntas do assistente).
const esquemaCorpo = {
  type: 'object',
  required: ['mensagens', 'aceite_demo'],
  additionalProperties: false,
  properties: {
    aceite_demo: { type: 'boolean', enum: [true] },
    mensagens: {
      type: 'array',
      minItems: 1,
      maxItems: 40,
      items: {
        type: 'object',
        required: ['papel', 'conteudo'],
        additionalProperties: false,
        properties: {
          papel: { type: 'string', enum: ['usuario', 'assistente'] },
          conteudo: { type: 'string', minLength: 1, maxLength: 2000 },
        },
      },
    },
  },
} as const;

export async function rotasTriagem(app: FastifyInstance) {
  app.get('/saude', async () => ({ ok: true }));

  app.post('/triagem', { schema: { body: esquemaCorpo } }, async (requisicao, resposta) => {
    const { mensagens } = requisicao.body as { mensagens: MensagemChat[]; aceite_demo: true };
    try {
      return await executarTriagem(mensagens);
    } catch (erro) {
      if (erro instanceof ErroTriagem) {
        resposta.status(422);
        return { erro: 'Não consegui entender a conversa. Recarregue a página e tente de novo.' };
      }
      // Loga apenas a mensagem técnica do erro — nunca o conteúdo da conversa.
      app.log.error({ erro: (erro as Error).message }, 'falha na triagem');
      resposta.status(502);
      return { erro: 'Não consegui processar agora. Espere um pouco e tente de novo.' };
    }
  });
}
