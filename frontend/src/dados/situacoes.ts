export type CategoriaSituacao =
  | 'renda_trabalho'
  | 'cuidado_deficiencia'
  | 'saude'
  | 'urgencia'
  | 'orientacao_geral';

export type PrioridadeSituacao = 'orientacao' | 'alta' | 'imediata';

export interface Situacao {
  id: string;
  titulo: string;
  resumo: string;
  categoria: CategoriaSituacao;
  prioridade: PrioridadeSituacao;
  direitosIds: string[];
  canais: string[];
  mensagemInicial: string;
}

export const CATEGORIAS_SITUACAO = [
  { id: 'todas', rotulo: 'Todas' },
  { id: 'renda_trabalho', rotulo: 'Renda e trabalho' },
  { id: 'cuidado_deficiencia', rotulo: 'Cuidado e deficiência' },
  { id: 'saude', rotulo: 'Saúde' },
  { id: 'urgencia', rotulo: 'Urgência' },
  { id: 'orientacao_geral', rotulo: 'Orientação geral' },
] as const;

export const SITUACOES: Situacao[] = [
  {
    id: 'perdi-emprego',
    titulo: 'Perdi o emprego com carteira assinada',
    resumo: 'Entenda o que confirmar após uma demissão e onde iniciar o pedido.',
    categoria: 'renda_trabalho',
    prioridade: 'alta',
    direitosIds: ['seguro-desemprego'],
    canais: ['Carteira de Trabalho Digital', 'SINE'],
    mensagemInicial: 'Perdi meu emprego com carteira assinada e quero entender os próximos passos.',
  },
  {
    id: 'renda-caiu',
    titulo: 'Minha renda caiu e a casa precisa de apoio',
    resumo: 'Organize informações sobre renda e família antes de procurar atendimento.',
    categoria: 'renda_trabalho',
    prioridade: 'alta',
    direitosIds: ['bolsa-familia'],
    canais: ['CRAS', 'CadÚnico'],
    mensagemInicial: 'A renda da minha casa caiu e preciso saber quais apoios devo verificar.',
  },
  {
    id: 'idoso-pouca-renda',
    titulo: 'Tenho 65 anos ou mais e pouca renda',
    resumo: 'Veja quais critérios de idade e renda precisam ser confirmados.',
    categoria: 'cuidado_deficiencia',
    prioridade: 'orientacao',
    direitosIds: ['bpc-loas-idoso'],
    canais: ['CRAS', 'INSS'],
    mensagemInicial: 'Tenho 65 anos ou mais, pouca renda e quero saber o que preciso confirmar.',
  },
  {
    id: 'pessoa-com-deficiencia',
    titulo: 'Sou PCD ou cuido de uma pessoa com deficiência',
    resumo: 'Prepare informações sobre impedimentos, renda familiar e avaliação oficial.',
    categoria: 'cuidado_deficiencia',
    prioridade: 'orientacao',
    direitosIds: ['bpc-loas-pcd'],
    canais: ['CRAS', 'INSS'],
    mensagemInicial: 'Sou PCD ou cuido de uma pessoa com deficiência e preciso de orientação.',
  },
  {
    id: 'crianca-deficiencia-autismo',
    titulo: 'Uma criança da família tem deficiência ou autismo',
    resumo: 'Entenda quais informações familiares e avaliações podem ser solicitadas.',
    categoria: 'cuidado_deficiencia',
    prioridade: 'orientacao',
    direitosIds: ['bpc-loas-pcd'],
    canais: ['CRAS', 'INSS'],
    mensagemInicial: 'Uma criança da minha família tem deficiência ou autismo e buscamos orientação.',
  },
  {
    id: 'doente-sem-trabalhar',
    titulo: 'Estou doente e não consigo trabalhar',
    resumo: 'Organize vínculos, contribuições e documentos de saúde para a análise oficial.',
    categoria: 'saude',
    prioridade: 'alta',
    direitosIds: ['auxilio-incapacidade-temporaria'],
    canais: ['UBS', 'INSS'],
    mensagemInicial: 'Estou doente, não consigo trabalhar e quero entender o que devo verificar.',
  },
  {
    id: 'acidente-afastamento',
    titulo: 'Sofri acidente e preciso me afastar',
    resumo: 'Veja quais registros médicos e previdenciários ajudam a iniciar a orientação.',
    categoria: 'saude',
    prioridade: 'alta',
    direitosIds: ['auxilio-incapacidade-temporaria'],
    canais: ['SUS', 'INSS'],
    mensagemInicial: 'Sofri um acidente, preciso me afastar do trabalho e quero orientação.',
  },
  {
    id: 'medicamentos',
    titulo: 'Preciso de remédios de uso contínuo',
    resumo: 'Confira receita, documento e disponibilidade nos canais de saúde.',
    categoria: 'saude',
    prioridade: 'orientacao',
    direitosIds: ['farmacia-popular'],
    canais: ['UBS', 'Farmácia Popular'],
    mensagemInicial: 'Preciso de remédios de uso contínuo e quero saber onde posso procurar.',
  },
  {
    id: 'sofrimento-emocional',
    titulo: 'Estou em sofrimento emocional ou crise de saúde mental',
    resumo: 'Encontre cuidado territorial e identifique quando buscar atendimento imediato.',
    categoria: 'saude',
    prioridade: 'alta',
    direitosIds: ['caps'],
    canais: ['CAPS', 'UBS', 'SAMU 192'],
    mensagemInicial: 'Estou em sofrimento emocional ou crise de saúde mental e preciso de ajuda.',
  },
  {
    id: 'alcool-outras-drogas',
    titulo: 'Preciso de ajuda com álcool ou outras drogas',
    resumo: 'Conheça portas de entrada do cuidado em saúde mental e atenção básica.',
    categoria: 'saude',
    prioridade: 'alta',
    direitosIds: ['caps'],
    canais: ['CAPS AD', 'UBS'],
    mensagemInicial: 'Preciso de ajuda com álcool ou outras drogas e quero encontrar atendimento.',
  },
  {
    id: 'violencia-risco',
    titulo: 'Há violência, ameaça ou risco imediato',
    resumo: 'Priorize proteção e canais de emergência antes de qualquer triagem de benefício.',
    categoria: 'urgencia',
    prioridade: 'imediata',
    direitosIds: [],
    canais: ['190', '180', '100', 'Defensoria'],
    mensagemInicial: 'Há violência, ameaça ou risco imediato e preciso de orientação segura.',
  },
  {
    id: 'nao-sei-servico',
    titulo: 'Não sei qual serviço procurar',
    resumo: 'Conte o momento com suas palavras para organizar uma primeira rota de atendimento.',
    categoria: 'orientacao_geral',
    prioridade: 'orientacao',
    direitosIds: [],
    canais: ['CRAS', 'UBS', 'Defensoria'],
    mensagemInicial: 'Não sei qual serviço procurar e preciso organizar o primeiro passo.',
  },
];

export const TOTAL_SITUACOES = SITUACOES.length;
