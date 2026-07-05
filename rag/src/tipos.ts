// Tipos do domínio — espelham o schema da seção 4.1 do SDD.

export type CategoriaVida =
  | 'familia_crianca'
  | 'idoso'
  | 'pcd'
  | 'saude_mental'
  | 'trabalho_acidente'
  | 'situacao_rua'
  | 'violencia_domestica'
  | 'divida_credito';

export type Natureza = 'beneficio' | 'servico';

export type CanalTipo =
  | 'app_meu_inss'
  | 'app_cadunico'
  | 'app_pe_de_meia'
  | 'app_fgts'
  | 'site_especifico'
  | 'presencial'
  | 'telefone';

export const ROTULOS_CATEGORIA: Record<CategoriaVida, string> = {
  familia_crianca: 'Família / criança',
  idoso: 'Idoso',
  pcd: 'Pessoa com deficiência',
  saude_mental: 'Saúde mental',
  trabalho_acidente: 'Trabalho / acidente',
  situacao_rua: 'Situação de rua / extrema pobreza',
  violencia_domestica: 'Violência doméstica',
  divida_credito: 'Dívida / crédito',
};

export interface DireitoItem {
  id: string;
  nome_popular: string;
  categoria_vida: CategoriaVida;
  natureza: Natureza;
  criterios_elegibilidade: string;
  documentos_necessarios: string[];
  canal_solicitacao: {
    tipo: CanalTipo;
    detalhe: string;
  };
  passo_a_passo: string[];
  fonte_legal: string;
  prioridade_base: 1 | 2 | 3 | 4 | 5;
  ultima_revisao: string; // ISO date
  abrangencia: 'federal' | 'estadual_variavel';
}

/** Item como está no db/seed/itens.json (inclui termos_populares, campo de apoio à busca). */
export interface DireitoItemSeed extends DireitoItem {
  termos_populares: string[];
}

export interface ItemComSimilaridade extends DireitoItem {
  similaridade: number;
}

/** Item dentro da "linha de vida" (resultado ordenado por urgência + facilidade). */
export interface ItemLinhaDaVida extends DireitoItem {
  posicao: number; // 1 = comece por aqui
  motivo: string; // por que provavelmente se aplica, em linguagem simples
}

export interface MensagemChat {
  papel: 'usuario' | 'assistente';
  conteudo: string;
}

export type RespostaTriagem =
  | { tipo: 'pergunta'; mensagem: string }
  | { tipo: 'resultado'; mensagem: string; itens: ItemLinhaDaVida[] }
  | { tipo: 'sem_match'; mensagem: string };

/** Linha retornada pela função SQL buscar_direitos / select na tabela. */
export interface LinhaDireitoItem {
  id: string;
  nome_popular: string;
  categoria_vida: CategoriaVida;
  natureza: Natureza;
  criterios_elegibilidade: string;
  documentos_necessarios: string[];
  canal_tipo: CanalTipo;
  canal_detalhe: string;
  passo_a_passo: string[];
  fonte_legal: string;
  prioridade_base: 1 | 2 | 3 | 4 | 5;
  ultima_revisao: string;
  abrangencia: 'federal' | 'estadual_variavel';
  similaridade?: number;
}

export function linhaParaItem(linha: LinhaDireitoItem): DireitoItem {
  return {
    id: linha.id,
    nome_popular: linha.nome_popular,
    categoria_vida: linha.categoria_vida,
    natureza: linha.natureza,
    criterios_elegibilidade: linha.criterios_elegibilidade,
    documentos_necessarios: linha.documentos_necessarios,
    canal_solicitacao: { tipo: linha.canal_tipo, detalhe: linha.canal_detalhe },
    passo_a_passo: linha.passo_a_passo,
    fonte_legal: linha.fonte_legal,
    prioridade_base: linha.prioridade_base,
    ultima_revisao: linha.ultima_revisao,
    abrangencia: linha.abrangencia,
  };
}
