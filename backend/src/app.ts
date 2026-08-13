import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { createHash } from 'node:crypto';
import { obterEnv } from './rag.js';
import { rotasTriagem } from './rotas/triagem.js';

function escaparExpressaoRegular(valor: string): string {
  return valor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Aceita uma origem exata ou um único `*` restrito a um segmento de hostname. */
export function criarRegraCors(regra: string): string | RegExp {
  const partes = regra.split('*');
  if (partes.length === 1) return regra;
  if (partes.length !== 2) {
    throw new Error('API_ORIGEM_PERMITIDA aceita no máximo um curinga (*)');
  }

  return new RegExp(
    `^${escaparExpressaoRegular(partes[0])}[a-z0-9-]+${escaparExpressaoRegular(partes[1])}$`,
  );
}

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
export function configurarAplicacao(app: FastifyInstance): FastifyInstance {
  app.register(cors, {
    origin: criarRegraCors(
      obterEnv('API_ORIGEM_PERMITIDA', 'http://localhost:5173'),
    ),
  });

  app.register(rateLimit, {
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

  app.register(rotasTriagem, { prefix: '/api' });
  return app;
}
