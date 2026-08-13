import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Direitos } from '../src/componentes/direitos/Direitos';

describe('catálogo de direitos', () => {
  it('busca entre sete itens e abre detalhes verificáveis', async () => {
    const user = userEvent.setup();
    render(<Direitos aoConversarSobre={vi.fn()} />);

    expect(screen.getByText('7 direitos e serviços revisados')).toBeVisible();
    await user.type(screen.getByRole('searchbox', { name: 'Buscar direitos' }), 'remédio');
    expect(screen.getAllByTestId('cartao-direito')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /ver detalhes de farmácia popular/i }));
    expect(screen.getByRole('link', { name: /fonte oficial/i })).toHaveAttribute(
      'href',
      expect.stringMatching(/^https:\/\//),
    );
  });
});
