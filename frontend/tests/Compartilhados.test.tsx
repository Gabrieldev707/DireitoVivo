import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EstadoVazio } from '../src/componentes/compartilhados/EstadoVazio';
import { Icone } from '../src/componentes/compartilhados/Icone';
import { Selo } from '../src/componentes/compartilhados/Selo';

describe('componentes compartilhados', () => {
  it('orienta a pessoa quando uma busca não encontra conteúdo', () => {
    render(
      <EstadoVazio
        titulo="Nenhum direito encontrado"
        descricao="Tente outra busca."
        acao={<button type="button">Limpar busca</button>}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Nenhum direito encontrado' })).toBeVisible();
    expect(screen.getByText('Tente outra busca.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Limpar busca' })).toBeVisible();
  });

  it('expõe o texto do selo e mantém o ícone decorativo fora da árvore acessível', () => {
    const { container } = render(
      <Selo tom="cuidado">
        <Icone nome="escudo" /> Conteúdo revisado
      </Selo>,
    );

    expect(screen.getByText(/conteúdo revisado/i)).toBeVisible();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
