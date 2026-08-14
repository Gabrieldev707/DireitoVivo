import type { AbaNavegacao } from '../../tipos';
import { Marca } from './Marca';

interface PropriedadesRodape {
  aoMudarAba: (aba: AbaNavegacao) => void;
}

export function Rodape({ aoMudarAba }: PropriedadesRodape) {
  return (
    <footer className="dv-footer">
      <div className="dv-container dv-footer__grid">
        <div className="dv-footer__brand">
          <Marca variante="completa" clara />
          <p>Orientação de direitos públicos em linguagem simples, sem cadastro e com fontes verificáveis.</p>
          <span>Projeto independente</span>
        </div>
        <nav className="dv-footer__links" aria-label="Explorar"><strong>Explorar</strong><a href="#inicio">Início</a><a href="#situacoes">Situações</a><a href="#direitos">Direitos</a><a href="#conversa">Conversar</a></nav>
        <nav className="dv-footer__links" aria-label="Confiança"><strong>Confiança</strong><a href="#acessibilidade">Acessibilidade e como usar</a><a href="#privacidade">Privacidade e dados</a><a href="#termos">Termos e limites</a><a href="#sobre">Sobre o projeto</a></nav>
        <div className="dv-footer__limits">
          <strong>Importante</strong>
          <span>Não representa órgão governamental.</span><span>Não substitui atendimento oficial.</span><span>Confirme regras no canal indicado.</span>
        </div>
      </div>
      <div className="dv-container dv-footer__bottom"><a href="https://github.com/Gabrieldev707/DireitoVivo" target="_blank" rel="noreferrer">Código no GitHub</a><span>Conteúdo revisado em 2026</span><a className="dv-button dv-button--light" href="#conversa" onClick={() => aoMudarAba('chat')}>Começar conversa</a></div>
    </footer>
  );
}
