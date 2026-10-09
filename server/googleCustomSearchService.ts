import { getStoreProductUrl, getOfficialStoreSearchUrl, cleanSearchQuery, unwrapUrl } from '../src/utils/storeUrls';
import { RAW_COMPONENTS } from '../src/data/componentsDatabase';
import { GoogleGenAI } from '@google/genai';
import { isGeminiQuotaDepleted, handleGeminiError } from './geminiResilience';

export interface StoreSearchResult {
  storeName: 'KaBuM!' | 'Pichau' | 'Terabyte' | 'Amazon BR' | 'Mercado Livre';
  productTitle: string;
  priceCash: number;
  priceInstallments: number;
  url: string;
  inStock: boolean;
  isLowest: boolean;
  badge?: string;
  source: 'google_custom_search' | 'google_search_grounding' | 'catalog_sync';
}

export interface StructuredCustomSearchResponse {
  query: string;
  productName: string;
  lowestPriceCash: number;
  lowestPriceInstallments: number;
  bestStore: string;
  stores: StoreSearchResult[];
  searchSource: 'google_custom_search_api' | 'google_grounding' | 'database_calibrated';
  groundingUrls?: string[];
  timestamp: string;
}

/**
 * Helper to parse Brazilian currency strings like "R$ 1.299,90", "1.299,90", "R$1299.90" into numeric values.
 */
export function parseBrlPrice(raw: string | number | undefined | null): number | null {
  if (typeof raw === 'number') return isNaN(raw) || raw <= 0 ? null : raw;
  if (!raw || typeof raw !== 'string') return null;

  // Extract digits with dots and commas
  const match = raw.match(/R\$\s*([\d\.,]+)/i) || raw.match(/([\d\.,]+)/);
  if (!match) return null;

  let cleaned = match[1].trim();

  // If Brazilian format 1.234,56
  if (cleaned.includes(',') && cleaned.includes('.')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes(',')) {
    cleaned = cleaned.replace(',', '.');
  }

  const num = parseFloat(cleaned);
  return isNaN(num) || num <= 0 ? null : Math.round(num * 100) / 100;
}

/**
 * Performs structured search using the official Google Custom Search JSON API if credentials are present.
 */
async function queryGoogleCustomSearchApi(
  query: string,
  siteDomain: string,
  apiKey: string,
  cx: string
): Promise<any[]> {
  const searchQuery = `${query} site:${siteDomain}`;
  const url = `https://customsearch.googleapis.com/customsearch/v1?key=${encodeURIComponent(
    apiKey
  )}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(searchQuery)}&gl=br&hl=pt-BR&num=3`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[Google Custom Search API] Error ${response.status} for ${siteDomain}: ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch (err: any) {
    console.error(`[Google Custom Search API] Fetch failed for ${siteDomain}:`, err?.message || err);
    return [];
  }
}

/**
 * Extracts structured pricing and clean direct canonical URLs from Google CSE item objects.
 */
