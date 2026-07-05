// Construção do texto que representa cada item na busca semântica.
// Manter num lugar só: o script db/scripts/gerar-embeddings.ts usa esta mesma função,
// e o texto usado fica auditável na coluna `texto_embedding`.
import { ROTULOS_CATEGORIA, type CategoriaVida } from './tipos.js';

/** Precisa bater com vector(768) na migration 0002 e com o outputDimensionality do provedor. */
export const DIMENSOES_EMBEDDING = 768;

export interface EntradaTextoEmbedding {
  nome_popular: string;
  categoria_vida: string;
  natureza: string;
  criterios_elegibilidade: string;
  canal_detalhe: string;
  termos_populares: string[];
}

export function construirTextoEmbedding(item: EntradaTextoEmbedding): string {
  const rotulo = ROTULOS_CATEGORIA[item.categoria_vida as CategoriaVida] ?? item.categoria_vida;
  return [
    item.nome_popular,
    item.termos_populares.length > 0 ? `Como as pessoas falam: ${item.termos_populares.join(', ')}.` : '',
    `Situação de vida: ${rotulo}.`,
    item.natureza === 'servico'
      ? 'É um serviço gratuito: não tem requerimento, é chegar e usar.'
      : 'É um benefício: tem pedido formal e critérios de elegibilidade.',
    `Quem tem direito: ${item.criterios_elegibilidade}`,
    `Onde pedir/acessar: ${item.canal_detalhe}.`,
  ]
    .filter(Boolean)
    .join('\n');
}
