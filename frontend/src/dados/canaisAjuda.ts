export interface CanalAjuda {
  id: string;
  titulo: string;
  quando_usar: string;
  acao: string;
  numero?: string;
  url_oficial: string;
  fonte: string;
  verificado_em: string;
  nivel: 'imediato' | 'orientacao' | 'assistencia';
}

export const CANAIS_AJUDA: CanalAjuda[] = [
  {
    id: 'policia', titulo: 'Polícia Militar', numero: '190',
    quando_usar: 'Quando há perigo ou violência acontecendo agora.', acao: 'Ligar 190',
    url_oficial: 'https://www.gov.br/anatel/pt-br/regulado/acompanhamento-e-controle/servicos-de-utilidade-publica-e-de-emergencia-tridigitos',
    fonte: 'Anatel', verificado_em: '2026-09-29', nivel: 'imediato',
  },
  {
    id: 'samu', titulo: 'SAMU', numero: '192',
    quando_usar: 'Para urgência ou emergência médica.', acao: 'Ligar 192',
    url_oficial: 'https://www.gov.br/saude/pt-br/composicao/saes/samu-192',
    fonte: 'Ministério da Saúde', verificado_em: '2026-09-29', nivel: 'imediato',
  },
  {
    id: 'mulher', titulo: 'Central de Atendimento à Mulher', numero: '180',
    quando_usar: 'Orientação e denúncia de violência contra mulheres. Se houver perigo agora, ligue 190.', acao: 'Ligar 180',
    url_oficial: 'https://www.gov.br/mulheres/pt-br/ligue180',
    fonte: 'Ministério das Mulheres', verificado_em: '2026-09-29', nivel: 'orientacao',
  },
  {
    id: 'direitos-humanos', titulo: 'Disque Direitos Humanos', numero: '100',
    quando_usar: 'Denúncia de violações de direitos humanos e orientação para proteção.', acao: 'Ligar 100',
    url_oficial: 'https://www.gov.br/pt-br/servicos/denunciar-violacao-de-direitos-humanos',
    fonte: 'Ministério dos Direitos Humanos e da Cidadania', verificado_em: '2026-09-29', nivel: 'orientacao',
  },
  {
    id: 'cras', titulo: 'CRAS e Cadastro Único',
    quando_usar: 'Para assistência social, Cadastro Único e informação sobre serviços do município. Não é um canal de emergência.', acao: 'Encontrar atendimento',
    url_oficial: 'https://www.gov.br/pt-br/servicos/inscrever-se-no-cadastro-unico-para-programas-sociais-do-governo-federal',
    fonte: 'Governo Federal', verificado_em: '2026-09-29', nivel: 'assistencia',
  },
];
