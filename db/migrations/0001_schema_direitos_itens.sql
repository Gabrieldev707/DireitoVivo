-- Migration 0001 — Schema da base de conhecimento (SDD seção 4.1)
-- Tabela única `direitos_itens`: cada linha é um benefício ou serviço público curado.
-- Privacidade por design: NENHUMA tabela guarda CPF, RG, nome ou dados do usuário.

create extension if not exists vector;

create table if not exists public.direitos_itens (
  -- Campos do schema do SDD (seção 4.1)
  id text primary key, -- slug estável, ex: 'bolsa-familia'
  nome_popular text not null,
  categoria_vida text not null check (categoria_vida in (
    'familia_crianca', 'idoso', 'pcd', 'saude_mental',
    'trabalho_acidente', 'situacao_rua', 'violencia_domestica', 'divida_credito'
  )),
  natureza text not null check (natureza in ('beneficio', 'servico')),
  criterios_elegibilidade text not null,
  documentos_necessarios text[] not null default '{}',
  canal_tipo text not null check (canal_tipo in (
    'app_meu_inss', 'app_cadunico', 'app_pe_de_meia', 'app_fgts',
    'site_especifico', 'presencial', 'telefone'
  )),
  canal_detalhe text not null,
  passo_a_passo text[] not null,
  fonte_legal text not null,
  prioridade_base smallint not null check (prioridade_base between 1 and 5),
  ultima_revisao date not null,
  abrangencia text not null check (abrangencia in ('federal', 'estadual_variavel')),

  -- Campos de infraestrutura (RAG e auditoria — não fazem parte da ficha exibida)
  termos_populares text[] not null default '{}', -- sinônimos/gírias usados só pra melhorar a busca
  texto_embedding text, -- texto exato que gerou o embedding (auditável)
  embedding vector(768), -- gemini-embedding-001 com outputDimensionality=768, normalizado
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table public.direitos_itens is
  'Base de conhecimento curada do Direito Vivo. Sem dados de usuário — apenas conteúdo público sobre benefícios/serviços.';

-- Leitura pública (a base é conteúdo público); escrita só via service_role.
alter table public.direitos_itens enable row level security;

create policy "leitura_publica_direitos"
  on public.direitos_itens
  for select
  to anon, authenticated
  using (true);
