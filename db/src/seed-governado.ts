import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { podeSerPublicado, type ItemConteudo } from './conteudo.js';

export interface ItemSeedGovernado extends ItemConteudo {
  categoria_vida: string;
  natureza: string;
  prioridade_base: number;
  abrangencia: string;
  termos_populares: string[];
}

export function carregarSeedGovernado(): ItemSeedGovernado[] {
  const caminho = fileURLToPath(new URL('../seed/itens.json', import.meta.url));
  return JSON.parse(readFileSync(caminho, 'utf8')) as ItemSeedGovernado[];
}

export function filtrarItensPublicaveis(
  itens: ItemSeedGovernado[],
  hoje: string,
): ItemSeedGovernado[] {
  return itens.filter((item) => podeSerPublicado(item, hoje));
}
