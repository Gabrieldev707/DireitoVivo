import { afterEach, describe, expect, it } from 'vitest';
import { abrirPagina, lerPagina } from '../src/navegacao';

afterEach(() => { window.location.hash = ''; });

describe('navegação por hash', () => {
  it('mapeia endereços antigos e atuais', () => {
    expect(lerPagina('#catalogo')).toBe('direitos');
    expect(lerPagina('#cenarios')).toBe('situacoes');
    expect(lerPagina('#chat')).toBe('conversa');
    expect(lerPagina('#ajuda')).toBe('ajuda');
    expect(lerPagina('#desconhecido')).toBe('inicio');
  });

  it('abre apenas o identificador da página, sem relato na URL', () => {
    abrirPagina('ajuda');
    expect(window.location.hash).toBe('#ajuda');
    expect(window.location.href).not.toContain('relato');
  });
});
