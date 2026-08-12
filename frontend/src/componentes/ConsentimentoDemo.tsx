import { useState } from 'react';

interface PropriedadesConsentimentoDemo {
  aoAceitar: () => void;
  aoCancelar: () => void;
}

export function ConsentimentoDemo({ aoAceitar, aoCancelar }: PropriedadesConsentimentoDemo) {
  const [confirmado, setConfirmado] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071D41]/75 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-consentimento-demo"
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#1351B4]">
          Demonstração de portfólio
        </span>
        <h2 id="titulo-consentimento-demo" className="mt-4 text-2xl font-black text-[#071D41]">
          Antes de iniciar
        </h2>
        <p className="mt-3 leading-relaxed text-slate-700">
          Este projeto demonstra uma triagem informativa. Ele não decide benefícios, não substitui
          orientação jurídica e não é um serviço oficial do governo.
        </p>
        <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-700">
          <li><strong>Não informe CPF</strong>, RG, nome completo, endereço, telefone ou e-mail.</li>
          <li>O sistema tenta mascarar alguns dados pessoais antes do processamento, mas evite enviá-los.</li>
          <li>O texto da conversa é enviado a um provedor de inteligência artificial para gerar a orientação.</li>
          <li>Confirme requisitos, prazos e canais nas fontes oficiais indicadas.</li>
        </ul>
        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4">
          <input
            type="checkbox"
            checked={confirmado}
            onChange={(evento) => setConfirmado(evento.target.checked)}
            className="mt-1 h-5 w-5"
          />
          <span className="text-sm font-bold text-slate-800">
            Entendi os limites da demonstração e quero continuar sem informar dados pessoais.
          </span>
        </label>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={aoCancelar} className="rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-700">
            Voltar sem iniciar
          </button>
          <button
            type="button"
            disabled={!confirmado}
            onClick={aoAceitar}
            className="rounded-lg bg-[#075e54] px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            Continuar para a demonstração
          </button>
        </div>
      </section>
    </div>
  );
}
