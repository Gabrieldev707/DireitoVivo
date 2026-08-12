import { describe, expect, it } from 'vitest';
import { detectarUrgencia } from '../src/urgencia.js';

describe('detectarUrgencia', () => {
  it.each([
    ['ele está armado e vai me matar agora', ['190']],
    ['meu marido me agrediu e estou em perigo', ['190', '180']],
    ['estou pensando em me matar hoje', ['188', '192']],
  ])('detecta risco imediato em %s', (texto, numeros) => {
    const resposta = detectarUrgencia(texto);
    expect(resposta?.nivel).toBe('imediato');
    expect(resposta?.canais.map((canal) => canal.numero)).toEqual(numeros);
  });

  it.each([
    'fui assaltado no ano passado e hoje estou desempregado',
    'tenho pensamentos ruins às vezes, mas não estou em risco agora',
    'quero informações sobre medida protetiva para outra pessoa',
  ])('não classifica contexto histórico ou informativo como urgência: %s', (texto) => {
    expect(detectarUrgencia(texto)).toBeUndefined();
  });
});
