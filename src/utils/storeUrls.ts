/**
 * Utility functions and URL Validator for generating direct product and search links
 * for consolidated Brazilian hardware stores (KaBuM!, Pichau, Terabyte, Amazon BR, Mercado Livre).
 */

export type HardwareStoreName = 'Kabum' | 'Terabyte' | 'Pichau' | 'Amazon BR' | 'Mercado Livre' | string;

export interface StoreMeta {
  name: string;
  domain: string;
  homeUrl: string;
  searchPattern: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const STORE_METAS: Record<string, StoreMeta> = {
  Kabum: {
    name: 'Kabum',
    domain: 'kabum.com.br',
    homeUrl: 'https://www.kabum.com.br',
    searchPattern: 'https://www.kabum.com.br/busca/{query}',
    badgeBg: 'bg-orange-500/10',
    badgeText: 'text-orange-400 hover:text-orange-300',
    badgeBorder: 'border-orange-500/20 hover:border-orange-500/40',
  },
  Terabyte: {
    name: 'Terabyte',
    domain: 'terabyteshop.com.br',
    homeUrl: 'https://www.terabyteshop.com.br',
    searchPattern: 'https://www.terabyteshop.com.br/busca?str={query}',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400 hover:text-emerald-300',
    badgeBorder: 'border-emerald-500/20 hover:border-emerald-500/40',
  },
  Pichau: {
    name: 'Pichau',
    domain: 'pichau.com.br',
    homeUrl: 'https://www.pichau.com.br',
    searchPattern: 'https://www.pichau.com.br/search?q={query}',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-400 hover:text-rose-300',
    badgeBorder: 'border-rose-500/20 hover:border-rose-500/40',
  },
  'Amazon BR': {
    name: 'Amazon BR',
    domain: 'amazon.com.br',
    homeUrl: 'https://www.amazon.com.br',
    searchPattern: 'https://www.amazon.com.br/s?k={query}',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400 hover:text-amber-300',
    badgeBorder: 'border-amber-500/20 hover:border-amber-500/40',
  },
  'Mercado Livre': {
    name: 'Mercado Livre',
    domain: 'mercadolivre.com.br',
    homeUrl: 'https://www.mercadolivre.com.br',
    searchPattern: 'https://lista.mercadolivre.com.br/{query}',
    badgeBg: 'bg-yellow-500/10',
    badgeText: 'text-yellow-400 hover:text-yellow-300',
    badgeBorder: 'border-yellow-500/20 hover:border-yellow-500/40',
  },
};

/**
 * Known precise search phrases for common hardware items in Brazilian stores
 * to guarantee that clicking takes the user directly to the exact product.
 */
const EXACT_SEARCH_MAP: Record<string, string> = {
  // CPUs
  'cpu-amd-r5-5600': 'Ryzen 5 5600',
  'cpu-amd-r5-5600gt': 'Ryzen 5 5600GT',
  'cpu-amd-r7-5700x': 'Ryzen 7 5700X',
  'cpu-amd-r7-5700x3d': 'Ryzen 7 5700X3D',
  'cpu-amd-r5-7600': 'Ryzen 5 7600',
  'cpu-amd-r7-7700x': 'Ryzen 7 7700X',
  'cpu-amd-r7-7800x3d': 'Ryzen 7 7800X3D',
  'cpu-amd-r9-7950x3d': 'Ryzen 9 7950X3D',
  'cpu-intel-i3-12100f': 'Core i3 12100F',
  'cpu-intel-i5-12400f': 'Core i5 12400F',
  'cpu-intel-i5-13400f': 'Core i5 13400F',
  'cpu-intel-i5-14600k': 'Core i5 14600K',
  'cpu-intel-i7-14700k': 'Core i7 14700K',
  'cpu-intel-i9-14900k': 'Core i9 14900K',

  // Coolers
  'cooler-deepcool-ak400': 'DeepCool AK400',
  'cooler-deepcool-ag400': 'DeepCool AG400',
  'cooler-thermalright-peerless-120': 'Thermalright Peerless Assassin 120 SE',
  'cooler-thermalright-phantom-spirit': 'Thermalright Phantom Spirit 120',
  'cooler-water-rise-mode-240': 'Water Cooler Rise Mode Aura Frost 240',
  'cooler-water-deepcool-lt720-360': 'Water Cooler DeepCool LT720 360mm',
  'cooler-water-corsair-h150i-elite': 'Water Cooler Corsair iCUE H150i Elite',

  // GPUs
  'gpu-amd-rx6600': 'Radeon RX 6600 8GB',
  'gpu-amd-rx7600': 'Radeon RX 7600 8GB',
  'gpu-amd-rx7600xt': 'Radeon RX 7600 XT 16GB',
  'gpu-nvidia-rtx3060': 'GeForce RTX 3060 12GB',
  'gpu-nvidia-rtx4060': 'RTX 4060 8GB',
  'gpu-nvidia-rtx4060ti': 'RTX 4060 Ti 8GB',
  'gpu-nvidia-rtx4060ti-16gb': 'RTX 4060 Ti 16GB',
  'gpu-amd-rx6750xt': 'Radeon RX 6750 XT 12GB',
  'gpu-amd-rx7700xt': 'Radeon RX 7700 XT 12GB',
  'gpu-amd-rx7800xt': 'Radeon RX 7800 XT 16GB',
  'gpu-nvidia-rtx4070': 'GeForce RTX 4070 12GB',
  'gpu-nvidia-rtx4070super': 'RTX 4070 SUPER 12GB',
  'gpu-nvidia-rtx4070tisuper': 'RTX 4070 Ti SUPER 16GB',
  'gpu-nvidia-rtx4080super': 'RTX 4080 SUPER 16GB',
  'gpu-nvidia-rtx4090': 'GeForce RTX 4090 24GB',

  // Motherboards
  'mobo-asrock-a520m-hvs': 'ASRock A520M-HVS',
  'mobo-msi-a520m-a-pro': 'MSI A520M-A PRO',
  'mobo-msi-b550m-vdh-wifi': 'MSI B550M PRO-VDH WIFI',
  'mobo-gigabyte-b550m-aorus-elite': 'Gigabyte B550M Aorus Elite',
  'mobo-asus-tuf-b550m-plus': 'ASUS TUF GAMING B550M-PLUS',
  'mobo-asrock-b650m-hdv': 'ASRock B650M-HDV M.2',
  'mobo-asus-prime-b650m-a-wifi': 'ASUS PRIME B650M-A WIFI II',
  'mobo-msi-mag-b650-tomahawk': 'MSI MAG B650 TOMAHAWK WIFI',
  'mobo-msi-b760m-bomber-ddr5': 'MSI PRO B760M-P DDR5',
  'mobo-asus-tuf-z790-plus-wifi': 'ASUS TUF GAMING Z790-PLUS WIFI',

  // RAM
  'ram-kingston-fury-8gb-3200-ddr4': 'Kingston Fury Beast 8GB DDR4 3200MHz',
  'ram-kingston-fury-16gb-3200-ddr4': 'Kingston Fury Beast 16GB DDR4 3200MHz',
  'ram-corsair-vengeance-16gb-3200-ddr4': 'Corsair Vengeance LPX 16GB DDR4 3200MHz',
  'ram-corsair-vengeance-32gb-6000-ddr5': 'Corsair Vengeance 32GB 2x16GB DDR5 6000MHz',
  'ram-xpg-lancer-16gb-6000-ddr5-rgb': 'XPG Lancer RGB 16GB DDR5 6000MHz',
  'ram-gskill-trident-z5-32gb-6000-ddr5': 'G.Skill Trident Z5 RGB 32GB DDR5 6000MHz',

  // Storage
  'ssd-kingston-nv2-500gb': 'SSD Kingston NV2 500GB M.2 NVMe',
  'ssd-kingston-nv2-1tb': 'SSD Kingston NV2 1TB M.2 NVMe',
  'ssd-kingston-nv2-2tb': 'SSD Kingston NV2 2TB M.2 NVMe',
  'ssd-kingston-kc3000-1tb': 'SSD Kingston KC3000 1TB M.2 NVMe',
  'ssd-crucial-p3-plus-1tb': 'SSD Crucial P3 Plus 1TB M.2 NVMe',
  'ssd-crucial-p3-plus-2tb': 'SSD Crucial P3 Plus 2TB M.2 NVMe',
  'ssd-wd-black-sn850x-1tb': 'SSD WD Black SN850X 1TB M.2 NVMe',

  // Cases
  'case-montech-air-903-max': 'Gabinete Montech Air 903 Max',
  'case-pichau-hx300-glass': 'Gabinete Pichau HX300 Glass',
  'case-mancer-goblin': 'Gabinete Mancer Goblin',
  'case-nzxt-h5-flow-black': 'Gabinete NZXT H5 Flow',
  'case-lian-li-lancool-216': 'Gabinete Lian Li Lancool 216',

  // PSUs
  'psu-msi-mag-a650bn': 'Fonte MSI MAG A650BN 650W',
  'psu-corsair-cv550': 'Fonte Corsair CV550 550W',
  'psu-cooler-master-mwe-650-bronze': 'Fonte Cooler Master MWE 650W Bronze',
  'psu-corsair-rm750e-gold': 'Fonte Corsair RM750e 750W Gold',
  'psu-superflower-leadex-850w-gold': 'Fonte Super Flower Leadex III 850W Gold',

  // Monitors
  'mon-lg-ultragear-24-180hz': 'LG UltraGear 24GS60F 180Hz',
  'mon-aoc-hero-24-144hz': 'Monitor AOC Hero 24 144Hz',
  'mon-aoc-hero-27-qhd-155hz': 'Monitor AOC Q27G2 27 QHD 155Hz',
  'mon-asus-tuf-vg27aq': 'ASUS TUF Gaming VG27AQ 27 165Hz QHD',

  // OS & Peripherals
  'os-windows-11-home': 'Microsoft Windows 11 Home',
  'os-windows-11-pro': 'Microsoft Windows 11 Pro',
  'mouse-logitech-g203-lightsync': 'Mouse Logitech G203 Lightsync',
  'mouse-razer-deathadder-v2': 'Mouse Razer DeathAdder V2',
  'kb-redragon-kumara-k552': 'Teclado Redragon Kumara K552 RGB',
  'kb-hyperx-alloy-origins-core': 'Teclado HyperX Alloy Origins Core',
  'hs-havit-h2002d': 'Headset Gamer Havit H2002D',
  'hs-hyperx-cloud-stinger-2': 'Headset HyperX Cloud Stinger 2',
  'fan-kit-rise-mode-crystal-3x': 'Kit Ventoinhas Rise Mode Crystal Sound ARGB 120mm',
};

/**
 * Cleans a product name to make it optimal for Brazilian store search engines.
 * Strips out noisy specs while preserving model and brand names.
 */
export function cleanSearchQuery(productName: string, productId?: string): string {
  if (productId && EXACT_SEARCH_MAP[productId]) {
    return EXACT_SEARCH_MAP[productId];
  }

  if (!productName) return '';

  return productName
    .replace(/\s*\([^)]*\)/g, '') // remove parenthesized details like (3D V-Cache) or (Wraith Stealth)
    .replace(/(\d+)\s*GHz/gi, '') // remove clock frequencies like 3.5 GHz
    .replace(/(\d+)-Core/gi, '') // remove core count like 6-Core
    .replace(/(\d+)\s*W\b/gi, '') // remove wattage like 65W
    .replace(/80\s*Plus\s*(Bronze|Gold|Platinum|White)/gi, '')
    .replace(/PFC\s*Ativo/gi, '')
    .replace(/Full\s*Modular|Não\s*Modular|Semi-Modular/gi, '')
    .replace(/Micro-ATX|Mini-ITX|Mid-Tower|All-Black|Dual\s*Tower/gi, '')
    .replace(/Vidro\s*Temperado\s*Lateral/gi, '')
    .replace(/Drivers\s*53mm.*$/gi, '')
    .replace(/Switch\s*Outemu.*$/gi, '')
    .replace(/com\s*Controladora.*$/gi, '')
    .replace(/GDDR6X|GDDR6/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Unwraps Google redirect URLs (e.g. https://www.google.com/url?q=https://...) to extract the real target URL.
 */
export function unwrapUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    if (url.includes('google.com/url?') || url.includes('google.com.br/url?')) {
      const parsed = new URL(url);
      const target = parsed.searchParams.get('q') || parsed.searchParams.get('url') || parsed.searchParams.get('sa');
      if (target && target.startsWith('http')) {
        return target;
      }
    }
  } catch {
    // If parsing fails, proceed with raw url
  }
  return url;
}

/**
 * Validates whether a store name matches an approved Brazilian retailer.
 */
export function normalizeStoreName(storeName?: string): string {
  if (!storeName) return 'Kabum';
  const s = storeName.toLowerCase().trim();
  if (s.includes('kabum')) return 'Kabum';
  if (s.includes('terabyte')) return 'Terabyte';
  if (s.includes('pichau')) return 'Pichau';
  if (s.includes('amazon')) return 'Amazon BR';
  if (s.includes('mercado') || s.includes('ml')) return 'Mercado Livre';
  return storeName;
}

/**
 * Returns the official search URL for a partner store with proper query encoding via encodeURIComponent.
 * Guaranteed to follow the official store search patterns:
 * - KaBuM!: https://www.kabum.com.br/busca/{encodedQuery}
 * - Terabyte: https://www.terabyteshop.com.br/busca?str={encodedQuery}
 * - Pichau: https://www.pichau.com.br/search?q={encodedQuery}
 * - Amazon BR: https://www.amazon.com.br/s?k={encodedQuery}
 * - Mercado Livre: https://lista.mercadolivre.com.br/{encodedQuery}
 * - Google Shopping: https://www.google.com.br/search?tbm=shop&q={encodedQuery}
 */
export function getOfficialStoreSearchUrl(storeName: HardwareStoreName, query: string): string {
  const cleanQuery = query ? query.trim() : '';
  const encodedQuery = encodeURIComponent(cleanQuery);
  const normalized = (storeName || '').toLowerCase().trim();

  // KaBuM! Official Search: https://www.kabum.com.br/busca/{termo_codificado}
  if (normalized.includes('kabum')) {
    return `https://www.kabum.com.br/busca/${encodedQuery}`;
  }

  // TerabyteShop Official Search: https://www.terabyteshop.com.br/busca?str={termo_codificado}
  if (normalized.includes('terabyte')) {
    return `https://www.terabyteshop.com.br/busca?str=${encodedQuery}`;
  }

  // Pichau Official Search: https://www.pichau.com.br/search?q={termo_codificado}
  if (normalized.includes('pichau')) {
    return `https://www.pichau.com.br/search?q=${encodedQuery}`;
  }

  // Amazon Brasil Official Search: https://www.amazon.com.br/s?k={termo_codificado}
  if (normalized.includes('amazon')) {
    return `https://www.amazon.com.br/s?k=${encodedQuery}`;
  }

  // Mercado Livre Brasil Search: https://lista.mercadolivre.com.br/{termo_codificado}
  if (normalized.includes('mercado') || normalized.includes('ml')) {
    return `https://lista.mercadolivre.com.br/${encodedQuery}`;
  }

  // Google Shopping Fallback: https://www.google.com.br/search?tbm=shop&q={termo_codificado}
  return `https://www.google.com.br/search?tbm=shop&q=${encodedQuery}`;
}

export interface UrlValidationResult {
  isValid: boolean;
  storeName: HardwareStoreName;
  isSearchUrl: boolean;
  isDirectProductUrl: boolean;
  canonicalUrl: string;
  hasProperEncoding: boolean;
  reason?: string;
}

/**
 * Validates whether a given URL adheres to the expected Brazilian hardware store patterns
 * and checks for proper encoding (never contains raw spaces or illegal characters).
 */
export function validateStoreUrl(url: string, expectedStore?: HardwareStoreName): UrlValidationResult {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return {
      isValid: false,
      storeName: expectedStore || 'Kabum',
      isSearchUrl: false,
      isDirectProductUrl: false,
      canonicalUrl: '',
      hasProperEncoding: false,
      reason: 'URL vazia ou nula.',
    };
  }

