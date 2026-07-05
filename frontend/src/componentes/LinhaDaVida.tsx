import type { ItemLinhaDaVida, RespostaTriagem } from '../tipos';
import { TEXTO_DISCLAIMER } from '../tipos';
import { FichaItem } from './FichaItem';

type Resultado = Extract<RespostaTriagem, { tipo: 'resultado' | 'sem_match' }>;

interface PropriedadesLinhaDaVida {
  resultado: Resultado;
  aoRecomecar: () => void;
  aoVerCatalogo: () => void;
}

// RF04: resultado como sequência priorizada + Linha do Tempo Gov.br (100% SVG - Sem Emoji)
export function LinhaDaVida({ resultado, aoRecomecar, aoVerCatalogo }: PropriedadesLinhaDaVida) {
  const itens: ItemLinhaDaVida[] = resultado.tipo === 'resultado' ? resultado.itens : [];

  function imprimirPlano() {
    window.print();
  }

  return (
    <section className="space-y-8 animate-fade-in pb-12">
      {/* 1. Cabeçalho de Resultado / Plano de Ação Cidadã */}
      <div className="gov-panel p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-900">
              {/* Ícone SVG Check */}
              <svg className="h-4 w-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Plano de Ação Cidadã • Linha de Vida Gov.br</span>
            </div>
            <h2 className="text-2xl font-black text-[#071D41] sm:text-3xl">
              {itens.length > 0 ? 'Seus Direitos e Benefícios Encontrados' : 'Nenhum Item Específico Encontrado'}
            </h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700 sm:text-lg">
              {resultado.mensagem}
            </p>
          </div>

          {/* Botão de Imprimir / Salvar PDF (100% SVG - Sem Emoji) */}
          <div className="flex shrink-0 flex-col gap-2">
            <button
              type="button"
              onClick={imprimirPlano}
              className="btn-gov-primary px-5 py-3 text-sm print:hidden"
            >
              {/* Ícone SVG Impressora */}
              <svg className="h-5 w-5 text-[#FFCD07]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Imprimir / Salvar em PDF</span>
            </button>
            <span className="text-center text-[11px] text-slate-500 print:hidden">
              Guarde seu comprovante para levar ao CRAS
            </span>
          </div>
        </div>
      </div>

      {/* 2. Timeline Priorizada dos Direitos (100% SVG) */}
      {itens.length > 0 && (
        <div className="space-y-6">
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm font-medium text-blue-950">
            <div className="flex items-center gap-2 font-bold text-[#1351B4]">
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Ordem de Prioridade Recomendada pela Inteligência Artificial:</span>
            </div>
            <p className="mt-1 pl-7 text-xs sm:text-sm">
              Siga a ordem numérica abaixo. O item número 1 representa o direito mais urgente, de maior impacto financeiro ou de aprovação mais rápida para o seu momento de vida. Clique na seta para expandir cada ficha.
            </p>
          </div>

          <ol className="relative space-y-6 before:absolute before:left-6 before:top-6 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-slate-300 md:before:left-8">
            {itens.map((item) => (
              <li key={item.id} className="relative pl-12 md:pl-16">
                {/* Indicador Numérico na Linha da Timeline */}
                <div className="absolute left-3 top-6 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#1351B4] text-xs font-black text-white ring-4 ring-white shadow-md md:left-4 md:h-8 md:w-8 md:text-sm">
                  {item.posicao}
                </div>

                <FichaItem item={item} />
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 3. Card de Rede de Apoio e Canais Oficiais */}
      <div className="gov-panel bg-slate-50 p-6 md:p-8">
        <h3 className="font-bold text-lg text-[#071D41]">
          Rede de Apoio Cidadão — Onde Buscar Ajuda Presencial Gratuita
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Você não está sozinho. Se precisar de ajuda para emitir documentos ou dar entrada nos pedidos, procure os órgãos abaixo:
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <strong className="block text-sm font-bold text-[#1351B4]">CRAS</strong>
            <span className="mt-1 block text-xs text-slate-600">Centro de Referência de Assistência Social do seu bairro para CadÚnico.</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <strong className="block text-sm font-bold text-[#1351B4]">Defensoria Pública</strong>
            <span className="mt-1 block text-xs text-slate-600">Advogados gratuitos do Estado para ações judiciais e revisão de dívidas.</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <strong className="block text-sm font-bold text-[#1351B4]">INSS (Ligue 135)</strong>
            <span className="mt-1 block text-xs text-slate-600">Central telefônica gratuita para agendar perícias, BPC e salário-maternidade.</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <strong className="block text-sm font-bold text-[#1351B4]">Disque 100 / 180</strong>
            <span className="mt-1 block text-xs text-slate-600">Denúncia de violações de direitos humanos e violência contra a mulher.</span>
          </div>
        </div>
      </div>

      {/* 4. Aviso Legal (RF06 - 100% SVG) */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-6 shadow-sm" role="note">
        <div className="flex items-start gap-3">
          <svg className="h-6 w-6 shrink-0 text-amber-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="leading-relaxed text-amber-900 font-bold">
              Lembrete Legal (RF06):
            </p>
            <p className="mt-1 text-sm text-amber-900 leading-relaxed">
              {TEXTO_DISCLAIMER}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Botões de Rodapé (100% SVG) */}
      <div className="flex flex-col gap-4 sm:flex-row print:hidden">
        <button
          type="button"
          onClick={aoRecomecar}
            className="btn-gov-primary flex-1 px-6 py-4 text-base"
        >
          Fazer Uma Nova Triagem com IA
        </button>
        <button
          type="button"
          onClick={aoVerCatalogo}
            className="btn-gov-secondary flex-1 px-6 py-4 text-base"
        >
          Explorar Catálogo de 14+ Direitos
        </button>
      </div>
    </section>
  );
}
