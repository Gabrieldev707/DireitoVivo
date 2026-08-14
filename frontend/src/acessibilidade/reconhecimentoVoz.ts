export interface EventoResultadoVoz {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

export interface ReconhecimentoVozNativo {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((evento: EventoResultadoVoz) => void) | null;
  onerror: ((evento: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}

type ConstrutorReconhecimento = new () => ReconhecimentoVozNativo;

interface JanelaComReconhecimento extends Window {
  SpeechRecognition?: ConstrutorReconhecimento;
  webkitSpeechRecognition?: ConstrutorReconhecimento;
}

export function obterConstrutorReconhecimento(): ConstrutorReconhecimento | undefined {
  if (typeof window === 'undefined') return undefined;
  const janela = window as JanelaComReconhecimento;
  return janela.SpeechRecognition ?? janela.webkitSpeechRecognition;
}

export function criarReconhecimentoVoz(): ReconhecimentoVozNativo | undefined {
  const Construtor = obterConstrutorReconhecimento();
  if (!Construtor) return undefined;
  const reconhecimento = new Construtor();
  reconhecimento.lang = 'pt-BR';
  reconhecimento.interimResults = false;
  reconhecimento.continuous = false;
  reconhecimento.maxAlternatives = 1;
  return reconhecimento;
}
