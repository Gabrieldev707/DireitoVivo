import { describe, expect, it } from 'vitest';
import { protegerMensagens } from '../src/protecao-dados.js';

describe('protegerMensagens', () => {
  it('mascara CPF formatado e e-mail sem alterar o array original', () => {
    const entrada = [
      { papel: 'usuario' as const, conteudo: 'CPF 123.456.789-09 e email pessoa@exemplo.com' },
    ];

    expect(protegerMensagens(entrada)).toEqual({
      mensagens: [
        { papel: 'usuario', conteudo: 'CPF [CPF REMOVIDO] e email [E-MAIL REMOVIDO]' },
      ],
      categoriasMascaradas: ['cpf', 'email'],
    });
    expect(entrada[0].conteudo).toContain('123.456.789-09');
  });

  it('mascara CPF sem pontuação quando identificado pelo contexto', () => {
    expect(
      protegerMensagens([{ papel: 'usuario', conteudo: 'meu cpf é 12345678909' }]).mensagens[0]
        .conteudo,
    ).toBe('meu cpf é [CPF REMOVIDO]');
  });

  it('mascara telefone brasileiro e CEP', () => {
    expect(
      protegerMensagens([
        { papel: 'usuario', conteudo: 'telefone (11) 99876-5432, CEP 01310-100' },
      ]),
    ).toEqual({
      mensagens: [
        { papel: 'usuario', conteudo: 'telefone [TELEFONE REMOVIDO], CEP [CEP REMOVIDO]' },
      ],
      categoriasMascaradas: ['telefone', 'cep'],
    });
  });

  it('preserva valores monetários, datas e números de benefício não identificados como PII', () => {
    const texto = 'Recebo R$ 1.320,50 desde 10/08/2026 e moro com 3 pessoas.';
    expect(protegerMensagens([{ papel: 'usuario', conteudo: texto }])).toEqual({
      mensagens: [{ papel: 'usuario', conteudo: texto }],
      categoriasMascaradas: [],
    });
  });
});
