import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Marca } from '../src/componentes/layout/Marca';
import { Rodape } from '../src/componentes/layout/Rodape';
import { Conversa } from '../src/componentes/conversa/Conversa';

describe('marca e rodapé', () => {
  it('oferece variantes com o mesmo nome acessível', () => {
    const { rerender } = render(<Marca variante="completa" />);
    expect(screen.getByText('Direito Vivo')).toBeVisible();
    rerender(<Marca variante="simbolo" />);
    expect(screen.getByLabelText('Direito Vivo')).toBeVisible();
  });

  it('usa a marca no agente da conversa e remove o avatar textual', () => {
    render(<Conversa mensagens={[{ papel: 'assistente', conteudo: 'Olá' }]} enviando={false} aoEnviar={vi.fn()} />);
    expect(screen.getByLabelText('Direito Vivo')).toBeInTheDocument();
    expect(screen.queryByText(/^DV$/)).not.toBeInTheDocument();
  });

  it('organiza exploração, confiança e limites com links reais', () => {
    render(<Rodape aoMudarAba={vi.fn()} />);
    expect(screen.getByRole('navigation', { name: 'Explorar' })).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'Confiança' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Privacidade e dados' })).toHaveAttribute('href', '#privacidade');
    expect(screen.getByText(/não representa órgão governamental/i)).toBeVisible();
  });
});
