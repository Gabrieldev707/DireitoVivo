interface PropriedadesCenariosVida {
  aoSelecionarCenarioParaChat: (cenarioNome: string, mensagemInicial: string) => void;
  aoVerAjuda?: () => void;
}

interface Cenario {
  id: string;
  titulo: string;
  chamada: string;
  descricao: string;
  direitosRelacionados: string[];
  orgaosProvaveis: string[];
  mensagemChat: string;
  urgencia: 'imediata' | 'alta' | 'orientacao';
  borda: string;
  fundo: string;
  texto: string;
}

const CENARIOS_OFICIAIS: Cenario[] = [
  {
    id: 'desemprego',
    titulo: 'Perda de renda ou desemprego',
    chamada: 'Quando o orçamento da casa caiu de repente.',
    descricao:
      'Demissão recente, trabalho sem carteira, renda variável, autônomo sem serviço ou família sem renda estável.',
    direitosRelacionados: [
      'Seguro-Desemprego',
      'Cadastro Único',
      'Bolsa Família',
      'Tarifa Social de Energia',
      'Auxílio-Gás',
    ],
    orgaosProvaveis: ['CRAS', 'Carteira de Trabalho Digital', 'Caixa Tem'],
    mensagemChat:
      'Perdi renda recentemente, estou desempregado ou trabalhando sem carteira, e minha família precisa de apoio. Quero saber quais benefícios sociais, descontos e direitos de proteção financeira posso solicitar.',
    urgencia: 'alta',
    borda: 'border-[#FFCD07]',
    fundo: 'bg-yellow-50',
    texto: 'text-yellow-950',
  },
  {
    id: 'maternidade',
    titulo: 'Nascimento, adoção ou cuidado solo',
    chamada: 'Para quem precisa proteger a infância e a renda familiar.',
    descricao:
      'Chegada de bebê, adoção, guarda, maternidade/paternidade solo ou dificuldade para manter crianças na escola e vacinadas.',
    direitosRelacionados: [
      'Salário-Maternidade',
      'Benefício Primeira Infância',
      'Bolsa Família',
      'Vaga em creche',
      'Pé-de-Meia',
    ],
    orgaosProvaveis: ['Meu INSS', 'CRAS', 'Secretaria de Educação'],
    mensagemChat:
      'Tive um filho recentemente, adotei uma criança ou sustento meus filhos sozinho(a). Quero descobrir os direitos de proteção à infância, renda, escola, saúde e maternidade/paternidade.',
    urgencia: 'orientacao',
    borda: 'border-[#1351B4]',
    fundo: 'bg-blue-50',
    texto: 'text-blue-950',
  },
  {
    id: 'idoso_pcd',
    titulo: 'Idoso, PCD ou cuidador familiar',
    chamada: 'Quando a casa precisa de renda, cuidado e acessibilidade.',
    descricao:
      'Pessoa idosa, pessoa com deficiência, doença de longo prazo ou familiar que exige cuidado frequente dentro de casa.',
    direitosRelacionados: [
      'BPC / LOAS',
      'Carteira da Pessoa Idosa',
      'Passe livre',
      'Isenções para PCD',
      'Prioridade de atendimento',
    ],
    orgaosProvaveis: ['CRAS', 'Meu INSS', 'SUS', 'Detran/SEFAZ'],
    mensagemChat:
      'Na minha casa há uma pessoa idosa ou pessoa com deficiência, ou eu sou cuidador familiar. Preciso entender BPC/LOAS, passe livre, prioridades, saúde e possíveis isenções.',
    urgencia: 'alta',
    borda: 'border-[#168821]',
    fundo: 'bg-green-50',
    texto: 'text-green-950',
  },
  {
    id: 'dividas',
    titulo: 'Dívidas, nome negativado ou desconto abusivo',
    chamada: 'Para reorganizar cobranças sem perder o mínimo para viver.',
    descricao:
      'Parcelas, cartão, empréstimos, consignado, juros altos, golpe bancário ou dívidas que comprometem alimentação e moradia.',
    direitosRelacionados: [
      'Lei do Superendividamento',
      'Renegociação em bloco',
      'Defensoria Pública',
      'Procon',
      'Revisão de contrato',
    ],
    orgaosProvaveis: ['Defensoria Pública', 'Procon', 'Juizado Especial'],
    mensagemChat:
      'Estou com muitas dívidas, nome negativado, juros altos ou descontos indevidos que comprometem o sustento básico da minha casa. Quero saber como usar a Lei do Superendividamento, Procon e Defensoria Pública.',
    urgencia: 'orientacao',
    borda: 'border-violet-500',
    fundo: 'bg-violet-50',
    texto: 'text-violet-950',
  },
  {
    id: 'saude_acidente',
    titulo: 'Saúde grave, saúde mental ou acidente',
    chamada: 'Quando o cuidado e o afastamento precisam virar plano.',
    descricao:
      'Doença grave, saúde mental, tratamento pelo SUS, medicação, acidente de trabalho ou incapacidade temporária.',
    direitosRelacionados: [
      'CAPS / SUS',
      'Auxílio por incapacidade',
      'Auxílio-Acidente',
      'Medicamento de alto custo',
      'Saque do FGTS',
    ],
    orgaosProvaveis: ['UBS', 'CAPS', 'Meu INSS', 'CRAS'],
    mensagemChat:
      'Estou enfrentando problema de saúde, saúde mental, doença grave ou acidente e preciso de atendimento, medicação, afastamento do trabalho ou benefício do INSS. Quero saber por onde começar.',
    urgencia: 'imediata',
    borda: 'border-rose-500',
    fundo: 'bg-rose-50',
    texto: 'text-rose-950',
  },
  {
    id: 'documentacao_rua',
    titulo: 'Documentação, moradia ou situação de rua',
    chamada: 'Quando faltar documento também bloqueia acesso a direitos.',
    descricao:
      'Perda de documentos, ausência de comprovante de residência, acolhimento, alimentação, higiene ou necessidade de reinserção em serviços públicos.',
    direitosRelacionados: [
      'Cadastro Único',
      'Centro POP',
      '2ª via de documentos',
      'Acolhimento institucional',
      'Defensoria Pública',
    ],
    orgaosProvaveis: ['CRAS', 'Centro POP', 'Defensoria Pública', 'Poupatempo/órgão estadual'],
    mensagemChat:
      'Estou com dificuldade de documentação, comprovante de residência, moradia ou em situação de rua. Quero saber por onde começar para acessar CadÚnico, acolhimento, documentos e atendimento público.',
    urgencia: 'alta',
    borda: 'border-orange-500',
    fundo: 'bg-orange-50',
    texto: 'text-orange-950',
  },
  {
    id: 'violencia_domestica',
    titulo: 'Violência doméstica ou ameaça',
    chamada: 'Quando segurança e proteção vêm antes de qualquer benefício.',
    descricao:
      'Agressão, ameaça, controle financeiro, perseguição, risco dentro de casa ou necessidade de medida protetiva e acolhimento.',
    direitosRelacionados: [
      'Medida protetiva',
      'Ligue 180',
      'Casa da Mulher Brasileira',
      'Defensoria Pública',
      'Acolhimento sigiloso',
    ],
    orgaosProvaveis: ['190', '180', 'Delegacia da Mulher', 'Defensoria Pública'],
    mensagemChat:
      'Estou vivendo ameaça, violência doméstica ou controle dentro de casa e preciso entender medidas de proteção, canais seguros, Defensoria Pública e acolhimento.',
    urgencia: 'imediata',
    borda: 'border-red-600',
    fundo: 'bg-red-50',
    texto: 'text-red-950',
  },
];

