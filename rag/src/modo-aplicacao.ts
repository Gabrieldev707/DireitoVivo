export type ModoAplicacao = 'desenvolvimento' | 'demo' | 'producao';

const MODOS_VALIDOS = new Set<ModoAplicacao>(['desenvolvimento', 'demo', 'producao']);

export function obterModoAplicacao(
  ambiente: Pick<NodeJS.ProcessEnv, 'MODO_APLICACAO'> = process.env,
): ModoAplicacao {
  const valor = ambiente.MODO_APLICACAO?.trim() || 'desenvolvimento';
  if (!MODOS_VALIDOS.has(valor as ModoAplicacao)) {
    throw new Error(
      `MODO_APLICACAO inválido: "${valor}". Use desenvolvimento, demo ou producao.`,
    );
  }
  return valor as ModoAplicacao;
}

export function validarModoAplicacao(modo: ModoAplicacao): void {
  if (modo === 'producao') {
    throw new Error(
      'O modo producao não está liberado: use demo até haver governança aprovada para dados reais.',
    );
  }
}
