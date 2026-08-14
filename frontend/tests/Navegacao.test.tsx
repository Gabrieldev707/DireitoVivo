import { act, render, screen, within } from '@testing-library/react';
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

  it.each([
    ['#direitos', 'direitos'],
    ['#situacoes', 'situacoes'],
    ['#conversa', 'conversa'],
  ])('abre o link canônico %s diretamente', (hash, destino) => {
    window.location.hash = hash;
    render(<App />);
    expect(screen.getByRole('main')).toHaveAttribute('data-view', destino);
  });

  it.each([
    ['#acessibilidade', 'acessibilidade'],
    ['#privacidade', 'privacidade'],
    ['#termos', 'termos'],
    ['#sobre', 'sobre'],
  ])('abre a página institucional %s', (hash, destino) => {
    window.location.hash = hash;
    render(<App />);
    expect(screen.getByRole('main')).toHaveAttribute('data-view', destino);
  });

  it('acompanha voltar, avançar e alterações manuais do hash', () => {
    window.location.hash = '#inicio';
    render(<App />);

    act(() => {
      window.location.hash = '#situacoes';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(screen.getByRole('main')).toHaveAttribute('data-view', 'situacoes');
  });

  it('publica a rota canônica ao navegar pelo cabeçalho', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(within(screen.getByRole('banner')).getByRole('button', { name: 'Direitos' }));
    expect(window.location.hash).toBe('#direitos');
  });
});

describe('cabeçalho responsivo', () => {
  it('mantém páginas institucionais fora da navegação principal', () => {
    render(<Cabecalho abaAtiva="sobre" aoMudarAba={vi.fn()} />);
    expect(within(screen.getByRole('navigation', { name: 'Principal' })).queryByRole('button', { name: 'Sobre' })).not.toBeInTheDocument();
  });
  it('abre e fecha o menu móvel com nomes acessíveis', async () => {
    const user = userEvent.setup();
    render(<Cabecalho abaAtiva="inicio" aoMudarAba={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Fechar menu' }));
    expect(screen.queryByRole('button', { name: 'Fechar menu' })).not.toBeInTheDocument();
  });
});
