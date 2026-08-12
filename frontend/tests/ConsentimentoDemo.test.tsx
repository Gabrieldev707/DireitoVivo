import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConsentimentoDemo } from '../src/componentes/ConsentimentoDemo';

describe('<ConsentimentoDemo>', () => {
  it('explica limites da demo e só permite continuar após o aceite explícito', async () => {
    const aoAceitar = vi.fn();
    const usuario = userEvent.setup();
    render(<ConsentimentoDemo aoAceitar={aoAceitar} aoCancelar={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: /antes de iniciar/i })).toBeInTheDocument();
    expect(screen.getByText(/demonstração de portfólio/i)).toBeInTheDocument();
    expect(screen.getByText(/não informe cpf/i)).toBeInTheDocument();
    expect(screen.getByText(/provedor de inteligência artificial/i)).toBeInTheDocument();

    const continuar = screen.getByRole('button', { name: /continuar para a demonstração/i });
    expect(continuar).toBeDisabled();
    await usuario.click(screen.getByRole('checkbox', { name: /entendi os limites/i }));
    await usuario.click(continuar);
    expect(aoAceitar).toHaveBeenCalledOnce();
  });

  it('permite cancelar sem gravar consentimento no navegador', async () => {
    const aoCancelar = vi.fn();
    const usuario = userEvent.setup();
    const gravar = vi.spyOn(Storage.prototype, 'setItem');
    render(<ConsentimentoDemo aoAceitar={vi.fn()} aoCancelar={aoCancelar} />);

    await usuario.click(screen.getByRole('button', { name: /voltar sem iniciar/i }));
    expect(aoCancelar).toHaveBeenCalledOnce();
    expect(gravar).not.toHaveBeenCalled();
    gravar.mockRestore();
  });
});
