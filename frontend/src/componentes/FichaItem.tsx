import { ROTULOS_CATEGORIA, type ItemLinhaDaVida } from '../tipos';

// RF05: ficha completa por item, expansível dentro da linha de vida.
export function FichaItem({ item }: { item: ItemLinhaDaVida }) {
  return (
    <details className="group rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 open:ring-emerald-300">
      <summary className="flex cursor-pointer list-none items-start gap-4 p-5 [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-lg font-bold text-white"
        >
          {item.posicao}
        </span>
        <span className="flex-1">
          <span className="block text-lg font-bold leading-snug">{item.nome_popular}</span>
          {item.motivo && <span className="mt-1 block text-stone-600">{item.motivo}</span>}
          <span className="mt-2 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
              {ROTULOS_CATEGORIA[item.categoria_vida] ?? item.categoria_vida}
            </span>
            <span
              className={
                'rounded-full px-3 py-1 ' +
                (item.natureza === 'servico'
                  ? 'bg-sky-100 text-sky-900'
                  : 'bg-emerald-100 text-emerald-900')
              }
            >
              {item.natureza === 'servico' ? 'Serviço gratuito — é só ir' : 'Benefício — tem pedido'}
            </span>
            {item.abrangencia === 'estadual_variavel' && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900">
                Varia por estado/cidade
              </span>
            )}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="mt-1 text-stone-400 transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>

      <div className="space-y-4 border-t border-stone-100 p-5 pt-4 leading-relaxed text-stone-800">
        <div>
          <h3 className="font-bold text-emerald-900">Quem tem direito</h3>
          <p className="mt-1">{item.criterios_elegibilidade}</p>
        </div>
        <div>
          <h3 className="font-bold text-emerald-900">Documentos para ter em mãos</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {item.documentos_necessarios.map((documento) => (
              <li key={documento}>{documento}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-emerald-900">Onde pedir</h3>
          <p className="mt-1">{item.canal_solicitacao.detalhe}</p>
        </div>
        <div>
          <h3 className="font-bold text-emerald-900">Passo a passo</h3>
          <ol className="mt-1 list-decimal space-y-2 pl-5">
            {item.passo_a_passo.map((passo) => (
              <li key={passo}>{passo}</li>
            ))}
          </ol>
        </div>
        <p className="border-t border-stone-100 pt-3 text-sm text-stone-500">
          Base legal: {item.fonte_legal} · Informação revisada em{' '}
          {new Date(item.ultima_revisao + 'T00:00:00').toLocaleDateString('pt-BR')}
        </p>
      </div>
    </details>
  );
}
