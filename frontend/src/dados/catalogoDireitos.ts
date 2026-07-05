import type { ItemLinhaDaVida } from '../tipos';

// Base de dados local oficial para o Portfólio de Direitos e Cenários de Vida do Direito Vivo.
// Estruturada de acordo com o Design System do Governo Federal (DSGOV) e legislação vigente.
export const CATALOGO_DIREITOS: ItemLinhaDaVida[] = [
  // --- FAMÍLIA / CRIANÇA ---
  {
    id: 'bolsa_familia',
    nome_popular: 'Programa Bolsa Família',
    categoria_vida: 'familia_crianca',
    natureza: 'beneficio',
    criterios_elegibilidade: 'Famílias com renda mensal por pessoa de até R$ 218,00 ou inscritas em programas de proteção social, devidamente cadastradas no Cadastro Único (CadÚnico) com dados atualizados nos últimos 2 anos.',
    documentos_necessarios: [
      'CPF ou Título de Eleitor do Responsável Familiar',
      'Documento de identificação (RG ou Certidão de Nascimento) de todos os moradores da casa',
      'Comprovante de residência atualizado (ou declaração de residência)',
      'Comprovante de matrícula escolar das crianças e adolescentes',
      'Caderneta de vacinação atualizada'
    ],
    canal_solicitacao: {
      tipo: 'presencial',
      detalhe: 'CRAS (Centro de Referência de Assistência Social) mais próximo do seu domicílio ou posto de atendimento do Cadastro Único no município.'
    },
    passo_a_passo: [
      'Reúna os documentos de todas as pessoas que moram na mesma casa.',
      'Compareça ao CRAS da sua cidade ou faça o agendamento prévio (se disponível no seu município).',
      'Realize ou atualize a entrevista do Cadastro Único com o assistente social.',
      'Aguarde a análise e validação pelo Sistema de Benefícios do Governo Federal.',
      'Acompanhe a aprovação pelo aplicativo oficial Bolsa Família, Caixa Tem ou pelo telefone 111.'
    ],
    fonte_legal: 'Lei nº 14.601/2023 (Programa Bolsa Família)',
    prioridade_base: 1,
    ultima_revisao: '2026-06-01',
    abrangencia: 'federal',
    posicao: 1,
    motivo: 'Garantia de renda básica essencial para subsistência alimentar e proteção da infância.'
  },
  {
    id: 'tarifa_social_energia',
    nome_popular: 'Tarifa Social de Energia Elétrica (Desconto de até 65%)',
    categoria_vida: 'familia_crianca',
    natureza: 'beneficio',
    criterios_elegibilidade: 'Famílias inscritas no CadÚnico com renda familiar mensal por pessoa menor ou igual a meio salário mínimo, ou quem receba o BPC (Benefício de Prestação Continuada).',
    documentos_necessarios: [
      'Número de Identificação Social (NIS) ou CPF do beneficiário do BPC',
      'Conta de luz recente da residência (código da unidade consumidora)',
      'Documento de identidade com foto (RG ou CNH)'
    ],
    canal_solicitacao: {
      tipo: 'online_telefone',
      detalhe: 'Atendimento telefônico, WhatsApp ou site oficial da distribuidora de energia elétrica da sua região (ex: Enel, Light, Cemig, CPFL).'
    },
    passo_a_passo: [
      'Verifique se o seu NIS no Cadastro Único está atualizado.',
      'Entre em contato com os canais de atendimento da distribuidora de luz do seu estado.',
      'Informe o número do NIS ou CPF e o código da unidade consumidora que consta na conta.',
      'A distribuidora cruzará os dados automaticamente com o Governo Federal e aplicará o desconto na próxima fatura.'
    ],
    fonte_legal: 'Lei nº 12.212/2010 e Lei nº 14.203/2021 (Concessão Automática)',
    prioridade_base: 2,
    ultima_revisao: '2026-05-15',
    abrangencia: 'federal',
    posicao: 2,
    motivo: 'Alívio imediato no orçamento familiar com redução do custo de serviço público essencial.'
  },
  {
    id: 'salario_maternidade',
    nome_popular: 'Salário-Maternidade (INSS / Urbano e Rural)',
    categoria_vida: 'familia_crianca',
    natureza: 'beneficio',
    criterios_elegibilidade: 'Seguradas do INSS por motivo de nascimento de filho, aborto não criminoso, adoção ou guarda judicial. Para quem está desempregada, é necessário estar no período de graça (qualidade de segurada). Para trabalhadoras rurais, bastam 10 meses de atividade rural comprovada.',
    documentos_necessarios: [
      'Certidão de Nascimento da criança (ou atestado médico/guia de adoção)',
      'Documento de identidade original com foto e CPF',
      'Carteira de Trabalho ou carnês de contribuição ao INSS',
      'Para rurais: autodeclaração de segurado especial ou notas fiscais de produção'
    ],
    canal_solicitacao: {
      tipo: 'online',
      detalhe: 'Aplicativo Meu INSS (gov.br), site meu.inss.gov.br ou Central Telefônica 135.'
    },
    passo_a_passo: [
      'Acesse o aplicativo ou site Meu INSS usando seu login Gov.br.',
      'Clique em "Novo Pedido" e busque por "Salário-Maternidade Urbano" ou "Rural".',
      'Preencha os dados solicitados e anexe a foto ou PDF da Certidão de Nascimento.',
      'Anote o número de protocolo e acompanhe o andamento pela aba "Consultar Pedidos".'
    ],
    fonte_legal: 'Art. 71 da Lei nº 8.213/1991 (Planos de Benefícios da Previdência Social)',
    prioridade_base: 1,
    ultima_revisao: '2026-04-10',
    abrangencia: 'federal',
    posicao: 3,
    motivo: 'Proteção à maternidade e garantia de sustento nos primeiros meses após o parto ou adoção.'
  },

  // --- IDOSO ---
  {
    id: 'bpc_idoso',
    nome_popular: 'BPC / LOAS para Idosos (1 Salário Mínimo Mensal)',
    categoria_vida: 'idoso',
    natureza: 'beneficio',
    criterios_elegibilidade: 'Pessoas com 65 anos ou mais, que comprovem não possuir meios de prover a própria manutenção nem de tê-la provida por sua família (renda familiar mensal per capita igual ou inferior a 1/4 do salário mínimo). Não exige contribuição prévia ao INSS.',
    documentos_necessarios: [
      'Inscrição ativa e atualizada no Cadastro Único (CadÚnico) da família',
      'CPF e RG do requerente e de todos os membros que moram na residência',
      'Comprovante de residência ou declaração firmada'
    ],
    canal_solicitacao: {
      tipo: 'online_telefone',
      detalhe: 'Aplicativo Meu INSS (com login Gov.br), site meu.inss.gov.br ou Central Telefônica 135.'
    },
    passo_a_passo: [
      'Certifique-se de que o CadÚnico está atualizado no CRAS antes de dar entrada no INSS.',
      'Acesse o portal ou aplicativo Meu INSS com sua conta Gov.br (prata ou ouro).',
      'Selecione "Novo Pedido" e digite "Benefício Assistencial à Pessoa Idosa".',
      'Confirme seus dados cadastrais, responda ao questionário socioeconômico e envie o pedido.',
      'Em caso de dúvidas, ligue gratuitamente para o 135 de segunda a sábado.'
    ],
    fonte_legal: 'Art. 20 da Lei nº 8.742/1993 (LOAS - Lei Orgânica da Assistência Social)',
    prioridade_base: 1,
    ultima_revisao: '2026-06-10',
    abrangencia: 'federal',
    posicao: 1,
    motivo: 'Benefício assistencial vitalício para dignidade e proteção social da pessoa idosa vulnerável.'
  },
  {
    id: 'passe_livre_idoso',
    nome_popular: 'Carteira da Pessoa Idosa (Viagens Interestaduais Gratuitas)',
    categoria_vida: 'idoso',
    natureza: 'servico',
    criterios_elegibilidade: 'Pessoas com 60 anos ou mais, inscritas no Cadastro Único com renda individual ou familiar de até dois salários mínimos, que não possuam comprovante de renda convencional.',
    documentos_necessarios: [
      'Número de Identificação Social (NIS) atualizado',
      'Documento oficial de identificação com foto (RG ou CNH)',
      'CPF'
    ],
    canal_solicitacao: {
      tipo: 'online_presencial',
      detalhe: 'Emissão online imediata pelo portal carteiraidoso.cidadania.gov.br ou presencialmente no CRAS do município.'
    },
    passo_a_passo: [
      'Acesse o site oficial da Carteira da Pessoa Idosa (carteiraidoso.cidadania.gov.br).',
      'Clique em "Emitir Carteira" e faça o login com sua conta Gov.br.',
      'O sistema gerará a carteirinha digital ou em PDF pronta para impressão.',
      'Apresente a carteira junto com documento oficial nos guichês das empresas de ônibus para garantir passagens gratuitas ou com 50% de desconto.'
    ],
    fonte_legal: 'Estatuto da Pessoa Idosa (Lei nº 10.741/2003, Art. 40) e Decreto nº 9.921/2019',
    prioridade_base: 2,
    ultima_revisao: '2026-03-20',
    abrangencia: 'federal',
    posicao: 2,
    motivo: 'Garantia legal do direito de ir e vir, convívio familiar e mobilidade interestadual.'
  },

  // --- PCD (PESSOA COM DEFICIÊNCIA) ---
  {
    id: 'bpc_pcd',
    nome_popular: 'BPC / LOAS para Pessoa com Deficiência',
    categoria_vida: 'pcd',
    natureza: 'beneficio',
    criterios_elegibilidade: 'Pessoas de qualquer idade com impedimento de longo prazo (mínimo de 2 anos) de natureza física, mental, intelectual ou sensorial, com renda familiar por pessoa igual ou inferior a 1/4 do salário mínimo.',
    documentos_necessarios: [
      'Cadastro Único (CadÚnico) atualizado',
      'Laudos médicos, exames, receitas e relatórios clínicos que comprovem a deficiência e limitações',
      'Documento de identidade com foto e CPF de toda a família'
    ],
    canal_solicitacao: {
      tipo: 'online',
      detalhe: 'Aplicativo Meu INSS ou Central 135. Requer agendamento de perícia médica e avaliação social no INSS.'
    },
    passo_a_passo: [
      'Atualize o CadÚnico no CRAS da sua cidade.',
      'Reúna todos os laudos e relatórios médicos atualizados que descrevam o impedimento e histórico do tratamento.',
      'Acesse o Meu INSS, clique em "Novo Pedido" e selecione "Benefício Assistencial à Pessoa com Deficiência".',
      'Agende a Perícia Médica e a Avaliação Social em uma agência do INSS.',
      'Compareça nas datas agendadas portando todos os documentos originais e laudos.'
    ],
    fonte_legal: 'Art. 20 da Lei nº 8.742/1993 e Estatuto da Pessoa com Deficiência (Lei nº 13.146/2015)',
    prioridade_base: 1,
    ultima_revisao: '2026-06-15',
    abrangencia: 'federal',
    posicao: 1,
    motivo: 'Suporte financeiro vital para custear terapias, cuidados e inclusão social.'
  },
  {
    id: 'isencao_impostos_pcd',
    nome_popular: 'Isenção de IPI, ICMS e IPVA para Aquisição de Veículos',
    categoria_vida: 'pcd',
    natureza: 'beneficio',
    criterios_elegibilidade: 'Pessoas com deficiência física, visual, mental severa ou profunda, ou autistas (diretamente ou por intermédio de seu representante legal) para compra de veículo automotor novo.',
    documentos_necessarios: [
      'Laudo de Avaliação emitido por prestador de serviço público de saúde (SUS) ou credenciado',
      'CNH especial (caso o próprio PCD seja o condutor) ou indicação de até 3 condutores autorizados',
      'Comprovante de disponibilidade financeira ou patrimonial',
      'RG, CPF e comprovante de residência'
    ],
    canal_solicitacao: {
      tipo: 'online',
      detalhe: 'Sistema Sisen da Receita Federal (para IPI) e Secretaria da Fazenda Estadual / SEFAZ (para ICMS e IPVA).'
    },
    passo_a_passo: [
      'Obtenha o laudo médico oficial no modelo exigido pela Receita Federal e SEFAZ.',
      'Acesse o sistema Sisen no portal da Receita Federal com login Gov.br e solicite a isenção do IPI.',
      'Com a autorização do IPI em mãos, solicite a isenção de ICMS no portal da SEFAZ do seu estado.',
      'Após a compra do veículo, solicite a isenção do IPVA junto ao Detran ou SEFAZ estadual.'
    ],
    fonte_legal: 'Lei nº 8.989/1995, Lei nº 14.287/2021 e Convênio ICMS 38/2012',
    prioridade_base: 3,
    ultima_revisao: '2026-02-10',
    abrangencia: 'estadual_variavel',
    posicao: 2,
    motivo: 'Acessibilidade e autonomia no transporte diário, consultas e locomoção.'
  },

  // --- SAÚDE MENTAL ---
  {
    id: 'atendimento_caps',
    nome_popular: 'Atendimento Psicológico e Psiquiátrico Gratuito (CAPS / SUS)',
    categoria_vida: 'saude_mental',
    natureza: 'servico',
    criterios_elegibilidade: 'Qualquer cidadão em sofrimento psíquico ou transtorno mental, incluindo quadros relacionados ao uso de álcool e outras drogas. O atendimento é porta aberta (não exige encaminhamento prévio).',
    documentos_necessarios: [
      'Documento de identidade com foto (RG ou CNH)',
      'Cartão Nacional de Saúde (Cartão do SUS)',
      'Comprovante de residência (opcional, não impede o primeiro acolhimento)'
    ],
    canal_solicitacao: {
      tipo: 'presencial',
      detalhe: 'Comparecimento direto à unidade do CAPS (Centro de Atenção Psicossocial) ou Unidade Básica de Saúde (UBS) do seu bairro.'
    },
    passo_a_passo: [
      'Localize o CAPS mais próximo no site da prefeitura ou perguntando no posto de saúde (UBS) do bairro.',
      'Dirija-se ao local em horário comercial de segunda a sexta (ou 24h nos CAPS III).',
      'Solicite o "Acolhimento Inicial" na recepção.',
      'Um psicólogo, enfermeiro ou assistente social fará a escuta qualificada e iniciará o Projeto Terapêutico Singular.'
    ],
    fonte_legal: 'Lei da Reforma Psiquiátrica (Lei nº 10.216/2001) e Portaria GM/MS nº 3.088/2011',
    prioridade_base: 1,
    ultima_revisao: '2026-05-01',
    abrangencia: 'federal',
    posicao: 1,
    motivo: 'Garantia de cuidado humanizado em liberdade, fornecimento de medicação e suporte psicossocial.'
  },
  {
    id: 'auxilio_doenca_saude_mental',
    nome_popular: 'Auxílio-Doença por Transtorno Mental (Benefício por Incapacidade)',
    categoria_vida: 'saude_mental',
    natureza: 'beneficio',
    criterios_elegibilidade: 'Trabalhadores segurados do INSS incapacitados temporariamente para o trabalho por mais de 15 dias consecutivos devido a quadros como depressão severa, ansiedade generalizada, burnout ou síndrome do pânico. Exige carência mínima de 12 contribuições (salvo acidente de trabalho).',
    documentos_necessarios: [
      'Atestado médico detalhado com CID (Código Internacional de Doenças), carimbo e assinatura do médico',
      'Relatórios clínicos, histórico de receitas de medicamentos e laudos psicológicos/psiquiátricos',
      'Carteira de Trabalho, carnês ou comprovante de segurado',
      'RG e CPF'
    ],
    canal_solicitacao: {
      tipo: 'online',
      detalhe: 'Aplicativo Meu INSS (com opção de análise documental Atestmed sem perícia presencial em muitos casos).'
    },
    passo_a_passo: [
      'Peça ao seu médico psiquiatra um laudo detalhado constando o tempo estimado de repouso necessário.',
      'Acesse o aplicativo Meu INSS e clique em "Pedir Benefício por Incapacidade (Auxílio-Doença)".',
      'Escolha a opção de "Análise Documental (Atestmed)" para envio digital do atestado e laudos sem filas.',
      'Anexe fotos nítidas do documento médico e de identificação.',
      'Acompanhe o resultado pelo aplicativo em até 30 dias.'
    ],
    fonte_legal: 'Art. 59 da Lei nº 8.213/1991 e Portaria Conjunta MPS/INSS nº 38/2023',
    prioridade_base: 2,
    ultima_revisao: '2026-06-05',
    abrangencia: 'federal',
    posicao: 2,
    motivo: 'Segurança financeira durante o período de tratamento e recuperação da saúde mental.'
  },

  // --- TRABALHO / ACIDENTE ---
  {
    id: 'seguro_desemprego',
    nome_popular: 'Seguro-Desemprego (Até 5 Parcelas)',
    categoria_vida: 'trabalho_acidente',
    natureza: 'beneficio',
    criterios_elegibilidade: 'Trabalhador formal demitido sem justa causa que comprove vínculo empregatício por pelo menos 12 meses nos últimos 18 meses (na 1ª solicitação), 9 meses (na 2ª) ou 6 meses (nas demais). Não estar recebendo benefício de prestação continuada da Previdência Social (exceto pensão por morte ou auxílio-acidente).',
    documentos_necessarios: [
      'Requerimento do Seguro-Desemprego (emitido e entregue pela empresa empregadora na demissão)',
      'Carteira de Trabalho (Digital ou Física) e Termo de Rescisão de Contrato de Trabalho (TRCT)',
      'RG, CPF e número do PIS/PASEP'
    ],
    canal_solicitacao: {
      tipo: 'online',
      detalhe: 'Aplicativo Carteira de Trabalho Digital (gov.br) ou Portal Emprega Brasil.'
    },
    passo_a_passo: [
      'Baixe no celular o aplicativo oficial "Carteira de Trabalho Digital" e entre com sua conta Gov.br.',
      'No menu inferior, toque em "Benefícios" e depois em "Seguro-Desemprego".',
      'Digite o número do Requerimento de Seguro-Desemprego (10 ou 11 dígitos) fornecido pela empresa.',
      'Confira os dados da rescisão, confirme a solicitação e indique uma conta bancária de sua titularidade.',
      'A primeira parcela será depositada em cerca de 30 dias após o requerimento.'
    ],
    fonte_legal: 'Lei nº 7.998/1990 e Art. 7º, inciso II da Constituição Federal',
    prioridade_base: 1,
    ultima_revisao: '2026-05-20',
    abrangencia: 'federal',
    posicao: 1,
    motivo: 'Amparo financeiro imediato após demissão involuntária para busca de recolocação profissional.'
  },
  {
    id: 'auxilio_acidente',
    nome_popular: 'Auxílio-Acidente (Indenização Mensal do INSS)',
    categoria_vida: 'trabalho_acidente',
    natureza: 'beneficio',
    criterios_elegibilidade: 'Trabalhadores empregados, avulsos e segurados especiais que sofreram acidente (de trabalho ou de qualquer natureza) do qual resultaram sequelas definitivas que reduzam a capacidade para o trabalho que exerciam habitualmente. Pode ser acumulado com o salário caso volte a trabalhar!',
    documentos_necessarios: [
      'Comunicação de Acidente de Trabalho (CAT) registrada pela empresa (se acidente laboral)',
      'Laudos de alta médica do auxílio-doença anterior constando a consolidação das sequelas',
      'Exames de imagem, receitas e relatórios médicos de reabilitação',
      'RG, CPF e Carteira de Trabalho'
    ],
    canal_solicitacao: {
      tipo: 'online',
      detalhe: 'Meu INSS ou Central 135. É concedido automaticamente após a alta do auxílio-doença acidentário em muitos casos.'
    },
    passo_a_passo: [
      'Verifique se, ao receber alta do Auxílio-Doença, você permaneceu com sequela motora, visual ou funcional definitiva.',
      'Caso o INSS não tenha implantado automaticamente, acesse o Meu INSS.',
      'Solicite agendamento de "Perícia Médica para Auxílio-Acidente" ou recurso administrativo.',
      'Apresente os laudos que comprovam a redução da capacidade laboral em comparação ao que você fazia antes do acidente.'
    ],
    fonte_legal: 'Art. 86 da Lei nº 8.213/1991',
    prioridade_base: 2,
    ultima_revisao: '2026-04-15',
    abrangencia: 'federal',
    posicao: 2,
    motivo: 'Indenização mensal de 50% do salário de benefício até a aposentadoria, sem impedir o trabalho.'
  },

  // --- SITUAÇÃO DE RUA / EXTREMA POBREZA ---
  {
    id: 'cadunico_sem_residencia',
    nome_popular: 'Inscrição no Cadastro Único para Pessoa em Situação de Rua',
    categoria_vida: 'situacao_rua',
    natureza: 'servico',
    criterios_elegibilidade: 'Pessoas ou famílias que utilizam os espaços públicos e áreas degradadas como moradia e sustento, de forma temporária ou permanente. NÃO é obrigatório ter comprovante de residência ou documentos de todos os tipos para realizar o cadastro inicial.',
    documentos_necessarios: [
      'Qualquer documento de identificação com foto (se possuir: RG, CPF, Título de Eleitor, Certidão ou Carteira de Trabalho)',
      'Nota: Caso não possua nenhum documento, o assistente social do Centro Pop ou CRAS emitirá encaminhamento para certidão gratuita.'
    ],
    canal_solicitacao: {
      tipo: 'presencial',
      detalhe: 'Centro Pop (Centro de Referência Especializado para População em Situação de Rua), CRAS ou equipes de Abordagem Social.'
    },
    passo_a_passo: [
      'Procure a unidade do Centro Pop ou o CRAS mais próximo no município.',
      'Informe que está em situação de rua ou acolhimento e deseja realizar o Cadastro Único.',
      'O endereço cadastrado poderá ser o próprio Centro Pop, abrigo ou localidade de referência territorial.',
      'Com o NIS gerado, você poderá acessar o Bolsa Família, restaurantes populares e isenção de taxas públicas.'
    ],
    fonte_legal: 'Decreto nº 7.053/2009 (Política Nacional para a População em Situação de Rua) e Decreto nº 11.016/2022',
    prioridade_base: 1,
    ultima_revisao: '2026-06-01',
    abrangencia: 'federal',
    posicao: 1,
    motivo: 'Portaria de entrada fundamental para cidadania, alimentação, documentação e programas de transferência de renda.'
  },
  {
    id: 'isencao_documentos_rua',
    nome_popular: 'Emissão Gratuita de Documentos Civil (RG, Certidão e CPF)',
    categoria_vida: 'situacao_rua',
    natureza: 'servico',
    criterios_elegibilidade: 'Cidadãos em situação de rua, vulnerabilidade socioeconômica ou extrema pobreza que necessitem de 2ª via da Certidão de Nascimento/Casamento ou emissão de RG para acesso a direitos sociais.',
    documentos_necessarios: [
      'Declaração de hipossuficiência (pobreza) emitida pela Defensoria Pública, CRAS ou Centro Pop',
      'Qualquer documento ou boletim de ocorrência em caso de perda/roubo (se houver)'
    ],
    canal_solicitacao: {
      tipo: 'presencial',
      detalhe: 'Defensoria Pública do Estado, Cartórios de Registro Civil (com requisição social) ou mutirões "PopRuaJud" do Judiciário.'
    },
    passo_a_passo: [
      'Solicite ao assistente social do Centro Pop/CRAS uma declaração de encaminhamento para gratuidade documental.',
      'Dirija-se ao cartório de registro civil ou posto de identificação do Estado portando a requisição.',
      'A emissão da 1ª e 2ª via de certidões e identidade será feita sem cobrança de taxas ou emolumentos.'
    ],
    fonte_legal: 'Lei nº 13.845/2019, Provimento nº 140/2023 do CNJ e Art. 5º, LXXVI da Constituição Federal',
    prioridade_base: 2,
    ultima_revisao: '2026-03-10',
    abrangencia: 'federal',
    posicao: 2,
    motivo: 'Resgate da dignidade civil; sem documento oficial não é possível sacar benefícios nem obter emprego.'
  },

  // --- VIOLÊNCIA DOMÉSTICA ---
  {
    id: 'medida_protetiva_urgencia',
    nome_popular: 'Medida Protetiva de Urgência (Lei Maria da Penha)',
    categoria_vida: 'violencia_domestica',
    natureza: 'servico',
    criterios_elegibilidade: 'Qualquer mulher em situação de violência doméstica e familiar (física, psicológica, moral, sexual ou patrimonial) cometida por cônjuge, companheiro, parente ou pessoa com quem coabite ou tenha convivido.',
    documentos_necessarios: [
      'Documento de identidade com foto (RG ou CNH)',
      'Comprovante de residência',
      'Provas da violência (mensagens de áudio/texto, fotos de lesões, laudos médicos ou testemunhas - se houver)'
    ],
    canal_solicitacao: {
      tipo: 'presencial_online',
      detalhe: 'Delegacia Especializada de Atendimento à Mulher (DEAM), qualquer Delegacia de Polícia civil, ou online pelas Delegacias Virtuais do Estado. Em emergência, ligue 190 (PM) ou 180 (Central de Atendimento à Mulher).'
    },
    passo_a_passo: [
      'Em caso de agressão iminente ou perigo atual, ligue imediatamente para o 190 (Polícia Militar).',
      'Para solicitar proteção legal, compareça a uma Delegacia (preferencialmente DEAM) ou acesse a Delegacia Virtual da Mulher do seu estado.',
      'Registre o Boletim de Ocorrência e solicite expressamente as "Medidas Protetivas de Urgência".',
      'O delegado remeterá o pedido ao Juiz em até 48 horas, que decidirá sobre o afastamento do agressor do lar e proibição de contato.'
    ],
    fonte_legal: 'Lei nº 11.340/2006 (Lei Maria da Penha - Arts. 18 ao 24)',
    prioridade_base: 1,
    ultima_revisao: '2026-06-20',
    abrangencia: 'federal',
    posicao: 1,
    motivo: 'Proteção imediata da integridade física e psicológica da vítima, com força policial e judicial.'
  },
  {
    id: 'afastamento_trabalho_violencia',
    nome_popular: 'Afastamento do Trabalho com Manutenção do Vínculo (Até 6 Meses)',
    categoria_vida: 'violencia_domestica',
    natureza: 'servico',
    criterios_elegibilidade: 'Mulheres com contrato de trabalho formal (CLT) ou servidoras públicas que precisem se afastar do local de trabalho para preservar sua integridade física ou psicológica em decorrência de violência doméstica.',
    documentos_necessarios: [
      'Decisão judicial que concede a Medida Protetiva e determina ou autoriza o afastamento laboral',
      'Boletim de Ocorrência policial',
      'Carteira de Trabalho e documento de identidade'
    ],
    canal_solicitacao: {
      tipo: 'judicial_presencial',
      detalhe: 'Pedido formulado diretamente ao Juiz da Vara de Violência Doméstica ou através do Defensor Público/Advogado no momento da solicitação da medida protetiva.'
    },
    passo_a_passo: [
      'Ao solicitar a Medida Protetiva ao Juiz ou na delegacia, informe sua situação profissional e a necessidade de afastamento para segurança.',
      'O Juiz emitirá ordem judicial determinando a manutenção do vínculo trabalhista por até 6 meses.',
      'Apresente (ou peça para um advogado/representante apresentar) a ordem judicial ao setor de Recursos Humanos da sua empresa.',
      'A empresa não poderá demitir sem justa causa durante o período de proteção.'
    ],
    fonte_legal: 'Art. 9º, § 2º, inciso II da Lei nº 11.340/2006 (Lei Maria da Penha) e jurisprudência do STJ',
    prioridade_base: 2,
    ultima_revisao: '2026-04-01',
    abrangencia: 'federal',
    posicao: 2,
    motivo: 'Garantia de segurança pessoal sem perder o emprego e a independência financeira para recomeçar.'
  },

  // --- DÍVIDA / CRÉDITO ---
  {
    id: 'lei_superendividamento',
    nome_popular: 'Proteção legal da Lei do Superendividamento (Renegociação em Bloco)',
    categoria_vida: 'divida_credito',
    natureza: 'servico',
    criterios_elegibilidade: 'Consumidor pessoa física, de boa-fé, que está impossibilitado de pagar a totalidade de suas dívidas de consumo (empréstimos bancários, cartões de crédito, crediários, financeiras) sem comprometer o seu "mínimo existencial" (despesas básicas com alimentação, luz, água e moradia).',
    documentos_necessarios: [
      'RG, CPF e comprovantes de renda atualizados (holerites, extratos ou declaração de IR)',
      'Comprovantes de todas as despesas mensais básicas (aluguel, água, luz, gás, remédios, supermercado)',
      'Contratos, faturas, extratos e relatórios de dívidas do Registrado do Banco Central (SCR) ou Serasa/SPC'
    ],
    canal_solicitacao: {
      tipo: 'presencial_online',
      detalhe: 'Núcleo de Defesa do Consumidor da Defensoria Pública do seu Estado (NUDECON), Procon Estadual/Municipal ou Juizado Especial Cível.'
    },
    passo_a_passo: [
      'Faça uma lista completa de todas as suas rendas e de todos os gastos essenciais para sobrevivência da família.',
      'Reúna os extratos de todas as dívidas e empréstimos em aberto.',
      'Agende atendimento no Procon da sua cidade ou no Núcleo de Superendividamento da Defensoria Pública.',
      'O órgão convocará todos os seus credores para uma audiência única de conciliação para propor um Plano de Pagamento em até 5 anos (60 meses), garantindo a preservação do seu mínimo existencial.'
    ],
    fonte_legal: 'Lei nº 14.181/2021 (Atualiza o Código de Defesa do Consumidor - Arts. 54-A a 54-G e 104-A)',
    prioridade_base: 1,
    ultima_revisao: '2026-06-10',
    abrangencia: 'federal',
    posicao: 1,
    motivo: 'Evita a falência civil da família, reduz juros abusivos e unifica o pagamento respeitando a dignidade.'
  },
  {
    id: 'revisao_juros_defensoria',
    nome_popular: 'Assistência Jurídica Gratuita para Defesa contra Juros Abusivos e Fraudes',
    categoria_vida: 'divida_credito',
    natureza: 'servico',
    criterios_elegibilidade: 'Cidadãos com renda familiar individual ou conjunta de até 3 salários mínimos (ou em situação de vulnerabilidade que impeça pagar advogado sem prejuízo do sustento), que sofreram golpes bancários, empréstimos consignados não autorizados ou cobranças abusivas.',
    documentos_necessarios: [
      'Documento de identidade (RG/CNH) e CPF',
      'Comprovante de residência e comprovantes de renda (ou carteira de trabalho)',
      'Extratos bancários que mostrem os descontos indevidos, contratos de empréstimo e números de protocolo de reclamação no banco'
    ],
    canal_solicitacao: {
      tipo: 'presencial_online',
      detalhe: 'Defensoria Pública do seu Estado (agendamento pelo site oficial ou telefone da Defensoria, ex: 129 em SP, 129 no RJ).'
    },
    passo_a_passo: [
      'Ao identificar desconto desconhecido ou juros absurdos em sua aposentadoria ou conta, contate o banco e anote o protocolo.',
      'Acesse o site da Defensoria Pública do seu Estado e agende triagem em "Direito do Consumidor / Cível".',
      'Compareça ao atendimento portando os extratos e comprovantes de renda.',
      'O Defensor Público ajuizará ação gratuita pedindo liminar para suspensão imediata dos descontos e devolução em dobro do valor cobrado indevidamente.'
    ],
    fonte_legal: 'Art. 5º, LXXIV da Constituição Federal, Lei Complementar nº 80/1994 e Art. 42 do CDC',
    prioridade_base: 2,
    ultima_revisao: '2026-05-10',
    abrangencia: 'estadual_variavel',
    posicao: 2,
    motivo: 'Acesso universal à Justiça gratuita para conter abusos financeiros do mercado de crédito.'
  }
];

// Helper para buscar itens por categoria
export function buscarDireitosPorCategoria(categoria?: string): ItemLinhaDaVida[] {
  if (!categoria || categoria === 'todos') {
    return CATALOGO_DIREITOS;
  }
  return CATALOGO_DIREITOS.filter((item) => item.categoria_vida === categoria);
}

// Helper para buscar por termo (nome, descrição ou critério)
export function pesquisarDireitos(termo: string): ItemLinhaDaVida[] {
  const limpo = termo.toLowerCase().trim();
  if (!limpo) return CATALOGO_DIREITOS;

  return CATALOGO_DIREITOS.filter((item) =>
    item.nome_popular.toLowerCase().includes(limpo) ||
    item.criterios_elegibilidade.toLowerCase().includes(limpo) ||
    item.motivo.toLowerCase().includes(limpo) ||
    item.fonte_legal.toLowerCase().includes(limpo) ||
    item.documentos_necessarios.some((doc) => doc.toLowerCase().includes(limpo))
  );
}
