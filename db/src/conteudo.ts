export type StatusConteudo = 'rascunho' | 'revisao_pendente' | 'publicavel' | 'expirado';

export interface CriterioEstruturado {
  id: string;
  descricao: string;
  confirmacao: 'autodeclaracao' | 'documental' | 'avaliacao_oficial';
}

export interface FonteOficial {
  titulo: string;
  url: string;
  orgao: string;
  acessado_em: string;
}

export interface ItemConteudo {
  id: string;
  nome_popular: string;
  resumo_simples: string;
  criterios_elegibilidade: string;
  criterios_estruturados: CriterioEstruturado[];
  documentos_necessarios: string[];
  canal_solicitacao: { tipo: string; detalhe: string };
  passo_a_passo: string[];
  fonte_legal: string;
  excecoes_e_alertas: string[];
  fontes_oficiais: FonteOficial[];
  status_conteudo: StatusConteudo;
  revisado_por: string;
  ultima_revisao: string;
  revisao_prevista_em: string;
  vigencia_inicio: string | null;
  vigencia_fim: string | null;
  versao_conteudo: number;
  programa_temporario?: boolean;
}

export type SeveridadeProblema = 'erro' | 'aviso';

export interface ProblemaConteudo {
  item_id: string;
  codigo: string;
  severidade: SeveridadeProblema;
  mensagem: string;
}

const DOMINIOS_EXATOS = new Set([
  'gov.br',
  'planalto.gov.br',
  'in.gov.br',
  'camara.leg.br',
  'senado.leg.br',
  'cnj.jus.br',
  'stf.jus.br',
  'stj.jus.br',
  'caixa.gov.br',
  'dataprev.gov.br',
]);
const STATUS_VALIDOS = new Set<StatusConteudo>([
  'rascunho',
  'revisao_pendente',
  'publicavel',
  'expirado',
]);

function dominioOuSubdominio(host: string, dominio: string): boolean {
  return host === dominio || host.endsWith(`.${dominio}`);
}

export function dominioEhOficial(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, '');
  if ([...DOMINIOS_EXATOS].some((dominio) => dominioOuSubdominio(host, dominio))) return true;
  if (/^(?:[a-z0-9-]+\.)*tr[ft]\d+\.jus\.br$/.test(host)) return true;
  if (/^(?:[a-z0-9-]+\.)*defensoria\.[a-z]{2}\.def\.br$/.test(host)) return true;
  return false;
}

function dataIsoValida(data: string | null | undefined): data is string {
  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  return !Number.isNaN(Date.parse(`${data}T00:00:00Z`));
}

function adicionar(
  problemas: ProblemaConteudo[],
  item: Pick<ItemConteudo, 'id'>,
  codigo: string,
  severidade: SeveridadeProblema,
  mensagem: string,
): void {
  problemas.push({ item_id: item.id, codigo, severidade, mensagem });
}

function auditarFonte(
  item: ItemConteudo,
  fonte: FonteOficial,
  problemas: ProblemaConteudo[],
): void {
  let url: URL;
  try {
    url = new URL(fonte.url);
  } catch {
    adicionar(problemas, item, 'fonte_url_invalida', 'erro', `URL inválida: ${fonte.url}`);
    return;
  }
  if (url.protocol !== 'https:') {
    adicionar(problemas, item, 'fonte_url_insegura', 'erro', `Fonte precisa usar HTTPS: ${fonte.url}`);
  }
  if (!dominioEhOficial(url.hostname)) {
    adicionar(
      problemas,
      item,
      'fonte_dominio_nao_oficial',
      'erro',
      `Domínio não permitido como fonte oficial: ${url.hostname}`,
    );
  }
  if (!fonte.titulo?.trim() || !fonte.orgao?.trim() || !dataIsoValida(fonte.acessado_em)) {
    adicionar(problemas, item, 'fonte_incompleta', 'erro', 'Fonte sem título, órgão ou data de acesso válida.');
  }
}

function camposEssenciaisVazios(item: ItemConteudo): string[] {
  const campos: Array<[string, unknown]> = [
    ['id', item.id],
    ['nome_popular', item.nome_popular],
    ['resumo_simples', item.resumo_simples],
    ['criterios_elegibilidade', item.criterios_elegibilidade],
    ['criterios_estruturados', item.criterios_estruturados],
    ['documentos_necessarios', item.documentos_necessarios],
    ['canal_solicitacao.detalhe', item.canal_solicitacao?.detalhe],
    ['passo_a_passo', item.passo_a_passo],
    ['fonte_legal', item.fonte_legal],
    ['revisado_por', item.revisado_por],
  ];
  return campos
    .filter(([, valor]) =>
      Array.isArray(valor) ? valor.length === 0 : typeof valor !== 'string' || valor.trim() === '',
    )
    .map(([nome]) => nome);
}

