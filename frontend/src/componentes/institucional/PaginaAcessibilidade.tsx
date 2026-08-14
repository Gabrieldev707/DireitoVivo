import { LayoutInstitucional } from './LayoutInstitucional';

export function PaginaAcessibilidade() {
  return <LayoutInstitucional etiqueta="Uso para todas as pessoas" titulo="Acessibilidade e como usar" resumo="Recursos para ler, navegar e conversar com mais autonomia — sem separar pessoas em uma versão diferente do serviço." secoes={[
    { id:'recursos', titulo:'Recursos disponíveis', conteudo:<><p>Você pode aumentar o texto, reforçar o contraste, destacar links e reduzir movimentos no botão Acessibilidade.</p><ul><li>Leitura em voz alta das respostas.</li><li>Navegação completa por teclado.</li><li>Modo de conversa guiada com botões grandes.</li><li>Texto livre sempre disponível.</li></ul><a className="dv-button dv-button--primary" href="#conversa" onClick={() => sessionStorage.setItem('direito-vivo-iniciar-guiado','true')}>Iniciar conversa guiada</a></> },
    { id:'teclado', titulo:'Usar sem mouse', conteudo:<p>Use Tab para avançar, Shift + Tab para voltar, Enter ou Espaço para ativar controles e Escape para fechar painéis. O link “Ir para o conteúdo principal” aparece ao receber foco.</p> },
    { id:'leitores', titulo:'Leitores de tela', conteudo:<p>As regiões da página, mensagens novas, estados de carregamento e erros recebem nomes e anúncios próprios. A validação manual com NVDA complementa os testes automáticos.</p> },
    { id:'voz', titulo:'Voz e suas limitações', conteudo:<p>O reconhecimento de voz não funciona em todos os navegadores e pode usar um serviço externo do próprio navegador. Quando disponível, a transcrição precisa ser revisada antes do envio. O texto permanece como alternativa.</p> },
    { id:'barreira', titulo:'Relatar uma barreira', conteudo:<p>Você pode <a href="https://github.com/Gabrieldev707/DireitoVivo/issues" target="_blank" rel="noreferrer">abrir uma issue no GitHub</a>. Não publique nome, documentos, endereço, telefone ou detalhes pessoais.</p> },
  ]} />;
}
