/**
 * URL Manager & Security Sanitizer Utility
 * 
 * Ensures all external e-commerce and web links are validated, sanitized,
 * stripped of dangerous schemes (javascript:, data:, vbscript:), unwrapped from
 * redirect intermediaries, and loaded safely in a new browser tab (_blank)
 * with strict `noopener noreferrer` and `no-referrer` attributes.
 */

import { HardwareStoreName, STORE_METAS, getOfficialStoreSearchUrl, cleanSearchQuery } from './storeUrls';
import { generateAffiliateLink } from './affiliate';

export interface SanitizedUrlResult {
  url: string;
  originalUrl: string;
  isValid: boolean;
  isSecure: boolean;
  protocol: 'https:' | 'http:' | 'unknown';
  domain: string;
  storeName?: HardwareStoreName;
  isOfficialStore: boolean;
  sanitizedReason?: string;
}

// Strictly allowed web protocols
const ALLOWED_PROTOCOLS = new Set(['https:', 'http:']);

// Dangerous URL patterns (XSS, script injection, data URI payloads)
const DANGEROUS_SCHEMES_REGEX = /^(javascript|vbscript|data|file|blob|about):/i;

/**
 * Unwraps URL redirects from Google Search Grounding and standard search engines.
 */
export function unwrapExternalRedirect(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();

  // Strip Markdown link formatting e.g. [text](url) or <url>
  const mdMatch = url.match(/\((https?:\/\/[^\s\)]+)\)/i) || url.match(/<(https?:\/\/[^\s>]+)>/i);
  if (mdMatch && mdMatch[1]) {
    url = mdMatch[1];
  }

  // Google Redirect: https://www.google.com/url?q=https://...
  if (url.includes('google.com/url?') || url.includes('google.com.br/url?')) {
    try {
      const parsed = new URL(url);
      const target = parsed.searchParams.get('q') || parsed.searchParams.get('url');
      if (target && (target.startsWith('http://') || target.startsWith('https://'))) {
        return decodeURIComponent(target);
      }
    } catch {
      // Ignore URL parse error and continue
    }
  }

  // Vertex AI Search / Gemini Grounding redirect
  if (url.includes('vertexaisearch.cloud.google.com/grounding-api-redirect/')) {
    const parts = url.split('/grounding-api-redirect/');
    if (parts[1]) {
      try {
        const decoded = decodeURIComponent(parts[1]);
        if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
          return decoded;
        }
      } catch {
        // Continue
      }
    }
  }

  return url;
}

/**
 * Validates and sanitizes any external e-commerce URL.
 * Enforces HTTPS, removes hazardous query parameters, validates store domains,
 * and supplies official fallback search URLs when a link is invalid or malformed.
 */
