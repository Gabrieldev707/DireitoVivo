import { describe, expect, it, vi } from 'vitest';
import { SITUACOES } from '../src/dados/situacoes';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Situacoes } from '../src/componentes/situacoes/Situacoes';

describe('situações orientadas', () => {
  it('oferece exatamente 12 entradas com ids e mensagens únicas', () => {
    expect(SITUACOES).toHaveLength(12);
    expect(new Set(SITUACOES.map((item) => item.id)).size).toBe(12);
    expect(new Set(SITUACOES.map((item) => item.mensagemInicial)).size).toBe(12);
  });

  it('limita referências aos sete direitos publicáveis', () => {
    const idsPermitidos = new Set([
      'bolsa-familia',
      'bpc-loas-idoso',
      'bpc-loas-pcd',
      'seguro-desemprego',
      'auxilio-incapacidade-temporaria',
      'farmacia-popular',
      'caps',
    ]);

    for (const situacao of SITUACOES) {
      expect(situacao.direitosIds.every((id) => idsPermitidos.has(id))).toBe(true);
    }
  });

  it('classifica cinco situações como saúde e mantém orientação geral separada', () => {
    expect(SITUACOES.filter((item) => item.categoria === 'saude')).toHaveLength(5);
    expect(SITUACOES.find((item) => item.id === 'nao-sei-servico')?.categoria).toBe(
      'orientacao_geral',
    );
  });
});

describe('página de situações', () => {
  it('filtra saúde e envia a situação selecionada', async () => {
    const user = userEvent.setup();
    const aoEscolher = vi.fn();
    render(<Situacoes aoEscolher={aoEscolher} />);

    expect(screen.getAllByTestId('cartao-situacao')).toHaveLength(12);
    await user.click(screen.getByRole('button', { name: 'Saúde' }));
    expect(screen.getByText('5 situações encontradas')).toBeVisible();
    await user.click(screen.getByRole('button', { name: /conversar sobre remédios/i }));
    expect(aoEscolher).toHaveBeenCalledWith(expect.objectContaining({ id: 'medicamentos' }));
  });
});
