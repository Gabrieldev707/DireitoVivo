import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';

describe('navegação compatível', () => {
  beforeEach(() => {
    window.location.hash = '';
    window.scrollTo = vi.fn();
  });

  it.each([
    ['#catalogo', 'direitos'],
    ['#cenarios', 'situacoes'],
    ['#chat', 'conversa'],
  ])('mantém o link antigo %s na nova experiência', (hash, destino) => {
    window.location.hash = hash;
    render(<App />);
    expect(screen.getByRole('main')).toHaveAttribute('data-view', destino);
  });
});
