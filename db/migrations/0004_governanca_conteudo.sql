-- Migration 0004 — Governança editorial e exposição mínima da base pública.
-- Não aplica conteúdo novo: as linhas existentes entram como revisao_pendente.

alter table public.direitos_itens
  add column if not exists resumo_simples text,
  add column if not exists criterios_estruturados jsonb not null default '[]'::jsonb
    check (jsonb_typeof(criterios_estruturados) = 'array'),
  add column if not exists excecoes_e_alertas text[] not null default '{}',
  add column if not exists fontes_oficiais jsonb not null default '[]'::jsonb
    check (jsonb_typeof(fontes_oficiais) = 'array'),
  add column if not exists vigencia_inicio date,
  add column if not exists vigencia_fim date,
  add column if not exists status_conteudo text not null default 'revisao_pendente'
    check (status_conteudo in ('rascunho', 'revisao_pendente', 'publicavel', 'expirado')),
  add column if not exists revisado_por text,
  add column if not exists revisao_prevista_em date,
  add column if not exists versao_conteudo integer not null default 1
    check (versao_conteudo >= 1),
  add column if not exists programa_temporario boolean not null default false,
  add constraint direitos_itens_vigencia_ordem
    check (vigencia_fim is null or vigencia_inicio is null or vigencia_fim >= vigencia_inicio);

comment on column public.direitos_itens.revisado_por is
  'Identificador de revisão editorial; não representa revisão jurídica.';

-- Mesmo se grants antigos tiverem sido ampliados, a migration restaura privilégio mínimo.
revoke insert, update, delete on table public.direitos_itens from anon, authenticated;
grant select on table public.direitos_itens to anon, authenticated, service_role;

alter table public.direitos_itens enable row level security;
drop policy if exists "leitura_publica_direitos" on public.direitos_itens;
drop policy if exists "leitura_publica_conteudo_publicavel" on public.direitos_itens;

create policy "leitura_publica_conteudo_publicavel"
  on public.direitos_itens
  for select
  to anon, authenticated
  using (
    status_conteudo = 'publicavel'
    and revisao_prevista_em >= current_date
    and (vigencia_inicio is null or vigencia_inicio <= current_date)
    and (vigencia_fim is null or vigencia_fim >= current_date)
  );

-- O tipo de retorno mudou; por isso a função é recriada dentro da mesma migration.
drop function if exists public.buscar_direitos(extensions.vector, integer, double precision);

create function public.buscar_direitos(
  consulta extensions.vector(768),
  limite integer default 8,
  limiar double precision default 0.30
)
returns table (
  id text,
  nome_popular text,
  categoria_vida text,
  natureza text,
  resumo_simples text,
  criterios_elegibilidade text,
  criterios_estruturados jsonb,
  documentos_necessarios text[],
  canal_tipo text,
  canal_detalhe text,
  passo_a_passo text[],
  fonte_legal text,
  excecoes_e_alertas text[],
  fontes_oficiais jsonb,
  prioridade_base smallint,
  ultima_revisao date,
  revisao_prevista_em date,
  vigencia_inicio date,
  vigencia_fim date,
  abrangencia text,
  versao_conteudo integer,
  similaridade double precision
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select
    d.id,
    d.nome_popular,
    d.categoria_vida,
    d.natureza,
    d.resumo_simples,
    d.criterios_elegibilidade,
    d.criterios_estruturados,
    d.documentos_necessarios,
    d.canal_tipo,
    d.canal_detalhe,
    d.passo_a_passo,
    d.fonte_legal,
    d.excecoes_e_alertas,
    d.fontes_oficiais,
    d.prioridade_base,
    d.ultima_revisao,
    d.revisao_prevista_em,
    d.vigencia_inicio,
    d.vigencia_fim,
    d.abrangencia,
    d.versao_conteudo,
    (1 - (d.embedding <=> consulta))::double precision as similaridade
  from public.direitos_itens d
  where d.embedding is not null
    and d.status_conteudo = 'publicavel'
    and d.revisao_prevista_em >= current_date
    and (d.vigencia_inicio is null or d.vigencia_inicio <= current_date)
    and (d.vigencia_fim is null or d.vigencia_fim >= current_date)
    and (1 - (d.embedding <=> consulta)) >= greatest(0.0, least(coalesce(limiar, 0.30), 1.0))
  order by d.embedding <=> consulta
  limit greatest(1, least(coalesce(limite, 8), 20));
$$;

revoke execute on function public.buscar_direitos(extensions.vector, integer, double precision) from public;
grant execute on function public.buscar_direitos(extensions.vector, integer, double precision)
  to anon, authenticated, service_role;
