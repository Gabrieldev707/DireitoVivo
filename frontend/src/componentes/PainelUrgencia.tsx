import type { RespostaTriagem } from '../tipos';

type RespostaUrgencia = Extract<RespostaTriagem, { tipo: 'urgencia' }>;

interface PropriedadesPainelUrgencia {
  resposta: RespostaUrgencia;
  aoSair: () => void;
}

export function PainelUrgencia({ resposta, aoSair }: PropriedadesPainelUrgencia) {
  return (
    <section role="alert" className="mx-auto max-w-3xl animate-fade-in rounded-2xl border-4 border-red-600 bg-white p-6 shadow-xl sm:p-8">
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-800">
        Prioridade: agora
      </span>
      <h2 className="mt-4 text-3xl font-black text-red-800">Ajuda imediata</h2>
      <p className="mt-4 text-lg font-bold leading-relaxed text-slate-900">{resposta.mensagem}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        Se puder, vá para um local seguro. Não confronte uma pessoa agressora. Este painel não substitui o atendimento de emergência.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {resposta.canais.map((canal) => (
          <article key={canal.numero} className="rounded-xl border-2 border-red-200 bg-red-50 p-5">
            <h3 className="font-black text-slate-900">{canal.nome}</h3>
            <p className="mt-2 text-sm text-slate-700">{canal.quando_usar}</p>
            <a
              href={`tel:${canal.numero}`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-red-700 px-5 py-3 text-lg font-black text-white"
            >
              Ligar {canal.numero}
            </a>
          </article>
        ))}
      </div>
      <button type="button" onClick={aoSair} className="mt-6 w-full rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-700">
        Voltar ao início
      </button>
    </section>
  );
}
