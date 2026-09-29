import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CenariosVida } from '../src/componentes/CenariosVida';

describe('<CenariosVida>', () => {
  it('oferece ajuda humana em cenários urgentes e só entrega a prévia ao App', async () => {
    const aoVerAjuda = vi.fn();
    const aoSelecionarCenarioParaChat = vi.fn();
    render(<CenariosVida aoVerAjuda={aoVerAjuda} aoSelecionarCenarioParaChat={aoSelecionarCenarioParaChat} />);
    const ajuda = screen.getAllByRole('button', { name: /ver canais de urgência/i });
    expect(ajuda.length).toBeGreaterThan(0);
    await userEvent.click(ajuda[0]);
    expect(aoVerAjuda).toHaveBeenCalledOnce();
    await userEvent.click(screen.getAllByRole('button', { name: /ver prévia da conversa/i })[0]);
    expect(aoSelecionarCenarioParaChat).toHaveBeenCalledOnce();
  });
});
