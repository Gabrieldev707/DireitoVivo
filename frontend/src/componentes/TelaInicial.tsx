import { TEXTO_DISCLAIMER } from '../tipos';

// RF06: disclaimer claro ANTES da triagem, não escondido em rodapé.
export function TelaInicial({ aoComecar }: { aoComecar: () => void }) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h2 className="text-2xl font-bold leading-snug">
          Existem benefícios e direitos que provavelmente são seus — e você nem sabe.
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-stone-700">
          Em uma conversa rápida e <strong>anônima</strong>, a gente descobre juntos o que pode se
          aplicar à sua vida e te mostra o caminho, passo a passo, para pedir.
        </p>
        <ul className="mt-4 space-y-2 text-stone-700">
          <li>✅ Não pedimos nome, CPF, RG nem endereço.</li>
          <li>✅ Nada do que você contar fica guardado.</li>
          <li>✅ Gratuito, para todo o Brasil.</li>
        </ul>
      </div>

      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5" role="note">
        <h3 className="font-bold text-amber-900">Antes de começar, é importante saber:</h3>
        <p className="mt-2 leading-relaxed text-amber-900">{TEXTO_DISCLAIMER}</p>
      </div>

      <button
        type="button"
        onClick={aoComecar}
        className="w-full rounded-2xl bg-emerald-700 px-6 py-4 text-lg font-bold text-white shadow-md transition hover:bg-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
      >
        Entendi, quero começar
      </button>
    </section>
  );
}