function textoAuditavel(item: ItemConteudo): string {
  return [
    item.resumo_simples,
    item.criterios_elegibilidade,
    ...(item.excecoes_e_alertas ?? []),
    ...(item.passo_a_passo ?? []),
  ].join(' ');
}

export function auditarItens(itens: ItemConteudo[], hoje: string): ProblemaConteudo[] {
  if (!dataIsoValida(hoje)) throw new Error(`Data de auditoria inválida: ${hoje}`);
  const problemas: ProblemaConteudo[] = [];
  const idsVistos = new Set<string>();

  for (const item of itens) {
    if (idsVistos.has(item.id)) {
      adicionar(problemas, item, 'id_duplicado', 'erro', `ID duplicado: ${item.id}`);
    }
    idsVistos.add(item.id);

    if (!STATUS_VALIDOS.has(item.status_conteudo)) {
      adicionar(problemas, item, 'status_invalido', 'erro', 'Status editorial ausente ou inválido.');
      continue;
    }

    if (item.status_conteudo !== 'publicavel') {
      adicionar(
        problemas,
        item,
        'item_nao_publicavel',
        'aviso',
        `Item marcado como ${item.status_conteudo}; não pode entrar na demo.`,
      );
      continue;
    }

    const vazios = camposEssenciaisVazios(item);
    if (vazios.length > 0) {
      adicionar(
        problemas,
        item,
        'campo_essencial_vazio',
        'erro',
        `Campos essenciais vazios: ${vazios.join(', ')}.`,
      );
    }

    if (!Array.isArray(item.fontes_oficiais) || item.fontes_oficiais.length === 0) {
      adicionar(problemas, item, 'fonte_ausente', 'erro', 'Item publicável precisa de fonte oficial.');
    } else {
      item.fontes_oficiais.forEach((fonte) => auditarFonte(item, fonte, problemas));
    }

    if (!dataIsoValida(item.ultima_revisao) || !dataIsoValida(item.revisao_prevista_em)) {
      adicionar(problemas, item, 'data_revisao_invalida', 'erro', 'Datas de revisão precisam usar AAAA-MM-DD.');
    } else if (item.revisao_prevista_em < hoje) {
      adicionar(problemas, item, 'revisao_vencida', 'erro', 'A revisão editorial está vencida.');
    }

    if (item.vigencia_inicio !== null && !dataIsoValida(item.vigencia_inicio)) {
      adicionar(problemas, item, 'vigencia_invalida', 'erro', 'Data inicial de vigência inválida.');
    }
    if (item.vigencia_fim !== null && !dataIsoValida(item.vigencia_fim)) {
      adicionar(problemas, item, 'vigencia_invalida', 'erro', 'Data final de vigência inválida.');
    } else if (item.vigencia_fim !== null && item.vigencia_fim < hoje) {
      adicionar(problemas, item, 'vigencia_encerrada', 'erro', 'A vigência do conteúdo foi encerrada.');
    }
    if (item.programa_temporario === true && item.vigencia_fim === null) {
      adicionar(
        problemas,
        item,
        'programa_temporario_sem_vigencia',
        'erro',
        'Programa temporário precisa declarar vigência final.',
      );
    }

    if (/\b(?:direito garantido|você tem direito|voce tem direito|aprovação garantida)\b/i.test(textoAuditavel(item))) {
      adicionar(
        problemas,
        item,
        'afirmacao_absoluta',
        'erro',
        'Conteúdo contém afirmação absoluta proibida.',
      );
    }
    if (!Number.isInteger(item.versao_conteudo) || item.versao_conteudo < 1) {
      adicionar(problemas, item, 'versao_invalida', 'erro', 'Versão do conteúdo precisa ser inteira e positiva.');
    }
  }

  return problemas;
}

export function podeSerPublicado(item: ItemConteudo, hoje: string): boolean {
  if (item.status_conteudo !== 'publicavel') return false;
  return !auditarItens([item], hoje).some((problema) => problema.severidade === 'erro');
}
