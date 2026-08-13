// Entrypoint detectado pela Vercel para publicar a API Fastify como uma única
// função. O servidor local usa a mesma fábrica em api/src/servidor.ts.
import { obterEnv } from '@direito-vivo/rag';
import { montarAplicacao } from './api/src/app.js';

const app = await montarAplicacao();
const porta = Number(obterEnv('PORT', obterEnv('API_PORTA', '3333')));
await app.listen({ port: porta, host: '0.0.0.0' });
