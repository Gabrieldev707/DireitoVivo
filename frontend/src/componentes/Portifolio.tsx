import { useMemo, useState } from 'react';
import { CATALOGO_DIREITOS } from '../dados/catalogoDireitos';
import { ROTULOS_CATEGORIA, type CategoriaVida, type ItemLinhaDaVida } from '../tipos';

interface PropriedadesPortifolio {
  aoSelecionarDireitoParaChat: (item: ItemLinhaDaVida) => void;
}

const CATEGORIA_RESUMO: Record<CategoriaVida, string> = {
  familia_crianca: 'Renda, infância, maternidade, energia e proteção familiar.',
  idoso: 'Garantias para envelhecimento, renda mínima e mobilidade.',
  pcd: 'BPC, acessibilidade, isenções e inclusão social.',
  saude_mental: 'SUS, CAPS, afastamentos e proteção em saúde mental.',
  trabalho_acidente: 'Seguro-desemprego, INSS e acidente de trabalho.',
  situacao_rua: 'Documentação, CadÚnico e rede socioassistencial.',
  violencia_domestica: 'Proteção urgente, trabalho e canais de denúncia.',
  divida_credito: 'Defensoria, Procon e proteção contra abusos financeiros.',
};

const CATEGORIA_CORES: Record<CategoriaVida, { borda: string; fundo: string; texto: string }> = {
  familia_crianca: { borda: 'border-[#FFCD07]', fundo: 'bg-yellow-50', texto: 'text-yellow-900' },
  idoso: { borda: 'border-[#1351B4]', fundo: 'bg-blue-50', texto: 'text-blue-900' },
  pcd: { borda: 'border-[#168821]', fundo: 'bg-green-50', texto: 'text-green-900' },
  saude_mental: { borda: 'border-cyan-500', fundo: 'bg-cyan-50', texto: 'text-cyan-900' },
  trabalho_acidente: { borda: 'border-indigo-500', fundo: 'bg-indigo-50', texto: 'text-indigo-900' },
  situacao_rua: { borda: 'border-orange-500', fundo: 'bg-orange-50', texto: 'text-orange-900' },
  violencia_domestica: { borda: 'border-rose-500', fundo: 'bg-rose-50', texto: 'text-rose-900' },
  divida_credito: { borda: 'border-violet-500', fundo: 'bg-violet-50', texto: 'text-violet-900' },
};

function IconeCategoriaSVG({ categoria }: { categoria: string }) {
  const classe = 'h-5 w-5';

  switch (categoria) {
    case 'familia_crianca':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.36-1.86M17 20H7m10 0v-2c0-.66-.13-1.28-.36-1.86M7 20H2v-2a3 3 0 015.36-1.86M7 20v-2c0-.66.13-1.28.36-1.86m0 0a5 5 0 019.28 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'idoso':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'pcd':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7zm0-2a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      );
    case 'saude_mental':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.3 6.3a4.5 4.5 0 000 6.4L12 20.4l7.7-7.7a4.5 4.5 0 00-6.4-6.4L12 7.6l-1.3-1.3a4.5 4.5 0 00-6.4 0z" />
        </svg>
      );
    case 'trabalho_acidente':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.25A24 24 0 0112 15c-3.18 0-6.22-.62-9-1.75M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'situacao_rua':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
        </svg>
      );
    case 'violencia_domestica':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.5-4.5A11.8 11.8 0 0112 3 11.8 11.8 0 013.5 5.5 12 12 0 003 9c0 5.4 3.7 10 9 11.3 5.3-1.3 9-5.9 9-11.3 0-1.2-.2-2.3-.5-3.5z" />
        </svg>
      );
    case 'divida_credito':
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.66 0-3 .9-3 2s1.34 2 3 2 3 .9 3 2-1.34 2-3 2m0-8V7m0 9v1m9-5a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg className={classe} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2" />
        </svg>
      );
  }
}

function formatarData(data: string) {
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
}

function rotuloCanal(tipo: string) {
  return tipo.replaceAll('_', ' + ').toUpperCase();
}