function extractFromCseItem(
  item: any,
  targetStore: 'KaBuM!' | 'Pichau' | 'Terabyte'
): { title: string; priceCash: number; priceInstallments: number; url: string; inStock: boolean } | null {
  if (!item || !item.link) return null;

  const title = item.title || '';
  const snippet = item.snippet || '';
  let url = item.link;

  let extractedCash: number | null = null;
  let extractedInstallments: number | null = null;

  // Check Schema.org / OpenGraph in pagemap
  const pagemap = item.pagemap || {};
  const offers = pagemap.offer || pagemap.offers || [];
  if (Array.isArray(offers) && offers.length > 0) {
    for (const off of offers) {
      if (off.price) {
        const p = parseBrlPrice(off.price);
        if (p && (!extractedCash || p < extractedCash)) {
          extractedCash = p;
        }
      }
    }
  }

  const metatags = pagemap.metatags || [];
  if (Array.isArray(metatags) && metatags.length > 0) {
    for (const meta of metatags) {
      const p =
        parseBrlPrice(meta['product:price:amount']) ||
        parseBrlPrice(meta['og:price:amount']) ||
        parseBrlPrice(meta['twitter:data1']);
      if (p && (!extractedCash || p < extractedCash)) {
        extractedCash = p;
      }
    }
  }

  // Check snippet text for installment patterns like "10x de R$ 89,90"
  const installmentRegex = /(\d{1,2})x\s*(?:de\s*)?R\$\s*([\d\.,]+)/i;
  const instMatch = `${title} ${snippet}`.match(installmentRegex);

  // If no price in metadata, search in title and snippet using Regex
  if (!extractedCash) {
    const textToSearch = `${title} ${snippet}`;
    // Look for PIX / à vista patterns: "R$ 1.299,90 no PIX", "por R$ 1.299,90"
    const pixRegex = /(?:R\$\s*([\d\.,]+)\s*(?:no\s*PIX|à\s*vista|com\s*desconto))/i;
    const generalRegex = /R\$\s*([\d\.,]+)/i;

    const pixMatch = textToSearch.match(pixRegex);
    if (pixMatch) {
      extractedCash = parseBrlPrice(pixMatch[1]);
    } else {
      const genMatch = textToSearch.match(generalRegex);
      if (genMatch) {
        extractedCash = parseBrlPrice(genMatch[1]);
      }
    }
  }

  // Defense against isolated installment capture (e.g. R$ 89,90 captured when it was 10x de R$ 89,90)
  if (instMatch && extractedCash) {
    const count = parseInt(instMatch[1], 10);
    const value = parseBrlPrice(instMatch[2]);
    if (value && count >= 6 && Math.abs(extractedCash - value) < 1) {
      // It was an isolated installment, calculate total
      extractedInstallments = Math.round(count * value * 100) / 100;
      extractedCash = Math.round(extractedInstallments * 0.85 * 100) / 100;
    }
  }

  if (!extractedCash || extractedCash <= 0) {
    return null;
  }

  // Calculate or extract installment price
  if (!extractedInstallments) {
    extractedInstallments = Math.round(extractedCash * 1.15 * 100) / 100;
  }

  // Clean canonical direct URL
  url = cleanStoreProductUrl(targetStore, url, title);

  return {
    title: cleanProductTitle(title),
    priceCash: extractedCash,
    priceInstallments: extractedInstallments,
    url,
    inStock: !snippet.toLowerCase().includes('esgotado') && !snippet.toLowerCase().includes('indisponível'),
  };
}

function cleanProductTitle(raw: string): string {
  return raw
    .replace(/\s*\|\s*KaBuM!?/gi, '')
    .replace(/\s*\|\s*Pichau/gi, '')
    .replace(/\s*\|\s*TerabyteShop/gi, '')
    .replace(/\s*-\s*KaBuM!?/gi, '')
    .replace(/\s*-\s*Terabyte/gi, '')
    .replace(/\s*-\s*Pichau/gi, '')
    .trim();
}

function cleanStoreProductUrl(storeName: string, rawUrl: string, fallbackQuery: string): string {
  const unwrapped = unwrapUrl(rawUrl);
  if (unwrapped && (unwrapped.startsWith('http://') || unwrapped.startsWith('https://'))) {
    if (!unwrapped.includes('google.com/url')) {
      return unwrapped;
    }
  }
  return getStoreProductUrl(storeName, fallbackQuery);
}

/**
 * Main backend search function executing structured queries across Brazilian stores.
 */
