import { useEffect, useRef, useState } from 'react';

interface PropriedadesAvisoDemo {
  aberto: boolean;
  contexto?: { titulo: string; texto: string };
  aoAceitar: () => void;
  aoFechar: () => void;
}

export function AvisoDemo({ aberto, contexto, aoAceitar, aoFechar }: PropriedadesAvisoDemo) {
  const [confirmou, setConfirmou] = useState(false);
  const dialogoRef = useRef<HTMLDivElement>(null);
  const fecharRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const focoAnterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    fecharRef.current?.focus();
    function aoTeclado(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        aoFechar();
      }
      if (evento.key !== 'Tab' || !dialogoRef.current) return;
      const focaveis = Array.from(dialogoRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]'));
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo?.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro?.focus();
      }
    }
    document.addEventListener('keydown', aoTeclado);
    return () => {
      document.removeEventListener('keydown', aoTeclado);
      document.body.style.overflow = overflowAnterior;
      focoAnterior?.focus();
    };
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#102d3e]/75 p-4">
      <div ref={dialogoRef} role="dialog" aria-modal="true" aria-labelledby="aviso-demo-titulo" aria-describedby="aviso-demo-descricao" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="aviso-demo-titulo" className="text-2xl font-bold text-[#173044]">Antes de usar a conversa</h2>
          <button ref={fecharRef} type="button" onClick={aoFechar} className="min-h-11 min-w-11 rounded-lg border border-slate-300" aria-label="Fechar aviso">×</button>
        </div>
        <p id="aviso-demo-descricao" className="mt-4 leading-relaxed text-slate-700">
          O Direito Vivo não cria conta nem salva o histórico desta conversa em seu banco. O relato será processado por um provedor externo de IA. Não informe nome, CPF, endereço ou telefone. A resposta é orientativa.
        </p>
        {contexto && (
          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-[#173044]">Texto que será enviado: {contexto.titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{contexto.texto}</p>
          </div>
        )}
        <label className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-[#173044]">
          <input type="checkbox" checked={confirmou} onChange={(evento) => setConfirmou(evento.target.checked)} className="mt-1 h-5 w-5" />
          Entendi e quero iniciar a demonstração
        </label>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={aoFechar} className="btn-gov-secondary min-h-11">Continuar sem conversa</button>
          <button type="button" disabled={!confirmou} onClick={() => { setConfirmou(false); aoAceitar(); }} className="btn-gov-primary min-h-11 disabled:cursor-not-allowed disabled:opacity-50">Iniciar demonstração</button>
        </div>
      </div>
    </div>
  );
}
