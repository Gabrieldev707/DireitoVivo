import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { LogotipoDireitoVivo } from './MarcaDireitoVivo';
import { TOTAL_DIREITOS } from '../dados/catalogoDireitos';
import type { Pagina } from '../navegacao';

export type AbaNavegacao = Pagina | 'resultado';

interface PropriedadesGovHeader {
  abaAtiva: AbaNavegacao;
  aoMudarAba: (aba: Pagina) => void;
}

const ABAS: Array<{
  id: Pagina;
  rotulo: string;
  descricao: string;
  badge?: string;
  icone: ReactNode;
}> = [
  {
    id: 'inicio',
    rotulo: 'Início',
    descricao: 'Página inicial',
    icone: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10" />
      </svg>
    ),
  },
  {
    id: 'direitos',
    rotulo: 'Direitos',
    descricao: 'Catálogo',
    badge: String(TOTAL_DIREITOS),
    icone: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 6.25v13m0-13C10.8 5.45 9.25 5 7.5 5S4.2 5.45 3 6.25v13C4.2 18.45 5.75 18 7.5 18s3.3.45 4.5 1.25m0-13C13.2 5.45 14.75 5 16.5 5s3.3.45 4.5 1.25v13C19.8 18.45 18.25 18 16.5 18s-3.3.45-4.5 1.25" />
      </svg>
    ),
  },
  {
    id: 'situacoes',
    rotulo: 'Situações',
    descricao: 'Guias de vida',
    icone: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 20 3.55 17.28A1 1 0 0 1 3 16.38V5.62a1 1 0 0 1 1.45-.9L9 7m0 13 6-3m-6 3V7m6 10 4.55 2.28A1 1 0 0 0 21 18.38V7.62a1 1 0 0 0-.55-.9L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    id: 'conversa',
    rotulo: 'Conversa',
    descricao: 'Atendimento',
    icone: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    id: 'ajuda',
    rotulo: 'Ajuda',
    descricao: 'Canais e dúvidas',
    icone: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 18h.01M9.1 9a3 3 0 1 1 4.6 2.54c-1.1.74-1.7 1.27-1.7 2.46M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
      </svg>
    ),
  },
];

function estaAtiva(aba: AbaNavegacao, abaAtiva: AbaNavegacao) {
  return abaAtiva === aba || (aba === 'conversa' && abaAtiva === 'resultado');
}

function contrasteInicial() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get('contraste') === 'alto' || window.localStorage.getItem('direito-vivo-contraste') === 'alto';
}

export function GovHeader({ abaAtiva, aoMudarAba }: PropriedadesGovHeader) {
  const [altoContraste, setAltoContraste] = useState(contrasteInicial);
  const [tamanhoFonte, setTamanhoFonte] = useState(100);

  useEffect(() => {
    return () => {
      document.body.classList.remove('alto-contraste');
      document.documentElement.style.fontSize = '';
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('alto-contraste', altoContraste);
    window.localStorage.setItem('direito-vivo-contraste', altoContraste ? 'alto' : 'padrao');
  }, [altoContraste]);

  function alternarContraste() {
    setAltoContraste((atual) => !atual);
  }

  function alterarFonte(delta: number) {
    const novoTamanho = Math.min(Math.max(tamanhoFonte + delta, 85), 140);
    setTamanhoFonte(novoTamanho);
    document.documentElement.style.fontSize = `${novoTamanho}%`;
  }

  return (
    <header className="site-header sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-[0_6px_22px_rgba(7,29,65,0.08)]">
      <div className="header-utility text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs font-bold sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <svg className="h-3.5 w-3.5 shrink-0 text-[#a7f3d0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 9v4m0 3h.01M4.72 19h14.56c1.44 0 2.34-1.55 1.62-2.8L13.62 4.2a1.88 1.88 0 00-3.24 0L3.1 16.2c-.72 1.25.18 2.8 1.62 2.8z" />
            </svg>
            <span className="header-independent-note">
              Projeto independente — não é um serviço oficial do Governo Federal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => aoMudarAba('ajuda')} className="rounded px-2 py-1 text-left underline underline-offset-2 hover:bg-white/10">
              Precisa de ajuda agora?
            </button>
            <a href="#conteudo-principal" className="hidden rounded px-2 py-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#FFCD07] sm:inline-flex">
              Conteúdo
            </a>
            <button
              type="button"
              onClick={() => alterarFonte(10)}
              className="access-button"
              title="Aumentar tamanho da fonte"
              aria-label="Aumentar fonte"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => alterarFonte(-10)}
              className="access-button"
              title="Diminuir tamanho da fonte"
              aria-label="Diminuir fonte"
            >
              A-
            </button>
            <button
              type="button"
              onClick={alternarContraste}
              aria-pressed={altoContraste}
              className={`access-button gap-1.5 ${altoContraste ? 'bg-[#FFCD07] text-[#071D41]' : 'bg-white/10 text-white hover:bg-white/20'}`}
              title="Alternar modo de alto contraste"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 3v18m0 0a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
              </svg>
              <span className="hidden sm:inline">Alto contraste</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-8">
          <button
            type="button"
            className="brand-lockup group flex min-w-0 items-center gap-3 rounded-lg text-left focus:outline-none focus:ring-4 focus:ring-[#075e54]/20"
            onClick={() => aoMudarAba('inicio')}
          >
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-2">
                <LogotipoDireitoVivo />
              </span>
              <span className="mt-1 block text-xs font-semibold leading-relaxed text-slate-600 sm:text-sm">
                Projeto independente de orientação sobre direitos.
              </span>
            </span>
          </button>
        </div>
      </div>

      <nav aria-label="Navegação principal" className="border-t border-slate-200 bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap gap-1 py-2 sm:gap-2">
            {ABAS.map((aba) => {
              const ativa = estaAtiva(aba.id, abaAtiva);
              return (
                <li key={aba.id}>
                  <button
                    type="button"
                    onClick={() => aoMudarAba(aba.id)}
                    aria-current={ativa ? 'page' : undefined}
                    className={`nav-tab ${ativa ? 'nav-tab--active' : ''}`}
                  >
                    {aba.icone}
                    <span className="flex flex-col items-start leading-tight">
                      <span>{aba.rotulo}</span>
                      <span className="hidden text-[11px] font-semibold opacity-75 sm:block">{aba.descricao}</span>
                    </span>
                    {aba.badge && <span className="nav-tab__badge">{aba.badge}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
