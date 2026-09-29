import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TelaInicial } from '../src/componentes/TelaInicial';

const props = () => ({
  aoComecar: vi.fn(),
  aoBuscarDireitos: vi.fn(),
  aoVerAjuda: vi.fn(),
  aoVerSituacoes: vi.fn(),
});

describe('<TelaInicial>', () => {
  it('busca um direito sem enviar relato à IA', async () => {
    const acoes = props();
    render(<TelaInicial {...acoes} />);
    await userEvent.type(screen.getByRole('searchbox', { name: /o que está acontecendo/i }), 'BPC');
    await userEvent.click(screen.getByRole('button', { name: /buscar direitos/i }));
    expect(acoes.aoBuscarDireitos).toHaveBeenCalledWith('BPC');
    expect(acoes.aoComecar).not.toHaveBeenCalled();
  });

  it('oferece ajuda antes da conversa e esclarece os limites', async () => {
    const acoes = props();
    render(<TelaInicial {...acoes} />);
    expect(screen.getAllByText(/projeto independente/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/não substitui aconselhamento jurídico/i)).toBeInTheDocument();
    expect(screen.queryByText(/anônima|nada é armazenado/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /preciso de ajuda agora/i }));
    expect(acoes.aoVerAjuda).toHaveBeenCalledOnce();
  });
});
