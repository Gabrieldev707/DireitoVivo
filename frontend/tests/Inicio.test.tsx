import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Inicio } from '../src/componentes/inicio/Inicio';

const propriedades = {
  aoComecar: vi.fn(),
  aoVerDireitos: vi.fn(),
  aoVerSituacoes: vi.fn(),
  aoEscolherSituacao: vi.fn(),
};

describe('nova página inicial', () => {
  it('apresenta uma ação principal e seis situações prioritárias', () => {
    render(<Inicio {...propriedades} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Descubra onde buscar ajuda');
    expect(screen.getByRole('button', { name: 'Contar minha situação' })).toBeVisible();
    expect(screen.getAllByTestId('situacao-destaque')).toHaveLength(6);
  });

  it('usa uma fotografia brasileira leve sem os elementos rejeitados do hero', () => {
    const { container } = render(<Inicio {...propriedades} />);
    expect(screen.getByRole('img', { name: /família brasileira consultando orientações/i })).toBeVisible();
    expect(container.querySelector('source[media="(max-width: 47.999rem)"]')).toHaveAttribute(
      'srcSet',
      '/assets/hero-brasil-familia-mobile.webp',
    );
    expect(screen.queryByText('orientação anônima')).not.toBeInTheDocument();
    expect(screen.queryByText('Da dúvida ao lugar certo')).not.toBeInTheDocument();
  });
});
