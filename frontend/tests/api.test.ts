import { afterEach, describe, expect, it, vi } from 'vitest';
import { enviarTriagem } from '../src/api';

const mensagens = [{ papel: 'usuario' as const, conteudo: 'teste' }];

afterEach(() => vi.unstubAllGlobals());

describe('enviarTriagem', () => {
  it('não faz fetch sem aceite explícito', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(enviarTriagem(mensagens)).rejects.toThrow(/aceite/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('envia o aceite junto com as mensagens', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ tipo: 'pergunta', mensagem: 'Oi' }) });
    vi.stubGlobal('fetch', fetchMock);
    await enviarTriagem(mensagens, true);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({ mensagens, aceite_demo: true });
  });
});
