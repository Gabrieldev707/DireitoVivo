// Carrega (upsert) os itens de seed/itens.json na tabela direitos_itens.
// Requer SUPABASE_CHAVE_SERVICO no .env da raiz (a tabela só aceita escrita via service_role).
// Uso: npm run db:seed (na raiz) ou npm run seed (neste diretório).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { criarClienteSupabase, type DireitoItemSeed } from '@direito-vivo/rag';

const caminhoItens = fileURLToPath(new URL('../seed/itens.json', import.meta.url));
const itens: DireitoItemSeed[] = JSON.parse(readFileSync(caminhoItens, 'utf8'));

const supabase = criarClienteSupabase({ usarChaveServico: true });

const linhas = itens.map((item) => ({
  id: item.id,
  nome_popular: item.nome_popular,
  categoria_vida: item.categoria_vida,
  natureza: item.natureza,
  criterios_elegibilidade: item.criterios_elegibilidade,
  documentos_necessarios: item.documentos_necessarios,
  canal_tipo: item.canal_solicitacao.tipo,
  canal_detalhe: item.canal_solicitacao.detalhe,
  passo_a_passo: item.passo_a_passo,
  fonte_legal: item.fonte_legal,
  prioridade_base: item.prioridade_base,
  ultima_revisao: item.ultima_revisao,
  abrangencia: item.abrangencia,
  termos_populares: item.termos_populares,
  atualizado_em: new Date().toISOString(),
}));

const { error } = await supabase.from('direitos_itens').upsert(linhas, { onConflict: 'id' });
if (error) {
  console.error('Falha ao carregar o seed:', error.message);
  process.exit(1);
}
console.log(`Seed carregado: ${linhas.length} itens (upsert por id).`);
console.log('Lembrete: rode "npm run db:embeddings" para (re)gerar os embeddings.');
