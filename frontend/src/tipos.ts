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

export interface ItemLinhaDaVida {
  id: string;
  nome_popular: string;
  categoria_vida: CategoriaVida;
  natureza: 'beneficio' | 'servico';
  criterios_elegibilidade: string;
  documentos_necessarios: string[];
  canal_solicitacao: { tipo: string; detalhe: string };
  passo_a_passo: string[];
  fonte_legal: string;
  prioridade_base: number;
  ultima_revisao: string;
  abrangencia: 'federal' | 'estadual_variavel';
  posicao: number;
  motivo: string;
}

export type RespostaTriagem =
  | { tipo: 'pergunta'; mensagem: string }
  | { tipo: 'resultado'; mensagem: string; itens: ItemLinhaDaVida[] }
  | { tipo: 'sem_match'; mensagem: string };

export const TEXTO_DISCLAIMER =
  'Esta é uma triagem informativa e não substitui aconselhamento jurídico ou confirmação oficial. Sempre confirme as informações no canal oficial indicado.';
