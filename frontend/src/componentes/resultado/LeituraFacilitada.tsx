import { useState } from 'react';
import { sintetizadorDeVoz } from '../../acessibilidade/sinteseVoz';

interface PropriedadesLeituraFacilitada {
  resumo: string;
  possibilidades: string[];
  passos: string[];
  canal?: string;
}

export function LeituraFacilitada({ resumo, possibilidades, passos, canal }: PropriedadesLeituraFacilitada) {
  const [aberta, setAberta] = useState(false);
  const [falando, setFalando] = useState(false);
  const textoFalado = [
    'Em poucas palavras.',
    resumo,
    possibilidades.length ? `Pode valer a pena confirmar: ${possibilidades.join(', ')}.` : '',
    passos[0] ? `O que fazer agora: ${passos[0]}` : '',
    canal ? `Onde confirmar: ${canal}.` : '',
  ].filter(Boolean).join(' ');

  function alternarLeitura() {
    if (falando) {
      sintetizadorDeVoz.parar();
      setFalando(false);
      return;
    }
    setFalando(true);
    sintetizadorDeVoz.ouvir(textoFalado, 'lenta', {
      aoTerminar: () => setFalando(false),
      aoFalhar: () => setFalando(false),
    });
  }

  return (
    <div className="dv-easy-read">
      <button className="dv-button dv-button--secondary" type="button" aria-expanded={aberta} onClick={() => setAberta((valor) => !valor)}>
        {aberta ? 'Fechar leitura facilitada' : 'Abrir leitura facilitada'}
      </button>
      {aberta && (
        <section role="region" aria-label="Leitura facilitada do resultado" tabIndex={-1}>
          <span>Versão curta</span>
          <h2>Em poucas palavras</h2>
          <p>{resumo}</p>
          {possibilidades.length > 0 && <p><strong>Pode valer a pena confirmar:</strong> {possibilidades.join(', ')}.</p>}
          <h3>O que fazer agora</h3>
          <p>{passos[0] ?? 'Procure uma porta de entrada pública para confirmar sua situação.'}</p>
          {canal && <p><strong>Onde confirmar:</strong> {canal}</p>}
          {sintetizadorDeVoz.disponivel() && (
            <button type="button" className="dv-button dv-button--primary" aria-label={falando ? 'Parar leitura facilitada' : 'Ouvir leitura facilitada'} onClick={alternarLeitura}>
              {falando ? 'Parar leitura' : 'Ouvir este resumo'}
            </button>
          )}
        </section>
      )}
    </div>
  );
}
