import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';

describe('central de confiança', () => {
  beforeEach(() => { window.scrollTo = vi.fn(); });

  it.each([
    ['#acessibilidade', 'Acessibilidade e como usar'],
    ['#privacidade', 'Privacidade e dados'],
    ['#termos', 'Termos e limites'],
    ['#sobre', 'Sobre o Direito Vivo'],
  ])('renderiza %s com conteúdo editorial', (hash, titulo) => {
    window.location.hash = hash;
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: titulo })).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'Nesta página' })).toBeVisible();
  });

  it('explica o processamento real sem prometer anonimato absoluto', () => {
    window.location.hash = '#privacidade';
    render(<App />);
    expect(screen.getByText(/histórico permanece somente nesta aba/i)).toBeVisible();
    expect(screen.getByText(/Gemini/i)).toBeVisible();
    expect(document.body).not.toHaveTextContent(/100% anônim|site oficial do governo/i);
  });

  it('explica recursos e limitações de acessibilidade', () => {
    window.location.hash = '#acessibilidade';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Recursos disponíveis' })).toBeVisible();
    expect(screen.getByText(/reconhecimento de voz não funciona em todos os navegadores/i)).toBeVisible();
  });
});
