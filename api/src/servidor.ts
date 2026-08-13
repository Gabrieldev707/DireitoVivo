import { obterEnv } from '@direito-vivo/rag';
import { montarAplicacao } from './app.js';

const app = await montarAplicacao();
const porta = Number(obterEnv('API_PORTA', '3333'));
await app.listen({ port: porta, host: '0.0.0.0' });
