import { afterAll, describe, expect, it, vi } from 'vitest';

process.env.GEMINI_API_KEY = 'teste-fake';
process.env.SUPABASE_URL = 'https://exemplo.supabase.co';
process.env.SUPABASE_CHAVE_PUBLICA = 'chave-fake';
process.env.API_ORIGEM_PERMITIDA =
  'https://*-gabriels-projects-c9eeaa61.vercel.app';

vi.mock('../src/rag.js', async (importOriginal) => {
  const original = await importOriginal<typeof import('../src/rag.js')>();
  return { ...original, executarTriagem: vi.fn() };
});

const { montarAplicacao } = await import('../src/app.js');
const app = await montarAplicacao({ logger: false });

afterAll(async () => {
  await app.close();
});

describe('aplicação Fastify implantável', () => {
  it('expõe o healthcheck sem abrir uma porta durante o import', async () => {
    const resposta = await app.inject({ method: 'GET', url: '/api/saude' });
    expect(resposta.statusCode).toBe(200);
    expect(resposta.json()).toEqual({ ok: true });
  });

  it('aceita uma Preview pertencente ao padrão configurado', async () => {
    const permitida = await app.inject({
      method: 'OPTIONS',
      url: '/api/triagem',
      headers: {
        origin:
          'https://direito-vivo-abc123-gabriels-projects-c9eeaa61.vercel.app',
        'access-control-request-method': 'POST',
      },
    });
    expect(permitida.headers['access-control-allow-origin']).toBe(
      'https://direito-vivo-abc123-gabriels-projects-c9eeaa61.vercel.app',
    );
  });

  it('recusa origem fora do padrão configurado', async () => {
    const recusada = await app.inject({
      method: 'OPTIONS',
      url: '/api/triagem',
      headers: {
        origin:
          'https://direito-vivo-abc123-projeto-de-terceiro.vercel.app',
        'access-control-request-method': 'POST',
      },
    });

    expect(recusada.headers['access-control-allow-origin']).toBeUndefined();
  });
});
