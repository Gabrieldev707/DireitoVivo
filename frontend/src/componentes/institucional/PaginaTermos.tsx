import { LayoutInstitucional } from './LayoutInstitucional';
export function PaginaTermos(){ return <LayoutInstitucional etiqueta="Antes de usar" titulo="Termos e limites" resumo="O Direito Vivo ajuda a organizar caminhos, mas não substitui decisões nem atendimentos oficiais." secoes={[
  {id:'independente',titulo:'Projeto independente',conteudo:<p>O Direito Vivo não representa o Governo Federal, prefeituras, INSS, SUS, Defensoria ou qualquer outro órgão público.</p>},
  {id:'orientacao',titulo:'Orientação, não decisão',conteudo:<p>A inteligência artificial apresenta possibilidades. Ela não concede benefício, não determina elegibilidade e não substitui orientação jurídica, médica ou assistencial.</p>},
  {id:'fontes',titulo:'Confirme nas fontes oficiais',conteudo:<p>Regras, prazos e canais podem mudar. Confirme os requisitos no canal oficial indicado e observe a data de revisão de cada conteúdo.</p>},
  {id:'emergencia',titulo:'Situações urgentes',conteudo:<p>Em risco imediato, use os canais de emergência mostrados pela aplicação. A conversa não deve atrasar a busca por ajuda presencial ou telefônica.</p>},
]} />; }
