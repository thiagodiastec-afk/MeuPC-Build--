export type AffiliateNetwork = 'lomadee' | 'awin' | 'rakuten' | 'direct';

interface AffiliateConfig {
  network: AffiliateNetwork;
  sourceId: string; // e.g. Publisher ID or Source ID
  campaignId?: string;
}

// Emulate a configuration that would normally come from env or database
const DEFAULT_AFFILIATE_CONFIG: AffiliateConfig = {
  network: 'lomadee',
  sourceId: '123456789', // Example ID
};

/**
 * Transforms a standard store URL into an affiliate tracking URL.
 * Supports MVP integration for major Brazilian networks (Lomadee, Awin).
 */
export function generateAffiliateLink(
  originalUrl: string,
  config: AffiliateConfig = DEFAULT_AFFILIATE_CONFIG
): string {
  if (!originalUrl) return '';
  
  try {
    const encodedUrl = encodeURIComponent(originalUrl);

    switch (config.network) {
      case 'lomadee':
        // Example Lomadee deep link format
        // https://api.lomadee.com/v3/SOURCE_ID/deeplink?sourceId=SOURCE_ID&url=ENCODED_URL
        return `https://api.lomadee.com/v3/${config.sourceId}/deeplink?sourceId=${config.sourceId}&url=${encodedUrl}`;
        
      case 'awin':
        // Example Awin deep link format (zanox)
        // https://www.awin1.com/cread.php?awinmid=CAMPAIGN_ID&awinaffid=SOURCE_ID&ued=ENCODED_URL
        if (config.campaignId) {
          return `https://www.awin1.com/cread.php?awinmid=${config.campaignId}&awinaffid=${config.sourceId}&ued=${encodedUrl}`;
        }
        return originalUrl; // Fallback if no campaign ID is set for Awin
        
      case 'rakuten':
        // Example Rakuten link format
        // https://click.linksynergy.com/deeplink?id=SOURCE_ID&mid=CAMPAIGN_ID&murl=ENCODED_URL
        if (config.campaignId) {
           return `https://click.linksynergy.com/deeplink?id=${config.sourceId}&mid=${config.campaignId}&murl=${encodedUrl}`;
        }
        return originalUrl;
        
      case 'direct':
      default:
        // No affiliate tracking
        return originalUrl;
    }
  } catch (error) {
    console.error('Error generating affiliate link:', error);
    return originalUrl; // Graceful fallback
  }
}
