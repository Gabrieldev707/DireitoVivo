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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Encontre o próximo passo');
    expect(screen.getByRole('button', { name: 'Contar minha situação' })).toBeVisible();
    expect(screen.getAllByTestId('situacao-destaque')).toHaveLength(6);
  });

  it('explica a rota sem imagens ou linguagem de portal governamental', () => {
    const { container } = render(<Inicio {...propriedades} />);
    expect(container.querySelectorAll('img')).toHaveLength(0);
    expect(screen.getByText('Conte')).toBeVisible();
    expect(screen.getByText('Confirme')).toBeVisible();
    expect(screen.getByText('Procure')).toBeVisible();
    expect(screen.queryByText(/serviço digital de cidadania/i)).not.toBeInTheDocument();
  });
});
