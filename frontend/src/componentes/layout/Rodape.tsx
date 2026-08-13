import type { AbaNavegacao } from '../../tipos';
import { Marca } from './Marca';

interface PropriedadesRodape {
  aoMudarAba: (aba: AbaNavegacao) => void;
}

export function Rodape({ aoMudarAba }: PropriedadesRodape) {
  return (
    <footer className="dv-footer">
      <div className="dv-container dv-footer__grid">
        <div>
          <Marca compacta />
          <p>Uma demonstração independente para organizar dúvidas e encontrar portas de entrada.</p>
        </div>
        <div className="dv-footer__links" aria-label="Links do rodapé">
          <button type="button" onClick={() => aoMudarAba('cenarios')}>Situações</button>
          <button type="button" onClick={() => aoMudarAba('catalogo')}>Direitos</button>
          <button type="button" onClick={() => aoMudarAba('chat')}>Conversar</button>
        </div>
        <div className="dv-footer__limits">
          <strong>Importante</strong>
          <span>Não substitui atendimento oficial.</span>
          <span>Confirme regras no canal indicado.</span>
        </div>
      </div>
    </footer>
  );
}
