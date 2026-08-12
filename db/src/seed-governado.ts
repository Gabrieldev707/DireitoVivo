import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { ItemConteudo } from './conteudo.js';

export function carregarSeedGovernado(): ItemConteudo[] {
  const caminho = fileURLToPath(new URL('../seed/itens.json', import.meta.url));
  return JSON.parse(readFileSync(caminho, 'utf8')) as ItemConteudo[];
}