  const unwrapped = unwrapUrl(url.trim()) || '';

  // Check for raw spaces or non-encoded characters in URL
  const hasRawSpaces = /\s/.test(unwrapped);

  try {
    const parsed = new URL(unwrapped);
    const hostname = parsed.hostname.toLowerCase();

    // Determine detected store
    let detectedStore: HardwareStoreName = 'Outra';
    if (hostname.includes('kabum.com.br')) detectedStore = 'Kabum';
    else if (hostname.includes('terabyteshop.com.br')) detectedStore = 'Terabyte';
    else if (hostname.includes('pichau.com.br')) detectedStore = 'Pichau';
    else if (hostname.includes('amazon.com.br')) detectedStore = 'Amazon BR';
    else if (hostname.includes('mercadolivre.com.br')) detectedStore = 'Mercado Livre';
    else if (hostname.includes('google.com') || hostname.includes('google.com.br')) detectedStore = 'Google Shopping';

    const isTargetStore = expectedStore
      ? normalizeStoreName(detectedStore) === normalizeStoreName(expectedStore)
      : true;

    // Check if it's an official search URL pattern
    let isSearchUrl = false;
    if (hostname.includes('kabum.com.br') && (parsed.pathname.startsWith('/busca') || parsed.searchParams.has('query'))) {
      isSearchUrl = true;
    } else if (hostname.includes('terabyteshop.com.br') && (parsed.searchParams.has('str') || parsed.searchParams.has('busca'))) {
      isSearchUrl = true;
    } else if (hostname.includes('pichau.com.br') && (parsed.pathname.startsWith('/search') || parsed.searchParams.has('q'))) {
      isSearchUrl = true;
    } else if (hostname.includes('amazon.com.br') && (parsed.pathname.startsWith('/s') || parsed.searchParams.has('k'))) {
      isSearchUrl = true;
    } else if (hostname.includes('mercadolivre.com.br') && (parsed.pathname.startsWith('/lista') || parsed.pathname.length > 2)) {
      isSearchUrl = true;
    } else if (hostname.includes('google') && parsed.searchParams.has('q')) {
      isSearchUrl = true;
    }

    // Check if it's a direct product page
    const isDirectProductUrl = !isSearchUrl && (
      parsed.pathname.includes('/produto/') ||
      parsed.pathname.includes('/p/') ||
      parsed.pathname.includes('/dp/') ||
      (parsed.pathname.split('/').filter(Boolean).length >= 2 && parsed.pathname.length > 10)
    );

    // Ensure it's not a generic homepage
    const isGenericHome = parsed.pathname === '/' || parsed.pathname === '';

    const isValid = !hasRawSpaces && !isGenericHome && (isSearchUrl || isDirectProductUrl) && isTargetStore;

    return {
      isValid,
      storeName: detectedStore,
      isSearchUrl,
      isDirectProductUrl,
      canonicalUrl: unwrapped,
      hasProperEncoding: !hasRawSpaces,
      reason: isGenericHome
        ? 'URL aponta apenas para a página inicial da loja sem termo de busca.'
        : !isTargetStore
        ? `Loja esperada (${expectedStore}) difere da URL (${detectedStore}).`
        : hasRawSpaces
        ? 'URL contém espaços não codificados com encodeURIComponent.'
        : undefined,
    };
  } catch (err: any) {
    return {
      isValid: false,
      storeName: expectedStore || 'Kabum',
      isSearchUrl: false,
      isDirectProductUrl: false,
      canonicalUrl: unwrapped,
      hasProperEncoding: false,
      reason: `Formato de URL inválido: ${err?.message || 'Erro ao processar URL'}`,
    };
  }
}

