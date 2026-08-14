import { useEffect, useState } from 'react';
import { enviarTriagem } from './api';
import { Conversa } from './componentes/conversa/Conversa';
import { Resultado } from './componentes/resultado/Resultado';
import { Inicio } from './componentes/inicio/Inicio';
import { Direitos } from './componentes/direitos/Direitos';
import { Situacoes } from './componentes/situacoes/Situacoes';
import { Cabecalho } from './componentes/layout/Cabecalho';
import { Rodape } from './componentes/layout/Rodape';
import { ConsentimentoDemo } from './componentes/ConsentimentoDemo';
import { Urgencia } from './componentes/resultado/Urgencia';
import type { AbaNavegacao, ItemLinhaDaVida, MensagemChat, RespostaTriagem } from './tipos';
import type { Situacao } from './dados/situacoes';
import { PaginaAcessibilidade } from './componentes/institucional/PaginaAcessibilidade';
import { PaginaPrivacidade } from './componentes/institucional/PaginaPrivacidade';
import { PaginaTermos } from './componentes/institucional/PaginaTermos';
import { PaginaSobre } from './componentes/institucional/PaginaSobre';

// Primeira fala do assistente — local, sem custo de LLM (RF01: acolhedora e sem pedir PII).
const MENSAGEM_ABERTURA: MensagemChat = {
  papel: 'assistente',
  conteudo:
    'Olá! Vou ajudar você a organizar direitos possíveis e descobrir onde confirmar.\n\n' +
    'Não envie nome completo, CPF, RG, endereço, telefone ou e-mail.\n\n' +
    'Para começar, conte o que aconteceu. Pode falar de trabalho, renda, saúde ou de alguém de quem você cuida.',
};

function obterAbaPorHash(): AbaNavegacao | undefined {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'direitos') return 'catalogo';
  if (hash === 'situacoes') return 'cenarios';
  if (hash === 'conversa') return 'chat';
  if (hash === 'catalogo' || hash === 'cenarios' || hash === 'chat') return hash;
  if (hash === 'inicio') return 'inicio';
  if (hash === 'acessibilidade' || hash === 'privacidade' || hash === 'termos' || hash === 'sobre') return hash;
  return undefined;
}

function obterAbaInicial(): AbaNavegacao {
  return obterAbaPorHash() ?? 'inicio';
}

const VISAO_CANONICA: Record<AbaNavegacao, string> = {
  inicio: 'inicio',
  catalogo: 'direitos',
  cenarios: 'situacoes',
  chat: 'conversa',
  resultado: 'resultado',
  acessibilidade: 'acessibilidade',
  privacidade: 'privacidade',
  termos: 'termos',
  sobre: 'sobre',
};