export function Portifolio({ aoSelecionarDireitoParaChat }: PropriedadesPortifolio) {
  const [termoBusca, setTermoBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaVida | 'todos'>('todos');
  const [itemModal, setItemModal] = useState<ItemLinhaDaVida | null>(null);

  const totaisPorCategoria = useMemo(() => {
    return (Object.keys(ROTULOS_CATEGORIA) as CategoriaVida[]).reduce<Record<CategoriaVida, number>>(
      (acc, categoria) => {
        acc[categoria] = CATALOGO_DIREITOS.filter((item) => item.categoria_vida === categoria).length;
        return acc;
      },
      {} as Record<CategoriaVida, number>,
    );
  }, []);

  const itensFiltrados = useMemo(() => {
    const termo = termoBusca.toLowerCase().trim();

    return CATALOGO_DIREITOS.filter((item) => {
      const passaCategoria =
        categoriaSelecionada === 'todos' || item.categoria_vida === categoriaSelecionada;

      if (!passaCategoria) return false;
      if (!termo) return true;

      return (
        item.nome_popular.toLowerCase().includes(termo) ||
        item.criterios_elegibilidade.toLowerCase().includes(termo) ||
        item.motivo.toLowerCase().includes(termo) ||
        item.fonte_legal.toLowerCase().includes(termo) ||
        item.documentos_necessarios.some((doc) => doc.toLowerCase().includes(termo))
      );
    });
  }, [termoBusca, categoriaSelecionada]);

  return (
    <section className="space-y-8 animate-fade-in pb-12">
      <div className="gov-panel overflow-hidden">
        <div className="gov-ribbon" aria-hidden="true" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem]">
          <div className="p-6 md:p-8">
            <div className="gov-kicker">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 6.25v13m0-13C10.8 5.45 9.25 5 7.5 5S4.2 5.45 3 6.25v13C4.2 18.45 5.75 18 7.5 18s3.3.45 4.5 1.25m0-13C13.2 5.45 14.75 5 16.5 5s3.3.45 4.5 1.25v13C19.8 18.45 18.25 18 16.5 18s-3.3.45-4.5 1.25" />
              </svg>
              Catálogo de cidadania
            </div>
            <h2 className="mt-2 text-2xl font-black text-[#071D41] sm:text-3xl">
              Direitos e serviços públicos organizados para consulta rápida.
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
              Filtre por área da vida, procure por benefício ou lei e abra a ficha para ver critérios, documentos, canal de solicitação e roteiro prático.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="border-l-4 border-[#1351B4] bg-slate-50 p-4">
                <strong className="block text-2xl font-black text-[#071D41]">{CATALOGO_DIREITOS.length}</strong>
                <span className="text-xs font-semibold text-slate-600">itens cadastrados</span>
              </div>
              <div className="border-l-4 border-[#168821] bg-slate-50 p-4">
                <strong className="block text-2xl font-black text-[#071D41]">
                  {(Object.keys(ROTULOS_CATEGORIA) as CategoriaVida[]).length}
                </strong>
                <span className="text-xs font-semibold text-slate-600">áreas da vida</span>
              </div>
              <div className="border-l-4 border-[#FFCD07] bg-slate-50 p-4">
                <strong className="block text-2xl font-black text-[#071D41]">BR</strong>
                <span className="text-xs font-semibold text-slate-600">base federal e estadual</span>
              </div>
            </div>
          </div>

          <div className="catalog-hero-visual">
            <img
              src="/assets/secao-catalogo-direitos.png"
              alt="Atendimento público com documentos para acesso a direitos"
              className="gov-photo"
            />
            <div className="catalog-hero-visual__badge">
              <strong>Consulta por tema</strong>
              <span>Renda, família, saúde, trabalho e proteção.</span>
            </div>
          </div>
        </div>
      </div>

      <section className="service-strip" aria-label="Como usar o catálogo">
        <div>
          <span className="service-strip__number">1</span>
          <strong>Busque pelo problema</strong>
          <p>Use termos comuns como aluguel, remédio, dívida, desemprego ou creche.</p>
        </div>
        <div>
          <span className="service-strip__number">2</span>
          <strong>Filtre pela área da vida</strong>
          <p>Escolha família, PCD, idoso, trabalho, saúde mental, violência ou crédito.</p>
        </div>
        <div>
          <span className="service-strip__number">3</span>
          <strong>Abra a ficha completa</strong>
          <p>Veja documentos, canal provável, base legal e roteiro passo a passo.</p>
        </div>
      </section>

      <div className="gov-panel p-4 md:p-5">
        <label htmlFor="busca-direitos" className="text-sm font-black text-[#071D41]">
          Buscar no catálogo
        </label>
        <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="busca-direitos"
              type="text"
              value={termoBusca}
              onChange={(evento) => setTermoBusca(evento.target.value)}
              placeholder="Ex.: BPC, energia, maternidade, dívida, INSS, CAPS"
              className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 pl-12 pr-12 text-base text-slate-900 transition focus:border-[#1351B4] focus:outline-none focus:ring-4 focus:ring-[#1351B4]/10"
            />
            {termoBusca && (
              <button
                type="button"
                onClick={() => setTermoBusca('')}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded text-slate-500 hover:bg-slate-100"
                title="Limpar busca"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setTermoBusca('');
              setCategoriaSelecionada('todos');
            }}
            className="btn-gov-secondary"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => setCategoriaSelecionada('todos')}
          className={`rounded-lg border-2 p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-[#1351B4]/20 ${
            categoriaSelecionada === 'todos'
              ? 'border-[#1351B4] bg-[#1351B4] text-white'
              : 'border-slate-200 bg-white text-slate-700 hover:border-[#1351B4]'
          }`}
        >
          <span className="text-sm font-black">Todos os direitos</span>
          <span className="mt-1 block text-2xl font-black">{CATALOGO_DIREITOS.length}</span>
          <span className="text-xs">Lista completa de benefícios e serviços.</span>
        </button>

        {(Object.keys(ROTULOS_CATEGORIA) as CategoriaVida[]).map((categoria) => {
          const ativo = categoriaSelecionada === categoria;
          const cores = CATEGORIA_CORES[categoria];

          return (
            <button
              key={categoria}
              type="button"
              onClick={() => setCategoriaSelecionada(categoria)}
              className={`rounded-lg border-2 p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-[#1351B4]/20 ${
                ativo
                  ? `border-[#1351B4] bg-[#1351B4] text-white`
                  : `${cores.borda} ${cores.fundo} ${cores.texto} hover:bg-white`
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-black">
                <IconeCategoriaSVG categoria={categoria} />
                {ROTULOS_CATEGORIA[categoria]}
              </span>
              <span className="mt-2 block text-2xl font-black">{totaisPorCategoria[categoria]}</span>
              <span className={`text-xs leading-relaxed ${ativo ? 'text-blue-50' : 'text-slate-600'}`}>
                {CATEGORIA_RESUMO[categoria]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-[#071D41]">
            {itensFiltrados.length} resultado{itensFiltrados.length === 1 ? '' : 's'} encontrado{itensFiltrados.length === 1 ? '' : 's'}
          </h3>
          <p className="text-sm text-slate-600">
            {categoriaSelecionada === 'todos'
              ? 'Exibindo todo o catálogo.'
              : `Área selecionada: ${ROTULOS_CATEGORIA[categoriaSelecionada]}.`}
          </p>
        </div>
      </div>

      {itensFiltrados.length === 0 ? (
        <div className="gov-panel p-10 text-center">
          <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.17 16.17a4 4 0 015.66 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-black text-[#071D41]">Nenhum direito encontrado</h3>
          <p className="mt-1 text-sm text-slate-600">
            Tente termos mais gerais como benefício, saúde, renda, família, INSS ou Defensoria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {itensFiltrados.map((item) => {
            const cores = CATEGORIA_CORES[item.categoria_vida];

            return (
              <article key={item.id} className="gov-panel overflow-hidden">
                <div className={`border-t-4 ${cores.borda}`} />
                <div className="flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${cores.fundo} ${cores.texto}`}>
                        <IconeCategoriaSVG categoria={item.categoria_vida} />
                        {ROTULOS_CATEGORIA[item.categoria_vida]}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                        {item.natureza === 'servico' ? 'Serviço gratuito' : 'Benefício social'}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-black leading-snug text-[#071D41]">{item.nome_popular}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.motivo}</p>

                    <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="bg-slate-50 p-3">
                        <dt className="text-[11px] font-black uppercase tracking-wide text-slate-500">Canal</dt>
                        <dd className="mt-1 text-xs font-bold text-[#071D41]">{rotuloCanal(item.canal_solicitacao.tipo)}</dd>
                      </div>
                      <div className="bg-slate-50 p-3">
                        <dt className="text-[11px] font-black uppercase tracking-wide text-slate-500">Abrangência</dt>
                        <dd className="mt-1 text-xs font-bold text-[#071D41]">
                          {item.abrangencia === 'federal' ? 'Federal' : 'Estadual/municipal'}
                        </dd>
                      </div>
                      <div className="bg-slate-50 p-3">
                        <dt className="text-[11px] font-black uppercase tracking-wide text-slate-500">Revisão</dt>
                        <dd className="mt-1 text-xs font-bold text-[#071D41]">{formatarData(item.ultima_revisao)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setItemModal(item)}
                      className="btn-gov-secondary flex-1 px-4 py-2.5 text-sm"
                    >
                      Ver ficha
                    </button>
                    <button
                      type="button"
                      onClick={() => aoSelecionarDireitoParaChat(item)}
                      className="btn-gov-primary flex-1 px-4 py-2.5 text-sm"
                    >
                      Testar na triagem
                      <svg className="h-4 w-4 text-[#FFCD07]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {itemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl">
            <div className="gov-ribbon" aria-hidden="true" />
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white p-5">
              <div>
                <span className="gov-kicker">
                  <IconeCategoriaSVG categoria={itemModal.categoria_vida} />
                  {ROTULOS_CATEGORIA[itemModal.categoria_vida]}
                </span>
                <h3 className="mt-1 text-xl font-black leading-snug text-[#071D41]">{itemModal.nome_popular}</h3>
              </div>
              <button
                type="button"
                onClick={() => setItemModal(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-slate-300 text-slate-600 transition hover:bg-slate-100"
                title="Fechar ficha"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 p-5 md:p-7">
              <section className="rounded-lg border border-blue-100 bg-blue-50 p-5">
                <h4 className="text-base font-black text-[#1351B4]">Quem tem direito</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-800">{itemModal.criterios_elegibilidade}</p>
              </section>

              <section>
                <h4 className="text-base font-black text-[#071D41]">Documentos para ter em mãos</h4>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {itemModal.documentos_necessarios.map((doc) => (
                    <li key={doc} className="flex items-start gap-2 border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#168821]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                      </svg>
                      {doc}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="grid grid-cols-1 gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <h4 className="text-base font-black text-[#071D41]">Onde pedir</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{itemModal.canal_solicitacao.detalhe}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <h4 className="text-base font-black text-[#071D41]">Base legal</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{itemModal.fonte_legal}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Revisado em {formatarData(itemModal.ultima_revisao)} ·{' '}
                    {itemModal.abrangencia === 'federal' ? 'Federal' : 'Estadual ou municipal'}
                  </p>
                </div>
              </section>

              <section>
                <h4 className="text-base font-black text-[#071D41]">Roteiro passo a passo</h4>
                <ol className="mt-3 space-y-3">
                  {itemModal.passo_a_passo.map((passo, indice) => (
                    <li key={passo} className="flex gap-3 text-sm leading-relaxed text-slate-800">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#1351B4] text-xs font-black text-white">
                        {indice + 1}
                      </span>
                      <span className="pt-1">{passo}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <div className="sticky bottom-0 flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setItemModal(null)}
                className="btn-gov-secondary px-5 py-3"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  const item = itemModal;
                  setItemModal(null);
                  aoSelecionarDireitoParaChat(item);
                }}
                className="btn-gov-primary px-5 py-3"
              >
                Iniciar triagem para este direito
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
