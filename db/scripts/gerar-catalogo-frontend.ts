// Gera o catálogo do frontend a partir de db/seed/itens.json — a fonte única de verdade.
//
// Antes deste script o frontend tinha um catálogo escrito à mão, com 17 itens e ids em
// snake_case (`bolsa_familia`), enquanto a base real tinha 30 itens em kebab-case
// (`bolsa-familia`). Nenhum id batia: eram duas bases paralelas que podiam se
// contradizer, e o catálogo mostrava direitos que a triagem jamais recomendaria.
//
// Uso: npm run db:catalogo (na raiz). Rode sempre que o seed mudar.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { auditarItens } from '../src/conteudo.js';
import { carregarSeedGovernado, filtrarItensPublicaveis } from '../src/seed-governado.js';

const aqui = dirname(fileURLToPath(import.meta.url));
const caminhoSaida = resolve(aqui, '../../frontend/src/dados/catalogoDireitos.ts');
const hoje = new Date().toISOString().slice(0, 10);
const todosItens = carregarSeedGovernado();
const erros = auditarItens(todosItens, hoje).filter((problema) => problema.severidade === 'erro');
if (erros.length > 0) throw new Error(`Catálogo bloqueado pela auditoria editorial: ${erros.length} erro(s).`);
const itens = filtrarItensPublicaveis(todosItens, hoje);

// Ordena por urgência/facilidade para o catálogo abrir com o que resolve mais rápido.
const ordenados = [...itens].sort(
  (a, b) =>
    a.prioridade_base - b.prioridade_base ||
    a.nome_popular.localeCompare(b.nome_popular, 'pt-BR'),
);

// `posicao` e `motivo` existem no tipo ItemLinhaDaVida porque a triagem os preenche.
// No catálogo não há conversa, então `motivo` recebe os critérios resumidos — é o texto
// que o card exibe e que a busca do catálogo varre.
const catalogo = ordenados.map((item, indice) => ({
  ...item,
  termos_populares: item.termos_populares ?? [],
  posicao: indice + 1,
  motivo: item.criterios_elegibilidade,
}));

const conteudo = `import type { ItemCatalogo } from '../tipos';

// ⚠️ ARQUIVO GERADO — não edite à mão.
// Fonte de verdade: db/seed/itens.json. Regenere com \`npm run db:catalogo\`.
// Gerado a partir de ${itens.length} itens publicáveis da base de conhecimento.
export const CATALOGO_DIREITOS: ItemCatalogo[] = ${JSON.stringify(catalogo, null, 2)};

/** Quantidade de itens da base — use no lugar de números escritos à mão na interface. */
export const TOTAL_DIREITOS = CATALOGO_DIREITOS.length;
`;

await writeFile(caminhoSaida, conteudo, 'utf-8');

console.log(`Catálogo gerado: ${catalogo.length} itens → frontend/src/dados/catalogoDireitos.ts`);
const porCategoria = catalogo.reduce<Record<string, number>>((acc, i) => {
  acc[i.categoria_vida] = (acc[i.categoria_vida] ?? 0) + 1;
  return acc;
}, {});
for (const [categoria, quantidade] of Object.entries(porCategoria).sort()) {
  console.log(`  ${categoria.padEnd(24)} ${quantidade}`);
}