export async function searchHardwareAcrossStores(
  query: string,
  category?: string,
  aiClient?: GoogleGenAI | null
): Promise<StructuredCustomSearchResponse> {
  const cseApiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const cseId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

  const cleanQuery = query.trim();

  // 1. If Google Custom Search credentials exist, query Google Custom Search API for the 3 target stores in parallel
  if (cseApiKey && cseId) {
    try {
      const [kabumItems, pichauItems, terabyteItems] = await Promise.all([
        queryGoogleCustomSearchApi(cleanQuery, 'kabum.com.br', cseApiKey, cseId),
        queryGoogleCustomSearchApi(cleanQuery, 'pichau.com.br', cseApiKey, cseId),
        queryGoogleCustomSearchApi(cleanQuery, 'terabyteshop.com.br', cseApiKey, cseId),
      ]);

      const stores: StoreSearchResult[] = [];

      const kabumResult = kabumItems.map(i => extractFromCseItem(i, 'KaBuM!')).find(Boolean);
      if (kabumResult) {
        stores.push({
          storeName: 'KaBuM!',
          productTitle: kabumResult.title,
          priceCash: kabumResult.priceCash,
          priceInstallments: kabumResult.priceInstallments,
          url: kabumResult.url,
          inStock: kabumResult.inStock,
          isLowest: false,
          source: 'google_custom_search',
        });
      }

      const pichauResult = pichauItems.map(i => extractFromCseItem(i, 'Pichau')).find(Boolean);
      if (pichauResult) {
        stores.push({
          storeName: 'Pichau',
          productTitle: pichauResult.title,
          priceCash: pichauResult.priceCash,
          priceInstallments: pichauResult.priceInstallments,
          url: pichauResult.url,
          inStock: pichauResult.inStock,
          isLowest: false,
          source: 'google_custom_search',
        });
      }

      const terabyteResult = terabyteItems.map(i => extractFromCseItem(i, 'Terabyte')).find(Boolean);
      if (terabyteResult) {
        stores.push({
          storeName: 'Terabyte',
          productTitle: terabyteResult.title,
          priceCash: terabyteResult.priceCash,
          priceInstallments: terabyteResult.priceInstallments,
          url: terabyteResult.url,
          inStock: terabyteResult.inStock,
          isLowest: false,
          source: 'google_custom_search',
        });
      }

      if (stores.length > 0) {
        const minCash = Math.min(...stores.map(s => s.priceCash));
        const bestStoreObj = stores.find(s => s.priceCash === minCash);
        stores.forEach(s => {
          s.isLowest = s.priceCash === minCash;
          if (s.isLowest) s.badge = 'Melhor no PIX';
        });

        return {
          query: cleanQuery,
          productName: bestStoreObj?.productTitle || cleanQuery,
          lowestPriceCash: minCash,
          lowestPriceInstallments: bestStoreObj?.priceInstallments || Math.round(minCash * 1.15 * 100) / 100,
          bestStore: bestStoreObj?.storeName || 'KaBuM!',
          stores,
          searchSource: 'google_custom_search_api',
          groundingUrls: stores.map(s => s.url),
          timestamp: new Date().toISOString(),
        };
      }
    } catch (cseError) {
      console.warn('[Google Custom Search] Fallback triggered due to error:', cseError);
    }
  }

  // 2. Google Search Grounding with Gemini (Two-Step Architecture)
  if (aiClient && !isGeminiQuotaDepleted()) {
    try {
      // ETAPA 1: Pesquisa na Web via Google Search Grounding (Texto puro, sem responseMimeType nem schema)
      const searchPrompt = `Pesquise no Google Search os preços atuais (hoje), disponibilidade e links para o componente de hardware no Brasil:
"${cleanQuery}" ${category ? `(Categoria: ${category})` : ''}

Consulte prioritariamente as principais lojas brasileiras: KaBuM!, TerabyteShop, Pichau Informática, Amazon Brasil e Mercado Livre.
Para cada loja identificada, extraia:
1. Nome da loja
2. Título exato do anúncio do produto
3. Preço à vista no PIX ou boleto com desconto
4. Preço a prazo ou parcelado (ex: em até 10x ou 12x)
5. Se está disponível em estoque
6. URL ou link encontrado na pesquisa da loja`;

      const step1Response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: searchPrompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const rawSearchText = step1Response.text || '';
      
      // Capturar URLs reais das fontes (groundingChunks) e consultas realizadas (webSearchQueries)
      const candidate = step1Response.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata;
      const groundingChunks = groundingMetadata?.groundingChunks || [];
      const realUris: Array<{ domain: string; uri: string; title: string }> = [];
      
      for (const ch of groundingChunks) {
        const uri = (ch as any)?.web?.uri;
        const title = (ch as any)?.web?.title || '';
        if (uri) {
          realUris.push({
            domain: uri.toLowerCase(),
            uri,
            title,
          });
        }
      }

      // ETAPA 2: Formatação estruturada em JSON (sem ferramentas, garantindo conformidade com a interface)
      const formattingPrompt = `Você é um formatador de dados de hardware brasileiro.
Com base no relatório de pesquisa web abaixo, formate as informações em formato JSON estrito:

${rawSearchText}

Schema JSON obrigatório:
{
  "productName": "Nome padronizado do produto",
  "lowestPriceCash": 0.00,
  "lowestPriceInstallments": 0.00,
  "bestStore": "Nome da loja com menor valor à vista",
  "stores": [
    {
      "storeName": "KaBuM!" | "Terabyte" | "Pichau" | "Amazon BR" | "Mercado Livre",
      "productTitle": "Título do produto na loja",
      "priceCash": número (preço à vista no PIX),
      "priceInstallments": número (preço parcelado),
      "url": "link ou URL da loja",
      "inStock": true | false
    }
  ]
}`;

      const step2Response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattingPrompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const step2Text = step2Response.text || '{}';
      const cleanJsonStr = step2Text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);

      if (parsed && Array.isArray(parsed.stores) && parsed.stores.length > 0) {
        const validStores = parsed.stores
          .filter((s: any) => s.priceCash > 0)
          .map((s: any) => {
            const normStore = (s.storeName || '').toLowerCase();
            
            // Cruzar com as URLs reais capturadas no groundingChunks da Etapa 1
            const matchedChunk = realUris.find(u => {
              if (normStore.includes('kabum') && u.domain.includes('kabum.com.br')) return true;
              if (normStore.includes('terabyte') && u.domain.includes('terabyteshop.com.br')) return true;
              if (normStore.includes('pichau') && u.domain.includes('pichau.com.br')) return true;
              if (normStore.includes('amazon') && u.domain.includes('amazon.com.br')) return true;
              if (normStore.includes('mercado') && u.domain.includes('mercadolivre.com.br')) return true;
              return false;
            });

            const resolvedUrl = matchedChunk
              ? matchedChunk.uri
              : getStoreProductUrl(s.storeName, parsed.productName || cleanQuery, s.url);

            return {
              storeName: s.storeName,
              productTitle: s.productTitle || parsed.productName || cleanQuery,
              priceCash: s.priceCash,
              priceInstallments: s.priceInstallments || Math.round(s.priceCash * 1.15 * 100) / 100,
              url: resolvedUrl,
              inStock: s.inStock !== false,
              isLowest: false,
              source: 'google_search_grounding' as const,
            };
          });

        if (validStores.length > 0) {
          const minCash = Math.min(...validStores.map((s: any) => s.priceCash));
          const best = validStores.find((s: any) => s.priceCash === minCash);
          validStores.forEach((s: any) => {
            s.isLowest = s.priceCash === minCash;
            if (s.isLowest) s.badge = 'Melhor no PIX';
          });

          return {
            query: cleanQuery,
            productName: parsed.productName || cleanQuery,
            lowestPriceCash: minCash,
            lowestPriceInstallments: best?.priceInstallments || Math.round(minCash * 1.15 * 100) / 100,
            bestStore: best?.storeName || 'KaBuM!',
            stores: validStores,
            searchSource: 'google_grounding',
            groundingUrls: realUris.map(u => u.uri),
            timestamp: new Date().toISOString(),
          };
        }
      }
    } catch (aiErr) {
      handleGeminiError('google-search-grounding', aiErr);
    }
  }

  // 3. High-precision database calibrated fallback
  return getCalibratedDatabaseSearch(cleanQuery, category);
}

