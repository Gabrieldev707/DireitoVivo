// Identidade visual própria do Direito Vivo.
// Projeto independente: nenhum símbolo oficial (gov.br, Brasão da República) é usado.
// O símbolo é um escudo (proteção/direito) com um broto (o "vivo" do nome).

interface PropriedadesMarca {
  className?: string;
  tamanho?: number;
}

export function SimboloDireitoVivo({ className = '', tamanho = 40 }: PropriedadesMarca) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="Direito Vivo"
    >
      <path
        d="M24 4L8 9.5v14.2c0 11.7 6.8 22.6 16 25.3 9.2-2.7 16-13.6 16-25.3V9.5L24 4z"
        fill="url(#dv-escudo)"
      />
      <path
        d="M24 9.4l11 3.8v10.5c0 8.6-4.9 16.6-11 18.8-6.1-2.2-11-10.2-11-18.8V13.2l11-3.8z"
        fill="#ffffff"
        fillOpacity="0.14"
      />
      {/* Broto: haste + duas folhas — o "vivo" */}
      <path
        d="M24 33.5V22.5"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M24 24.5c0-3.4-2.4-6.2-5.6-6.6-.4 3.5 1.9 6.6 5.6 6.6z"
        fill="#ffffff"
      />
      <path
        d="M24 21c0-3.9 2.8-7.1 6.4-7.5.5 4-2.2 7.5-6.4 7.5z"
        fill="#a7f3d0"
      />
      <defs>
        <linearGradient id="dv-escudo" x1="8" y1="4" x2="40" y2="49" gradientUnits="userSpaceOnUse">
          <stop stopColor="#128c7e" />
          <stop offset="1" stopColor="#075e54" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogotipoDireitoVivo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <SimboloDireitoVivo tamanho={38} />
      <span className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tight text-[#075e54] sm:text-2xl">
          Direito<span className="text-[#25d366]">Vivo</span>
        </span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Projeto independente
        </span>
      </span>
    </span>
  );
}
