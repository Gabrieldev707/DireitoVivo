import type { ItemCatalogo } from '../tipos';

// ⚠️ ARQUIVO GERADO — não edite à mão.
// Fonte de verdade: db/seed/itens.json. Regenere com `npm run db:catalogo`.
// Gerado a partir de 7 itens publicáveis da base de conhecimento.
export const CATALOGO_DIREITOS: ItemCatalogo[] = [
  {
    "id": "bolsa-familia",
    "nome_popular": "Bolsa Família",
    "categoria_vida": "familia_crianca",
    "natureza": "beneficio",
    "criterios_elegibilidade": "Para famílias com renda de até R$ 218 por pessoa ao mês (valor de referência — confirme no CRAS). É preciso estar inscrito no CadÚnico. Famílias com crianças, gestantes e adolescentes recebem valores extras.",
    "documentos_necessarios": [
      "Documento de identificação de cada pessoa da família (certidão de nascimento, RG ou CPF)",
      "Comprovante de endereço (se tiver)",
      "Comprovante de renda (se tiver)"
    ],
    "canal_solicitacao": {
      "tipo": "app_cadunico",
      "detalhe": "CRAS mais próximo (cadastro) + aplicativo CadÚnico (acompanhamento)"
    },
    "passo_a_passo": [
      "Vá ao CRAS mais próximo da sua casa e peça para entrar no CadÚnico (ou atualizar, se já tiver).",
      "Leve os documentos de todo mundo que mora com você.",
      "Depois do cadastro, a seleção é automática — não precisa de um pedido separado.",
      "Acompanhe pelo aplicativo CadÚnico ou pelo aplicativo Bolsa Família.",
      "Se aprovado, o pagamento cai no Caixa Tem no mês seguinte à seleção."
    ],
    "fonte_legal": "Lei 14.601/2023",
    "prioridade_base": 1,
    "ultima_revisao": "2026-07-05",
    "abrangencia": "federal",
    "termos_populares": [
      "bolsa",
      "auxílio do governo",
      "benefício do governo",
      "cadastro único",
      "cadunico",
      "renda baixa",
      "sem renda",
      "mãe solo",
      "criança pequena"
    ],
    "resumo_simples": "Programa federal de transferência de renda cuja entrada depende do Cadastro Único e da análise das regras vigentes.",
    "criterios_estruturados": [
      {
        "id": "confirmar-requisitos-oficiais",
        "descricao": "Para famílias com renda de até R$ 218 por pessoa ao mês (valor de referência — confirme no CRAS). É preciso estar inscrito no CadÚnico. Famílias com crianças, gestantes e adolescentes recebem valores extras.",
        "confirmacao": "avaliacao_oficial"
      }
    ],
    "excecoes_e_alertas": [
      "A orientação não garante concessão; confirme regras e documentos no canal oficial."
    ],
    "fontes_oficiais": [
      {
        "titulo": "Receber o Bolsa Família",
        "url": "https://www.gov.br/pt-br/servicos/receber-o-bolsa-familia",
        "orgao": "Ministério do Desenvolvimento e Assistência Social",
        "acessado_em": "2026-08-12"
      }
    ],
    "status_conteudo": "publicavel",
    "revisado_por": "curadoria-editorial-2026-08",
    "revisao_prevista_em": "2026-11-12",
    "vigencia_inicio": "2023-06-19",
    "vigencia_fim": null,
    "versao_conteudo": 1,
    "programa_temporario": false,
    "posicao": 1,
    "motivo": "Para famílias com renda de até R$ 218 por pessoa ao mês (valor de referência — confirme no CRAS). É preciso estar inscrito no CadÚnico. Famílias com crianças, gestantes e adolescentes recebem valores extras."
  },
  {
    "id": "bpc-loas-idoso",
    "nome_popular": "BPC/LOAS para idosos",
    "categoria_vida": "idoso",
    "natureza": "beneficio",
    "criterios_elegibilidade": "Um salário mínimo por mês para quem tem 65 anos ou mais e renda familiar de menos de 1/4 de salário mínimo por pessoa. Não precisa ter contribuído para o INSS. Precisa estar no CadÚnico.",
    "documentos_necessarios": [
      "Documento de identificação com foto",
      "CPF",
      "Comprovante de inscrição no CadÚnico (feito no CRAS)",
      "Comprovantes de renda da família (se houver)"
    ],
    "canal_solicitacao": {
      "tipo": "app_meu_inss",
      "detalhe": "Aplicativo ou site Meu INSS"
    },
    "passo_a_passo": [
      "Primeiro, garanta que você (ou o idoso) está no CadÚnico — isso se faz no CRAS.",
      "Abra o aplicativo Meu INSS (ou o site meu.inss.gov.br) e entre com a conta gov.br.",
      "Toque em 'Novo Pedido' e busque por 'BPC' ou 'Benefício Assistencial ao Idoso'.",
      "Preencha as informações e envie.",
      "Acompanhe o andamento pelo próprio aplicativo. Se negarem, você pode recorrer."
    ],
    "fonte_legal": "Lei 8.742/1993 (LOAS), art. 20",
    "prioridade_base": 1,
    "ultima_revisao": "2026-07-05",
    "abrangencia": "federal",
    "termos_populares": [
      "loas",
      "aposentadoria sem contribuir",
      "benefício do idoso",
      "salário do idoso",
      "nunca trabalhei de carteira assinada",
      "vovô",
      "vovó",
      "65 anos"
    ],
    "resumo_simples": "Benefício assistencial para pessoa idosa que cumpra os requisitos legais e cadastrais verificados pelo INSS.",
    "criterios_estruturados": [
      {
        "id": "confirmar-requisitos-oficiais",
        "descricao": "Um salário mínimo por mês para quem tem 65 anos ou mais e renda familiar de menos de 1/4 de salário mínimo por pessoa. Não precisa ter contribuído para o INSS. Precisa estar no CadÚnico.",
        "confirmacao": "avaliacao_oficial"
      }
    ],
    "excecoes_e_alertas": [
      "A orientação não garante concessão; confirme regras e documentos no canal oficial."
    ],
    "fontes_oficiais": [
      {
        "titulo": "Benefícios Assistenciais",
        "url": "https://www.gov.br/inss/pt-br/servicos/beneficios-assistenciais",
        "orgao": "Instituto Nacional do Seguro Social",
        "acessado_em": "2026-08-12"
      }
    ],
    "status_conteudo": "publicavel",
    "revisado_por": "curadoria-editorial-2026-08",
    "revisao_prevista_em": "2026-11-12",
    "vigencia_inicio": "1993-12-07",
    "vigencia_fim": null,
    "versao_conteudo": 1,
    "programa_temporario": false,
    "posicao": 2,
    "motivo": "Um salário mínimo por mês para quem tem 65 anos ou mais e renda familiar de menos de 1/4 de salário mínimo por pessoa. Não precisa ter contribuído para o INSS. Precisa estar no CadÚnico."
  },
  {
    "id": "bpc-loas-pcd",
    "nome_popular": "BPC/LOAS para pessoa com deficiência",
    "categoria_vida": "pcd",
    "natureza": "beneficio",
    "criterios_elegibilidade": "Um salário mínimo por mês para pessoa com deficiência de longo prazo (física, mental, intelectual ou sensorial), de QUALQUER idade — não é só para idosos. A renda da família deve ser menor que 1/4 de salário mínimo por pessoa. Não precisa ter contribuído para o INSS. Passa por avaliação médica e social do INSS.",
    "documentos_necessarios": [
      "Documento de identificação com foto e CPF",
      "Comprovante de inscrição no CadÚnico",
      "Laudos e exames médicos que mostrem a deficiência (quanto mais detalhados, melhor)"
    ],
    "canal_solicitacao": {
      "tipo": "app_meu_inss",
      "detalhe": "Aplicativo ou site Meu INSS"
    },
    "passo_a_passo": [
      "Faça ou atualize o CadÚnico no CRAS.",
      "Junte todos os laudos médicos que você tiver (com CID e assinatura do médico).",
      "No aplicativo Meu INSS, toque em 'Novo Pedido' e busque 'BPC' ou 'Benefício Assistencial à Pessoa com Deficiência'.",
      "O INSS vai marcar uma avaliação médica e uma avaliação social — compareça às duas.",
      "Acompanhe pelo aplicativo. Se negarem, você pode recorrer em até 30 dias."
    ],
    "fonte_legal": "Lei 8.742/1993 (LOAS), art. 20",
    "prioridade_base": 1,
    "ultima_revisao": "2026-07-05",
    "abrangencia": "federal",
    "termos_populares": [
      "loas deficiente",
      "benefício para deficiente",
      "criança autista",
      "autismo",
      "deficiência",
      "não consigo trabalhar",
      "filho especial",
      "salário para pcd"
    ],
    "resumo_simples": "Benefício assistencial para pessoa com deficiência que cumpra os requisitos legais, sociais e cadastrais.",
    "criterios_estruturados": [
      {
        "id": "confirmar-requisitos-oficiais",
        "descricao": "Um salário mínimo por mês para pessoa com deficiência de longo prazo (física, mental, intelectual ou sensorial), de QUALQUER idade — não é só para idosos. A renda da família deve ser menor que 1/4 de salário mínimo por pessoa. Não precisa ter contribuído para o INSS. Passa por avaliação médica e social do INSS.",
        "confirmacao": "avaliacao_oficial"
      }
    ],
    "excecoes_e_alertas": [
      "A orientação não garante concessão; confirme regras e documentos no canal oficial."
    ],
    "fontes_oficiais": [
      {
        "titulo": "Benefício assistencial à pessoa com deficiência (BPC-Loas)",
        "url": "https://www.gov.br/inss/pt-br/direitos-e-deveres/beneficios-assistenciais/beneficio-assistencial-a-pessoa-com-deficiencia-bpc-loas",
        "orgao": "Instituto Nacional do Seguro Social",
        "acessado_em": "2026-08-12"
      }
    ],
    "status_conteudo": "publicavel",
    "revisado_por": "curadoria-editorial-2026-08",
    "revisao_prevista_em": "2026-11-12",
    "vigencia_inicio": "1993-12-07",
    "vigencia_fim": null,
    "versao_conteudo": 1,
    "programa_temporario": false,
    "posicao": 3,
    "motivo": "Um salário mínimo por mês para pessoa com deficiência de longo prazo (física, mental, intelectual ou sensorial), de QUALQUER idade — não é só para idosos. A renda da família deve ser menor que 1/4 de salário mínimo por pessoa. Não precisa ter contribuído para o INSS. Passa por avaliação médica e social do INSS."
  },
  {
    "id": "caps",
    "nome_popular": "CAPS — Centro de Atenção Psicossocial",
    "categoria_vida": "saude_mental",
    "natureza": "servico",
    "criterios_elegibilidade": "Atendimento GRATUITO do SUS para quem está em sofrimento mental (depressão grave, crises, pensamentos de morte, esquizofrenia) ou com problemas com álcool e outras drogas (CAPS AD). Há CAPS infantojuvenil (CAPSi) para crianças e adolescentes. Não precisa de encaminhamento: pode chegar direto, e não paga nada.",
    "documentos_necessarios": [
      "Se tiver, leve documento de identificação e cartão do SUS — mas o atendimento não pode ser negado por falta de documento"
    ],
    "canal_solicitacao": {
      "tipo": "presencial",
      "detalhe": "CAPS mais próximo (a UBS/posto de saúde informa o endereço); em crise grave, ligue 188 (CVV) ou vá ao pronto-socorro"
    },
    "passo_a_passo": [
      "Descubra o CAPS mais perto: pergunte no posto de saúde ou busque 'CAPS + nome da sua cidade'.",
      "Vá até lá — pode ir sem agendamento e sem encaminhamento. Chegando, diga que quer acolhimento.",
      "Você vai conversar com a equipe (psicólogo, assistente social ou enfermeiro) e sair com um plano de cuidado.",
      "O CAPS também fornece remédio psiquiátrico gratuito e laudos que servem para pedir benefícios do INSS.",
      "Se a angústia for insuportável agora: ligue 188 (CVV, 24 horas, gratuito) ou procure a emergência mais próxima."
    ],
    "fonte_legal": "Lei 10.216/2001; Portaria GM/MS 3.088/2011 (RAPS)",
    "prioridade_base": 1,
    "ultima_revisao": "2026-07-05",
    "abrangencia": "federal",
    "termos_populares": [
      "depressão",
      "ansiedade",
      "crise",
      "pensamento ruim",
      "vontade de sumir",
      "psicólogo de graça",
      "psiquiatra de graça",
      "álcool",
      "droga",
      "vício",
      "surto"
    ],
    "resumo_simples": "Serviço público comunitário de saúde mental, com modalidades e funcionamento definidos pela rede local do SUS.",
    "criterios_estruturados": [
      {
        "id": "confirmar-requisitos-oficiais",
        "descricao": "Atendimento GRATUITO do SUS para quem está em sofrimento mental (depressão grave, crises, pensamentos de morte, esquizofrenia) ou com problemas com álcool e outras drogas (CAPS AD). Há CAPS infantojuvenil (CAPSi) para crianças e adolescentes. Não precisa de encaminhamento: pode chegar direto, e não paga nada.",
        "confirmacao": "avaliacao_oficial"
      }
    ],
    "excecoes_e_alertas": [
      "A orientação não garante concessão; confirme regras e documentos no canal oficial."
    ],
    "fontes_oficiais": [
      {
        "titulo": "Centros de Atenção Psicossocial (CAPS)",
        "url": "https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps",
        "orgao": "Ministério da Saúde",
        "acessado_em": "2026-08-12"
      }
    ],
    "status_conteudo": "publicavel",
    "revisado_por": "curadoria-editorial-2026-08",
    "revisao_prevista_em": "2026-11-12",
    "vigencia_inicio": "2001-04-06",
    "vigencia_fim": null,
    "versao_conteudo": 1,
    "programa_temporario": false,
    "posicao": 4,
    "motivo": "Atendimento GRATUITO do SUS para quem está em sofrimento mental (depressão grave, crises, pensamentos de morte, esquizofrenia) ou com problemas com álcool e outras drogas (CAPS AD). Há CAPS infantojuvenil (CAPSi) para crianças e adolescentes. Não precisa de encaminhamento: pode chegar direto, e não paga nada."
  },
  {
    "id": "farmacia-popular",
    "nome_popular": "Farmácia Popular",
    "categoria_vida": "familia_crianca",
    "natureza": "servico",
    "criterios_elegibilidade": "Remédios de graça (ou com grande desconto) para qualquer pessoa com receita médica válida. Cobre remédios de pressão alta, diabetes, asma, colesterol, osteoporose, anticoncepcionais, fraldas geriátricas e outros. Não precisa de cadastro prévio.",
    "documentos_necessarios": [
      "Receita médica válida (vale receita do SUS ou de médico particular, emitida há menos de 180 dias)",
      "Documento oficial com CPF"
    ],
    "canal_solicitacao": {
      "tipo": "presencial",
      "detalhe": "Qualquer farmácia com o selo 'Aqui Tem Farmácia Popular'"
    },
    "passo_a_passo": [
      "Pegue a receita com o médico (do posto de saúde ou particular).",
      "Procure uma farmácia com o adesivo 'Aqui Tem Farmácia Popular' — a maioria das grandes redes participa.",
      "Apresente a receita e um documento com CPF no balcão.",
      "Se o remédio estiver na lista do programa, sai de graça ou com desconto na hora."
    ],
    "fonte_legal": "Lei 10.858/2004 e Decreto 5.090/2004",
    "prioridade_base": 1,
    "ultima_revisao": "2026-07-05",
    "abrangencia": "federal",
    "termos_populares": [
      "remédio de graça",
      "remédio caro",
      "não consigo comprar remédio",
      "pressão alta",
      "diabetes",
      "insulina",
      "asma",
      "bombinha",
      "fralda geriátrica"
    ],
    "resumo_simples": "Programa que oferece medicamentos e insumos por farmácias credenciadas, conforme produtos e documentos vigentes.",
    "criterios_estruturados": [
      {
        "id": "confirmar-requisitos-oficiais",
        "descricao": "Remédios de graça (ou com grande desconto) para qualquer pessoa com receita médica válida. Cobre remédios de pressão alta, diabetes, asma, colesterol, osteoporose, anticoncepcionais, fraldas geriátricas e outros. Não precisa de cadastro prévio.",
        "confirmacao": "avaliacao_oficial"
      }
    ],
    "excecoes_e_alertas": [
      "A orientação não garante concessão; confirme regras e documentos no canal oficial."
    ],
    "fontes_oficiais": [
      {
        "titulo": "Farmácia Popular",
        "url": "https://www.gov.br/saude/pt-br/composicao/sectics/daf/farmacia-popular",
        "orgao": "Ministério da Saúde",
        "acessado_em": "2026-08-12"
      }
    ],
    "status_conteudo": "publicavel",
    "revisado_por": "curadoria-editorial-2026-08",
    "revisao_prevista_em": "2026-11-12",
    "vigencia_inicio": "2004-04-13",
    "vigencia_fim": null,
    "versao_conteudo": 1,
    "programa_temporario": false,
    "posicao": 5,
    "motivo": "Remédios de graça (ou com grande desconto) para qualquer pessoa com receita médica válida. Cobre remédios de pressão alta, diabetes, asma, colesterol, osteoporose, anticoncepcionais, fraldas geriátricas e outros. Não precisa de cadastro prévio."
  },
  {
    "id": "seguro-desemprego",
    "nome_popular": "Seguro-Desemprego",
    "categoria_vida": "trabalho_acidente",
    "natureza": "beneficio",
    "criterios_elegibilidade": "Para quem trabalhava de carteira assinada e foi demitido sem justa causa. No primeiro pedido, é preciso ter trabalhado pelo menos 12 meses nos últimos 18. Paga de 3 a 5 parcelas, conforme o tempo trabalhado.",
    "documentos_necessarios": [
      "Termo de rescisão do contrato",
      "Documento de identificação e CPF",
      "Carteira de trabalho (física ou digital)",
      "Requerimento do seguro-desemprego (entregue pela empresa na demissão)"
    ],
    "canal_solicitacao": {
      "tipo": "site_especifico",
      "detalhe": "Aplicativo Carteira de Trabalho Digital ou portal gov.br"
    },
    "passo_a_passo": [
      "Baixe o aplicativo 'Carteira de Trabalho Digital' e entre com a conta gov.br.",
      "Toque em 'Benefícios' e depois em 'Seguro-Desemprego'.",
      "Confira os dados da demissão e envie o pedido.",
      "Atenção ao prazo: do 7º ao 120º dia depois da demissão.",
      "As parcelas caem na conta indicada ou no Caixa Tem."
    ],
    "fonte_legal": "Lei 7.998/1990",
    "prioridade_base": 1,
    "ultima_revisao": "2026-07-05",
    "abrangencia": "federal",
    "termos_populares": [
      "fui demitido",
      "mandado embora",
      "perdi o emprego",
      "desempregado",
      "rescisão",
      "carteira assinada"
    ],
    "resumo_simples": "Assistência financeira temporária para trabalhador dispensado sem justa causa que cumpra os requisitos oficiais.",
    "criterios_estruturados": [
      {
        "id": "confirmar-requisitos-oficiais",
        "descricao": "Para quem trabalhava de carteira assinada e foi demitido sem justa causa. No primeiro pedido, é preciso ter trabalhado pelo menos 12 meses nos últimos 18. Paga de 3 a 5 parcelas, conforme o tempo trabalhado.",
        "confirmacao": "avaliacao_oficial"
      }
    ],
    "excecoes_e_alertas": [
      "A orientação não garante concessão; confirme regras e documentos no canal oficial."
    ],
    "fontes_oficiais": [
      {
        "titulo": "Solicitar o Seguro-Desemprego",
        "url": "https://www.gov.br/pt-br/servicos/solicitar-o-seguro-desemprego",
        "orgao": "Ministério do Trabalho e Emprego",
        "acessado_em": "2026-08-12"
      }
    ],
    "status_conteudo": "publicavel",
    "revisado_por": "curadoria-editorial-2026-08",
    "revisao_prevista_em": "2026-11-12",
    "vigencia_inicio": "1990-01-11",
    "vigencia_fim": null,
    "versao_conteudo": 1,
    "programa_temporario": false,
    "posicao": 6,
    "motivo": "Para quem trabalhava de carteira assinada e foi demitido sem justa causa. No primeiro pedido, é preciso ter trabalhado pelo menos 12 meses nos últimos 18. Paga de 3 a 5 parcelas, conforme o tempo trabalhado."
  },
  {
    "id": "auxilio-incapacidade-temporaria",
    "nome_popular": "Auxílio-Doença (Auxílio por Incapacidade Temporária)",
    "categoria_vida": "trabalho_acidente",
    "natureza": "beneficio",
    "criterios_elegibilidade": "Para quem contribui (ou contribuiu há pouco tempo) para o INSS e está sem condições de trabalhar por mais de 15 dias por doença ou acidente. Em geral, pede 12 meses de contribuição — mas acidentes e algumas doenças graves não exigem esse tempo mínimo.",
    "documentos_necessarios": [
      "Documento de identificação e CPF",
      "Atestado ou laudo médico legível, com CID, data, assinatura e tempo de afastamento sugerido",
      "Exames e receitas que comprovem o problema de saúde"
    ],
    "canal_solicitacao": {
      "tipo": "app_meu_inss",
      "detalhe": "Aplicativo ou site Meu INSS"
    },
    "passo_a_passo": [
      "Peça ao médico um atestado ou laudo detalhado (com CID e tempo de afastamento).",
      "Abra o aplicativo Meu INSS e toque em 'Novo Pedido'.",
      "Busque por 'Benefício por Incapacidade' e escolha a análise por documentos (Atestmed), se disponível.",
      "Anexe fotos legíveis do laudo e dos exames.",
      "Se for marcada perícia presencial, compareça na data. Acompanhe tudo pelo aplicativo."
    ],
    "fonte_legal": "Lei 8.213/1991, art. 59",
    "prioridade_base": 2,
    "ultima_revisao": "2026-07-05",
    "abrangencia": "federal",
    "termos_populares": [
      "encostado",
      "encostar no inss",
      "afastado do trabalho",
      "atestado",
      "perícia",
      "doente sem poder trabalhar",
      "cirurgia"
    ],
    "resumo_simples": "Benefício previdenciário sujeito à comprovação de incapacidade temporária e aos demais requisitos do INSS.",
    "criterios_estruturados": [
      {
        "id": "confirmar-requisitos-oficiais",
        "descricao": "Para quem contribui (ou contribuiu há pouco tempo) para o INSS e está sem condições de trabalhar por mais de 15 dias por doença ou acidente. Em geral, pede 12 meses de contribuição — mas acidentes e algumas doenças graves não exigem esse tempo mínimo.",
        "confirmacao": "avaliacao_oficial"
      }
    ],
    "excecoes_e_alertas": [
      "A orientação não garante concessão; confirme regras e documentos no canal oficial."
    ],
    "fontes_oficiais": [
      {
        "titulo": "Solicitar Auxílio por Incapacidade Temporária",
        "url": "https://www.gov.br/pt-br/servicos/solicitar-beneficio-por-incapacidade-temporaria-auxilio-doenca",
        "orgao": "Instituto Nacional do Seguro Social",
        "acessado_em": "2026-08-12"
      }
    ],
    "status_conteudo": "publicavel",
    "revisado_por": "curadoria-editorial-2026-08",
    "revisao_prevista_em": "2026-11-12",
    "vigencia_inicio": "1991-07-24",
    "vigencia_fim": null,
    "versao_conteudo": 1,
    "programa_temporario": false,
    "posicao": 7,
    "motivo": "Para quem contribui (ou contribuiu há pouco tempo) para o INSS e está sem condições de trabalhar por mais de 15 dias por doença ou acidente. Em geral, pede 12 meses de contribuição — mas acidentes e algumas doenças graves não exigem esse tempo mínimo."
  }
];

/** Quantidade de itens da base — use no lugar de números escritos à mão na interface. */
export const TOTAL_DIREITOS = CATALOGO_DIREITOS.length;
