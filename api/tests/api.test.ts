import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Fastify, { type FastifyInstance } from 'fastify';

// Precisamos setar env antes de qualquer import do módulo rag.
process.env.GEMINI_API_KEY = 'teste-fake';
process.env.SUPABASE_URL = 'https://exemplo.supabase.co';
process.env.SUPABASE_CHAVE_PUBLICA = 'chave-fake';
process.env.API_ORIGEM_PERMITIDA = 'http://localhost:5173';

// A rota importa executarTriagem em runtime; mockamos no nível de módulo pra não bater rede.
const mockExecutarTriagem = vi.fn();

vi.mock('@direito-vivo/rag', async (importOriginal) => {
  const original = await importOriginal<typeof import('@direito-vivo/rag')>();
  return {
    ...original,
    executarTriagem: (...args: unknown[]) => mockExecutarTriagem(...args),
  };
});

const { rotasTriagem } = await import('../src/rotas/triagem.js');

async function montarApp(): Promise<FastifyInstance> {
  const app = Fastify({ disableRequestLogging: true, logger: false });
  await app.register(rotasTriagem, { prefix: '/api' });
  await app.ready();
  return app;
}

let app: FastifyInstance;

beforeEach(async () => {
  mockExecutarTriagem.mockReset();
  app = await montarApp();
});

afterEach(async () => {
  await app.close();
});

describe('GET /api/saude', () => {
  it('retorna 200 e {ok:true}', async () => {
    const r = await app.inject({ method: 'GET', url: '/api/saude' });
    expect(r.statusCode).toBe(200);
    expect(r.json()).toEqual({ ok: true });
  });
});

describe('POST /api/triagem', () => {
  const historicoValido = {
    mensagens: [{ papel: 'usuario', conteudo: 'estou desempregado' }],
    aceite_demo: true,
  };

  for (const aceite of [undefined, false]) {
    it(`rejeita aceite ${String(aceite)} antes do motor`, async () => {
      const payload = aceite === undefined
        ? { mensagens: historicoValido.mensagens }
        : { ...historicoValido, aceite_demo: aceite };
      const r = await app.inject({ method: 'POST', url: '/api/triagem', payload });
      expect(r.statusCode).toBe(400);
      expect(mockExecutarTriagem).not.toHaveBeenCalled();
    });
  }

  it('encaminha para o motor e devolve a resposta', async () => {
    mockExecutarTriagem.mockResolvedValue({ tipo: 'pergunta', mensagem: 'renda?' });

    const r = await app.inject({
      method: 'POST',
      url: '/api/triagem',
      payload: historicoValido,
    });

    expect(r.statusCode).toBe(200);
    expect(r.json()).toEqual({ tipo: 'pergunta', mensagem: 'renda?' });
    expect(mockExecutarTriagem).toHaveBeenCalledWith(historicoValido.mensagens);
  });

  it('rejeita payload sem "mensagens"', async () => {
    const r = await app.inject({ method: 'POST', url: '/api/triagem', payload: {} });
    expect(r.statusCode).toBe(400);
    expect(mockExecutarTriagem).not.toHaveBeenCalled();
  });

  it('rejeita papel inválido', async () => {
    const r = await app.inject({
      method: 'POST',
      url: '/api/triagem',
      payload: {
        mensagens: [{ papel: 'sistema', conteudo: 'oi' }],
      },
    });
    expect(r.statusCode).toBe(400);
  });

  it('rejeita conteúdo vazio', async () => {
    const r = await app.inject({
      method: 'POST',
      url: '/api/triagem',
      payload: { mensagens: [{ papel: 'usuario', conteudo: '' }] },
    });
    expect(r.statusCode).toBe(400);
  });

  it('rejeita conteúdo maior que 2000 caracteres', async () => {
    const grande = 'a'.repeat(2001);
    const r = await app.inject({
      method: 'POST',
      url: '/api/triagem',
      payload: { mensagens: [{ papel: 'usuario', conteudo: grande }] },
    });
    expect(r.statusCode).toBe(400);
  });

  it('rejeita conversas com mais de 40 mensagens', async () => {
    const mensagens = Array.from({ length: 41 }, (_, i) => ({
      papel: i % 2 === 0 ? ('usuario' as const) : ('assistente' as const),
      conteudo: `msg ${i}`,
    }));
    const r = await app.inject({ method: 'POST', url: '/api/triagem', payload: { mensagens } });
    expect(r.statusCode).toBe(400);
  });

  it('devolve 422 quando o motor lança ErroTriagem', async () => {
    const { ErroTriagem } = await import('@direito-vivo/rag');
    mockExecutarTriagem.mockRejectedValue(new ErroTriagem('formato ruim'));
    const r = await app.inject({
      method: 'POST',
      url: '/api/triagem',
      payload: historicoValido,
    });
    expect(r.statusCode).toBe(422);
    const body = r.json() as { erro: string };
    // Mensagem devolvida é genérica — nunca vaza detalhe técnico do provider.
    expect(body.erro).not.toContain('formato ruim');
  });

  it('devolve 502 e mensagem opaca quando o motor lança erro genérico', async () => {
    mockExecutarTriagem.mockRejectedValue(new Error('token do supabase expirou'));
    const r = await app.inject({
      method: 'POST',
      url: '/api/triagem',
      payload: historicoValido,
    });
    expect(r.statusCode).toBe(502);
    const body = r.json() as { erro: string };
    expect(body.erro).not.toContain('supabase');
    expect(body.erro).not.toContain('token');
  });
});

describe('privacidade dos logs', () => {
  it('a rota nunca coloca o corpo da requisição no log', async () => {
    const trilha: string[] = [];
    const appComLogger = Fastify({
      disableRequestLogging: true,
      logger: {
        level: 'info',
        stream: {
          write(msg: string) {
            trilha.push(msg);
          },
        },
      },
    });
    await appComLogger.register(rotasTriagem, { prefix: '/api' });
    await appComLogger.ready();

    mockExecutarTriagem.mockRejectedValue(new Error('falha interna'));
    await appComLogger.inject({
      method: 'POST',
      url: '/api/triagem',
      payload: {
        mensagens: [
          { papel: 'usuario', conteudo: 'meu CPF é 000.000.000-00 e eu quero X' },
        ],
      },
    });
    await appComLogger.close();

    const logs = trilha.join('\n');
    // Nem o CPF nem o conteúdo da mensagem podem aparecer no log da API.
    expect(logs).not.toContain('000.000.000-00');
    expect(logs).not.toContain('meu CPF');
  });
});
