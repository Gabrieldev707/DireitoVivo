-- Migration 0003 — Move a extensão pgvector para fora do schema public
-- (recomendação do security advisor do Supabase: lint 0014_extension_in_public).
-- A função buscar_direitos precisa do schema extensions no search_path para
-- continuar resolvendo o operador <=> depois da mudança.

create schema if not exists extensions;
alter extension vector set schema extensions;

create or replace function public.buscar_direitos(
  consulta extensions.vector(768),
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
set search_path = public, extensions
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