export function App() {
  const [abaAtiva, setAbaAtiva] = useState<AbaNavegacao>(obterAbaInicial);
  const [mensagens, setMensagens] = useState<MensagemChat[]>([MENSAGEM_ABERTURA]);
  const [resultado, setResultado] = useState<Extract<RespostaTriagem, { tipo: 'orientacao' | 'sem_match' }>>();
  const [urgencia, setUrgencia] = useState<Extract<RespostaTriagem, { tipo: 'urgencia' }>>();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string>();
  const [aceiteDemo, setAceiteDemo] = useState(false);
  const [consentimentoAberto, setConsentimentoAberto] = useState(() => obterAbaInicial() === 'chat');
  const [historicoPendente, setHistoricoPendente] = useState<MensagemChat[]>();
  const [historicoFalho, setHistoricoFalho] = useState<MensagemChat[]>();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (abaAtiva !== 'resultado') {
      window.history.replaceState(null, '', `#${VISAO_CANONICA[abaAtiva]}`);
    }
  }, [abaAtiva]);

  useEffect(() => {
    function sincronizarComEndereco() {
      const proximaAba = obterAbaPorHash();
      if (!proximaAba) return;

      if (proximaAba === 'chat' && !aceiteDemo) {
        setHistoricoPendente(undefined);
        setConsentimentoAberto(true);
        return;
      }

      setConsentimentoAberto(false);
      setAbaAtiva(proximaAba);
    }

    window.addEventListener('hashchange', sincronizarComEndereco);
    return () => window.removeEventListener('hashchange', sincronizarComEndereco);
  }, [aceiteDemo]);

  async function processarTriagem(historico: MensagemChat[], aceite = aceiteDemo) {
    setMensagens(historico);
    setEnviando(true);
    setErro(undefined);
    setAbaAtiva('chat'); // Garante que a tela de chat esteja visível

    try {
      const resposta = await enviarTriagem(historico, aceite);
      setHistoricoFalho(undefined);
      if (resposta.tipo === 'pergunta') {
        setMensagens([...historico, { papel: 'assistente', conteudo: resposta.mensagem }]);
      } else if (resposta.tipo === 'urgencia') {
        setUrgencia(resposta);
        setResultado(undefined);
        setAbaAtiva('resultado');
      } else {
        setUrgencia(undefined);
        setResultado(resposta);
        setAbaAtiva('resultado');
      }
    } catch (excecao) {
      setErro((excecao as Error).message);
      setHistoricoFalho(historico);
      // Mantém a mensagem do usuário no histórico para tentar de novo.
    } finally {
      setEnviando(false);
    }
  }

  async function aoEnviar(texto: string) {
    const historico = [...mensagens, { papel: 'usuario', conteudo: texto } as MensagemChat];
    await processarTriagem(historico);
  }

  function tentarNovamente() {
    if (historicoFalho) void processarTriagem(historicoFalho);
  }

  function mudarAba(aba: AbaNavegacao) {
    if (aba === 'chat' && !aceiteDemo) {
      setHistoricoPendente(undefined);
      setConsentimentoAberto(true);
      return;
    }
    setAbaAtiva(aba);
  }

  function aceitarDemo() {
    setAceiteDemo(true);
    setConsentimentoAberto(false);
    const pendente = historicoPendente;
    setHistoricoPendente(undefined);
    if (pendente) {
      setMensagens(pendente);
      if (pendente.at(-1)?.papel === 'usuario') void processarTriagem(pendente, true);
      else setAbaAtiva('chat');
      return;
    }
    setAbaAtiva('chat');
  }

  // Integração entre a biblioteca de direitos e a conversa
  function aoConversarSobreDireito(item: ItemLinhaDaVida) {
    const novoHistorico: MensagemChat[] = [
      MENSAGEM_ABERTURA,
      {
        papel: 'assistente',
        conteudo: `Excelente escolha! Para verificarmos se você tem direito ao **${item.nome_popular}** (${item.criterios_elegibilidade}), me conte rapidamente um pouco da sua renda mensal familiar e quantas pessoas moram com você.`,
      },
    ];
    setResultado(undefined);
    setUrgencia(undefined);
    setErro(undefined);
    if (!aceiteDemo) {
      setHistoricoPendente(novoHistorico);
      setConsentimentoAberto(true);
    } else {
      setMensagens(novoHistorico);
      setAbaAtiva('chat');
    }
  }

  // Integração entre situações cotidianas e a conversa
  function prepararConversaDeSituacao(cenarioNome: string, mensagemInicial: string) {
    const novoHistorico: MensagemChat[] = [
      MENSAGEM_ABERTURA,
      {
        papel: 'assistente',
        conteudo: `Vamos analisar o cenário "${cenarioNome}" com foco nos canais públicos mais adequados. Vou usar apenas as informações que você decidir compartilhar.`,
      },
      { papel: 'usuario', conteudo: mensagemInicial },
    ];
    setResultado(undefined);
    setUrgencia(undefined);
    setErro(undefined);
    if (!aceiteDemo) {
      setHistoricoPendente(novoHistorico);
      setConsentimentoAberto(true);
    } else {
      void processarTriagem(novoHistorico);
    }
  }

  function recomecar() {
    setMensagens([MENSAGEM_ABERTURA]);
    setResultado(undefined);
    setUrgencia(undefined);
    setErro(undefined);
    setAceiteDemo(false);
    setAbaAtiva('inicio');
  }

  function aoSelecionarSituacao(situacao: Situacao) {
    prepararConversaDeSituacao(situacao.titulo, situacao.mensagemInicial);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fb] text-slate-900">
      <a href="#conteudo-principal" className="skip-link">
        Ir para o conteúdo principal
      </a>

      <Cabecalho abaAtiva={abaAtiva} aoMudarAba={mudarAba} />

      {/* Conteúdo Principal Dinâmico por Aba */}
      <main
        id="conteudo-principal"
        tabIndex={-1}
        data-view={VISAO_CANONICA[abaAtiva]}
        className={
          abaAtiva === 'inicio'
            ? 'flex-1 w-full'
            : abaAtiva === 'chat'
              ? 'flex-1 min-h-0 w-full'
            : 'flex-1 w-full'
        }
      >
        {abaAtiva === 'inicio' && (
          <Inicio
            aoComecar={() => mudarAba('chat')}
            aoVerDireitos={() => setAbaAtiva('catalogo')}
            aoVerSituacoes={() => setAbaAtiva('cenarios')}
            aoEscolherSituacao={aoSelecionarSituacao}
          />
        )}

        {abaAtiva === 'catalogo' && (
          <Direitos aoConversarSobre={aoConversarSobreDireito} />
        )}

        {abaAtiva === 'cenarios' && (
          <Situacoes aoEscolher={aoSelecionarSituacao} />
        )}

        {abaAtiva === 'chat' && (
          <Conversa
            mensagens={mensagens}
            enviando={enviando}
            erro={erro}
            aoEnviar={aoEnviar}
            aoLimpar={recomecar}
            aoTentarNovamente={tentarNovamente}
          />
        )}

        {abaAtiva === 'resultado' && resultado && (
          <Resultado
            resposta={resultado}
            aoRecomecar={recomecar}
            aoVerDireitos={() => setAbaAtiva('catalogo')}
          />
        )}

        {abaAtiva === 'resultado' && urgencia && (
          <Urgencia resposta={urgencia} aoSair={recomecar} />
        )}

        {abaAtiva === 'acessibilidade' && <PaginaAcessibilidade />}
        {abaAtiva === 'privacidade' && <PaginaPrivacidade />}
        {abaAtiva === 'termos' && <PaginaTermos />}
        {abaAtiva === 'sobre' && <PaginaSobre />}
      </main>

      {abaAtiva !== 'chat' && <Rodape aoMudarAba={mudarAba} />}
      {consentimentoAberto && (
        <ConsentimentoDemo
          aoAceitar={aceitarDemo}
          aoCancelar={() => {
            setConsentimentoAberto(false);
            setHistoricoPendente(undefined);
            if (abaAtiva === 'chat') setAbaAtiva('inicio');
          }}
        />
      )}
    </div>
  );
}
