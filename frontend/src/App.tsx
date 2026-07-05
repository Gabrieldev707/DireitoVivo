import { useState } from 'react';
import { enviarTriagem } from './api';
import { Chat } from './componentes/Chat';
import { LinhaDaVida } from './componentes/LinhaDaVida';
import { TelaInicial } from './componentes/TelaInicial';
import { TEXTO_DISCLAIMER, type MensagemChat, type RespostaTriagem } from './tipos';

// Primeira fala do assistente — local, sem custo de LLM (RF01: acolhedora e sem pedir PII).
const MENSAGEM_ABERTURA: MensagemChat = {
  papel: 'assistente',
  conteudo:
    'Oi! Eu vou te fazer algumas perguntas rápidas para descobrir benefícios e direitos que podem ser seus. ' +
    'Você não precisa dizer seu nome, CPF ou RG — a conversa é anônima. ' +
    'Para começar: me conta um pouco de como está sua vida hoje? (trabalho, família, saúde... do seu jeito)',
};

type Fase = 'inicio' | 'chat' | 'resultado';

export function App() {
  const [fase, setFase] = useState<Fase>('inicio');
  const [mensagens, setMensagens] = useState<MensagemChat[]>([MENSAGEM_ABERTURA]);
  const [resultado, setResultado] = useState<Extract<RespostaTriagem, { tipo: 'resultado' | 'sem_match' }>>();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string>();

  async function aoEnviar(texto: string) {
    const historico = [...mensagens, { papel: 'usuario', conteudo: texto } as MensagemChat];
    setMensagens(historico);
    setEnviando(true);
    setErro(undefined);
    try {
      const resposta = await enviarTriagem(historico);
      if (resposta.tipo === 'pergunta') {
        setMensagens([...historico, { papel: 'assistente', conteudo: resposta.mensagem }]);
      } else {
        setResultado(resposta);
        setFase('resultado');
      }
    } catch (excecao) {
      setErro((excecao as Error).message);
      // Mantém a mensagem do usuário no histórico; ele pode tentar de novo.
    } finally {
      setEnviando(false);
    }
  }

  function recomecar() {
    setMensagens([MENSAGEM_ABERTURA]);
    setResultado(undefined);
    setErro(undefined);
    setFase('inicio');
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <span aria-hidden="true" className="text-3xl">🌱</span>
          <div>
            <h1 className="text-xl font-bold text-emerald-800">Direito Vivo</h1>
            <p className="text-sm text-stone-600">Direitos que existem, mas ninguém te contou.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {fase === 'inicio' && <TelaInicial aoComecar={() => setFase('chat')} />}
        {fase === 'chat' && (
          <Chat mensagens={mensagens} enviando={enviando} erro={erro} aoEnviar={aoEnviar} />
        )}
        {fase === 'resultado' && resultado && (
          <LinhaDaVida resultado={resultado} aoRecomecar={recomecar} />
        )}
      </main>

      <footer className="mx-auto max-w-3xl px-4 pb-8">
        <p className="text-sm leading-relaxed text-stone-500">{TEXTO_DISCLAIMER}</p>
      </footer>
    </div>
  );
}
