import { LayoutInstitucional } from './LayoutInstitucional';
export function PaginaPrivacidade(){ return <LayoutInstitucional etiqueta="Transparência" titulo="Privacidade e dados" resumo="O que acontece com o seu texto durante a demonstração e quais cuidados continuam sendo necessários." secoes={[
  {id:'coleta',titulo:'O que pedimos',conteudo:<p>Não exigimos cadastro, login, nome, CPF ou RG. Conte somente aspectos gerais da situação necessários para orientar possibilidades.</p>},
  {id:'processamento',titulo:'Como o texto é processado',conteudo:<><p>O histórico permanece somente nesta aba e é enviado ao servidor a cada turno necessário. A aplicação não possui tabela de conversas ou perfis.</p><p>Padrões reconhecíveis de CPF, telefone, e-mail e CEP são mascarados antes da chamada ao provedor externo de inteligência artificial, atualmente Gemini. O mascaramento reduz exposição, mas não garante anonimização completa.</p></>},
  {id:'registros',titulo:'Armazenamento e registros',conteudo:<p>O backend desativa logs de requisição e não deve registrar o corpo da conversa. Fechar ou recarregar a aba e usar “Limpar e recomeçar” remove o histórico mantido pelo frontend.</p>},
  {id:'cuidados',titulo:'Cuidados ao conversar',conteudo:<p>Não envie dados pessoais seus ou de terceiros. A demonstração não oferece canal individual para pedidos envolvendo dados pessoais.</p>},
]} />; }