function IconeCenarioSVG({ id }: { id: string }) {
  const classe = 'h-6 w-6';

  switch (id) {
    case 'desemprego':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    case 'maternidade':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4.3 6.3a4.5 4.5 0 000 6.4L12 20.4l7.7-7.7a4.5 4.5 0 00-6.4-6.4L12 7.6l-1.3-1.3a4.5 4.5 0 00-6.4 0z" />
        </svg>
      );
    case 'idoso_pcd':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m5.5-4.5A11.8 11.8 0 0112 3 11.8 11.8 0 013.5 5.5 12 12 0 003 9c0 5.4 3.7 10 9 11.3 5.3-1.3 9-5.9 9-11.3 0-1.2-.2-2.3-.5-3.5z" />
        </svg>
      );
    case 'dividas':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 14l6-6m-5.5.5h.01m5 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      );
    case 'saude_acidente':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4.5 12.5h4l2-5 4 10 2-5h3M12 21a9 9 0 100-18 9 9 0 000 18z" />
        </svg>
      );
    case 'documentacao_rua':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.6a1 1 0 0 1 .7.3l5.4 5.4a1 1 0 0 1 .3.7V19a2 2 0 0 1-2 2z" />
        </svg>
      );
    case 'violencia_domestica':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 3 4.5 6.2V11c0 4.8 3.2 8.2 7.5 10 4.3-1.8 7.5-5.2 7.5-10V6.2L12 3zm-2 9 1.6 1.6L15 10" />
        </svg>
      );
    default:
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

function rotuloUrgencia(urgencia: Cenario['urgencia']) {
  if (urgencia === 'imediata') return 'Prioridade imediata';
  if (urgencia === 'alta') return 'Alta prioridade';
  return 'Orientação guiada';
}

