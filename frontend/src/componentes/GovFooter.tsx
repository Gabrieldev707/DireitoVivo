import { TEXTO_DISCLAIMER } from '../tipos';
import type { Pagina } from '../navegacao';
import { SimboloDireitoVivo } from './MarcaDireitoVivo';
import { CANAIS_AJUDA } from '../dados/canaisAjuda';

interface PropriedadesGovFooter {
  aoMudarAba?: (aba: Pagina) => void;
}

const PRINCIPIOS = [
  'Sem conta',
  'Gratuito',
  'Sem cadastro',
  'Código aberto',
];

export function GovFooter({ aoMudarAba }: PropriedadesGovFooter) {
  return (
    <footer className="footer-brasil relative mt-16 overflow-hidden border-t border-[#0a5f55] bg-[#064942] text-white">
      <div className="gov-ribbon" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <SimboloDireitoVivo tamanho={56} className="shrink-0" />
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  Direito<span className="text-[#25d366]">Vivo</span>
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-emerald-50">
                  Uma camada de orientação cidadã para organizar direitos, documentos e próximos passos antes do atendimento oficial.
                </p>
              </div>
            </div>

            <div className="footer-history" aria-label="Princípios do projeto">
              {PRINCIPIOS.map((principio) => (
                <span key={principio}>{principio}</span>
              ))}
            </div>

            <div className="rounded-lg border-2 border-[#25d366]/40 bg-[#25d366]/10 p-4 text-xs leading-relaxed text-emerald-50 backdrop-blur">
              <strong className="block text-white">
                Projeto independente, sem vínculo com o Governo Federal.
              </strong>
              <span className="mt-1 block">
                O Direito Vivo não é um canal oficial, não recebe pedidos de benefício e não
                consulta sistemas públicos. {TEXTO_DISCLAIMER}
              </span>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-[#FFCD07]">Navegação</h3>
              <ul className="mt-4 space-y-2 text-sm text-blue-100">
                <li>
                  <button type="button" onClick={() => aoMudarAba?.('inicio')} className="footer-link">
                    Início e serviços para você
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => aoMudarAba?.('direitos')} className="footer-link">
                    Catálogo de direitos
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => aoMudarAba?.('situacoes')} className="footer-link">
                    Cenários de vida
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => aoMudarAba?.('conversa')} className="footer-link">
                    Conversa guiada
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => aoMudarAba?.('ajuda')} className="footer-link">
                    Ajuda e canais humanos
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-[#FFCD07]">Canais úteis</h3>
              <ul className="mt-4 space-y-3">
                {CANAIS_AJUDA.map((canal) => (
                  <li key={canal.id} className="rounded border border-white/10 bg-white/6 p-3">
                    <strong className="block text-sm text-white">{canal.titulo}{canal.numero ? `: ${canal.numero}` : ''}</strong>
                    <span className="mt-1 block text-xs leading-relaxed text-blue-100">{canal.quando_usar}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6 text-[11px] leading-relaxed text-blue-100 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 Direito Vivo. Conteúdo informativo, sem vínculo oficial com processo administrativo ou decisão de benefício.
          </p>
          <div className="flex flex-wrap gap-2 font-black uppercase tracking-wide">
            <span className="rounded bg-white/10 px-3 py-1">Acessibilidade</span>
            <span className="rounded bg-white/10 px-3 py-1">Transparência</span>
            <span className="rounded bg-white/10 px-3 py-1">Privacidade</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
