import { LayoutInstitucional } from './LayoutInstitucional';
export function PaginaSobre(){ return <LayoutInstitucional etiqueta="Projeto aberto" titulo="Sobre o Direito Vivo" resumo="Uma demonstração brasileira para transformar uma situação de vida em próximos passos verificáveis." secoes={[
  {id:'problema',titulo:'Por que existe',conteudo:<p>Muitas pessoas sabem o que aconteceu com elas, mas não conhecem o nome do direito ou a porta pública correta. O projeto começa pela linguagem da vida real.</p>},
  {id:'metodo',titulo:'Como funciona',conteudo:<p>A pessoa escolhe uma entre 12 situações ou conversa livremente. A triagem consulta uma base curada e apresenta somente os 7 conteúdos atualmente publicáveis, com fontes e datas de revisão.</p>},
  {id:'tecnologia',titulo:'Tecnologia e segurança',conteudo:<p>O frontend usa React; a API usa Fastify; o motor de busca e triagem usa RAG, Gemini e Supabase. O sistema não cria conta nem salva conversas no banco da aplicação.</p>},
  {id:'aberto',titulo:'Código e limitações',conteudo:<p>Este é um projeto de demonstração, ainda sujeito a falhas e revisão. <a href="https://github.com/Gabrieldev707/DireitoVivo" target="_blank" rel="noreferrer">Veja o código no GitHub</a>.</p>},
]} />; }
