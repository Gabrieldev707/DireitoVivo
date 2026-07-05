import { TEXTO_DISCLAIMER } from '../tipos';

interface PropriedadesTelaInicial {
  aoComecar: () => void;
  aoVerCatalogo: () => void;
  aoVerCenarios: () => void;
}

const ETAPAS_ATENDIMENTO = [
  {
    titulo: 'Relate a situação',
    descricao: 'Use linguagem simples, sem nome completo, CPF, RG ou endereço.',
  },
  {
    titulo: 'Entenda a porta de entrada',
    descricao: 'A triagem separa urgência, renda, família, saúde e trabalho.',
  },
  {
    titulo: 'Siga uma rota pública',
    descricao: 'Receba órgãos prováveis, documentos e um passo a passo inicial.',
  },
];

const CANAIS_APOIO = [
  { nome: 'CRAS', detalhe: 'Cadastro Único, Bolsa Família, apoio socioassistencial e rede local.' },
  { nome: 'INSS 135', detalhe: 'BPC, salário-maternidade, incapacidade e perícias.' },
  { nome: 'Defensoria', detalhe: 'Orientação jurídica gratuita, dívidas, família e consumidor.' },
  { nome: 'SUS / CAPS', detalhe: 'Acolhimento em saúde, saúde mental e medicamentos.' },
];

const PERFIS_SERVICO = [
  'Trabalhador',
  'Família com crianças',
  'Pessoa idosa',
  'Pessoa com deficiência',
  'Cuidador familiar',
  'Mulher em risco',
  'Pessoa endividada',
  'Sem moradia fixa',
];

