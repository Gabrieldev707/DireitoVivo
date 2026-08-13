import { describe, expect, it } from 'vitest';
import { SITUACOES } from '../src/dados/situacoes';

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
