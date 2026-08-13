import type { FastifyInstance } from 'fastify';
import {
  ErroTriagem,
  executarTriagem,
  obterModoAplicacao,
  validarModoAplicacao,
  type MensagemChat,
} from '../rag.js';

// Limites defensivos: conversa curta por natureza (máx. 6 perguntas do assistente).
const esquemaCorpo = {
  type: 'object',
  required: ['mensagens'],
  additionalProperties: false,
  properties: {
    aceite_demo: { type: 'boolean' },
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
    const { mensagens, aceite_demo } = requisicao.body as {
      mensagens: MensagemChat[];
      aceite_demo?: boolean;
    };
    const modo = obterModoAplicacao();
    validarModoAplicacao(modo);
    if (modo === 'demo' && aceite_demo !== true) {
      resposta.status(403);
      return { erro: 'Confirme os termos da demonstração antes de continuar.' };
    }
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