export function TelaInicial({ aoComecar, aoVerCatalogo, aoVerCenarios }: PropriedadesTelaInicial) {
  const destaques = [
    {
      titulo: 'Catálogo de direitos',
      descricao:
        'Benefícios, serviços e garantias organizados por área da vida, com critérios e documentos.',
      imagem: '/assets/secao-catalogo-direitos.png',
      alt: 'Mesa de atendimento público com documentos, celular e orientação sobre direitos sociais',
      acao: 'Abrir catálogo',
      onClick: aoVerCatalogo,
      tom: 'border-[#1351B4]',
    },
    {
      titulo: 'Cenários de vida',
      descricao:
        'Roteiros para desemprego, maternidade, cuidado, saúde, dívidas, violência e urgências.',
      imagem: '/assets/secao-cenarios-vida.png',
      alt: 'Pessoas em uma unidade pública recebendo orientação social',
      acao: 'Ver cenários',
      onClick: aoVerCenarios,
      tom: 'border-[#168821]',
    },
    {
      titulo: 'Triagem assistida',
      descricao:
        'Uma conversa guiada para transformar um problema confuso em próximos passos possíveis.',
      imagem: '/assets/secao-chat-triagem.png',
      alt: 'Atendimento digital em celular com foco em serviço público anônimo',
      acao: 'Iniciar triagem',
      onClick: aoComecar,
      tom: 'border-[#FFCD07]',
    },
  ];

  return (
    <section className="animate-fade-in pb-14">
      <section className="home-hero" aria-labelledby="titulo-hero">
        <img
          src="/assets/hero-familia-servico-publico.png"
          alt="Família brasileira recebendo orientação em serviço público"
          className="home-hero__image"
        />
        <div className="home-hero__overlay" aria-hidden="true" />
        <img src="/assets/brasao-republica.png" alt="" aria-hidden="true" className="home-hero__watermark" />

        <div className="home-hero__inner relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_25rem] lg:px-8">
          <div className="max-w-3xl text-white">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded border border-white/25 bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-wide text-[#FFCD07] backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-[#168821]" />
              Serviço digital de cidadania
            </div>

            <h1 id="titulo-hero" className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Direito público com cara de Brasil e caminho de balcão.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-blue-50 sm:text-lg">
              O Direito Vivo ajuda a transformar dúvidas sobre renda, família, saúde, trabalho e proteção em uma rota simples de atendimento, documentos e canais oficiais.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={aoComecar} className="btn-gov-hero">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-5 5v-5z" />
                </svg>
                Iniciar triagem anônima
              </button>

              <button type="button" onClick={aoVerCatalogo} className="btn-gov-hero-secondary">
                Explorar direitos
                <svg className="h-5 w-5 text-[#FFCD07]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M13 7l5 5m0 0-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            <dl className="mt-9 grid max-w-3xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div className="hero-stat border-[#FFCD07]">
                <dt>Privacidade</dt>
                <dd>0 documentos pessoais no chat</dd>
              </div>
              <div className="hero-stat border-[#168821]">
                <dt>Catálogo</dt>
                <dd>14+ direitos e serviços</dd>
              </div>
              <div className="hero-stat border-[#4f9cf9]">
                <dt>Canais</dt>
                <dd>CRAS, INSS, SUS e Defensoria</dd>
              </div>
            </dl>
          </div>

          <aside className="hero-service-panel" aria-label="Fluxo de atendimento">
            <div className="gov-ribbon" aria-hidden="true" />
            <div className="p-5">
              <div className="gov-kicker text-white">
                <span className="h-2 w-2 rounded-full bg-[#FFCD07]" />
                Rota cidadã
              </div>
              <ol className="mt-4 space-y-4">
                {ETAPAS_ATENDIMENTO.map((etapa, indice) => (
                  <li key={etapa.titulo} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#FFCD07] text-xs font-black text-[#071D41]">
                      {indice + 1}
                    </span>
                    <span>
                      <strong className="block text-sm text-white">{etapa.titulo}</strong>
                      <span className="mt-1 block text-xs leading-relaxed text-blue-100">{etapa.descricao}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <button type="button" onClick={aoVerCenarios} className="mt-5 w-full btn-gov-light">
                Ver guias por cenário
              </button>
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        <section className="identity-brasil-section">
          <div>
            <div className="gov-kicker">
              <span className="h-2 w-2 rounded-full bg-[#168821]" />
              Identificação brasileira
            </div>
            <h2 className="mt-3 text-2xl font-black text-[#071D41] sm:text-3xl">
              Um portal visualmente público, acessível e direto.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">
              A interface usa cores nacionais, sinais institucionais e uma navegação parecida com serviços públicos digitais: entrar por perfil, por tema ou pela situação vivida.
            </p>
          </div>
          <div className="identity-brasil-section__logo">
            <img
              src="/assets/governo-brasil-2025.png"
              alt="Governo do Brasil - Do lado do povo brasileiro"
              className="gov-mark-logo h-auto w-full object-contain"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3" aria-label="Principais caminhos">
          {destaques.map((item) => (
            <article key={item.titulo} className={`feature-card ${item.tom}`}>
              <div className="feature-card__media">
                <img src={item.imagem} alt={item.alt} className="gov-photo" />
              </div>
              <div className="p-6">
                <div className="gov-kicker">
                  <span className="h-2 w-2 rounded-full bg-[#168821]" />
                  Acesso orientado
                </div>
                <h2 className="mt-2 text-xl font-black text-[#071D41]">{item.titulo}</h2>
                <p className="mt-2 min-h-20 text-sm leading-relaxed text-slate-600">{item.descricao}</p>
                <button type="button" onClick={item.onClick} className="mt-5 btn-gov-primary">
                  {item.acao}
                  <svg className="h-4 w-4 text-[#FFCD07]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M13 7l5 5m0 0-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="brasil-focus-section">
          <div>
            <div className="gov-kicker">
              <span className="h-2 w-2 rounded-full bg-[#FFCD07]" />
              Brasil em foco
            </div>
            <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              Direitos começam no território onde a pessoa vive.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-100">
              A triagem não tenta adivinhar tudo. Ela aproxima o problema de uma rede pública real: CRAS, SUS, INSS, Defensoria, Procon, escola, município e canais de emergência.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PERFIS_SERVICO.map((perfil) => (
                <span key={perfil} className="rounded border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-white">
                  {perfil}
                </span>
              ))}
            </div>
          </div>

          <div className="brasil-globe-card" role="img" aria-label="Planeta animado com o Brasil destacado como foco do atendimento">
            <div className="brasil-globe" aria-hidden="true">
              <span className="brasil-globe__grid" />
              <span className="brasil-globe__land brasil-globe__land--one" />
              <span className="brasil-globe__land brasil-globe__land--two" />
              <span className="brasil-globe__focus" />
              <span className="brasil-globe__pulse" />
            </div>
            <strong>Serviço pensado para o Brasil inteiro</strong>
            <span>Da dúvida inicial ao canal público mais provável.</span>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-3">
            <div className="gov-kicker">
              <span className="h-2 w-2 rounded-full bg-[#FFCD07]" />
              Como funciona
            </div>
            <h2 className="text-2xl font-black text-[#071D41] sm:text-3xl">
              Uma lógica de atendimento, não uma página decorativa.
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              A experiência foi organizada para o usuário entrar por problema, confirmar direitos possíveis e chegar ao órgão com uma lista mais clara do que dizer e levar.
            </p>
          </div>

          <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {ETAPAS_ATENDIMENTO.map((etapa, indice) => (
              <li key={etapa.titulo} className="step-card">
                <span className="flex h-9 w-9 items-center justify-center rounded bg-[#1351B4] text-sm font-black text-white">
                  {indice + 1}
                </span>
                <h3 className="mt-4 text-base font-black text-[#071D41]">{etapa.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{etapa.descricao}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="gov-panel overflow-hidden">
          <div className="gov-ribbon" aria-hidden="true" />
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
            <div>
              <div className="gov-kicker">
                <span className="h-2 w-2 rounded-full bg-[#168821]" />
                Rede de apoio
              </div>
              <h2 className="mt-2 text-2xl font-black text-[#071D41]">
                Canais que costumam resolver a próxima etapa.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Depois da triagem, o plano indica onde confirmar o direito e como preparar a documentação.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CANAIS_APOIO.map((canal) => (
                <div key={canal.nome} className="support-card">
                  <strong className="block text-sm font-black text-[#071D41]">{canal.nome}</strong>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">{canal.detalhe}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-6 shadow-sm" role="note">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-amber-200 text-amber-950">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.94 4h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.72 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-amber-950">Antes de começar sua triagem</h3>
              <p className="mt-2 leading-relaxed text-amber-950">{TEXTO_DISCLAIMER}</p>
              <p className="mt-2 text-xs font-bold text-amber-900">
                Em caso de urgência, procure diretamente o CRAS, uma unidade de saúde, a Defensoria Pública, a Polícia Militar pelo 190 ou a Central 180 quando houver violência contra a mulher.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
