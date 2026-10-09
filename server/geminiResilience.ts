let lastQuotaExceededAt = 0;
let lastErrorMessage = '';
const COOLDOWN_MS = 20 * 1000; // 20 seconds short cooldown

export function isGeminiQuotaDepleted(): boolean {
  return Date.now() - lastQuotaExceededAt < COOLDOWN_MS;
}

export function recordGeminiQuotaDepleted(errMsg: string = ''): void {
  lastQuotaExceededAt = Date.now();
  lastErrorMessage = errMsg;
}

export function getLastQuotaNotice(): string {
  return 'A cota de busca em tempo real via IA atingiu o limite temporário (Erro 429). Exibindo cotações de referência calibradas de lojas brasileiras com links oficiais para compra.';
}

export function parseGeminiError(error: any): { is429: boolean; message: string } {
  const errMsg = typeof error === 'string' ? error : (error?.message || JSON.stringify(error || ''));
  const is429 = 
    error?.status === 429 ||
    error?.status === 'RESOURCE_EXHAUSTED' ||
    error?.code === 429 ||
    errMsg.includes('429') ||
    errMsg.includes('RESOURCE_EXHAUSTED') ||
    errMsg.includes('credits are depleted') ||
    errMsg.includes('prepayment') ||
    errMsg.includes('quota') ||
    errMsg.includes('Quota exceeded');

  if (is429) {
    recordGeminiQuotaDepleted(errMsg);
    return {
      is429: true,
      message: 'Cota de requisições de IA atingiu o limite temporário (429: RESOURCE_EXHAUSTED). Operando em modo de contingência.',
    };
  }

  return {
    is429: false,
    message: errMsg || 'Erro de conexão com serviço de IA.',
  };
}

export function handleGeminiError(endpointName: string, error: any): boolean {
  const parsed = parseGeminiError(error);
  if (parsed.is429) {
    console.log(`[MeuPC Backend] Aviso de Cota em ${endpointName}: 429 RESOURCE_EXHAUSTED.`);
    return true;
  }
  console.log(`[MeuPC Backend] Aviso em ${endpointName}: ${parsed.message}`);
  return false;
}