export function validateAndSanitizeUrl(
  rawUrl?: string,
  options?: {
    fallbackStore?: HardwareStoreName;
    fallbackProductName?: string;
    fallbackProductId?: string;
  }
): SanitizedUrlResult {
  const original = rawUrl ? String(rawUrl).trim() : '';
  const unwrapped = unwrapExternalRedirect(original);

  // Check if string contains dangerous schemes
  if (DANGEROUS_SCHEMES_REGEX.test(unwrapped)) {
    console.warn('[URL Manager] Blocked dangerous URL scheme:', unwrapped);
    const fallbackStore = options?.fallbackStore || 'Kabum';
    const fallbackName = options?.fallbackProductName || 'Hardware PC';
    const safeFallback = getOfficialStoreSearchUrl(fallbackStore, fallbackName);

    return {
      url: safeFallback,
      originalUrl: original,
      isValid: false,
      isSecure: true,
      protocol: 'https:',
      domain: STORE_METAS[fallbackStore]?.domain || 'kabum.com.br',
      storeName: fallbackStore,
      isOfficialStore: true,
      sanitizedReason: 'Esquema de URL inseguro bloqueado. Redirecionado para busca segura.',
    };
  }

  // If URL is empty or invalid, generate official store fallback
  if (!unwrapped || (!unwrapped.startsWith('http://') && !unwrapped.startsWith('https://'))) {
    const fallbackStore = options?.fallbackStore || 'Kabum';
    const fallbackName = options?.fallbackProductName || 'Hardware';
    const safeFallback = getOfficialStoreSearchUrl(fallbackStore, fallbackName);

    return {
      url: safeFallback,
      originalUrl: original,
      isValid: false,
      isSecure: true,
      protocol: 'https:',
      domain: STORE_METAS[fallbackStore]?.domain || 'kabum.com.br',
      storeName: fallbackStore,
      isOfficialStore: true,
      sanitizedReason: 'URL ausente ou malformatada. Gerada busca oficial da loja.',
    };
  }

  try {
    const parsed = new URL(unwrapped);

    // Protocol check
    const protocol = parsed.protocol as 'https:' | 'http:';
    if (!ALLOWED_PROTOCOLS.has(protocol)) {
      throw new Error(`Protocol not allowed: ${protocol}`);
    }

    const domain = parsed.hostname.toLowerCase().replace(/^www\./, '');

    // Identify store by domain
    let detectedStore: HardwareStoreName | undefined = options?.fallbackStore;
    if (domain.includes('kabum.com.br')) detectedStore = 'Kabum';
    else if (domain.includes('terabyteshop.com.br')) detectedStore = 'Terabyte';
    else if (domain.includes('pichau.com.br')) detectedStore = 'Pichau';
    else if (domain.includes('amazon.com.br') || domain.includes('amazon.com')) detectedStore = 'Amazon BR';
    else if (domain.includes('mercadolivre.com.br') || domain.includes('mercadolivre.com')) detectedStore = 'Mercado Livre';

    // Upgrade http to https for known hardware stores
    if (parsed.protocol === 'http:' && (
      domain.includes('kabum.com.br') ||
      domain.includes('terabyteshop.com.br') ||
      domain.includes('pichau.com.br') ||
      domain.includes('amazon.com.br') ||
      domain.includes('mercadolivre.com.br') ||
      domain.includes('google.com')
    )) {
      parsed.protocol = 'https:';
    }

    // Clean tracking garbage params (utm_*, gclid, fbclid, _gl) while preserving essential query parameters
    const searchParams = parsed.searchParams;
    const keysToRemove: string[] = [];
    searchParams.forEach((_, key) => {
      const lower = key.toLowerCase();
      if (
        lower.startsWith('utm_') ||
        lower === 'gclid' ||
        lower === 'fbclid' ||
        lower === '_gl' ||
        lower === 'gad_source' ||
        lower === 'gbraid' ||
        lower === 'wbraid'
      ) {
        keysToRemove.push(key);
      }
    });
    keysToRemove.forEach(k => searchParams.delete(k));

    const finalUrl = generateAffiliateLink(parsed.toString(), { network: 'lomadee', sourceId: '1234567' });

    return {
      url: finalUrl,
      originalUrl: original,
      isValid: true,
      isSecure: parsed.protocol === 'https:',
      protocol: parsed.protocol === 'https:' ? 'https:' : 'http:',
      domain,
      storeName: detectedStore,
      isOfficialStore: Boolean(detectedStore),
      sanitizedReason: undefined,
    };
  } catch (err) {
    console.warn('[URL Manager] Error parsing URL, using safe store fallback:', err);
    const fallbackStore = options?.fallbackStore || 'Kabum';
    const fallbackName = options?.fallbackProductName || 'Hardware';
    const safeFallback = getOfficialStoreSearchUrl(fallbackStore, fallbackName);

    return {
      url: safeFallback,
      originalUrl: original,
      isValid: false,
      isSecure: true,
      protocol: 'https:',
      domain: STORE_METAS[fallbackStore]?.domain || 'kabum.com.br',
      storeName: fallbackStore,
      isOfficialStore: true,
      sanitizedReason: 'Erro na estrutura da URL. Gerada busca oficial codificada.',
    };
  }
}

/**
 * Safely opens an external URL in a new browser tab with strict security flags,
 * unwrap handling, and multi-layer fallback support for iframe sandboxes.
 */
export function openSafeExternalUrl(
  rawUrl: string,
  options?: {
    target?: string;
    fallbackStore?: HardwareStoreName;
    fallbackProductName?: string;
  }
): boolean {
  const sanitized = validateAndSanitizeUrl(rawUrl, options);
  const target = options?.target || '_blank';

  if (!sanitized.url) return false;

  try {
    const newWindow = window.open(sanitized.url, target, 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null;
      return true;
    }
  } catch {
    // Fallback if window.open fails due to popup blocker
  }

  // DOM Anchor fallback for sandboxed environments & iframes
  try {
    const link = document.createElement('a');
    link.href = sanitized.url;
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
    return true;
  } catch (err) {
    console.error('[URL Manager] Failed to open external URL safely:', err);
    return false;
  }
}
