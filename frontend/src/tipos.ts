// Tipos da conversa e do resultado — espelham o contrato da API (/api/triagem).
// Duplicados de propósito: o pacote rag roda em Node (dotenv, supabase) e não deve
// entrar no bundle do navegador.

export type CategoriaVida =
  | 'familia_crianca'
  | 'idoso'
  | 'pcd'
  | 'saude_mental'
  | 'trabalho_acidente'
  | 'situacao_rua'
  | 'violencia_domestica'
  | 'divida_credito';

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

export interface MensagemChat {
  papel: 'usuario' | 'assistente';
  conteudo: string;
}

export type AbaNavegacao = 'inicio' | 'catalogo' | 'cenarios' | 'chat' | 'resultado';

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

export interface ItemLinhaDaVida {
  id: string;
  nome_popular: string;
  categoria_vida: CategoriaVida;
  natureza: 'beneficio' | 'servico';
  resumo_simples: string;
  criterios_elegibilidade: string;
  criterios_estruturados: CriterioEstruturado[];
  documentos_necessarios: string[];
  canal_solicitacao: { tipo: string; detalhe: string };
  passo_a_passo: string[];
  fonte_legal: string;
  excecoes_e_alertas: string[];
  fontes_oficiais: FonteOficial[];
  prioridade_base: number;
  ultima_revisao: string;
  revisao_prevista_em: string;
  vigencia_inicio: string | null;
  vigencia_fim: string | null;
  versao_conteudo: number;
  abrangencia: 'federal' | 'estadual_variavel';
  posicao: number;
  motivo: string;
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

/** Rótulos legíveis dos canais — a interface nunca deve exibir o enum cru. */
export const ROTULOS_CANAL: Record<string, string> = {
  app_meu_inss: 'Aplicativo Meu INSS',
  app_cadunico: 'Aplicativo CadÚnico',
  app_pe_de_meia: 'Aplicativo Pé-de-Meia',
  app_fgts: 'Aplicativo FGTS',
  site_especifico: 'Site oficial',
  presencial: 'Atendimento presencial',
  telefone: 'Telefone',
};

export function rotularCanal(tipo: string): string {
  return ROTULOS_CANAL[tipo] ?? tipo.replace(/_/g, ' ');
}

/**
 * Item como aparece no catálogo navegável. Estende a ficha da linha de vida com
 * `termos_populares` — as palavras que a pessoa realmente usa ("auxílio doença",
 * "encostado") e que a busca do catálogo varre além do nome oficial.
 */
export interface ItemCatalogo extends ItemLinhaDaVida {
  termos_populares: string[];
  status_conteudo: 'publicavel' | 'revisao_pendente' | 'rascunho' | 'expirado';
  revisado_por: string;
  programa_temporario: boolean;
}

export type RespostaTriagem =
  | { tipo: 'pergunta'; mensagem: string }
  | {
      tipo: 'orientacao';
      resumo: string;
      confianca: 'alta' | 'media' | 'baixa';
      itens: ItemOrientacao[];
      alertas: string[];
      aviso_dados_mascarados?: true;
    }
  | { tipo: 'sem_match'; mensagem: string; proximos_passos: string[]; aviso_dados_mascarados?: true }
  | {
      tipo: 'urgencia';
      nivel: 'imediato';
      mensagem: string;
      canais: CanalUrgencia[];
      aviso_dados_mascarados?: true;
    };

export const TEXTO_DISCLAIMER =
  'Esta é uma triagem informativa e não substitui aconselhamento jurídico ou confirmação oficial. Sempre confirme as informações no canal oficial indicado.';
