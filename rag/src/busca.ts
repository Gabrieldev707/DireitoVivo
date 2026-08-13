// Busca na base de conhecimento: semântica (pgvector) com fallback para a base inteira.
import { obterProvedorLLM } from './provedor-llm.js';
import { obterSupabase } from './supabase.js';
import {
  linhaParaItem,
  type DireitoItem,
  type ItemComSimilaridade,
  type LinhaDireitoItem,
} from './tipos.js';

const COLUNAS_FICHA =
  'id, nome_popular, categoria_vida, natureza, resumo_simples, criterios_elegibilidade, ' +
  'criterios_estruturados, documentos_necessarios, canal_tipo, canal_detalhe, passo_a_passo, ' +
  'fonte_legal, excecoes_e_alertas, fontes_oficiais, prioridade_base, ultima_revisao, ' +
  'revisao_prevista_em, vigencia_inicio, vigencia_fim, abrangencia, versao_conteudo';

/**
 * Retorna os itens mais próximos da consulta por similaridade de cosseno.
 * Se os embeddings ainda não foram gerados (base recém-carregada), cai para a base
 * inteira — com ~30 itens isso segue dentro do contexto do LLM sem problema.
 */
export async function buscarItensRelevantes(consulta: string, limite = 10): Promise<ItemComSimilaridade[]> {
  const embedding = await obterProvedorLLM().gerarEmbedding(consulta, 'consulta');
  const { data, error } = await obterSupabase().rpc('buscar_direitos', {
    consulta: JSON.stringify(embedding),
    limite,
    limiar: 0.3,
  });
  if (error) throw new Error(`Falha na busca semântica: ${error.message}`);

  const linhas = (data ?? []) as LinhaDireitoItem[];
  if (linhas.length > 0) {
    return linhas.map((linha) => ({ ...linhaParaItem(linha), similaridade: linha.similaridade ?? 0 }));
  }
  const todos = await listarTodosItens();
  return todos.map((item) => ({ ...item, similaridade: 0 }));
}

export async function listarTodosItens(): Promise<DireitoItem[]> {
  const { data, error } = await obterSupabase()
    .from('direitos_itens')
    .select(COLUNAS_FICHA)
    .order('prioridade_base')
    .order('nome_popular');
  if (error) throw new Error(`Falha ao listar itens: ${error.message}`);
  return ((data ?? []) as unknown as LinhaDireitoItem[]).map(linhaParaItem);
}

export async function buscarFichasPorIds(ids: string[]): Promise<DireitoItem[]> {
  if (ids.length === 0) return [];
  const { data, error } = await obterSupabase()
    .from('direitos_itens')
    .select(COLUNAS_FICHA)
    .in('id', ids);
  if (error) throw new Error(`Falha ao buscar fichas: ${error.message}`);
  return ((data ?? []) as unknown as LinhaDireitoItem[]).map(linhaParaItem);
}
