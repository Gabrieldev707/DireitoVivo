import { CANAIS_AJUDA, type CanalAjuda } from '../dados/canaisAjuda';

function ListaCanais({ canais }: { canais: CanalAjuda[] }) {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      {canais.map((canal) => (
        <article key={canal.id} className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-bold text-[#173044]">{canal.titulo}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{canal.quando_usar}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {canal.numero && <a className="btn-gov-primary min-h-11" href={`tel:${canal.numero}`}>{canal.acao}</a>}
            <a className="text-sm font-bold text-[#1351B4] underline underline-offset-4" href={canal.url_oficial} target="_blank" rel="noopener noreferrer">Ver informação oficial sobre {canal.titulo}</a>
          </div>
        </article>
      ))}
    </div>
  );
}

export function Ajuda() {
  return (
    <div className="space-y-10 pb-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold text-[#173044] sm:text-4xl">Encontre ajuda para o próximo passo</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-700">Você pode procurar atendimento humano mesmo sem usar a conversa com IA. Escolha o canal conforme a situação.</p>
      </header>
      <section role="region" aria-labelledby="ajuda-imediata" className="rounded-2xl border-l-4 border-red-700 bg-red-50 p-5 sm:p-7">
        <h2 id="ajuda-imediata" className="text-2xl font-bold text-red-950">Perigo imediato</h2>
        <p className="mt-2 text-sm text-red-950">Se há risco agora, procure um serviço de emergência. Não espere pela triagem digital.</p>
        <ListaCanais canais={CANAIS_AJUDA.filter((canal) => canal.nivel === 'imediato')} />
      </section>
      <section role="region" aria-labelledby="ajuda-orientacao">
        <h2 id="ajuda-orientacao" className="text-2xl font-bold text-[#173044]">Orientação e denúncia</h2>
        <ListaCanais canais={CANAIS_AJUDA.filter((canal) => canal.nivel === 'orientacao')} />
      </section>
      <section role="region" aria-labelledby="ajuda-assistencia">
        <h2 id="ajuda-assistencia" className="text-2xl font-bold text-[#173044]">Assistência social e serviços</h2>
        <ListaCanais canais={CANAIS_AJUDA.filter((canal) => canal.nivel === 'assistencia')} />
      </section>
      <section aria-labelledby="duvidas-ajuda" className="max-w-3xl border-t border-slate-200 pt-8">
        <h2 id="duvidas-ajuda" className="text-2xl font-bold text-[#173044]">Dúvidas frequentes</h2>
        <div className="mt-4 space-y-3">
          <details className="rounded-lg border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-bold">Preciso de documentos para usar o site?</summary><p className="mt-3 text-sm leading-relaxed">Não. O catálogo e os canais de ajuda podem ser consultados sem cadastro. O órgão responsável pode pedir documentos para um atendimento ou pedido oficial.</p></details>
          <details className="rounded-lg border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-bold">O que acontece com meu relato na conversa?</summary><p className="mt-3 text-sm leading-relaxed">O Direito Vivo não guarda o histórico em seu banco. O texto enviado é processado por um provedor externo de IA. Não informe dados pessoais.</p></details>
          <details className="rounded-lg border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-bold">A resposta confirma meu direito?</summary><p className="mt-3 text-sm leading-relaxed">Não. Ela ajuda a organizar possibilidades. Confirme requisitos e próximos passos no canal oficial indicado.</p></details>
        </div>
      </section>
    </div>
  );
}
