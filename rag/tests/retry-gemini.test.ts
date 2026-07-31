import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

// O provedor real exige GEMINI_API_KEY no construtor; setamos antes de importar.
process.env.GEMINI_API_KEY = 'fake-para-teste';

const mockGenerateContent = vi.fn();
const mockEmbedContent = vi.fn();

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = {
      generateContent: (...args: unknown[]) => mockGenerateContent(...args),
      embedContent: (...args: unknown[]) => mockEmbedContent(...args),
    };
  },
}));

const { criarProvedorGemini } = await import('../src/provedores/gemini.js');

function erroApi(status: number, mensagem: string) {
  return Object.assign(new Error(mensagem), { status });
}

describe('retry do provedor Gemini', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('repete em 429 respeitando o retryDelay informado pelo servidor', async () => {
    mockGenerateContent
      .mockRejectedValueOnce(erroApi(429, '{"error":{"retryDelay":"11s"}}'))
      .mockResolvedValueOnce({ text: 'resposta ok' });

    const provedor = criarProvedorGemini();
    const promessa = provedor.gerarTexto('sistema', [{ papel: 'usuario', conteudo: 'oi' }]);

    // Antes de avançar o relógio a chamada ainda não teve sucesso.
    await vi.advanceTimersByTimeAsync(11_500);
    await expect(promessa).resolves.toBe('resposta ok');
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });

  it('repete em 503 (modelo sobrecarregado) com backoff exponencial', async () => {
    mockGenerateContent
      .mockRejectedValueOnce(erroApi(503, 'This model is currently experiencing high demand'))
      .mockRejectedValueOnce(erroApi(503, 'This model is currently experiencing high demand'))
      .mockResolvedValueOnce({ text: 'enfim' });

    const provedor = criarProvedorGemini();
    const promessa = provedor.gerarTexto('sistema', [{ papel: 'usuario', conteudo: 'oi' }]);

    await vi.advanceTimersByTimeAsync(30_000);
    await expect(promessa).resolves.toBe('enfim');
    expect(mockGenerateContent).toHaveBeenCalledTimes(3);
  });

  it('não repete em erro que não é transitório (ex.: 400)', async () => {
    mockGenerateContent.mockRejectedValue(erroApi(400, 'requisição inválida'));

    const provedor = criarProvedorGemini();
    const promessa = provedor.gerarTexto('sistema', [{ papel: 'usuario', conteudo: 'oi' }]);

    await expect(promessa).rejects.toThrow('requisição inválida');
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it('desiste após esgotar as tentativas e propaga o erro', async () => {
    mockGenerateContent.mockRejectedValue(erroApi(503, 'high demand'));

    const provedor = criarProvedorGemini();
    const promessa = provedor.gerarTexto('sistema', [{ papel: 'usuario', conteudo: 'oi' }]);
    // Captura a rejeição desde já para não virar unhandled rejection ao avançar o relógio.
    const resultado = expect(promessa).rejects.toThrow('high demand');

    await vi.advanceTimersByTimeAsync(120_000);
    await resultado;
    expect(mockGenerateContent).toHaveBeenCalledTimes(5);
  });

  it('erro de resposta vazia não vira retry infinito', async () => {
    mockGenerateContent.mockResolvedValue({ text: '' });

    const provedor = criarProvedorGemini();
    await expect(
      provedor.gerarTexto('sistema', [{ papel: 'usuario', conteudo: 'oi' }]),
    ).rejects.toThrow(/vazia/i);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });
});