export function CenariosVida({ aoSelecionarCenarioParaChat, aoVerAjuda }: PropriedadesCenariosVida) {
  return (
    <section className="space-y-8 pb-12">
      <div className="gov-panel overflow-hidden">
        <div className="grid grid-cols-1">
          <div className="p-6 md:p-8">
            <div className="gov-kicker">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 20l-5.45-2.72A1 1 0 013 16.38V5.62a1 1 0 011.45-.9L9 7m0 13l6-3m-6 3V7m6 10l4.55 2.28A1 1 0 0021 18.38V7.62a1 1 0 00-.55-.9L15 4m0 13V4m0 0L9 7" />
              </svg>
              Guias por cenário
            </div>
            <h1 className="mt-2 text-2xl font-black text-[#071D41] sm:text-3xl">
              Escolha o momento de vida mais próximo do que você está vivendo.
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
              Leia caminhos possíveis e canais humanos. Se quiser iniciar a demonstração com IA, confira antes o texto que será enviado.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="border-l-4 border-[#FFCD07] bg-slate-50 p-4">
                <strong className="block text-2xl font-black text-[#071D41]">{CENARIOS_OFICIAIS.length}</strong>
                <span className="text-xs font-semibold text-slate-600">cenários principais</span>
              </div>
              <div className="border-l-4 border-[#168821] bg-slate-50 p-4">
                <strong className="block text-2xl font-black text-[#071D41]">CRAS</strong>
                <span className="text-xs font-semibold text-slate-600">porta de entrada frequente</span>
              </div>
              <div className="border-l-4 border-[#1351B4] bg-slate-50 p-4">
                <strong className="block text-2xl font-black text-[#071D41]">IA</strong>
                <span className="text-xs font-semibold text-slate-600">perguntas já orientadas</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <section className="scenario-priority-band" aria-label="Como os cenários priorizam atendimento">
        <div>
          <span className="scenario-priority-band__tag bg-red-100 text-red-950">Imediata</span>
          <strong>Risco, violência ou saúde grave</strong>
          <p>Orienta a procurar canal de emergência antes de qualquer conversa longa.</p>
        </div>
        <div>
          <span className="scenario-priority-band__tag bg-amber-100 text-amber-950">Alta</span>
          <strong>Renda, cuidado ou moradia</strong>
          <p>Leva para CRAS, INSS, SUS, Defensoria ou rede local conforme o caso.</p>
        </div>
        <div>
          <span className="scenario-priority-band__tag bg-blue-100 text-blue-950">Guiada</span>
          <strong>Dúvida inicial ou planejamento</strong>
          <p>Organiza documentos e perguntas para chegar melhor preparado ao órgão.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {CENARIOS_OFICIAIS.map((cenario, indice) => (
          <article key={cenario.id} className="gov-panel overflow-hidden">
            <div className={`border-t-4 ${cenario.borda}`} />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded ${cenario.fundo} ${cenario.texto}`}>
                  <IconeCenarioSVG id={cenario.id} />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                  {rotuloUrgencia(cenario.urgencia)}
                </span>
              </div>

              <div className="mt-4">
                <span className="text-xs font-black uppercase tracking-wide text-[#1351B4]">
                  Roteiro {indice + 1}
                </span>
                <h3 className="mt-1 text-xl font-black leading-snug text-[#071D41]">{cenario.titulo}</h3>
                <p className="mt-1 text-sm font-bold text-slate-700">{cenario.chamada}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{cenario.descricao}</p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                    Direitos que podem aparecer
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {cenario.direitosRelacionados.map((direito) => (
                      <span key={direito} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                        {direito}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                    Órgãos prováveis
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {cenario.orgaosProvaveis.map((orgao) => (
                      <span key={orgao} className="rounded bg-blue-50 px-3 py-1 text-xs font-black text-[#1351B4]">
                        {orgao}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {cenario.urgencia === 'imediata' && (
                <div className="mt-5 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-950">
                  <strong>Em perigo imediato, procure ajuda humana antes da conversa.</strong>
                  <button type="button" onClick={aoVerAjuda} className="ml-2 font-bold underline underline-offset-2">Ver canais de urgência</button>
                </div>
              )}
              <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  A conversa abre sem pedir nome, CPF ou RG.
                </span>
                <button
                  type="button"
                  onClick={() => aoSelecionarCenarioParaChat(cenario.titulo, cenario.mensagemChat)}
                  className="btn-gov-primary px-5 py-3 text-sm"
                >
                  Ver prévia da conversa
                  <svg className="h-4 w-4 text-[#FFCD07]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-lg border border-red-200 bg-red-50 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black text-red-950">Situações de risco exigem atendimento imediato</h3>
            <p className="mt-1 text-sm leading-relaxed text-red-900">
              Violência em andamento, risco de vida, emergência médica ou criança em perigo não devem esperar a triagem digital.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-black text-red-950">
            <span className="rounded bg-white px-3 py-2 ring-1 ring-red-200">190 Polícia Militar</span>
            <span className="rounded bg-white px-3 py-2 ring-1 ring-red-200">192 SAMU</span>
            <span className="rounded bg-white px-3 py-2 ring-1 ring-red-200">180 Mulher</span>
            <span className="rounded bg-white px-3 py-2 ring-1 ring-red-200">100 Direitos Humanos</span>
          </div>
        </div>
      </section>
    </section>
  );
}
