export type ComponentCategory =
  | 'cpu'
  | 'cooler'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'case'
  | 'psu'
  | 'os'
  | 'monitor'
  | 'mouse'
  | 'keyboard'
  | 'headset'
  | 'case_fan'
  | 'chair'
  | 'microphone'
  | 'mousepad';

export interface StorePrice {
  storeName: 'Kabum' | 'KaBuM!' | 'Terabyte' | 'TerabyteShop' | 'Pichau' | 'Amazon BR' | 'Mercado Livre' | string;
  priceCash: number; // Preço à vista (com desconto PIX/Boleto)
  priceInstallments: number; // Preço parcelado (ex: 10x ou 12x)
  url: string;
  inStock: boolean;
  isLowest?: boolean;
  badge?: string;
}

export interface PriceHistoryPoint {
  date: string; // ISO format YYYY-MM-DD
  priceCash: number;
}

export interface PCComponent {
  id: string;
  category: ComponentCategory;
  name: string;
  brand: string;
  model: string;
  image: string;
  rating: number;
  reviewCount: number;
  stores: StorePrice[];
  priceHistory?: PriceHistoryPoint[]; // Added price history
  lowestPriceCash: number;
  lowestPriceInstallments: number;
  specs: Record<string, string | number | boolean>;
  
  // Hardware specific attributes for compatibility engine
  socket?: string; // e.g. "AM4", "AM5", "LGA1700", "LGA1851"
  chipset?: string; // e.g. "B650", "B550", "B760", "Z790"
  memoryType?: 'DDR4' | 'DDR5';
  memorySpeed?: number; // MHz e.g. 3200, 3600, 5600, 6000
  memoryCapacity?: number; // GB per stick e.g. 8, 16, 32
  tdpWattage?: number; // Watts e.g. 65, 125, 200, 285
  formFactor?: 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'E-ATX';
  supportedFormFactors?: ('ATX' | 'Micro-ATX' | 'Mini-ITX' | 'E-ATX')[];
  maxGpuLength?: number; // mm in case
  gpuLength?: number; // mm of the GPU
  maxCoolerHeight?: number; // mm in case
  coolerHeight?: number; // mm of the cooler
  coolerType?: 'Air' | 'Water 120mm' | 'Water 240mm' | 'Water 360mm';
  psuWattage?: number; // W rating of PSU e.g. 650, 750, 850
  psuEfficiency?: '80 Plus White' | '80 Plus Bronze' | '80 Plus Silver' | '80 Plus Gold' | '80 Plus Platinum';
  psuModularity?: 'Não Modular' | 'Semi-Modular' | 'Full Modular';
  storageType?: 'NVMe M.2' | 'SATA SSD' | 'HDD 3.5"';
  storageCapacity?: string; // e.g. "1 TB", "2 TB", "500 GB"
  m2Slots?: number; // On motherboard
  ramSlots?: number; // On motherboard e.g. 2 or 4
  integratedGraphics?: boolean; // For CPU
  pcieGen?: '3.0' | '4.0' | '5.0'; // For motherboard / GPU / SSD
  radiatorSupport?: ('120mm' | '240mm' | '280mm' | '360mm')[]; // For case
  coolerIncluded?: boolean;
  dimensions?: { length?: number; width?: number; height?: number; slots?: number; radiatorSize?: number };
  maxMemorySlots?: number;
  clearances?: { maxGpuLength?: number; maxCoolerHeight?: number; maxCpuCoolerHeight?: number; radiatorSupport?: any };
}

export interface SelectedItem {
  component: PCComponent;
  quantity: number;
  customPriceCash?: number;
  customPriceInstallments?: number;
  selectedStore?: string;
  notes?: string;
}

export type BuildSelection = {
  [K in ComponentCategory]?: SelectedItem | SelectedItem[]; // storage, ram, fans can have multiple
};

export type IssueGranularCategory = 
  | 'structural'   // Sockets, form factor, basic fitting
  | 'clearance'    // GPU length vs case, cooler height vs case, AIO radiator support
  | 'memory'       // RAM speed, sweet spot, single vs dual channel, slot count
  | 'bottleneck'   // CPU vs GPU balance, PCIe gen bandwidth
  | 'power';       // PSU wattage, headroom, 12VHPWR advice

export interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  category: ComponentCategory;
  issueCategory?: IssueGranularCategory;
  title: string;
  message: string;
  recommendation?: string;
  metric?: {
    current: string | number;
    limit: string | number;
    margin?: string | number;
  };
}

export interface PhysicalClearanceReport {
  coolerClearance?: {
    coolerHeight: number;
    caseMaxHeight: number;
    marginMm: number;
    status: 'ok' | 'tight' | 'exceeded';
  };
  gpuClearance?: {
    gpuLength: number;
    caseMaxLength: number;
    marginMm: number;
    status: 'ok' | 'tight' | 'exceeded';
  };
  radiatorClearance?: {
    radiatorSize: string;
    isSupported: boolean;
    caseSupportedRadiators: string[];
  };
}

export interface BottleneckAnalysisReport {
  score: number; // 0 to 100 (100 = perfectly balanced)
  type: 'balanced' | 'cpu_bottleneck' | 'gpu_bottleneck' | 'ram_bottleneck';
  summary: string;
  idealResolution: '1080p' | '1440p' | '4K';
  cpuTier: number; // 1 to 5
  gpuTier: number; // 1 to 5
  notes: string[];
}

export interface CompatibilityReport {
  isCompatible: boolean;
  hasWarnings: boolean;
  issues: CompatibilityIssue[];
  estimatedWattage: number;
  recommendedPsuWattage: number;
  psuStatus: 'none' | 'insufficient' | 'tight' | 'optimal' | 'excessive';
  clearances?: PhysicalClearanceReport;
  bottleneck?: BottleneckAnalysisReport;
}

export interface SavedBuild {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  parts: BuildSelection;
  totalCash: number;
  totalInstallments: number;
  estimatedWattage?: number;
  partsCount?: number;
  tags?: string[];
}

export interface PresetBuild {
  id: string;
  title: string;
  subtitle: string;
  tier: 'Entrada' | 'Intermediário' | 'Alto Desempenho' | 'Extremo / 4K' | 'Workstation';
  approxPriceCash: number;
  description: string;
  targetResolution: '1080p Médio' | '1080p Ultra' | '1440p Ultra' | '4K Ultra' | 'Produtividade';
  componentIds: {
    cpu: string;
    cooler?: string;
    gpu?: string;
    motherboard: string;
    ram: { id: string; quantity: number };
    storage: { id: string; quantity: number }[];
    case: string;
    psu: string;
    monitor?: string;
  };
}
