import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Portifolio } from '../src/componentes/Portifolio';
import { CATALOGO_DIREITOS } from '../src/dados/catalogoDireitos';

describe('<Portifolio>', () => {
  it('sinaliza a revisão de vigência do Novo Desenrola no catálogo gerado', () => {
    const item = CATALOGO_DIREITOS.find((direito) => direito.id === 'novo-desenrola-brasil');
    expect(item?.criterios_elegibilidade).toMatch(/vigência encerrado/i);
    expect(item?.ultima_revisao).toBe('2026-09-29');
  });
  it('encontra nome sem acento e restaura a lista ao limpar', async () => {
    render(<Portifolio aoSelecionarDireitoParaChat={vi.fn()} />);
    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox', { name: /buscar no catálogo/i }), 'auxilio');
    expect(screen.getAllByText(/auxílio/i).length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: /limpar filtros/i }));
    expect(screen.getByText(/30 resultados encontrados/i)).toBeInTheDocument();
  });

  it('abre ficha como diálogo e devolve o foco ao fechar', async () => {
    render(<Portifolio termoInicial="BPC" aoSelecionarDireitoParaChat={vi.fn()} />);
    const user = userEvent.setup();
    const abrir = screen.getAllByRole('button', { name: /ver ficha/i })[0];
    await user.click(abrir);
    const dialogo = screen.getByRole('dialog');
    expect(dialogo).toHaveAttribute('aria-modal', 'true');
    expect(dialogo.contains(document.activeElement)).toBe(true);
    const fechar = screen.getByRole('button', { name: /fechar ficha/i });
    fechar.focus();
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(dialogo.contains(document.activeElement)).toBe(true);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(abrir).toHaveFocus();
  });
});
