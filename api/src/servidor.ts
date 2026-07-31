import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { createHash } from 'node:crypto';
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

// Limite de uso. Existe por dois motivos: proteger a cota do provedor LLM (o free tier
// do Gemini dá 5 req/min por modelo — um único abusador derruba o serviço para todos)
// e evitar custo descontrolado num tier pago.
//
// Tensão com a privacidade: limitar por IP exige uma chave por cliente. Resolvemos
// guardando apenas o hash truncado do IP, em memória, com o mesmo TTL da janela —
// nunca o IP em si, nunca em disco, nunca em log. Some quando o processo reinicia.
await app.register(rateLimit, {
  max: Number(obterEnv('API_LIMITE_REQUISICOES', '20')),
  timeWindow: obterEnv('API_LIMITE_JANELA', '5 minutes'),
  keyGenerator: (requisicao) =>
    createHash('sha256')
      .update(requisicao.ip + obterEnv('API_SAL_LIMITE', 'direito-vivo'))
      .digest('hex')
      .slice(0, 16),
  // A rota de saúde é usada por monitoramento/deploy — não deve consumir cota.
  allowList: (requisicao) => requisicao.url === '/api/saude',
  // O statusCode precisa vir no objeto: sem ele o plugin devolve 500.
  errorResponseBuilder: (_requisicao, contexto) => ({
    statusCode: 429,
    erro: `Muitas mensagens em pouco tempo. Tente de novo em ${contexto.after}.`,
  }),
});

await app.register(rotasTriagem, { prefix: '/api' });

const porta = Number(obterEnv('API_PORTA', '3333'));
await app.listen({ port: porta, host: '0.0.0.0' });
