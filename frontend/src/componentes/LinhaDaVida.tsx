import type { ItemLinhaDaVida, RespostaTriagem } from '../tipos';
import { TEXTO_DISCLAIMER } from '../tipos';
import { FichaItem } from './FichaItem';

type Resultado = Extract<RespostaTriagem, { tipo: 'resultado' | 'sem_match' }>;

// RF04: resultado como sequência priorizada ("comece por aqui"), nunca lista solta.
export function LinhaDaVida({ resultado, aoRecomecar }: { resultado: Resultado; aoRecomecar: () => void }) {
  const itens: ItemLinhaDaVida[] = resultado.tipo === 'resultado' ? resultado.itens : [];

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h2 className="text-xl font-bold text-emerald-800">
          {itens.length > 0 ? 'O que encontramos para você' : 'Não encontramos um item específico'}
        </h2>
        <p className="mt-2 whitespace-pre-wrap text-lg leading-relaxed text-stone-700">
          {resultado.mensagem}
        </p>
      </div>

      {itens.length > 0 && (
        <>
          <p className="text-stone-700">
            <strong>Sua linha de vida:</strong> siga na ordem — o número 1 é o mais urgente ou mais
            fácil de conseguir agora. Toque em cada um para ver o passo a passo completo.
          </p>
          <ol className="space-y-4">
            {itens.map((item) => (
              <li key={item.id} className="relative">
                <FichaItem item={item} />
              </li>
            ))}
          </ol>
        </>
      )}

      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5" role="note">
        <p className="leading-relaxed text-amber-900">
          <strong>Lembrete:</strong> {TEXTO_DISCLAIMER}
        </p>
        <p className="mt-2 leading-relaxed text-amber-900">
          Em caso de dúvida, o CRAS da sua cidade e a Defensoria Pública atendem de graça.
        </p>
      </div>

      <button
        type="button"
        onClick={aoRecomecar}
        className="w-full rounded-2xl border-2 border-emerald-700 px-6 py-4 text-lg font-bold text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
      >
        Fazer uma nova triagem
      </button>
    </section>
  );
}
