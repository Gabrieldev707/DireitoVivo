-- Migration 0002 — Função de busca semântica (RAG)
-- Recebe o embedding da consulta (gerado no backend) e retorna os itens mais
-- próximos por similaridade de cosseno. Com ~30 linhas não há necessidade de
-- índice vetorial (ivfflat/hnsw) — busca exata é instantânea nessa escala.

create or replace function public.buscar_direitos(
  consulta vector(768),
  limite int default 8,
  limiar float default 0.30
)
returns table (
  id text,
  nome_popular text,
  categoria_vida text,
  natureza text,
  criterios_elegibilidade text,
  documentos_necessarios text[],
  canal_tipo text,
  canal_detalhe text,
  passo_a_passo text[],
  fonte_legal text,
  prioridade_base smallint,
  ultima_revisao date,
  abrangencia text,
  similaridade float
)
language sql
stable
set search_path = public
as $$
  select
    d.id,
    d.nome_popular,
    d.categoria_vida,
    d.natureza,
    d.criterios_elegibilidade,
    d.documentos_necessarios,
    d.canal_tipo,
    d.canal_detalhe,
    d.passo_a_passo,
    d.fonte_legal,
    d.prioridade_base,
    d.ultima_revisao,
    d.abrangencia,
    (1 - (d.embedding <=> consulta))::float as similaridade
  from public.direitos_itens d
  where d.embedding is not null
    and (1 - (d.embedding <=> consulta)) >= limiar
  order by d.embedding <=> consulta
  limit limite;
$$;
