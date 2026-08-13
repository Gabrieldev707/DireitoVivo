import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { PainelAcessibilidade } from '../src/componentes/layout/PainelAcessibilidade';

describe('painel de acessibilidade', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-tamanho-texto');
    window.localStorage.clear();
  });

  it('oferece ajustes compreensíveis e persiste preferências', async () => {
    const user = userEvent.setup();
    render(<PainelAcessibilidade />);

    await user.click(screen.getByRole('button', { name: 'Abrir acessibilidade' }));
    expect(screen.getByRole('dialog', { name: 'Preferências de acessibilidade' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Aumentar texto' }));
    await user.click(screen.getByRole('switch', { name: 'Contraste reforçado' }));
    await user.click(screen.getByRole('switch', { name: 'Destacar links' }));
    await user.click(screen.getByRole('switch', { name: 'Reduzir movimentos' }));

    expect(document.documentElement).toHaveAttribute('data-tamanho-texto', 'grande');
    expect(document.documentElement).toHaveClass('contraste-reforcado', 'destacar-links', 'reduzir-movimento');
    expect(window.localStorage.getItem('direito-vivo-acessibilidade')).toContain('"contraste":true');
  });

  it('permite restaurar o padrão', async () => {
    const user = userEvent.setup();
    render(<PainelAcessibilidade />);
    await user.click(screen.getByRole('button', { name: 'Abrir acessibilidade' }));
    await user.click(screen.getByRole('button', { name: 'Aumentar texto' }));
    await user.click(screen.getByRole('button', { name: 'Restaurar padrão' }));
    expect(document.documentElement).toHaveAttribute('data-tamanho-texto', 'normal');
  });
});