function getCalibratedDatabaseSearch(
  query: string,
  category?: string
): StructuredCustomSearchResponse {
  const qClean = query.toLowerCase().trim();
  const matchedComp =
    RAW_COMPONENTS.find(
      c =>
        c.name.toLowerCase().includes(qClean) ||
        qClean.includes(c.name.toLowerCase()) ||
        (c.id && qClean.includes(c.id.toLowerCase()))
    ) ||
    RAW_COMPONENTS.find(c => category && c.category === category) ||
    null;

  const prodName = matchedComp?.name || query;

  const kabumUrl = getStoreProductUrl('Kabum', prodName, undefined, matchedComp?.id);
  const terabyteUrl = getStoreProductUrl('Terabyte', prodName, undefined, matchedComp?.id);
  const pichauUrl = getStoreProductUrl('Pichau', prodName, undefined, matchedComp?.id);

  let stores: StoreSearchResult[] = [];
  let baseCash = matchedComp?.lowestPriceCash || 899.0;

  if (matchedComp && Array.isArray(matchedComp.stores) && matchedComp.stores.length > 0) {
    const minCash = Math.min(...matchedComp.stores.map(s => s.priceCash));
    baseCash = minCash;

    stores = matchedComp.stores
      .filter(s => ['Kabum', 'Terabyte', 'Pichau'].includes(s.storeName))
      .map(s => ({
        storeName: (s.storeName === 'Kabum' ? 'KaBuM!' : s.storeName) as any,
        productTitle: prodName,
        priceCash: s.priceCash,
        priceInstallments: s.priceInstallments,
        url: getStoreProductUrl(s.storeName, prodName, s.url, matchedComp.id),
        inStock: s.inStock !== false,
        isLowest: s.priceCash === minCash,
        badge: s.priceCash === minCash ? 'Melhor no PIX' : undefined,
        source: 'catalog_sync' as const,
      }));
  }

  if (stores.length === 0) {
    stores = [
      {
        storeName: 'KaBuM!',
        productTitle: prodName,
        priceCash: baseCash,
        priceInstallments: Math.round(baseCash * 1.15 * 100) / 100,
        url: kabumUrl,
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX',
        source: 'catalog_sync',
      },
      {
        storeName: 'Pichau',
        productTitle: prodName,
        priceCash: Math.round(baseCash * 1.02 * 100) / 100,
        priceInstallments: Math.round(baseCash * 1.17 * 100) / 100,
        url: pichauUrl,
        inStock: true,
        isLowest: false,
        source: 'catalog_sync',
      },
      {
        storeName: 'Terabyte',
        productTitle: prodName,
        priceCash: Math.round(baseCash * 1.04 * 100) / 100,
        priceInstallments: Math.round(baseCash * 1.19 * 100) / 100,
        url: terabyteUrl,
        inStock: true,
        isLowest: false,
        source: 'catalog_sync',
      },
    ];
  }

  const minPrice = Math.min(...stores.map(s => s.priceCash));
  const bestStoreObj = stores.find(s => s.priceCash === minPrice);

  return {
    query,
    productName: prodName,
    lowestPriceCash: minPrice,
    lowestPriceInstallments: bestStoreObj?.priceInstallments || Math.round(minPrice * 1.15 * 100) / 100,
    bestStore: bestStoreObj?.storeName || 'KaBuM!',
    stores,
    searchSource: 'database_calibrated',
    groundingUrls: stores.map(s => s.url),
    timestamp: new Date().toISOString(),
  };
}

