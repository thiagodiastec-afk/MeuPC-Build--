import { ComponentCategory, PCComponent, StorePrice } from '../types/pc';
import { getStoreProductUrl } from '../utils/storeUrls';

export interface LivePartItem {
  name: string;
  price: number; // Menor preço à vista no PIX
  priceInstallments?: number; // Preço parcelado
  store: string;
  url: string;
  inStock: boolean;
  specs?: string;
  tdp?: number | null;
  socket?: string;
  category?: ComponentCategory;
}

export interface PartsSearchResponse {
  success: boolean;
  data: LivePartItem[];
  cached?: boolean;
  timestamp: string;
  error?: string;
}

/**
 * Searches for real-time parts and prices via backend Google Search Grounding.
 */
export async function searchPartsOnline(
  query: string,
  category?: ComponentCategory
): Promise<LivePartItem[]> {
  const params = new URLSearchParams();
  if (query) params.append('q', query.trim());
  if (category) params.append('category', category);

  const res = await fetch(`/api/parts/search?${params.toString()}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Erro ao consultar preços em tempo real');
  }

  const json: PartsSearchResponse = await res.json();
  if (!json.success || !Array.isArray(json.data)) {
    throw new Error(json.error || 'Formato de resposta inválido');
  }

  return json.data;
}

/**
 * Converts a live online search item into a standard PCComponent instance for the build.
 */
export function livePartToPCComponent(item: LivePartItem, category: ComponentCategory): PCComponent {
  const normName = item.name.trim();
  const lowerName = normName.toLowerCase();

  // Smart TDP Wattage Extraction
  let tdpWattage = item.tdp || undefined;
  if (!tdpWattage) {
    if (lowerName.includes('4090')) tdpWattage = 450;
    else if (lowerName.includes('4080')) tdpWattage = 320;
    else if (lowerName.includes('4070 ti')) tdpWattage = 285;
    else if (lowerName.includes('4070 super')) tdpWattage = 220;
    else if (lowerName.includes('4070')) tdpWattage = 200;
    else if (lowerName.includes('4060 ti')) tdpWattage = 160;
    else if (lowerName.includes('4060')) tdpWattage = 115;
    else if (lowerName.includes('6600')) tdpWattage = 132;
    else if (lowerName.includes('6750')) tdpWattage = 250;
    else if (lowerName.includes('7600') && category === 'gpu') tdpWattage = 165;
    else if (lowerName.includes('7800 xt')) tdpWattage = 263;
    else if (lowerName.includes('7800x3d')) tdpWattage = 120;
    else if (lowerName.includes('5700x3d') || lowerName.includes('5700x')) tdpWattage = 105;
    else if (lowerName.includes('5600') || lowerName.includes('5500') || lowerName.includes('12400') || lowerName.includes('13400')) tdpWattage = 65;
    else if (lowerName.includes('7600') && category === 'cpu') tdpWattage = 65;
    else if (category === 'cpu') tdpWattage = 65;
    else if (category === 'gpu') tdpWattage = 150;
  }

  // Smart Socket Extraction
  let socket = item.socket || undefined;
  if (!socket) {
    if (lowerName.includes('am4') || lowerName.includes('5600') || lowerName.includes('5700') || lowerName.includes('b550') || lowerName.includes('a520') || lowerName.includes('b450')) {
      socket = 'AM4';
    } else if (lowerName.includes('am5') || lowerName.includes('7600') || lowerName.includes('7800') || lowerName.includes('b650') || lowerName.includes('x670')) {
      socket = 'AM5';
    } else if (lowerName.includes('1700') || lowerName.includes('12400') || lowerName.includes('13400') || lowerName.includes('14400') || lowerName.includes('h610') || lowerName.includes('b760') || lowerName.includes('z790')) {
      socket = 'LGA1700';
    }
  }

  // Smart Memory Type
  let memoryType: 'DDR4' | 'DDR5' | undefined = undefined;
  if (lowerName.includes('ddr5')) {
    memoryType = 'DDR5';
  } else if (lowerName.includes('ddr4')) {
    memoryType = 'DDR4';
  } else if (socket === 'AM5') {
    memoryType = 'DDR5';
  } else if (socket === 'AM4') {
    memoryType = 'DDR4';
  }

  // Format Stores
  const cashPrice = item.price > 0 ? item.price : 100;
  const installmentsPrice = item.priceInstallments && item.priceInstallments > 0 
    ? item.priceInstallments 
    : Math.round(cashPrice * 1.176 * 100) / 100;

  const directUrl = item.url && item.url.startsWith('http') 
    ? item.url 
    : getStoreProductUrl(item.store || 'KaBuM!', normName);

  const mainStore: StorePrice = {
    storeName: item.store || 'KaBuM!',
    priceCash: cashPrice,
    priceInstallments: installmentsPrice,
    url: directUrl,
    inStock: item.inStock !== false,
    isLowest: true,
  };

  const id = `live-${category}-${encodeURIComponent(normName.toLowerCase().slice(0, 30))}-${Date.now()}`;

  // Image placeholder by category
  const imagesByCategory: Record<ComponentCategory, string> = {
    cpu: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
    gpu: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80',
    motherboard: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    ram: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&auto=format&fit=crop&q=80',
    storage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&auto=format&fit=crop&q=80',
    psu: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&auto=format&fit=crop&q=80',
    case: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=400&auto=format&fit=crop&q=80',
    cooler: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80',
    case_fan: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80',
    mouse: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80',
    headset: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80',
    mousepad: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80',
    microphone: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&auto=format&fit=crop&q=80',
    chair: 'https://images.unsplash.com/photo-1580481077195-c3f2d2b591b9?w=400&auto=format&fit=crop&q=80',
    os: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&auto=format&fit=crop&q=80',
  };

  const specsRecord: Record<string, string | number | boolean> = {
    'Especificações': item.specs || 'Componente em tempo real',
  };
  if (socket) specsRecord['Soquete'] = socket;
  if (tdpWattage) specsRecord['TDP'] = `${tdpWattage}W`;
  if (memoryType) specsRecord['Tipo de Memória'] = memoryType;

  return {
    id,
    category,
    name: normName,
    brand: normName.split(' ')[0] || 'Hardware',
    model: normName,
    image: imagesByCategory[category] || imagesByCategory.cpu,
    rating: 4.8,
    reviewCount: 42,
    stores: [mainStore],
    lowestPriceCash: cashPrice,
    lowestPriceInstallments: installmentsPrice,
    specs: specsRecord,
    socket,
    tdpWattage,
    memoryType,
  };
}