/**
 * Validates whether a given URL is a real canonical link or just a generic homepage/placeholder.
 */
function isRealCanonicalProductUrl(url: string, expectedStore?: HardwareStoreName): boolean {
  const result = validateStoreUrl(url, expectedStore);
  return result.isValid;
}

/**
 * Returns a guaranteed valid store URL for buying/consulting a component.
 * If a real verified direct URL is provided, it is sanitized, unwrapped and returned.
 * Otherwise, the official store search URL is generated using the exact encoded term (encodeURIComponent).
 * NEVER generates fictitious slugs, raw spaces or broken query parameters.
 */
export function getStoreProductUrl(
  storeName: HardwareStoreName,
  productName: string,
  rawUrl?: string,
  productId?: string
): string {
  const cleanRaw = unwrapUrl(rawUrl);

  // If cleanRaw is already a valid deep product URL from grounding / real metadata, use it directly!
  if (cleanRaw && isRealCanonicalProductUrl(cleanRaw, storeName)) {
    return cleanRaw;
  }

  const query = cleanSearchQuery(productName, productId) || productName;
  return getOfficialStoreSearchUrl(storeName, query);
}

/**
 * Returns a Google Shopping query URL to compare real-time prices across all Brazilian stores.
 * Query is always encoded via encodeURIComponent.
 */
