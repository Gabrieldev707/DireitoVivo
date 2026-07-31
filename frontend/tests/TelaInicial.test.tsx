import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TelaInicial } from '../src/componentes/TelaInicial';

describe('<TelaInicial>', () => {
  it('exibe o disclaimer completo antes do CTA (RF06)', () => {
    render(
      <TelaInicial
        aoComecar={vi.fn()}
        aoVerCatalogo={vi.fn()}
        aoVerCenarios={vi.fn()}
      />,
    );
    expect(screen.getByText(/não substitui aconselhamento jurídico/i)).toBeInTheDocument();
  });

  it('aciona aoComecar ao clicar no botão principal de triagem', async () => {
    const aoComecar = vi.fn();
    const usuario = userEvent.setup();
    render(
      <TelaInicial
        aoComecar={aoComecar}
        aoVerCatalogo={vi.fn()}
        aoVerCenarios={vi.fn()}
      />,
    );
    // Existem várias CTA de "triagem" na tela — clicamos na primeira que aparece com texto principal
    const botoes = screen.getAllByRole('button', { name: /triagem/i });
    await usuario.click(botoes[0]);
    expect(aoComecar).toHaveBeenCalled();
  });

  it('aciona aoVerCatalogo ao clicar em "Explorar direitos"', async () => {
    const aoVerCatalogo = vi.fn();
    const usuario = userEvent.setup();
    render(
      <TelaInicial
        aoComecar={vi.fn()}
        aoVerCatalogo={aoVerCatalogo}
        aoVerCenarios={vi.fn()}
      />,
    );
    await usuario.click(screen.getByRole('button', { name: /explorar direitos/i }));
    expect(aoVerCatalogo).toHaveBeenCalled();
  });
});
