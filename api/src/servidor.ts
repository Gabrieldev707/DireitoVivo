import Fastify from 'fastify';
import cors from '@fastify/cors';
import { obterEnv } from '@direito-vivo/rag';
import { rotasTriagem } from './rotas/triagem.js';

const app = Fastify({
  // Privacidade por design (SDD seção 3): sem log de requisição — o relato da triagem
  // combinado com IP + timestamp permitiria reidentificar a pessoa.
  disableRequestLogging: true,
  logger: { level: 'info' },
});

await app.register(cors, {
  origin: obterEnv('API_ORIGEM_PERMITIDA', 'http://localhost:5173'),
});
await app.register(rotasTriagem, { prefix: '/api' });

const porta = Number(obterEnv('API_PORTA', '3333'));
await app.listen({ port: porta, host: '0.0.0.0' });
