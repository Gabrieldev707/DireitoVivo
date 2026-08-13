import { useEffect, useState } from 'react';
import type { AbaNavegacao } from '../../tipos';
import { Icone } from '../compartilhados/Icone';
import { Marca } from './Marca';

interface PropriedadesCabecalho {
  abaAtiva: AbaNavegacao;
  aoMudarAba: (aba: AbaNavegacao) => void;
}

const ABAS: Array<{ id: AbaNavegacao; rotulo: string }> = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'cenarios', rotulo: 'Situações' },
  { id: 'catalogo', rotulo: 'Direitos' },
  { id: 'chat', rotulo: 'Conversar' },
];

export function Cabecalho({ abaAtiva, aoMudarAba }: PropriedadesCabecalho) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [altoContraste, setAltoContraste] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('alto-contraste', altoContraste);
    return () => document.body.classList.remove('alto-contraste');
  }, [altoContraste]);

  function navegar(aba: AbaNavegacao) {
    setMenuAberto(false);
    aoMudarAba(aba);
  }

  return (
    <header className="dv-header" data-chat={abaAtiva === 'chat' || abaAtiva === 'resultado'}>
      <div className="dv-header__notice">
        <div className="dv-container">
          <span>Projeto independente</span>
          <span>Sem cadastro</span>
          <span>Confirme no canal oficial</span>
        </div>
      </div>
      <div className="dv-container dv-header__main">
        <button className="dv-header__brand" type="button" onClick={() => navegar('inicio')}>
          <Marca />
          <span className="sr-only">Ir para o início</span>
        </button>

        <button
          className="dv-header__menu-button"
          type="button"
          aria-expanded={menuAberto}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuAberto((atual) => !atual)}
        >
          <Icone nome={menuAberto ? 'fechar' : 'menu'} />
        </button>

        <div className={`dv-header__panel ${menuAberto ? 'dv-header__panel--open' : ''}`}>
          <nav aria-label="Principal">
            {ABAS.map((aba) => (
              <button
                key={aba.id}
                type="button"
                aria-current={abaAtiva === aba.id || (aba.id === 'chat' && abaAtiva === 'resultado') ? 'page' : undefined}
                onClick={() => navegar(aba.id)}
              >
                {aba.rotulo}
              </button>
            ))}
          </nav>
          <div className="dv-header__tools">
            <button
              type="button"
              className="dv-header__contrast"
              aria-pressed={altoContraste}
              onClick={() => setAltoContraste((atual) => !atual)}
            >
              Alto contraste
            </button>
            <button className="dv-button dv-button--primary" type="button" onClick={() => navegar('chat')}>
              Começar conversa <Icone nome="seta" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
