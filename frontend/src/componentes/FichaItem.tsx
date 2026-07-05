import { ROTULOS_CATEGORIA, type ItemLinhaDaVida } from '../tipos';

// Helper 100% SVG para ícones de categoria (SEM EMOJI)
function IconeCategoriaSVG({ categoria }: { categoria: string }) {
  switch (categoria) {
    case 'familia_crianca':
      return (
        <svg className="h-4 w-4 text-[#1351B4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'idoso':
      return (
        <svg className="h-4 w-4 text-[#1351B4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'pcd':
      return (
        <svg className="h-4 w-4 text-[#1351B4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case 'saude_mental':
      return (
        <svg className="h-4 w-4 text-[#1351B4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case 'trabalho_acidente':
      return (
        <svg className="h-4 w-4 text-[#1351B4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'situacao_rua':
      return (
        <svg className="h-4 w-4 text-[#1351B4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case 'violencia_domestica':
      return (
        <svg className="h-4 w-4 text-[#1351B4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'divida_credito':
      return (
        <svg className="h-4 w-4 text-[#1351B4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg className="h-4 w-4 text-[#1351B4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

// RF05: ficha completa por item, expansível dentro da linha de vida (100% SVG - Sem Emoji)
export function FichaItem({ item }: { item: ItemLinhaDaVida }) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition open:border-[#1351B4] open:shadow-md">
      {/* Cabeçalho do Card (Summary) */}
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-6 [&::-webkit-details-marker]:hidden">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Tag Categoria */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              <IconeCategoriaSVG categoria={item.categoria_vida} />
              <span>{ROTULOS_CATEGORIA[item.categoria_vida] ?? item.categoria_vida}</span>
            </span>

            {/* Tag Natureza (Benefício ou Serviço) */}
            <span
              className={
                'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ' +
                (item.natureza === 'servico'
                  ? 'bg-sky-100 text-sky-900'
                  : 'bg-emerald-100 text-emerald-900')
              }
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>{item.natureza === 'servico' ? 'Serviço Gratuito' : 'Benefício Social'}</span>
            </span>

            {/* Tag Abrangência */}
            {item.abrangencia === 'estadual_variavel' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                <span>Varia por Estado/Cidade</span>
              </span>
            )}
          </div>

          <h3 className="text-xl font-black text-[#071D41] sm:text-2xl">
            {item.nome_popular}
          </h3>

          {item.motivo && (
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              {item.motivo}
            </p>
          )}
        </div>

        {/* Indicador Seta SVG para Expandir */}
        <div className="flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-400 transition group-open:bg-[#1351B4] group-open:text-white group-open:rotate-180">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </summary>

      {/* Conteúdo Expansível (Ficha Técnica Completa DSGOV - 100% SVG) */}
      <div className="space-y-6 border-t border-slate-200 bg-slate-50/50 p-6 sm:p-8">
        {/* 1. Quem Tem Direito */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
          <div className="flex items-center gap-2 font-bold text-[#1351B4]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h4 className="text-base">Quem tem direito (Requisitos de Elegibilidade)</h4>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-800">
            {item.criterios_elegibilidade}
          </p>
        </div>

        {/* 2. Documentos Necessários */}
        <div>
          <div className="flex items-center gap-2 font-bold text-[#071D41]">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 className="text-base">Documentos Para Ter Em Mãos</h4>
          </div>
          <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {item.documentos_necessarios.map((documento) => (
              <li
                key={documento}
                className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3 text-xs font-medium text-slate-700 shadow-2xs"
              >
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{documento}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Onde e Como Pedir */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 font-bold text-[#071D41]">
            <svg className="h-5 w-5 text-[#1351B4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h4 className="text-base">Onde Pedir ({item.canal_solicitacao.tipo.toUpperCase()})</h4>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {item.canal_solicitacao.detalhe}
          </p>
        </div>

        {/* 4. Passo a Passo */}
        <div>
          <div className="flex items-center gap-2 font-bold text-[#071D41]">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h4 className="text-base">Roteiro Passo a Passo</h4>
          </div>
          <ol className="mt-3 space-y-3">
            {item.passo_a_passo.map((passo, idx) => (
              <li key={passo} className="flex items-start gap-3 text-sm text-slate-800">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1351B4] text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{passo}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 5. Base Legal */}
        <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>
            <strong>Base Legal:</strong> {item.fonte_legal}
          </span>
          <span>
            Revisado em {new Date(item.ultima_revisao + 'T00:00:00').toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </details>
  );
}
