import { useState } from 'react';
import type { ItemLinhaDaVida, RespostaTriagem } from '../tipos';
import { TEXTO_DISCLAIMER } from '../tipos';
import { FichaItem } from './FichaItem';

type Resultado = Extract<RespostaTriagem, { tipo: 'resultado' | 'sem_match' }>;

interface PropriedadesLinhaDaVida {
  resultado: Resultado;
  aoRecomecar: () => void;
  aoVerCatalogo: () => void;
}

function montarTextoCompartilhamento(itens: ItemLinhaDaVida[]): string {
  if (itens.length === 0) {
    return 'Consultei orientações sobre direitos no Direito Vivo, um projeto independente.';
  }
  const lista = itens
    .slice(0, 5)
    .map((item, i) => `${i + 1}. ${item.nome_popular}`)
    .join('\n');
  return `Orientações do Direito Vivo:\n\n${lista}\n\nProjeto independente. Confirme critérios e próximos passos no canal oficial.`;
}

export function LinhaDaVida({ resultado, aoRecomecar, aoVerCatalogo }: PropriedadesLinhaDaVida) {
  const itens: ItemLinhaDaVida[] = resultado.tipo === 'resultado' ? resultado.itens : [];
  const [estadoShare, setEstadoShare] = useState<'inicial' | 'copiado' | 'erro'>('inicial');

  function imprimirPlano() {
    window.print();
  }

  async function compartilhar() {
    const texto = montarTextoCompartilhamento(itens);
    const url = window.location.origin + '/';
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Direito Vivo — minha linha de vida',
          text: texto,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(`${texto}\n\n${url}`);
      setEstadoShare('copiado');
      setTimeout(() => setEstadoShare('inicial'), 2400);
    } catch (excecao) {
      if ((excecao as { name?: string }).name === 'AbortError') return;
      setEstadoShare('erro');
      setTimeout(() => setEstadoShare('inicial'), 2400);
    }
  }

  return (
    <section className="space-y-8 pb-12">
      <div className="gov-panel p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-900">
              <svg className="h-4 w-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Orientações para sua situação</span>
            </div>
            <h1 className="text-2xl font-black text-[#071D41] sm:text-3xl">
              {itens.length > 0
                ? 'Veja estas orientações e confirme cada passo'
                : 'Não encontrei um item específico para o que você contou'}
            </h1>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700 sm:text-lg">
              {resultado.mensagem}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 print:hidden">
            <button
              type="button"
              onClick={compartilhar}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#075e54] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#064942] focus:outline-none focus:ring-4 focus:ring-[#075e54]/25 active:translate-y-0"
              title="Compartilhar minha linha de vida"
              aria-live="polite"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4m0 0L8 6m4-4v14" />
              </svg>
              {estadoShare === 'copiado'
                ? 'Copiado!'
                : estadoShare === 'erro'
                  ? 'Tente de novo'
                  : 'Compartilhar'}
            </button>
            <button
              type="button"
              onClick={imprimirPlano}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 active:translate-y-0"
            >
              <svg className="h-5 w-5 text-[#075e54]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Imprimir / PDF</span>
            </button>
            <span className="text-center text-[11px] text-slate-500">
              O compartilhamento inclui nomes de direitos, sem seu relato.
            </span>
          </div>
        </div>
      </div>

      {itens.length > 0 && (
        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm font-medium text-emerald-950">
            <div className="flex items-center gap-2 font-bold text-[#075e54]">
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Ordem sugerida para consulta</span>
            </div>
            <p className="mt-1 pl-7 text-xs sm:text-sm">
              Esta ordem é uma orientação, não uma decisão de elegibilidade. Abra cada ficha para consultar critérios, documentos e passos.
            </p>
          </div>

          <ol className="relative space-y-6 before:absolute before:left-6 before:top-6 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-slate-300 md:before:left-8">
            {itens.map((item) => (
              <li key={item.id} className="relative pl-12 md:pl-16">
                <div className="absolute left-3 top-6 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#075e54] text-xs font-black text-white ring-4 ring-white shadow-md md:left-4 md:h-8 md:w-8 md:text-sm">
                  {item.posicao}
                </div>
                <FichaItem item={item} />
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="gov-panel bg-slate-50 p-6 md:p-8">
        <h3 className="font-bold text-lg text-[#071D41]">
          Onde tirar dúvidas presencialmente e de graça
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Se travar em algum passo, procure diretamente um destes órgãos — todos são gratuitos e atendem sem agendamento em muitas cidades.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <strong className="block text-sm font-bold text-[#075e54]">CRAS</strong>
            <span className="mt-1 block text-xs text-slate-600">CadÚnico, Bolsa Família e assistência social do seu bairro.</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <strong className="block text-sm font-bold text-[#075e54]">Defensoria Pública</strong>
            <span className="mt-1 block text-xs text-slate-600">Orientação jurídica gratuita: dívida, família, consumidor.</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <strong className="block text-sm font-bold text-[#075e54]">INSS — 135</strong>
            <span className="mt-1 block text-xs text-slate-600">BPC, salário-maternidade, incapacidade e perícias.</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <strong className="block text-sm font-bold text-[#075e54]">Disque 100 / 180</strong>
            <span className="mt-1 block text-xs text-slate-600">Denúncia de violações de direitos e violência contra a mulher.</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-6 shadow-sm" role="note">
        <div className="flex items-start gap-3">
          <svg className="h-6 w-6 shrink-0 text-amber-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="leading-relaxed text-amber-900 font-bold">Lembrete importante</p>
            <p className="mt-1 text-sm text-amber-900 leading-relaxed">{TEXTO_DISCLAIMER}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row print:hidden">
        <button
          type="button"
          onClick={aoRecomecar}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#075e54] px-6 py-4 text-base font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#064942] focus:outline-none focus:ring-4 focus:ring-[#075e54]/25"
        >
          Fazer nova triagem
        </button>
        <button
          type="button"
          onClick={aoVerCatalogo}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#075e54] bg-white px-6 py-4 text-base font-black text-[#075e54] shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-[#075e54]/20"
        >
          Explorar catálogo completo
        </button>
      </div>
    </section>
  );
}
