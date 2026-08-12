import type { RespostaUrgencia } from './tipos.js';

const CANAL_190 = {
  nome: 'Polícia Militar',
  numero: '190',
  quando_usar: 'Perigo, ameaça ou agressão acontecendo agora',
};
const CANAL_180 = {
  nome: 'Central de Atendimento à Mulher',
  numero: '180',
  quando_usar: 'Orientação e acolhimento em violência contra a mulher',
};
const CANAL_188 = {
  nome: 'Centro de Valorização da Vida',
  numero: '188',
  quando_usar: 'Apoio emocional imediato e gratuito',
};
const CANAL_192 = {
  nome: 'SAMU',
  numero: '192',
  quando_usar: 'Emergência médica ou risco imediato à vida',
};

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function detectarUrgencia(texto: string): RespostaUrgencia | undefined {
  const relato = normalizar(texto);
  if (/nao estou em risco|sem risco agora|ano passado|outra pessoa/.test(relato)) return undefined;

  const autoexterminio =
    /(estou|to) (pensando|com vontade) (em|de) me matar/.test(relato) ||
    /(quero|vou) (me matar|tirar minha vida)/.test(relato) ||
    /suicid/.test(relato);
  const atual = /agora|hoje|neste momento|imediat|estou em perigo|vai me matar|armad[oa]/.test(relato);

  if (autoexterminio && atual) {
    return {
      tipo: 'urgencia',
      nivel: 'imediato',
      mensagem:
        'Sua segurança vem primeiro. Se houver risco de você se machucar agora, ligue para o SAMU ou procure uma emergência. O CVV também atende gratuitamente.',
      canais: [CANAL_188, CANAL_192],
    };
  }

  const ameacaOuAgressao =
    /vai me matar|quer me matar|esta armado|com uma arma|me agrediu|me bateu|estou em perigo/.test(relato);
  if (ameacaOuAgressao && atual) {
    const contextoMulher = /marido|companheiro|ex-marido|ex-companheiro|violencia domestica/.test(relato);
    return {
      tipo: 'urgencia',
      nivel: 'imediato',
      mensagem:
        'Se existe perigo agora, vá para um local seguro se puder e procure ajuda imediatamente. Não confronte a pessoa agressora.',
      canais: contextoMulher ? [CANAL_190, CANAL_180] : [CANAL_190],
    };
  }

  return undefined;
}
