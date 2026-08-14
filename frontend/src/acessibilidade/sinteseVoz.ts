import type { VelocidadeLeitura } from './preferencias';

const TAXAS: Record<VelocidadeLeitura, number> = {
  lenta: 0.8,
  normal: 1,
  rapida: 1.25,
};

interface EventosSintese {
  aoTerminar?: () => void;
  aoFalhar?: () => void;
}

export const sintetizadorDeVoz = {
  disponivel() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  },
  ouvir(texto: string, velocidade: VelocidadeLeitura = 'normal', eventos: EventosSintese = {}) {
    if (!this.disponivel()) return false;
    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = 'pt-BR';
    fala.rate = TAXAS[velocidade];
    fala.onend = () => eventos.aoTerminar?.();
    fala.onerror = () => eventos.aoFalhar?.();
    window.speechSynthesis.speak(fala);
    return true;
  },
  parar() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  },
};
