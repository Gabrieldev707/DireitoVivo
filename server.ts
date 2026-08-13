import Fastify from 'fastify';
import { configurarAplicacao } from './backend/src/app.js';

// O registro dos plugins é síncrono; o Fastify conclui a inicialização em
// listen/ready. Isso mantém o entrypoint compatível com o adaptador da Vercel.
const app = configurarAplicacao(
  Fastify({ disableRequestLogging: true, logger: { level: 'info' } }),
);
app.listen({ port: 3000 });
