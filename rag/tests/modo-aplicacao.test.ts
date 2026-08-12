import { describe, expect, it } from 'vitest';
import { obterModoAplicacao, validarModoAplicacao } from '../src/modo-aplicacao.js';

describe('modo da aplicação', () => {
  it('usa desenvolvimento quando a variável está ausente', () => {
    expect(obterModoAplicacao({})).toBe('desenvolvimento');
  });

  it('aceita explicitamente o modo demo', () => {
    expect(obterModoAplicacao({ MODO_APLICACAO: 'demo' })).toBe('demo');
  });

  it('recusa valor desconhecido', () => {
    expect(() => obterModoAplicacao({ MODO_APLICACAO: 'publico' })).toThrow('MODO_APLICACAO');
  });

  it('mantém produção real bloqueada', () => {
    expect(() => validarModoAplicacao('producao')).toThrow('não está liberado');
  });
});
