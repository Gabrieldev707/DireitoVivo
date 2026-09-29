import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Ajuda } from '../src/componentes/Ajuda';

describe('<Ajuda>', () => {
  it('separa perigo imediato de orientação e assistência', () => {
    render(<Ajuda />);
    const imediato = screen.getByRole('region', { name: /perigo imediato/i });
    expect(within(imediato).getByRole('link', { name: /190/i })).toHaveAttribute('href', 'tel:190');
    expect(within(imediato).getByRole('link', { name: /192/i })).toHaveAttribute('href', 'tel:192');
    expect(within(imediato).queryByText(/CRAS/i)).not.toBeInTheDocument();
    const orientacao = screen.getByRole('region', { name: /orientação e denúncia/i });
    expect(within(orientacao).getByRole('link', { name: /180/i })).toBeInTheDocument();
    expect(within(orientacao).getByRole('link', { name: /100/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /CRAS e Cadastro Único/i })).toBeInTheDocument();
  });
});