export function getGoogleShoppingUrl(productName: string, productId?: string): string {
  const query = cleanSearchQuery(productName, productId) || productName;
  return `https://www.google.com.br/search?tbm=shop&q=${encodeURIComponent(query.trim())}`;
}

/**
 * Batch validator for all component URLs in a build selection.
 */
export function validateAllBuildLinks(parts: Record<string, any>): Array<{
  category: string;
  componentName: string;
  storeName: string;
  url: string;
  isValid: boolean;
  isSearchUrl: boolean;
  isDirectProductUrl: boolean;
  reason?: string;
}> {
  const results: Array<{
    category: string;
    componentName: string;
    storeName: string;
    url: string;
    isValid: boolean;
    isSearchUrl: boolean;
    isDirectProductUrl: boolean;
    reason?: string;
  }> = [];

  Object.entries(parts).forEach(([category, itemOrList]) => {
    if (!itemOrList) return;
    const items = Array.isArray(itemOrList) ? itemOrList : [itemOrList];
    items.forEach((item: any) => {
      const comp = item.component;
      if (!comp) return;

      const lowestStore = comp.stores?.find((s: any) => s.isLowest) || comp.stores?.[0];
      const storeName = item.selectedStore || lowestStore?.storeName || 'Kabum';
      const url = getStoreProductUrl(storeName, comp.name, lowestStore?.url, comp.id);
      const validation = validateStoreUrl(url, storeName);

      results.push({
        category,
        componentName: comp.name,
        storeName,
        url,
        isValid: validation.isValid,
        isSearchUrl: validation.isSearchUrl,
        isDirectProductUrl: validation.isDirectProductUrl,
        reason: validation.reason,
      });
    });
  });

  return results;
}

/**
 * Safely opens any external store or grounding link in a new browser tab/window,
 * handling unwrapping of Google redirect URLs, sanitizing parameters, and working reliably
 * across iframes, pop-up blockers, mobile and desktop environments.
 */
export function openSafeStoreUrl(rawUrl: string, target: string = '_blank'): void {
  if (!rawUrl || typeof rawUrl !== 'string') return;
  const cleanUrl = unwrapUrl(rawUrl) || rawUrl;

  try {
    const newWindow = window.open(cleanUrl, target, 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null;
      return;
    }
  } catch {
    // Fallback if window.open throws in sandboxed environment
  }

  // Robust DOM anchor fallback
  try {
    const link = document.createElement('a');
    link.href = cleanUrl;
    link.target = target;
    link.rel = 'noopener noreferrer';
    link.referrerPolicy = 'no-referrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 150);
  } catch (err) {
    console.warn('Could not open URL automatically:', err);
  }
}

// Re-export URL Manager utilities for convenience
export { validateAndSanitizeUrl, openSafeExternalUrl, unwrapExternalRedirect } from './urlManager';
export type { SanitizedUrlResult } from './urlManager';
