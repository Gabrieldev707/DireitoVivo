import { useEffect, useId, useState } from 'react';
import { Icone } from '../compartilhados/Icone';

type TamanhoTexto = 'normal' | 'grande' | 'maior';

interface Preferencias {
  tamanho: TamanhoTexto;
  contraste: boolean;
  links: boolean;
  movimento: boolean;
}

const CHAVE = 'direito-vivo-acessibilidade';
const PADRAO: Preferencias = { tamanho: 'normal', contraste: false, links: false, movimento: false };

function carregar(): Preferencias {
  try {
    const salvo = window.localStorage.getItem(CHAVE);
    return salvo ? { ...PADRAO, ...JSON.parse(salvo) } : PADRAO;
  } catch {
    return PADRAO;
  }
}

function aplicar(preferencias: Preferencias) {
  const raiz = document.documentElement;
  raiz.dataset.tamanhoTexto = preferencias.tamanho;
  raiz.classList.toggle('contraste-reforcado', preferencias.contraste);
  raiz.classList.toggle('destacar-links', preferencias.links);
  raiz.classList.toggle('reduzir-movimento', preferencias.movimento);
}

export function PainelAcessibilidade() {
  const [aberto, setAberto] = useState(false);
  const [preferencias, setPreferencias] = useState<Preferencias>(carregar);
  const id = useId();

  useEffect(() => {
    aplicar(preferencias);
    try { window.localStorage.setItem(CHAVE, JSON.stringify(preferencias)); } catch { /* preferência local opcional */ }
  }, [preferencias]);

  function definir(proximas: Preferencias) {
    setPreferencias(proximas);
  }

  function mudarTamanho(delta: number) {
    const tamanhos: TamanhoTexto[] = ['normal', 'grande', 'maior'];
    const indice = Math.max(0, Math.min(tamanhos.length - 1, tamanhos.indexOf(preferencias.tamanho) + delta));
    definir({ ...preferencias, tamanho: tamanhos[indice] });
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
          <label><span><strong>Contraste reforçado</strong><small>Escurece textos e contornos.</small></span><input aria-label="Contraste reforçado" type="checkbox" role="switch" checked={preferencias.contraste} onChange={() => definir({ ...preferencias, contraste: !preferencias.contraste })} /></label>
          <label><span><strong>Destacar links</strong><small>Sublinha tudo que abre outra página.</small></span><input aria-label="Destacar links" type="checkbox" role="switch" checked={preferencias.links} onChange={() => definir({ ...preferencias, links: !preferencias.links })} /></label>
          <label><span><strong>Reduzir movimentos</strong><small>Desliga animações e rolagem suave.</small></span><input aria-label="Reduzir movimentos" type="checkbox" role="switch" checked={preferencias.movimento} onChange={() => definir({ ...preferencias, movimento: !preferencias.movimento })} /></label>
          <button className="dv-accessibility__reset" type="button" onClick={() => definir(PADRAO)}>Restaurar padrão</button>
        </section>
      )}
    </div>
  );
}
