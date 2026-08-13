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

export interface CriterioEstruturado {
  id: string;
  descricao: string;
  confirmacao: 'autodeclaracao' | 'documental' | 'avaliacao_oficial';
}

export interface FonteOficial {
  titulo: string;
  url: string;
  orgao: string;
  acessado_em: string;
}

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
  resumo_simples: string;
  criterios_elegibilidade: string;
  criterios_estruturados: CriterioEstruturado[];
  documentos_necessarios: string[];
  canal_solicitacao: {
    tipo: CanalTipo;
    detalhe: string;
  };
  passo_a_passo: string[];
  fonte_legal: string;
  excecoes_e_alertas: string[];
  fontes_oficiais: FonteOficial[];
  prioridade_base: 1 | 2 | 3 | 4 | 5;
  ultima_revisao: string; // ISO date
  revisao_prevista_em: string;
  vigencia_inicio: string | null;
  vigencia_fim: string | null;
  versao_conteudo: number;
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

export type SituacaoOrientacao = 'compativel' | 'precisa_confirmar';

export interface ItemOrientacao extends ItemLinhaDaVida {
  situacao: SituacaoOrientacao;
  criterios_confirmados: string[];
  criterios_pendentes: string[];
  proximos_passos: string[];
  documentos: string[];
  fontes: FonteOficial[];
}

export interface CanalUrgencia {
  nome: string;
  numero: string;
  quando_usar: string;
}

export interface RespostaUrgencia {
  tipo: 'urgencia';
  nivel: 'imediato';
  mensagem: string;
  canais: CanalUrgencia[];
  aviso_dados_mascarados?: boolean;
}

export type RespostaTriagem =
  | { tipo: 'pergunta'; mensagem: string; aviso_dados_mascarados?: boolean }
  | {
      tipo: 'orientacao';
      resumo: string;
      confianca: 'alta' | 'media' | 'baixa';
      itens: ItemOrientacao[];
      alertas: string[];
      aviso_dados_mascarados?: boolean;
    }
  | { tipo: 'sem_match'; mensagem: string; proximos_passos: string[]; aviso_dados_mascarados?: boolean }
  | RespostaUrgencia;

/** Linha retornada pela função SQL buscar_direitos / select na tabela. */
export interface LinhaDireitoItem {
  id: string;
  nome_popular: string;
  categoria_vida: CategoriaVida;
  natureza: Natureza;
  resumo_simples: string;
  criterios_elegibilidade: string;
  criterios_estruturados: CriterioEstruturado[];
  documentos_necessarios: string[];
  canal_tipo: CanalTipo;
  canal_detalhe: string;
  passo_a_passo: string[];
  fonte_legal: string;
  excecoes_e_alertas: string[];
  fontes_oficiais: FonteOficial[];
  prioridade_base: 1 | 2 | 3 | 4 | 5;
  ultima_revisao: string;
  revisao_prevista_em: string;
  vigencia_inicio: string | null;
  vigencia_fim: string | null;
  versao_conteudo: number;
  abrangencia: 'federal' | 'estadual_variavel';
  similaridade?: number;
}

export function linhaParaItem(linha: LinhaDireitoItem): DireitoItem {
  return {
    id: linha.id,
    nome_popular: linha.nome_popular,
    categoria_vida: linha.categoria_vida,
    natureza: linha.natureza,
    resumo_simples: linha.resumo_simples,
    criterios_elegibilidade: linha.criterios_elegibilidade,
    criterios_estruturados: linha.criterios_estruturados,
    documentos_necessarios: linha.documentos_necessarios,
    canal_solicitacao: { tipo: linha.canal_tipo, detalhe: linha.canal_detalhe },
    passo_a_passo: linha.passo_a_passo,
    fonte_legal: linha.fonte_legal,
    excecoes_e_alertas: linha.excecoes_e_alertas,
    fontes_oficiais: linha.fontes_oficiais,
    prioridade_base: linha.prioridade_base,
    ultima_revisao: linha.ultima_revisao,
    revisao_prevista_em: linha.revisao_prevista_em,
    vigencia_inicio: linha.vigencia_inicio,
    vigencia_fim: linha.vigencia_fim,
    versao_conteudo: linha.versao_conteudo,
    abrangencia: linha.abrangencia,
  };
}
