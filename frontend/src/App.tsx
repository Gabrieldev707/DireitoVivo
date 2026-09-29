import { useEffect, useState } from 'react';
import { enviarTriagem } from './api';
import { Chat } from './componentes/Chat';
import { LinhaDaVida } from './componentes/LinhaDaVida';
import { TelaInicial } from './componentes/TelaInicial';
import { Portifolio } from './componentes/Portifolio';
import { CenariosVida } from './componentes/CenariosVida';
import { GovHeader, type AbaNavegacao } from './componentes/GovHeader';
import { GovFooter } from './componentes/GovFooter';
import { AvisoDemo } from './componentes/AvisoDemo';
import type { ItemLinhaDaVida, MensagemChat, RespostaTriagem } from './tipos';

// Primeira fala do assistente — local, sem custo de LLM (RF01: acolhedora e sem pedir PII).
const MENSAGEM_ABERTURA: MensagemChat = {
  papel: 'assistente',
  conteudo:
    'Olá! Eu sou a Inteligência Artificial do Direito Vivo, desenvolvida para descobrir benefícios e direitos públicos que podem ser seus por lei.\n\n' +
    'Não informe nome, CPF, RG, endereço ou telefone. O texto enviado será processado por um provedor externo de IA.\n\n' +
    'Para começarmos: me conte com suas palavras como está sua vida hoje? (ex: situação de trabalho, renda, família, saúde ou se cuida de crianças/idosos)',
};

function obterAbaInicial(): AbaNavegacao {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'catalogo' || hash === 'cenarios' || hash === 'chat') return hash;
  return 'inicio';
}

export function App() {
  type Pendente = { tipo: 'texto'; texto: string } | { tipo: 'cenario'; titulo: string; texto: string };
  const [abaAtiva, setAbaAtiva] = useState<AbaNavegacao>(obterAbaInicial);
  const [mensagens, setMensagens] = useState<MensagemChat[]>([MENSAGEM_ABERTURA]);
  const [resultado, setResultado] = useState<Extract<RespostaTriagem, { tipo: 'resultado' | 'sem_match' }>>();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string>();
  const [aceiteDemo, setAceiteDemo] = useState(false);
  const [pendente, setPendente] = useState<Pendente | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (abaAtiva !== 'resultado') {
      window.history.replaceState(null, '', `#${abaAtiva}`);
    }
  }, [abaAtiva]);

  async function processarTriagem(historico: MensagemChat[], aceite: true) {
    setMensagens(historico);
    setEnviando(true);
    setErro(undefined);
    setAbaAtiva('chat'); // Garante que a tela de chat esteja visível

    try {
      const resposta = await enviarTriagem(historico, aceite);
      if (resposta.tipo === 'pergunta') {
        setMensagens([...historico, { papel: 'assistente', conteudo: resposta.mensagem }]);
      } else {
        setResultado(resposta);
        setAbaAtiva('resultado');
      }
    } catch (excecao) {
      setErro((excecao as Error).message);
      // Mantém a mensagem do usuário no histórico para tentar de novo.
    } finally {
      setEnviando(false);
    }
  }

  async function aoEnviar(texto: string) {
    if (!aceiteDemo) {
      setPendente({ tipo: 'texto', texto });
      return;
    }
    const historico = [...mensagens, { papel: 'usuario', conteudo: texto } as MensagemChat];
    await processarTriagem(historico, true);
  }

  // Integração entre Portfólio de Direitos e o Chat IA
  function aoSelecionarDireitoParaChat(item: ItemLinhaDaVida) {
    const novoHistorico: MensagemChat[] = [
      MENSAGEM_ABERTURA,
      {
        papel: 'assistente',
        conteudo: `Excelente escolha! Para verificarmos se você tem direito ao **${item.nome_popular}** (${item.criterios_elegibilidade}), me conte rapidamente um pouco da sua renda mensal familiar e quantas pessoas moram com você.`,
      },
    ];
    setMensagens(novoHistorico);
    setResultado(undefined);
    setErro(undefined);
    setAbaAtiva('chat');
  }

  // Integração entre Cenários de Vida e o Chat IA
  function aoSelecionarCenarioParaChat(cenarioNome: string, mensagemInicial: string) {
    setPendente({ tipo: 'cenario', titulo: cenarioNome, texto: mensagemInicial });
  }

  function aceitarDemonstracao() {
    if (!pendente) return;
    const escolhido = pendente;
    setPendente(null);
    setAceiteDemo(true);
    if (escolhido.tipo === 'texto') {
      void processarTriagem([...mensagens, { papel: 'usuario', conteudo: escolhido.texto }], true);
      return;
    }
    const novoHistorico: MensagemChat[] = [
      MENSAGEM_ABERTURA,
      {
        papel: 'assistente',
        conteudo: `Vamos analisar o cenário "${escolhido.titulo}" com foco nos canais públicos mais adequados. Vou usar apenas as informações que você decidir compartilhar.`,
      },
      { papel: 'usuario', conteudo: escolhido.texto },
    ];
    setResultado(undefined);
    setErro(undefined);
    setAbaAtiva('chat');
    void processarTriagem(novoHistorico, true);
  }

  function recomecar() {
    setMensagens([MENSAGEM_ABERTURA]);
    setResultado(undefined);
    setErro(undefined);
    setAbaAtiva('inicio');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fb] text-slate-900">
      <a href="#conteudo-principal" className="skip-link">
        Ir para o conteúdo principal
      </a>

      {/* Cabeçalho Oficial Gov.br (com acessibilidade, logos SVG e abas) */}
      <GovHeader abaAtiva={abaAtiva} aoMudarAba={setAbaAtiva} />

      {/* Conteúdo Principal Dinâmico por Aba */}
      <main
        id="conteudo-principal"
        tabIndex={-1}
        className={
          abaAtiva === 'inicio'
            ? 'flex-1 w-full'
            : 'flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8'
        }
      >
        {abaAtiva === 'inicio' && (
          <TelaInicial
            aoComecar={() => setAbaAtiva('chat')}
            aoVerCatalogo={() => setAbaAtiva('catalogo')}
            aoVerCenarios={() => setAbaAtiva('cenarios')}
          />
        )}

        {abaAtiva === 'catalogo' && (
          <Portifolio aoSelecionarDireitoParaChat={aoSelecionarDireitoParaChat} />
        )}

        {abaAtiva === 'cenarios' && (
          <CenariosVida aoSelecionarCenarioParaChat={aoSelecionarCenarioParaChat} />
        )}

        {abaAtiva === 'chat' && (
          <Chat
            mensagens={mensagens}
            enviando={enviando}
            erro={erro}
            aoEnviar={aoEnviar}
            aoLimpar={recomecar}
          />
        )}

        {abaAtiva === 'resultado' && resultado && (
          <LinhaDaVida
            resultado={resultado}
            aoRecomecar={recomecar}
            aoVerCatalogo={() => setAbaAtiva('catalogo')}
          />
        )}
      </main>

      {/* Rodapé Oficial Gov.br (com logo PNG, contatos governamentais e disclaimer RF06) */}
      <GovFooter aoMudarAba={setAbaAtiva} />
      <AvisoDemo
        aberto={pendente !== null}
        contexto={pendente?.tipo === 'cenario' ? { titulo: pendente.titulo, texto: pendente.texto } : pendente?.tipo === 'texto' ? { titulo: 'Seu relato', texto: pendente.texto } : undefined}
        aoAceitar={aceitarDemonstracao}
        aoFechar={() => setPendente(null)}
      />
    </div>
  );
}
