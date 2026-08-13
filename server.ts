// Entrypoint detectado pela Vercel para publicar a API Fastify como uma única
// função. O servidor local usa a mesma fábrica em backend/src/servidor.ts.
import Fastify from 'fastify';
import { configurarAplicacao } from './backend/src/app.js';

const app = await configurarAplicacao(
  Fastify({ disableRequestLogging: true, logger: { level: 'info' } }),
);
// O adaptador Fastify da Vercel procura o processo na porta 3000 quando PORT
// não é injetada. A porta local (3333) permanece em backend/src/servidor.ts.
const porta = Number(process.env.PORT ?? '3000');
await app.listen({ port: porta, host: '0.0.0.0' });
