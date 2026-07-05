import { TEXTO_DISCLAIMER } from '../tipos';
import type { AbaNavegacao } from './GovHeader';

interface PropriedadesGovFooter {
  aoMudarAba?: (aba: AbaNavegacao) => void;
}

const MARCOS_BRASIL = [
  'Independência',
  'República',
  'Constituição de 1988',
  'Acesso à Informação',
];

const CANAIS = [
  { nome: 'Central INSS', valor: '135', detalhe: 'Benefícios previdenciários e assistenciais.' },
  { nome: 'Direitos Humanos', valor: 'Disque 100', detalhe: 'Violações de direitos e proteção social.' },
  { nome: 'Central da Mulher', valor: 'Ligue 180', detalhe: 'Violência doméstica e orientação.' },
  { nome: 'Emergência', valor: '190 / 192', detalhe: 'Risco imediato ou urgência médica.' },
];

export function GovFooter({ aoMudarAba }: PropriedadesGovFooter) {
  return (
    <footer className="footer-brasil relative mt-16 overflow-hidden border-t border-[#0b3471] bg-[#071D41] text-white">
      <img
        src="/assets/brasao-republica.png"
        alt=""
        aria-hidden="true"
        className="footer-brasil__watermark"
      />
      <div className="gov-ribbon" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="inline-flex w-fit rounded bg-white px-3 py-2 shadow-sm">
                <img
                  src="/assets/govbr-logo-oficial.webp"
                  alt="gov.br"
                  className="gov-logo-img h-9 w-auto object-contain"
                />
              </span>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Direito Vivo</h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-blue-100">
                  Uma camada de orientação cidadã para organizar direitos, documentos e próximos passos antes do atendimento oficial.
                </p>
              </div>
            </div>

            <div className="footer-history" aria-label="Referências históricas e institucionais do Brasil">
              {MARCOS_BRASIL.map((marco) => (
                <span key={marco}>{marco}</span>
              ))}
            </div>

            <div className="rounded-lg border border-white/15 bg-white/8 p-4 text-xs leading-relaxed text-blue-50 backdrop-blur">
              <strong className="text-white">Aviso legal:</strong> {TEXTO_DISCLAIMER}
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
                  <button type="button" onClick={() => aoMudarAba?.('catalogo')} className="footer-link">
                    Catálogo de direitos
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => aoMudarAba?.('cenarios')} className="footer-link">
                    Cenários de vida
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => aoMudarAba?.('chat')} className="footer-link">
                    Triagem anônima
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-[#FFCD07]">Canais úteis</h3>
              <ul className="mt-4 space-y-3">
                {CANAIS.map((canal) => (
                  <li key={canal.nome} className="rounded border border-white/10 bg-white/6 p-3">
                    <strong className="block text-sm text-white">{canal.nome}: {canal.valor}</strong>
                    <span className="mt-1 block text-xs leading-relaxed text-blue-100">{canal.detalhe}</span>
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
