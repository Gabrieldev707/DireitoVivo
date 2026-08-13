import { afterEach, describe, expect, it, vi } from 'vitest';
import { montarUrlApi } from '../src/api';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('URL da API', () => {
  it('usa a mesma origem no desenvolvimento integrado', () => {
    vi.stubEnv('VITE_API_URL', '');
    expect(montarUrlApi('/api/triagem')).toBe('/api/triagem');
  });

  it('usa a origem da preview sem duplicar barras', () => {
    vi.stubEnv('VITE_API_URL', 'https://direito-vivo-api.vercel.app/');
    expect(montarUrlApi('/api/triagem')).toBe(
      'https://direito-vivo-api.vercel.app/api/triagem',
    );
  });
});
