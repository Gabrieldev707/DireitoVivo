import { Icone } from '../compartilhados/Icone';
import { Selo } from '../compartilhados/Selo';
import { ProgressoConversa, type EtapaConversa } from './ProgressoConversa';

interface PropriedadesContexto {
  aoLimpar?: () => void;
  podeLimpar: boolean;
  etapa: EtapaConversa;
}

export function ContextoConversa({ aoLimpar, podeLimpar, etapa }: PropriedadesContexto) {
  return (
    <aside className="dv-conversation__context" aria-label="Sobre esta conversa">
      <Selo tom="cuidado"><Icone nome="escudo" /> sem cadastro</Selo>
      <h1>Conte o que aconteceu. A gente organiza com você.</h1>
      <p>Não precisa conhecer leis ou benefícios. Responda só o que souber.</p>
      <div className="dv-conversation__journey"><strong>O que vamos descobrir</strong><ProgressoConversa etapa={etapa} /></div>
      <div className="dv-conversation__rules">
        <span>Não envie nome, CPF, RG ou endereço.</span>
        <span>A IA não decide concessão de benefício.</span>
        <span>Ao final, indicamos onde confirmar: CRAS, SUS, INSS ou Defensoria.</span>
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
