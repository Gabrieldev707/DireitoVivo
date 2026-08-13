// Entrypoint detectado pela Vercel para publicar a API Fastify como uma única
// função. O servidor local usa a mesma fábrica em backend/src/servidor.ts.
import Fastify from 'fastify';
import { obterEnv } from './backend/src/rag.js';
import { configurarAplicacao } from './backend/src/app.js';

const app = await configurarAplicacao(
  Fastify({ disableRequestLogging: true, logger: { level: 'info' } }),
);
const porta = Number(obterEnv('PORT', obterEnv('API_PORTA', '3333')));
await app.listen({ port: porta, host: '0.0.0.0' });
