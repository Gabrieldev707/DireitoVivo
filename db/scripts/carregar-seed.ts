// Carrega (upsert) os itens de seed/itens.json na tabela direitos_itens.
// Requer SUPABASE_CHAVE_SERVICO no .env da raiz (a tabela só aceita escrita via service_role).
// Uso: npm run db:seed (na raiz) ou npm run seed (neste diretório).
import { criarClienteSupabase } from '@direito-vivo/rag';
import { auditarItens } from '../src/conteudo.js';
import { carregarSeedGovernado } from '../src/seed-governado.js';

const itens = carregarSeedGovernado();
const hoje = new Date().toISOString().slice(0, 10);
const erros = auditarItens(itens, hoje).filter((problema) => problema.severidade === 'erro');
if (erros.length > 0) throw new Error(`Seed bloqueado pela auditoria editorial: ${erros.length} erro(s).`);

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
  resumo_simples: item.resumo_simples,
  criterios_estruturados: item.criterios_estruturados,
  excecoes_e_alertas: item.excecoes_e_alertas,
  fontes_oficiais: item.fontes_oficiais,
  prioridade_base: item.prioridade_base,
  ultima_revisao: item.ultima_revisao,
  revisao_prevista_em: item.revisao_prevista_em,
  vigencia_inicio: item.vigencia_inicio,
  vigencia_fim: item.vigencia_fim,
  status_conteudo: item.status_conteudo,
  revisado_por: item.revisado_por,
  versao_conteudo: item.versao_conteudo,
  programa_temporario: item.programa_temporario ?? false,
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
