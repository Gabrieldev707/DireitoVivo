import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConsentimentoDemo } from '../src/componentes/ConsentimentoDemo';

describe('<ConsentimentoDemo>', () => {
  it('explica limites da demo e só permite continuar após o aceite explícito', async () => {
    const aoAceitar = vi.fn();
    const usuario = userEvent.setup();
    render(<ConsentimentoDemo aoAceitar={aoAceitar} aoCancelar={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: /você escolhe o que compartilhar/i })).toBeInTheDocument();
    expect(screen.getByText(/antes da conversa/i)).toBeInTheDocument();
    expect(screen.getByText(/não informe cpf/i)).toBeInTheDocument();
    expect(screen.getByText(/provedor de inteligência artificial/i)).toBeInTheDocument();

    const continuar = screen.getByRole('button', { name: /entendi e quero continuar/i });
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

    await usuario.click(screen.getByRole('button', { name: /voltar sem enviar/i }));
    expect(aoCancelar).toHaveBeenCalledOnce();
    expect(gravar).not.toHaveBeenCalled();
    gravar.mockRestore();
  });
});
