import { useState } from 'react';

interface PropriedadesConsentimentoDemo {
  aoAceitar: () => void;
  aoCancelar: () => void;
}

export function ConsentimentoDemo({ aoAceitar, aoCancelar }: PropriedadesConsentimentoDemo) {
  const [confirmado, setConfirmado] = useState(false);

  return (
    <div className="dv-consent-backdrop">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-consentimento-demo"
        className="dv-consent"
      >
        <span className="dv-eyebrow">
          Antes da conversa
        </span>
        <h2 id="titulo-consentimento-demo">
          Você escolhe o que compartilhar.
        </h2>
        <p>
          Esta demonstração usa IA para organizar uma orientação informativa. Ela não decide benefícios nem substitui atendimento oficial.
        </p>
        <ul className="dv-consent__list">
          <li><strong>Não informe CPF</strong>, RG, nome completo, endereço, telefone ou e-mail.</li>
          <li>O texto é processado por um provedor de inteligência artificial; alguns dados são mascarados antes do envio.</li>
          <li>A orientação não garante concessão de benefício ou acesso a serviço.</li>
          <li>Confirme requisitos, prazos e canais na fonte oficial indicada.</li>
        </ul>
        <label className="dv-consent__check">
          <input
            type="checkbox"
            checked={confirmado}
            onChange={(evento) => setConfirmado(evento.target.checked)}
          />
          <span>
            Entendi os limites da demonstração e quero continuar sem informar dados pessoais.
          </span>
        </label>
        <div className="dv-consent__actions">
          <button type="button" onClick={aoCancelar} className="dv-button dv-button--secondary">
            Voltar sem enviar
          </button>
          <button
            type="button"
            disabled={!confirmado}
            onClick={aoAceitar}
            className="dv-button dv-button--primary"
          >
            Entendi e quero continuar
          </button>
        </div>
      </section>
    </div>
  );
}
