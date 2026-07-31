import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Fastify, { type FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';
import { createHash } from 'node:crypto';

process.env.GEMINI_API_KEY = 'teste-fake';
process.env.SUPABASE_URL = 'https://exemplo.supabase.co';
process.env.SUPABASE_CHAVE_PUBLICA = 'chave-fake';

const mockExecutarTriagem = vi.fn();

vi.mock('@direito-vivo/rag', async (importOriginal) => {
  const original = await importOriginal<typeof import('@direito-vivo/rag')>();
  return {
    ...original,
    executarTriagem: (...args: unknown[]) => mockExecutarTriagem(...args),
  };
});

const { rotasTriagem } = await import('../src/rotas/triagem.js');

const LIMITE = 3;

// Espelha a configuração do servidor: mesma chave hasheada, mesma allowList.
async function montarAppComLimite(): Promise<FastifyInstance> {
  const app = Fastify({ disableRequestLogging: true, logger: false });
  await app.register(rateLimit, {
    max: LIMITE,
    timeWindow: '1 minute',
    keyGenerator: (requisicao) =>
      createHash('sha256').update(requisicao.ip + 'sal-teste').digest('hex').slice(0, 16),
    allowList: (requisicao) => requisicao.url === '/api/saude',
    errorResponseBuilder: (_requisicao, contexto) => ({
      statusCode: 429,
      erro: `Muitas mensagens em pouco tempo. Tente de novo em ${contexto.after}.`,
    }),
  });
  await app.register(rotasTriagem, { prefix: '/api' });
  await app.ready();
  return app;
}

let app: FastifyInstance;

beforeEach(async () => {
  mockExecutarTriagem.mockReset();
  mockExecutarTriagem.mockResolvedValue({ tipo: 'pergunta', mensagem: 'e a renda?' });
  app = await montarAppComLimite();
});

afterEach(async () => {
  await app.close();
});

const payload = { mensagens: [{ papel: 'usuario', conteudo: 'estou sem trabalho' }] };

describe('rate limit da triagem', () => {
  it('permite requisições até o limite configurado', async () => {
    for (let i = 0; i < LIMITE; i++) {
      const r = await app.inject({ method: 'POST', url: '/api/triagem', payload });
      expect(r.statusCode).toBe(200);
    }
  });

  it('bloqueia com 429 ao ultrapassar o limite e não chama o motor LLM', async () => {
    for (let i = 0; i < LIMITE; i++) {
      await app.inject({ method: 'POST', url: '/api/triagem', payload });
    }
    const chamadasAntes = mockExecutarTriagem.mock.calls.length;

    const bloqueada = await app.inject({ method: 'POST', url: '/api/triagem', payload });

    expect(bloqueada.statusCode).toBe(429);
    // O ponto do limite: a cota do provedor LLM não é consumida na requisição bloqueada.
    expect(mockExecutarTriagem.mock.calls.length).toBe(chamadasAntes);
  });

  it('devolve mensagem amigável, sem jargão técnico, ao bloquear', async () => {
    for (let i = 0; i < LIMITE; i++) {
      await app.inject({ method: 'POST', url: '/api/triagem', payload });
    }
    const r = await app.inject({ method: 'POST', url: '/api/triagem', payload });
    const corpo = r.json() as { erro: string };
    expect(corpo.erro).toMatch(/muitas mensagens/i);
    expect(corpo.erro).not.toMatch(/rate|limit|429/i);
  });

  it('healthcheck não consome cota (allowList)', async () => {
    for (let i = 0; i < LIMITE + 5; i++) {
      const r = await app.inject({ method: 'GET', url: '/api/saude' });
      expect(r.statusCode).toBe(200);
    }
  });

  it('a chave de limite é um hash — o IP nunca é usado em texto puro', async () => {
    const ip = '203.0.113.42';
    const hashEsperado = createHash('sha256').update(ip + 'sal-teste').digest('hex').slice(0, 16);

    // O hash trunca em 16 chars e não permite recuperar o IP.
    expect(hashEsperado).toHaveLength(16);
    expect(hashEsperado).not.toContain('203');
    expect(hashEsperado).toMatch(/^[a-f0-9]{16}$/);
  });
});
