import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { createHash } from 'node:crypto';
import { obterEnv } from './rag.js';
import { rotasTriagem } from './rotas/triagem.js';

/**
 * Monta a aplicação sem abrir porta. O mesmo objeto atende o servidor local e o
 * runtime serverless, evitando duas configurações de segurança divergentes.
 */
export async function montarAplicacao(
  opcoes: FastifyServerOptions = {
    disableRequestLogging: true,
    logger: { level: 'info' },
  },
): Promise<FastifyInstance> {
  const app = Fastify({ disableRequestLogging: true, ...opcoes });

  return configurarAplicacao(app);
}

/** Registra os controles e rotas em uma instância já criada pelo runtime. */
export async function configurarAplicacao(app: FastifyInstance): Promise<FastifyInstance> {

  await app.register(cors, {
    origin: obterEnv('API_ORIGEM_PERMITIDA', 'http://localhost:5173'),
  });

  await app.register(rateLimit, {
    max: Number(obterEnv('API_LIMITE_REQUISICOES', '20')),
    timeWindow: obterEnv('API_LIMITE_JANELA', '5 minutes'),
    keyGenerator: (requisicao) =>
      createHash('sha256')
        .update(requisicao.ip + obterEnv('API_SAL_LIMITE', 'direito-vivo'))
        .digest('hex')
        .slice(0, 16),
    allowList: (requisicao) => requisicao.url === '/api/saude',
    errorResponseBuilder: (_requisicao, contexto) => ({
      statusCode: 429,
      erro: `Muitas mensagens em pouco tempo. Tente de novo em ${contexto.after}.`,
    }),
  });

  await app.register(rotasTriagem, { prefix: '/api' });
  return app;
}
