import { afterEach, describe, expect, it, vi } from 'vitest';
import { obterEnv } from '../src/config.js';

describe('configuração de ambiente', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('remove espaços e quebras de linha do valor configurado', () => {
    vi.stubEnv('ORIGEM_TESTE', '  https://exemplo.test\r\n');

    expect(obterEnv('ORIGEM_TESTE')).toBe('https://exemplo.test');
  });
});
