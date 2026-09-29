import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AvisoDemo } from '../src/componentes/AvisoDemo';

describe('<AvisoDemo>', () => {
  it('explica o provedor e exige confirmação antes de aceitar', async () => {
    const aoAceitar = vi.fn();
    const usuario = userEvent.setup();
    render(<AvisoDemo aberto aoAceitar={aoAceitar} aoFechar={vi.fn()} />);
    expect(screen.getByRole('dialog')).toHaveTextContent(/provedor externo de IA/i);
    const confirmar = screen.getByRole('button', { name: /iniciar demonstração/i });
    expect(confirmar).toBeDisabled();
    await usuario.click(screen.getByRole('checkbox', { name: /entendi/i }));
    await usuario.click(confirmar);
    expect(aoAceitar).toHaveBeenCalledOnce();
  });

  it('mostra o relato de cenário e fecha por Escape', async () => {
    const aoFechar = vi.fn();
    const usuario = userEvent.setup();
    render(<AvisoDemo aberto contexto={{ titulo: 'Desemprego', texto: 'Perdi renda recentemente' }} aoAceitar={vi.fn()} aoFechar={aoFechar} />);
    expect(screen.getByText(/Perdi renda recentemente/)).toBeInTheDocument();
    await usuario.keyboard('{Escape}');
    expect(aoFechar).toHaveBeenCalledOnce();
  });

  it('devolve o foco ao acionador ao fechar', () => {
    const acionador = document.createElement('button');
    document.body.appendChild(acionador);
    acionador.focus();
    const { rerender, unmount } = render(<AvisoDemo aberto aoAceitar={vi.fn()} aoFechar={vi.fn()} />);
    expect(screen.getByRole('button', { name: /fechar aviso/i })).toHaveFocus();
    rerender(<AvisoDemo aberto={false} aoAceitar={vi.fn()} aoFechar={vi.fn()} />);
    expect(acionador).toHaveFocus();
    unmount();
    acionador.remove();
  });
});
