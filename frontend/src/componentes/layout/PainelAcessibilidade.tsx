import { useId, useState } from 'react';
import { Icone } from '../compartilhados/Icone';
import { usePreferenciasAcessibilidade } from '../../acessibilidade/PreferenciasProvider';
import type { TamanhoTexto } from '../../acessibilidade/preferencias';

export function PainelAcessibilidade() {
  const [aberto, setAberto] = useState(false);
  const { preferencias, atualizar, restaurar } = usePreferenciasAcessibilidade();
  const id = useId();

  function mudarTamanho(delta: number) {
    const tamanhos: TamanhoTexto[] = ['normal', 'grande', 'maior'];
    const indice = Math.max(0, Math.min(tamanhos.length - 1, tamanhos.indexOf(preferencias.tamanho) + delta));
    atualizar({ tamanho: tamanhos[indice] });
  }

  return (
    <div className="dv-accessibility">
      <button
        className="dv-accessibility__trigger"
        type="button"
        aria-expanded={aberto}
        aria-controls={id}
        aria-label="Abrir acessibilidade"
        onClick={() => setAberto((atual) => !atual)}
      >
        <span aria-hidden="true">Aa</span> Acessibilidade
      </button>
      {aberto && (
        <section id={id} className="dv-accessibility__panel" role="dialog" aria-label="Preferências de acessibilidade">
          <header>
            <div><strong>Ajuste a leitura</strong><span>As escolhas ficam salvas neste aparelho.</span></div>
            <button type="button" aria-label="Fechar acessibilidade" onClick={() => setAberto(false)}><Icone nome="fechar" /></button>
          </header>
          <div className="dv-accessibility__text-size">
            <span>Tamanho do texto</span>
            <div>
              <button type="button" aria-label="Diminuir texto" onClick={() => mudarTamanho(-1)} disabled={preferencias.tamanho === 'normal'}>A−</button>
              <output aria-live="polite">{preferencias.tamanho === 'normal' ? 'Normal' : preferencias.tamanho === 'grande' ? 'Grande' : 'Muito grande'}</output>
              <button type="button" aria-label="Aumentar texto" onClick={() => mudarTamanho(1)} disabled={preferencias.tamanho === 'maior'}>A+</button>
            </div>
          </div>
          <label><span><strong>Contraste reforçado</strong><small>Escurece textos e contornos.</small></span><input aria-label="Contraste reforçado" type="checkbox" role="switch" checked={preferencias.contraste} onChange={() => atualizar({ contraste: !preferencias.contraste })} /></label>
          <label><span><strong>Destacar links</strong><small>Sublinha tudo que abre outra página.</small></span><input aria-label="Destacar links" type="checkbox" role="switch" checked={preferencias.links} onChange={() => atualizar({ links: !preferencias.links })} /></label>
          <label><span><strong>Reduzir movimentos</strong><small>Desliga animações e rolagem suave.</small></span><input aria-label="Reduzir movimentos" type="checkbox" role="switch" checked={preferencias.movimento} onChange={() => atualizar({ movimento: !preferencias.movimento })} /></label>
          <button className="dv-accessibility__reset" type="button" onClick={restaurar}>Restaurar padrão</button>
        </section>
      )}
    </div>
  );
}
