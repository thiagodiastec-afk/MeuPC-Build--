export interface LiveStoreOffer {
  storeName: string;
  priceCash: number;
  priceInstallments: number;
  url: string;
  inStock: boolean;
  isLowest?: boolean;
  badge?: string;
}

export interface LivePriceSearchResult {
  productName: string;
  lowestPriceCash: number;
  lowestPriceInstallments: number;
  bestStore: string;
  stores: LiveStoreOffer[];
  marketAnalysis?: string;
}

export interface LiveSearchApiResponse {
  success: boolean;
  data: LivePriceSearchResult;
  groundingSources?: Array<{ title: string; url: string }>;
  timestamp: string;
  error?: string;
  fallback?: boolean;
}

export interface LiveSyncItemResult {
  id: string;
  category: string;
  name: string;
  currentCash: number;
  currentInstallments: number;
  bestStore: string;
  priceChangeStatus: 'abaixou' | 'subiu' | 'estável';
  verifiedNote?: string;
}

export interface LiveSyncApiResponse {
  success: boolean;
  message?: string;
  products?: any[];
  data?: {
    success?: boolean;
    updatedItems?: LiveSyncItemResult[];
    totalCash?: number;
    totalInstallments?: number;
    syncSummary?: string;
  };
  groundingSources?: Array<{ title: string; url: string }>;
  timestamp?: string;
  error?: string;
}

/**
 * Executes a real-time price search on Brazilian stores using Google Search Grounding.
 */
export async function searchLivePrice(
  query: string,
  category?: string,
  currentPrice?: number
): Promise<LiveSearchApiResponse> {
  const res = await fetch('/api/prices/live-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, category, currentPrice }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Não foi possível obter os preços em tempo real no momento, tente novamente em instantes');
  }

  return res.json();
}

/**
 * Synchronizes and verifies real-time prices for an entire build list.
 */
export async function syncBuildPricesLive(
  items: Array<{ id: string; category: string; name: string; currentCash: number }>
): Promise<LiveSyncApiResponse> {
  try {
    const res = await fetch('/api/prices/live-sync-build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        message: err.message || err.error || 'Não foi possível obter os preços em tempo real no momento, tente novamente em instantes',
        products: [],
        timestamp: new Date().toISOString(),
      };
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Erro na chamada syncBuildPricesLive:", err);
    return {
      success: false,
      message: 'Não foi possível obter os preços em tempo real no momento, tente novamente em instantes',
      products: [],
      timestamp: new Date().toISOString(),
    };
  }
}
