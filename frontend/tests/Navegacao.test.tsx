import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';
import { Cabecalho } from '../src/componentes/layout/Cabecalho';
import userEvent from '@testing-library/user-event';

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

describe('cabeçalho responsivo', () => {
  it('abre e fecha o menu móvel com nomes acessíveis', async () => {
    const user = userEvent.setup();
    render(<Cabecalho abaAtiva="inicio" aoMudarAba={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Fechar menu' }));
    expect(screen.queryByRole('button', { name: 'Fechar menu' })).not.toBeInTheDocument();
  });
});
