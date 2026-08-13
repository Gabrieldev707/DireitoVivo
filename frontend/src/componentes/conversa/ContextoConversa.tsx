import { Icone } from '../compartilhados/Icone';
import { Selo } from '../compartilhados/Selo';

interface PropriedadesContexto {
  aoLimpar?: () => void;
  podeLimpar: boolean;
}

export function ContextoConversa({ aoLimpar, podeLimpar }: PropriedadesContexto) {
  return (
    <aside className="dv-conversation__context" aria-label="Sobre esta conversa">
      <Selo tom="cuidado"><Icone nome="escudo" /> conversa protegida</Selo>
      <h1>Vamos organizar seu próximo passo.</h1>
      <p>Responda só o que souber. A orientação pode fazer perguntas para distinguir critérios parecidos.</p>
      <div className="dv-conversation__rules">
        <span>Não envie nome, CPF, RG ou endereço.</span>
        <span>A IA não decide concessão de benefício.</span>
        <span>Confirme tudo no canal oficial.</span>
      </div>
      {aoLimpar && (
        <button className="dv-button dv-button--quiet" type="button" disabled={!podeLimpar} onClick={aoLimpar}>
          <Icone nome="limpar" /> Limpar e recomeçar
        </button>
      )}
    </aside>
  );
}
