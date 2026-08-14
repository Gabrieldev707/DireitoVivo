import { Icone } from '../compartilhados/Icone';
import { Selo } from '../compartilhados/Selo';
import { ProgressoConversa } from './ProgressoConversa';

interface PropriedadesContexto {
  aoLimpar?: () => void;
  podeLimpar: boolean;
}

export function ContextoConversa({ aoLimpar, podeLimpar }: PropriedadesContexto) {
  return (
    <aside className="dv-conversation__context" aria-label="Sobre esta conversa">
      <Selo tom="cuidado"><Icone nome="escudo" /> sem cadastro</Selo>
      <h1>Conte o que aconteceu. A gente organiza com você.</h1>
      <p>Não precisa conhecer leis ou benefícios. Responda só o que souber.</p>
      <div className="dv-conversation__journey"><strong>O que vamos descobrir</strong><ProgressoConversa etapa="entender" />
        <div className="sr-only">
        <ol>
          <li><span>1</span><div><b>O que aconteceu</b><small>Trabalho, renda, saúde ou cuidado.</small></div></li>
          <li><span>2</span><div><b>O que pode ajudar</b><small>Direitos possíveis e documentos.</small></div></li>
          <li><span>3</span><div><b>Onde confirmar</b><small>CRAS, SUS, INSS ou Defensoria.</small></div></li>
        </ol>
        </div>
      </div>
      <div className="dv-conversation__rules">
        <span>Não envie nome, CPF, RG ou endereço.</span>
        <span>A IA não decide concessão de benefício.</span>
        <span>Se prefere atendimento presencial, diga sua cidade sem informar o endereço.</span>
      </div>
      {aoLimpar && (
        <button className="dv-button dv-button--quiet" type="button" disabled={!podeLimpar} onClick={aoLimpar}>
          <Icone nome="limpar" /> Limpar e recomeçar
        </button>
      )}
    </aside>
  );
}
