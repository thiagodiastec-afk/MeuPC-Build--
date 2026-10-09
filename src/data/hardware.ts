import { PCComponent } from '../types/pc';

export function createStoreLinks(productName: string) {
  const enc = encodeURIComponent(productName);
  return [
    {
      storeName: 'KaBuM!',
      url: `https://www.kabum.com.br/busca/${enc}`,
      inStock: true,
      badge: 'PIX com Desconto'
    },
    {
      storeName: 'Terabyte',
      url: `https://www.terabyteshop.com.br/busca?busca=${enc}`,
      inStock: true,
      badge: 'Melhor no PIX'
    },
    {
      storeName: 'Pichau',
      url: `https://www.pichau.com.br/search?q=${enc}`,
      inStock: true,
      badge: 'Frete Rápido'
    },
    {
      storeName: 'Amazon BR',
      url: `https://www.amazon.com.br/s?k=${enc}`,
      inStock: true,
      badge: 'Prime'
    },
    {
      storeName: 'Mercado Livre',
      url: `https://lista.mercadolivre.com.br/${enc}`,
      inStock: true,
      badge: 'Entrega Rápida'
    }
  ];
}

function calcInstallments(cash: number): number {
  return Math.round(cash * 1.176 * 100) / 100;
}

export const HARDWARE_CATALOG: PCComponent[] = [
  // ==========================================
  // PROCESSADORES (CPUs)
  // ==========================================
  {
    id: 'cpu-amd-r5-5600',
    name: 'AMD Ryzen 5 5600 3.5GHz (4.4GHz Turbo)',
    category: 'cpu',
    brand: 'AMD',
    model: 'Ryzen 5 5600',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 428,
    lowestPriceCash: 799.90,
    lowestPriceInstallments: 941.06,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 799.90,
        priceInstallments: 941.06,
        url: 'https://www.kabum.com.br/busca/Ryzen%205%205600',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'Terabyte',
        priceCash: 819.00,
        priceInstallments: 963.53,
        url: 'https://www.terabyteshop.com.br/busca?busca=Ryzen%205%205600',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 809.90,
        priceInstallments: 952.82,
        url: 'https://www.pichau.com.br/search?q=Ryzen%205%205600',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 859.00,
        priceInstallments: 941.06,
        url: 'https://www.amazon.com.br/s?k=Ryzen%205%205600',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 849.00,
        priceInstallments: 959.00,
        url: 'https://lista.mercadolivre.com.br/Ryzen%205%205600',
        inStock: true,
      }
    ],
    specs: {
      'Núcleos / Threads': '6 Núcleos / 12 Threads',
      'Clock Base / Boost': '3.5 GHz / 4.4 GHz',
      'Cache L3': '32 MB',
      'PCIe': 'PCIe 4.0',
      'Cooler Incluso': 'Sim (Wraith Stealth)'
    },
    socket: 'AM4',
    tdpWattage: 65,
    memoryType: 'DDR4',
    coolerIncluded: true
  },
  {
    id: 'cpu-amd-r7-5700x',
    name: 'AMD Ryzen 7 5700X 3.4GHz (4.6GHz Turbo)',
    category: 'cpu',
    brand: 'AMD',
    model: 'Ryzen 7 5700X',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 312,
    lowestPriceCash: 1149.00,
    lowestPriceInstallments: 1351.76,
    stores: [
      {
        storeName: 'Terabyte',
        priceCash: 1149.00,
        priceInstallments: 1351.76,
        url: 'https://www.terabyteshop.com.br/busca?busca=Ryzen%207%205700X',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'KaBuM!',
        priceCash: 1179.90,
        priceInstallments: 1388.12,
        url: 'https://www.kabum.com.br/busca/Ryzen%207%205700X',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 1169.00,
        priceInstallments: 1375.29,
        url: 'https://www.pichau.com.br/search?q=Ryzen%207%205700X',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 1199.00,
        priceInstallments: 1351.76,
        url: 'https://www.amazon.com.br/s?k=Ryzen%207%205700X',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 1189.00,
        priceInstallments: 1399.00,
        url: 'https://lista.mercadolivre.com.br/Ryzen%207%205700X',
        inStock: true,
      }
    ],
    specs: {
      'Núcleos / Threads': '8 Núcleos / 16 Threads',
      'Clock Base / Boost': '3.4 GHz / 4.6 GHz',
      'Cache L3': '32 MB',
      'PCIe': 'PCIe 4.0',
      'Cooler Incluso': 'Não'
    },
    socket: 'AM4',
    tdpWattage: 65,
    memoryType: 'DDR4',
    coolerIncluded: false
  },
  {
    id: 'cpu-amd-r7-5700x3d',
    name: 'AMD Ryzen 7 5700X3D 3.0GHz (4.1GHz Turbo) 3D V-Cache',
    category: 'cpu',
    brand: 'AMD',
    model: 'Ryzen 7 5700X3D',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewCount: 540,
    lowestPriceCash: 1399.00,
    lowestPriceInstallments: 1645.88,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 1399.00,
        priceInstallments: 1645.88,
        url: 'https://www.kabum.com.br/busca/Ryzen%207%205700X3D',
        inStock: true,
        isLowest: true,
        badge: 'Top Custo-Benefício AM4'
      },
      {
        storeName: 'Terabyte',
        priceCash: 1429.00,
        priceInstallments: 1681.18,
        url: 'https://www.terabyteshop.com.br/busca?busca=Ryzen%207%205700X3D',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 1419.90,
        priceInstallments: 1670.47,
        url: 'https://www.pichau.com.br/search?q=Ryzen%207%205700X3D',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 1479.00,
        priceInstallments: 1645.88,
        url: 'https://www.amazon.com.br/s?k=Ryzen%207%205700X3D',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 1450.00,
        priceInstallments: 1699.00,
        url: 'https://lista.mercadolivre.com.br/Ryzen%207%205700X3D',
        inStock: true,
      }
    ],
    specs: {
      'Núcleos / Threads': '8 Núcleos / 16 Threads',
      'Clock Base / Boost': '3.0 GHz / 4.1 GHz',
      'Cache L3': '96 MB (3D V-Cache)',
      'Desempenho em Jogos': 'Excepcional para eSports e AAA',
      'Cooler Incluso': 'Não'
    },
    socket: 'AM4',
    tdpWattage: 105,
    memoryType: 'DDR4',
    coolerIncluded: false
  },
  {
    id: 'cpu-amd-r5-7600',
    name: 'AMD Ryzen 5 7600 3.8GHz (5.1GHz Turbo) AM5',
    category: 'cpu',
    brand: 'AMD',
    model: 'Ryzen 5 7600',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 198,
    lowestPriceCash: 1349.00,
    lowestPriceInstallments: 1587.06,
    stores: [
      {
        storeName: 'Terabyte',
        priceCash: 1349.00,
        priceInstallments: 1587.06,
        url: 'https://www.terabyteshop.com.br/busca?busca=Ryzen%205%207600',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'KaBuM!',
        priceCash: 1379.00,
        priceInstallments: 1622.35,
        url: 'https://www.kabum.com.br/busca/Ryzen%205%207600',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 1369.00,
        priceInstallments: 1610.59,
        url: 'https://www.pichau.com.br/search?q=Ryzen%205%207600',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 1399.00,
        priceInstallments: 1587.06,
        url: 'https://www.amazon.com.br/s?k=Ryzen%205%207600',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 1389.00,
        priceInstallments: 1610.00,
        url: 'https://lista.mercadolivre.com.br/Ryzen%205%207600',
        inStock: true,
      }
    ],
    specs: {
      'Núcleos / Threads': '6 Núcleos / 12 Threads',
      'Clock Base / Boost': '3.8 GHz / 5.1 GHz',
      'Cache L3': '32 MB',
      'Plataforma': 'AM5 (Suporte a longo prazo)',
      'Memória Suportada': 'DDR5',
      'Gráficos Integrados': 'AMD Radeon Graphics (RDNA 2)'
    },
    socket: 'AM5',
    tdpWattage: 65,
    memoryType: 'DDR5',
    coolerIncluded: true
  },
  {
    id: 'cpu-intel-i5-12400f',
    name: 'Intel Core i5-12400F 2.5GHz (4.4GHz Turbo)',
    category: 'cpu',
    brand: 'Intel',
    model: 'Core i5-12400F',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 388,
    lowestPriceCash: 699.90,
    lowestPriceInstallments: 823.41,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 699.90,
        priceInstallments: 823.41,
        url: 'https://www.kabum.com.br/busca/i5%2012400F',
        inStock: true,
        isLowest: true,
        badge: 'Líder Custo x Benefício'
      },
      {
        storeName: 'Terabyte',
        priceCash: 719.00,
        priceInstallments: 845.88,
        url: 'https://www.terabyteshop.com.br/busca?busca=i5%2012400F',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 709.00,
        priceInstallments: 834.12,
        url: 'https://www.pichau.com.br/search?q=i5%2012400F',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 749.00,
        priceInstallments: 823.41,
        url: 'https://www.amazon.com.br/s?k=i5%2012400F',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 739.00,
        priceInstallments: 859.00,
        url: 'https://lista.mercadolivre.com.br/i5%2012400F',
        inStock: true,
      }
    ],
    specs: {
      'Núcleos / Threads': '6 Performance-cores / 12 Threads',
      'Clock Base / Boost': '2.5 GHz / 4.4 GHz',
      'Cache L3': '18 MB Intel Smart Cache',
      'PCIe': 'PCIe 5.0 e PCIe 4.0',
      'Cooler Incluso': 'Sim (Laminar RM1)'
    },
    socket: 'LGA1700',
    tdpWattage: 65,
    memoryType: 'DDR4',
    coolerIncluded: true
  },
  {
    id: 'cpu-intel-i5-13400f',
    name: 'Intel Core i5-13400F 2.5GHz (4.6GHz Turbo)',
    category: 'cpu',
    brand: 'Intel',
    model: 'Core i5-13400F',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 220,
    lowestPriceCash: 1199.00,
    lowestPriceInstallments: 1410.59,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 1199.00,
        priceInstallments: 1410.59,
        url: 'https://www.kabum.com.br/busca/i5%2013400F',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'Pichau',
        priceCash: 1219.00,
        priceInstallments: 1434.12,
        url: 'https://www.pichau.com.br/search?q=i5%2013400F',
        inStock: true,
      },
      {
        storeName: 'Terabyte',
        priceCash: 1229.00,
        priceInstallments: 1445.88,
        url: 'https://www.terabyteshop.com.br/busca?busca=i5%2013400F',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 1249.00,
        priceInstallments: 1410.59,
        url: 'https://www.amazon.com.br/s?k=i5%2013400F',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 1239.00,
        priceInstallments: 1450.00,
        url: 'https://lista.mercadolivre.com.br/i5%2013400F',
        inStock: true,
      }
    ],
    specs: {
      'Núcleos / Threads': '10 Núcleos (6P + 4E) / 16 Threads',
      'Clock Boost': 'Até 4.6 GHz',
      'Cache': '20 MB',
      'Suporte Memória': 'DDR4 e DDR5'
    },
    socket: 'LGA1700',
    tdpWattage: 65,
    memoryType: 'DDR4',
    coolerIncluded: true
  },
  {
    id: 'cpu-amd-r7-7800x3d',
    name: 'AMD Ryzen 7 7800X3D 4.2GHz (5.0GHz Turbo) AM5',
    category: 'cpu',
    brand: 'AMD',
    model: 'Ryzen 7 7800X3D',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewCount: 620,
    lowestPriceCash: 2899.00,
    lowestPriceInstallments: 3410.59,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 2899.00,
        priceInstallments: 3410.59,
        url: 'https://www.kabum.com.br/busca/Ryzen%207%207800X3D',
        inStock: true,
        isLowest: true,
        badge: 'Melhor CPU Gamer do Mundo'
      },
      {
        storeName: 'Terabyte',
        priceCash: 2949.00,
        priceInstallments: 3469.41,
        url: 'https://www.terabyteshop.com.br/busca?busca=Ryzen%207%207800X3D',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 2929.00,
        priceInstallments: 3445.88,
        url: 'https://www.pichau.com.br/search?q=Ryzen%207%207800X3D',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 2999.00,
        priceInstallments: 3410.59,
        url: 'https://www.amazon.com.br/s?k=Ryzen%207%207800X3D',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 2970.00,
        priceInstallments: 3499.00,
        url: 'https://lista.mercadolivre.com.br/Ryzen%207%207800X3D',
        inStock: true,
      }
    ],
    specs: {
      'Núcleos / Threads': '8 Núcleos / 16 Threads',
      'Clock Base / Boost': '4.2 GHz / 5.0 GHz',
      'Cache L3': '96 MB (104 MB Total)',
      'Memória Suportada': 'DDR5'
    },
    socket: 'AM5',
    tdpWattage: 120,
    memoryType: 'DDR5',
    coolerIncluded: false
  },

  // ==========================================
  // PLACAS DE VÍDEO (GPUs)
  // ==========================================
  {
    id: 'gpu-amd-rx6600',
    name: 'AMD Radeon RX 6600 8GB GDDR6 (ASRock / XFX / Sapphire)',
    category: 'gpu',
    brand: 'AMD',
    model: 'Radeon RX 6600 8GB',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 650,
    lowestPriceCash: 1399.00,
    lowestPriceInstallments: 1645.88,
    stores: [
      {
        storeName: 'Terabyte',
        priceCash: 1399.00,
        priceInstallments: 1645.88,
        url: 'https://www.terabyteshop.com.br/busca?busca=RX%206600%208GB',
        inStock: true,
        isLowest: true,
        badge: 'Melhor Custo x FPS 1080p'
      },
      {
        storeName: 'KaBuM!',
        priceCash: 1429.00,
        priceInstallments: 1681.18,
        url: 'https://www.kabum.com.br/busca/RX%206600%208GB',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 1419.00,
        priceInstallments: 1669.41,
        url: 'https://www.pichau.com.br/search?q=RX%206600%208GB',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 1469.00,
        priceInstallments: 1645.88,
        url: 'https://www.amazon.com.br/s?k=RX%206600%208GB',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 1449.00,
        priceInstallments: 1690.00,
        url: 'https://lista.mercadolivre.com.br/RX%206600%208GB',
        inStock: true,
      }
    ],
    specs: {
      'VRAM': '8GB GDDR6 128-bit',
      'Arquitetura': 'RDNA 2',
      'Resolução Alvo': '1080p Ultra',
      'Conector': '1x 8-pin',
      'Fonte Recomendada': '500W'
    },
    tdpWattage: 132,
    dimensions: { length: 241, slots: 2 }
  },
  {
    id: 'gpu-amd-rx7600',
    name: 'AMD Radeon RX 7600 8GB GDDR6 (RDNA 3)',
    category: 'gpu',
    brand: 'AMD',
    model: 'Radeon RX 7600 8GB',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 215,
    lowestPriceCash: 1799.00,
    lowestPriceInstallments: 2116.47,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 1799.00,
        priceInstallments: 2116.47,
        url: 'https://www.kabum.com.br/busca/RX%207600%208GB',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'Terabyte',
        priceCash: 1829.00,
        priceInstallments: 2151.76,
        url: 'https://www.terabyteshop.com.br/busca?busca=RX%207600%208GB',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 1819.00,
        priceInstallments: 2140.00,
        url: 'https://www.pichau.com.br/search?q=RX%207600%208GB',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 1879.00,
        priceInstallments: 2116.47,
        url: 'https://www.amazon.com.br/s?k=RX%207600%208GB',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 1849.00,
        priceInstallments: 2190.00,
        url: 'https://lista.mercadolivre.com.br/RX%207600%208GB',
        inStock: true,
      }
    ],
    specs: {
      'VRAM': '8GB GDDR6 128-bit',
      'Arquitetura': 'RDNA 3',
      'Encoder': 'AV1 Hardware Encoding',
      'Fonte Recomendada': '550W'
    },
    tdpWattage: 165,
    dimensions: { length: 240, slots: 2 }
  },
  {
    id: 'gpu-nvidia-rtx-4060',
    name: 'NVIDIA GeForce RTX 4060 8GB GDDR6 DLSS 3',
    category: 'gpu',
    brand: 'NVIDIA',
    model: 'GeForce RTX 4060 8GB',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 880,
    lowestPriceCash: 1899.00,
    lowestPriceInstallments: 2234.12,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 1899.00,
        priceInstallments: 2234.12,
        url: 'https://www.kabum.com.br/busca/RTX%204060%208GB',
        inStock: true,
        isLowest: true,
        badge: 'Top Vendas Brasil'
      },
      {
        storeName: 'Terabyte',
        priceCash: 1929.00,
        priceInstallments: 2269.41,
        url: 'https://www.terabyteshop.com.br/busca?busca=RTX%204060%208GB',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 1919.00,
        priceInstallments: 2257.65,
        url: 'https://www.pichau.com.br/search?q=RTX%204060%208GB',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 1979.00,
        priceInstallments: 2234.12,
        url: 'https://www.amazon.com.br/s?k=RTX%204060%208GB',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 1950.00,
        priceInstallments: 2290.00,
        url: 'https://lista.mercadolivre.com.br/RTX%204060%208GB',
        inStock: true,
      }
    ],
    specs: {
      'VRAM': '8GB GDDR6 128-bit',
      'Tecnologias': 'DLSS 3 Frame Generation / Ray Tracing',
      'Eficiência': 'Apenas 115W de consumo médio',
      'Fonte Recomendada': '500W ou 550W'
    },
    tdpWattage: 115,
    dimensions: { length: 242, slots: 2 }
  },
  {
    id: 'gpu-nvidia-rtx-4060ti',
    name: 'NVIDIA GeForce RTX 4060 Ti 8GB GDDR6 DLSS 3',
    category: 'gpu',
    brand: 'NVIDIA',
    model: 'GeForce RTX 4060 Ti 8GB',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 340,
    lowestPriceCash: 2499.00,
    lowestPriceInstallments: 2940.00,
    stores: [
      {
        storeName: 'Terabyte',
        priceCash: 2499.00,
        priceInstallments: 2940.00,
        url: 'https://www.terabyteshop.com.br/busca?busca=RTX%204060%20Ti',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'KaBuM!',
        priceCash: 2549.00,
        priceInstallments: 2998.82,
        url: 'https://www.kabum.com.br/busca/RTX%204060%20Ti',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 2529.00,
        priceInstallments: 2975.29,
        url: 'https://www.pichau.com.br/search?q=RTX%204060%20Ti',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 2599.00,
        priceInstallments: 2940.00,
        url: 'https://www.amazon.com.br/s?k=RTX%204060%20Ti',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 2570.00,
        priceInstallments: 2999.00,
        url: 'https://lista.mercadolivre.com.br/RTX%204060%20Ti',
        inStock: true,
      }
    ],
    specs: {
      'VRAM': '8GB GDDR6 128-bit',
      'Desempenho': 'Excelente para 1080p competitivo e 1440p',
      'Tecnologias': 'DLSS 3 / AV1 / Reflex',
      'Fonte Recomendada': '550W'
    },
    tdpWattage: 160,
    dimensions: { length: 250, slots: 2 }
  },
  {
    id: 'gpu-amd-rx6750xt',
    name: 'AMD Radeon RX 6750 XT 12GB GDDR6 (XFX / MSI)',
    category: 'gpu',
    brand: 'AMD',
    model: 'Radeon RX 6750 XT 12GB',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 410,
    lowestPriceCash: 2199.00,
    lowestPriceInstallments: 2587.06,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 2199.00,
        priceInstallments: 2587.06,
        url: 'https://www.kabum.com.br/busca/RX%206750%20XT',
        inStock: true,
        isLowest: true,
        badge: 'Custo-Benefício 1440p (12GB)'
      },
      {
        storeName: 'Terabyte',
        priceCash: 2249.00,
        priceInstallments: 2645.88,
        url: 'https://www.terabyteshop.com.br/busca?busca=RX%206750%20XT',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 2239.00,
        priceInstallments: 2634.12,
        url: 'https://www.pichau.com.br/search?q=RX%206750%20XT',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 2299.00,
        priceInstallments: 2587.06,
        url: 'https://www.amazon.com.br/s?k=RX%206750%20XT',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 2270.00,
        priceInstallments: 2690.00,
        url: 'https://lista.mercadolivre.com.br/RX%206750%20XT',
        inStock: true,
      }
    ],
    specs: {
      'VRAM': '12GB GDDR6 192-bit',
      'Resolução Ideal': '1440p Quad HD com alta longevidade',
      'Conectores': '2x 8-pin',
      'Fonte Recomendada': '650W'
    },
    tdpWattage: 250,
    dimensions: { length: 280, slots: 2.5 }
  },
  {
    id: 'gpu-nvidia-rtx-4070-super',
    name: 'NVIDIA GeForce RTX 4070 SUPER 12GB GDDR6X',
    category: 'gpu',
    brand: 'NVIDIA',
    model: 'GeForce RTX 4070 SUPER 12GB',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewCount: 412,
    lowestPriceCash: 4199.00,
    lowestPriceInstallments: 4940.00,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 4199.00,
        priceInstallments: 4940.00,
        url: 'https://www.kabum.com.br/busca/RTX%204070%20SUPER',
        inStock: true,
        isLowest: true,
        badge: 'Monstro 1440p e 4K'
      },
      {
        storeName: 'Terabyte',
        priceCash: 4249.00,
        priceInstallments: 4998.82,
        url: 'https://www.terabyteshop.com.br/busca?busca=RTX%204070%20SUPER',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 4239.00,
        priceInstallments: 4987.06,
        url: 'https://www.pichau.com.br/search?q=RTX%204070%20SUPER',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 4349.00,
        priceInstallments: 4940.00,
        url: 'https://www.amazon.com.br/s?k=RTX%204070%20SUPER',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 4299.00,
        priceInstallments: 5090.00,
        url: 'https://lista.mercadolivre.com.br/RTX%204070%20SUPER',
        inStock: true,
      }
    ],
    specs: {
      'VRAM': '12GB GDDR6X 192-bit',
      'Desempenho': 'Próxima da RTX 4070 Ti consumindo menos energia',
      'Tecnologias': 'DLSS 3.5 Ray Reconstruction',
      'Fonte Recomendada': '650W ou 750W'
    },
    tdpWattage: 220,
    dimensions: { length: 265, slots: 2.5 }
  },

  // ==========================================
  // PLACAS-MÃE (Motherboards)
  // ==========================================
  {
    id: 'mobo-msi-a520m-a-pro',
    name: 'MSI A520M-A PRO Micro-ATX (AM4 DDR4)',
    category: 'motherboard',
    brand: 'MSI',
    model: 'A520M-A PRO',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 310,
    lowestPriceCash: 379.90,
    lowestPriceInstallments: 446.94,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 379.90,
        priceInstallments: 446.94,
        url: 'https://www.kabum.com.br/busca/A520M',
        inStock: true,
        isLowest: true,
        badge: 'Entrada Econômica'
      },
      {
        storeName: 'Terabyte',
        priceCash: 399.00,
        priceInstallments: 469.41,
        url: 'https://www.terabyteshop.com.br/busca?busca=A520M',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 389.00,
        priceInstallments: 457.65,
        url: 'https://www.pichau.com.br/search?q=A520M',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 419.00,
        priceInstallments: 446.94,
        url: 'https://www.amazon.com.br/s?k=A520M',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 399.00,
        priceInstallments: 479.00,
        url: 'https://lista.mercadolivre.com.br/A520M',
        inStock: true,
      }
    ],
    specs: {
      'Soquete': 'AM4',
      'Slots de Memória': '2x DDR4 (até 64GB)',
      'Slots M.2': '1x M.2 NVMe PCIe 3.0',
      'Formato': 'Micro-ATX'
    },
    socket: 'AM4',
    memoryType: 'DDR4',
    formFactor: 'Micro-ATX',
    maxMemorySlots: 2
  },
  {
    id: 'mobo-asrock-b450m-hdv',
    name: 'ASRock B450M-HDV R4.0 Micro-ATX (AM4 DDR4)',
    category: 'motherboard',
    brand: 'ASRock',
    model: 'B450M-HDV R4.0',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 190,
    lowestPriceCash: 399.00,
    lowestPriceInstallments: 469.41,
    stores: [
      {
        storeName: 'Terabyte',
        priceCash: 399.00,
        priceInstallments: 469.41,
        url: 'https://www.terabyteshop.com.br/busca?busca=B450M',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'KaBuM!',
        priceCash: 419.00,
        priceInstallments: 492.94,
        url: 'https://www.kabum.com.br/busca/B450M',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 409.00,
        priceInstallments: 481.18,
        url: 'https://www.pichau.com.br/search?q=B450M',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 439.00,
        priceInstallments: 469.41,
        url: 'https://www.amazon.com.br/s?k=B450M',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 420.00,
        priceInstallments: 489.00,
        url: 'https://lista.mercadolivre.com.br/B450M',
        inStock: true,
      }
    ],
    specs: {
      'Soquete': 'AM4',
      'Slots de Memória': '2x DDR4 3200MHz',
      'Slots M.2': '1x Ultra M.2 PCIe Gen3 x4',
      'Formato': 'Micro-ATX'
    },
    socket: 'AM4',
    memoryType: 'DDR4',
    formFactor: 'Micro-ATX',
    maxMemorySlots: 2
  },
  {
    id: 'mobo-msi-b550m-vdh-wifi',
    name: 'MSI B550M PRO-VDH WiFi Micro-ATX (AM4 DDR4)',
    category: 'motherboard',
    brand: 'MSI',
    model: 'B550M PRO-VDH WiFi',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 780,
    lowestPriceCash: 699.00,
    lowestPriceInstallments: 822.35,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 699.00,
        priceInstallments: 822.35,
        url: 'https://www.kabum.com.br/busca/B550M%20PRO-VDH',
        inStock: true,
        isLowest: true,
        badge: 'Campeã de Vendas AM4'
      },
      {
        storeName: 'Terabyte',
        priceCash: 729.00,
        priceInstallments: 857.65,
        url: 'https://www.terabyteshop.com.br/busca?busca=B550M%20PRO-VDH',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 719.00,
        priceInstallments: 845.88,
        url: 'https://www.pichau.com.br/search?q=B550M%20PRO-VDH',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 759.00,
        priceInstallments: 822.35,
        url: 'https://www.amazon.com.br/s?k=B550M%20PRO-VDH',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 740.00,
        priceInstallments: 869.00,
        url: 'https://lista.mercadolivre.com.br/B550M%20PRO-VDH',
        inStock: true,
      }
    ],
    specs: {
      'Soquete': 'AM4',
      'Conectividade': 'Wi-Fi e Bluetooth integrados',
      'Slots de Memória': '4x DDR4 (até 128GB)',
      'Slots M.2': '2x M.2 (1x PCIe 4.0 + 1x PCIe 3.0)',
      'VRM': 'Dissipador robusto para Ryzen 7'
    },
    socket: 'AM4',
    memoryType: 'DDR4',
    formFactor: 'Micro-ATX',
    maxMemorySlots: 4
  },
  {
    id: 'mobo-asus-prime-b650m-a',
    name: 'ASUS Prime B650M-A WiFi II Micro-ATX (AM5 DDR5)',
    category: 'motherboard',
    brand: 'ASUS',
    model: 'Prime B650M-A WiFi II',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 180,
    lowestPriceCash: 999.00,
    lowestPriceInstallments: 1175.29,
    stores: [
      {
        storeName: 'Terabyte',
        priceCash: 999.00,
        priceInstallments: 1175.29,
        url: 'https://www.terabyteshop.com.br/busca?busca=B650M',
        inStock: true,
        isLowest: true,
        badge: 'Custo x Benefício AM5'
      },
      {
        storeName: 'KaBuM!',
        priceCash: 1049.00,
        priceInstallments: 1234.12,
        url: 'https://www.kabum.com.br/busca/B650M',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 1029.00,
        priceInstallments: 1210.59,
        url: 'https://www.pichau.com.br/search?q=B650M',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 1089.00,
        priceInstallments: 1175.29,
        url: 'https://www.amazon.com.br/s?k=B650M',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 1050.00,
        priceInstallments: 1240.00,
        url: 'https://lista.mercadolivre.com.br/B650M',
        inStock: true,
      }
    ],
    specs: {
      'Soquete': 'AM5',
      'Slots de Memória': '4x DDR5 (até 192GB)',
      'Slots M.2': 'PCIe 5.0 M.2 suportado',
      'Conectividade': 'Wi-Fi 6 e 2.5Gb Ethernet'
    },
    socket: 'AM5',
    memoryType: 'DDR5',
    formFactor: 'Micro-ATX',
    maxMemorySlots: 4
  },
  {
    id: 'mobo-msi-pro-h610m-e',
    name: 'MSI PRO H610M-E DDR4 Micro-ATX (LGA1700)',
    category: 'motherboard',
    brand: 'MSI',
    model: 'PRO H610M-E DDR4',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 260,
    lowestPriceCash: 459.00,
    lowestPriceInstallments: 540.00,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 459.00,
        priceInstallments: 540.00,
        url: 'https://www.kabum.com.br/busca/H610M',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'Terabyte',
        priceCash: 479.00,
        priceInstallments: 563.53,
        url: 'https://www.terabyteshop.com.br/busca?busca=H610M',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 469.00,
        priceInstallments: 551.76,
        url: 'https://www.pichau.com.br/search?q=H610M',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 499.00,
        priceInstallments: 540.00,
        url: 'https://www.amazon.com.br/s?k=H610M',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 489.00,
        priceInstallments: 569.00,
        url: 'https://lista.mercadolivre.com.br/H610M',
        inStock: true,
      }
    ],
    specs: {
      'Soquete': 'LGA 1700 (12ª, 13ª e 14ª Geração)',
      'Slots de Memória': '2x DDR4 (até 64GB 3200MHz)',
      'Slots M.2': '1x M.2 PCIe 3.0 x4',
      'Formato': 'Micro-ATX'
    },
    socket: 'LGA1700',
    memoryType: 'DDR4',
    formFactor: 'Micro-ATX',
    maxMemorySlots: 2
  },
  {
    id: 'mobo-asrock-b760m-d4',
    name: 'ASRock B760M-HDV/M.2 D4 Micro-ATX (LGA1700 DDR4)',
    category: 'motherboard',
    brand: 'ASRock',
    model: 'B760M-HDV/M.2 D4',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 140,
    lowestPriceCash: 649.00,
    lowestPriceInstallments: 763.53,
    stores: [
      {
        storeName: 'Terabyte',
        priceCash: 649.00,
        priceInstallments: 763.53,
        url: 'https://www.terabyteshop.com.br/busca?busca=B760M',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'KaBuM!',
        priceCash: 679.00,
        priceInstallments: 798.82,
        url: 'https://www.kabum.com.br/busca/B760M',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 669.00,
        priceInstallments: 787.06,
        url: 'https://www.pichau.com.br/search?q=B760M',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 719.00,
        priceInstallments: 763.53,
        url: 'https://www.amazon.com.br/s?k=B760M',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 699.00,
        priceInstallments: 819.00,
        url: 'https://lista.mercadolivre.com.br/B760M',
        inStock: true,
      }
    ],
    specs: {
      'Soquete': 'LGA 1700',
      'PCIe': 'PCIe 4.0 x16',
      'Slots M.2': '2x Hyper M.2 PCIe Gen4 x4',
      'Slots de Memória': '2x DDR4'
    },
    socket: 'LGA1700',
    memoryType: 'DDR4',
    formFactor: 'Micro-ATX',
    maxMemorySlots: 2
  },
  {
    id: 'mobo-msi-b760m-bomber-ddr5',
    name: 'MSI B760M Bomber DDR5 Micro-ATX (LGA1700 DDR5)',
    category: 'motherboard',
    brand: 'MSI',
    model: 'B760M Bomber DDR5',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 95,
    lowestPriceCash: 749.00,
    lowestPriceInstallments: 881.18,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 749.00,
        priceInstallments: 881.18,
        url: 'https://www.kabum.com.br/busca/B760M%20DDR5',
        inStock: true,
        isLowest: true,
        badge: 'Entrada DDR5 Intel'
      },
      {
        storeName: 'Terabyte',
        priceCash: 779.00,
        priceInstallments: 916.47,
        url: 'https://www.terabyteshop.com.br/busca?busca=B760M%20DDR5',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 769.00,
        priceInstallments: 904.71,
        url: 'https://www.pichau.com.br/search?q=B760M%20DDR5',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 819.00,
        priceInstallments: 881.18,
        url: 'https://www.amazon.com.br/s?k=B760M%20DDR5',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 799.00,
        priceInstallments: 929.00,
        url: 'https://lista.mercadolivre.com.br/B760M%20DDR5',
        inStock: true,
      }
    ],
    specs: {
      'Soquete': 'LGA 1700',
      'Memória': 'DDR5 até 6400MHz+ (OC)',
      'Slots M.2': '2x M.2 PCIe 4.0 x4',
      'Slots de Memória': '2x DDR5'
    },
    socket: 'LGA1700',
    memoryType: 'DDR5',
    formFactor: 'Micro-ATX',
    maxMemorySlots: 2
  },

  // ==========================================
  // MEMÓRIAS RAM
  // ==========================================
  {
    id: 'ram-kingston-fury-16gb-3200-ddr4',
    name: 'Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz CL16',
    category: 'ram',
    brand: 'Kingston',
    model: 'Fury Beast 16GB (2x8GB) DDR4 3200',
    image: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 920,
    lowestPriceCash: 289.90,
    lowestPriceInstallments: 341.06,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 289.90,
        priceInstallments: 341.06,
        url: 'https://www.kabum.com.br/busca/16GB%20DDR4%203200MHz',
        inStock: true,
        isLowest: true,
        badge: 'Kit Dual Channel Padrão'
      },
      {
        storeName: 'Terabyte',
        priceCash: 299.00,
        priceInstallments: 351.76,
        url: 'https://www.terabyteshop.com.br/busca?busca=16GB%20DDR4%203200MHz',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 295.00,
        priceInstallments: 347.06,
        url: 'https://www.pichau.com.br/search?q=16GB%20DDR4%203200MHz',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 319.00,
        priceInstallments: 341.06,
        url: 'https://www.amazon.com.br/s?k=16GB%20DDR4%203200MHz',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 309.00,
        priceInstallments: 359.00,
        url: 'https://lista.mercadolivre.com.br/16GB%20DDR4%203200MHz',
        inStock: true,
      }
    ],
    specs: {
      'Capacidade': '16GB (2 pentes de 8GB)',
      'Velocidade': '3200 MHz',
      'Latência': 'CL16',
      'Perfil': 'Intel XMP 2.0 / AMD Ready',
      'Dissipador': 'Alumínio preto baixo perfil'
    },
    memoryType: 'DDR4'
  },
  {
    id: 'ram-corsair-vengeance-32gb-ddr4',
    name: 'Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz CL16',
    category: 'ram',
    brand: 'Corsair',
    model: 'Vengeance LPX 32GB (2x16GB)',
    image: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 540,
    lowestPriceCash: 499.00,
    lowestPriceInstallments: 587.06,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 499.00,
        priceInstallments: 587.06,
        url: 'https://www.kabum.com.br/busca/32GB%20DDR4%203200MHz',
        inStock: true,
        isLowest: true,
        badge: 'Melhor para Multitarefas'
      },
      {
        storeName: 'Terabyte',
        priceCash: 519.00,
        priceInstallments: 610.59,
        url: 'https://www.terabyteshop.com.br/busca?busca=32GB%20DDR4%203200MHz',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 509.00,
        priceInstallments: 598.82,
        url: 'https://www.pichau.com.br/search?q=32GB%20DDR4%203200MHz',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 539.00,
        priceInstallments: 587.06,
        url: 'https://www.amazon.com.br/s?k=32GB%20DDR4%203200MHz',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 520.00,
        priceInstallments: 610.00,
        url: 'https://lista.mercadolivre.com.br/32GB%20DDR4%203200MHz',
        inStock: true,
      }
    ],
    specs: {
      'Capacidade': '32GB (2 pentes de 16GB)',
      'Velocidade': '3200 MHz',
      'Latência': 'CL16-20-20-38',
      'Compatibilidade': 'AM4 e LGA1700'
    },
    memoryType: 'DDR4'
  },
  {
    id: 'ram-corsair-vengeance-32gb-6000-ddr5',
    name: 'Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz CL36',
    category: 'ram',
    brand: 'Corsair',
    model: 'Vengeance 32GB (2x16GB) DDR5 6000',
    image: 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 320,
    lowestPriceCash: 799.00,
    lowestPriceInstallments: 940.00,
    stores: [
      {
        storeName: 'Terabyte',
        priceCash: 799.00,
        priceInstallments: 940.00,
        url: 'https://www.terabyteshop.com.br/busca?busca=32GB%20DDR5%206000MHz',
        inStock: true,
        isLowest: true,
        badge: 'Sweet Spot AM5 / LGA1700'
      },
      {
        storeName: 'KaBuM!',
        priceCash: 829.00,
        priceInstallments: 975.29,
        url: 'https://www.kabum.com.br/busca/32GB%20DDR5%206000MHz',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 819.00,
        priceInstallments: 963.53,
        url: 'https://www.pichau.com.br/search?q=32GB%20DDR5%206000MHz',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 859.00,
        priceInstallments: 940.00,
        url: 'https://www.amazon.com.br/s?k=32GB%20DDR5%206000MHz',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 840.00,
        priceInstallments: 989.00,
        url: 'https://lista.mercadolivre.com.br/32GB%20DDR5%206000MHz',
        inStock: true,
      }
    ],
    specs: {
      'Capacidade': '32GB (2 pentes de 16GB)',
      'Velocidade': '6000 MHz',
      'Latência': 'CL36',
      'Perfis': 'AMD EXPO e Intel XMP 3.0'
    },
    memoryType: 'DDR5'
  },

  // ==========================================
  // ARMAZENAMENTO (Storage / SSDs)
  // ==========================================
  {
    id: 'ssd-kingston-nv2-500gb',
    name: 'SSD Kingston NV2 500GB M.2 2280 NVMe PCIe 4.0',
    category: 'storage',
    brand: 'Kingston',
    model: 'NV2 500GB',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 410,
    lowestPriceCash: 239.90,
    lowestPriceInstallments: 282.24,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 239.90,
        priceInstallments: 282.24,
        url: 'https://www.kabum.com.br/busca/SSD%20500GB%20NVMe',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'Terabyte',
        priceCash: 249.00,
        priceInstallments: 292.94,
        url: 'https://www.terabyteshop.com.br/busca?busca=SSD%20500GB%20NVMe',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 245.00,
        priceInstallments: 288.24,
        url: 'https://www.pichau.com.br/search?q=SSD%20500GB%20NVMe',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 269.00,
        priceInstallments: 282.24,
        url: 'https://www.amazon.com.br/s?k=SSD%20500GB%20NVMe',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 259.00,
        priceInstallments: 299.00,
        url: 'https://lista.mercadolivre.com.br/SSD%20500GB%20NVMe',
        inStock: true,
      }
    ],
    specs: {
      'Capacidade': '500 GB',
      'Interface': 'PCIe 4.0 x4 NVMe',
      'Leitura Sequencial': 'Até 3500 MB/s',
      'Gravação Sequencial': 'Até 2100 MB/s'
    }
  },
  {
    id: 'ssd-kingston-nv2-1tb',
    name: 'SSD Kingston NV2 1TB M.2 2280 NVMe PCIe 4.0',
    category: 'storage',
    brand: 'Kingston',
    model: 'NV2 1TB',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 1100,
    lowestPriceCash: 399.00,
    lowestPriceInstallments: 469.41,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 399.00,
        priceInstallments: 469.41,
        url: 'https://www.kabum.com.br/busca/SSD%201TB%20NVMe',
        inStock: true,
        isLowest: true,
        badge: 'Líder Absoluto de Vendas'
      },
      {
        storeName: 'Terabyte',
        priceCash: 419.00,
        priceInstallments: 492.94,
        url: 'https://www.terabyteshop.com.br/busca?busca=SSD%201TB%20NVMe',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 409.00,
        priceInstallments: 481.18,
        url: 'https://www.pichau.com.br/search?q=SSD%201TB%20NVMe',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 439.00,
        priceInstallments: 469.41,
        url: 'https://www.amazon.com.br/s?k=SSD%201TB%20NVMe',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 420.00,
        priceInstallments: 489.00,
        url: 'https://lista.mercadolivre.com.br/SSD%201TB%20NVMe',
        inStock: true,
      }
    ],
    specs: {
      'Capacidade': '1 TB (1000 GB)',
      'Interface': 'PCIe 4.0 x4 NVMe',
      'Leitura Sequencial': 'Até 3500 MB/s',
      'Gravação Sequencial': 'Até 2100 MB/s',
      'Formato': 'M.2 2280'
    }
  },
  {
    id: 'ssd-kingston-nv2-2tb',
    name: 'SSD Kingston NV2 2TB M.2 2280 NVMe PCIe 4.0',
    category: 'storage',
    brand: 'Kingston',
    model: 'NV2 2TB',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 390,
    lowestPriceCash: 749.00,
    lowestPriceInstallments: 881.18,
    stores: [
      {
        storeName: 'Terabyte',
        priceCash: 749.00,
        priceInstallments: 881.18,
        url: 'https://www.terabyteshop.com.br/busca?busca=SSD%202TB%20NVMe',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'KaBuM!',
        priceCash: 769.00,
        priceInstallments: 904.71,
        url: 'https://www.kabum.com.br/busca/SSD%202TB%20NVMe',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 759.00,
        priceInstallments: 892.94,
        url: 'https://www.pichau.com.br/search?q=SSD%202TB%20NVMe',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 799.00,
        priceInstallments: 881.18,
        url: 'https://www.amazon.com.br/s?k=SSD%202TB%20NVMe',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 780.00,
        priceInstallments: 919.00,
        url: 'https://lista.mercadolivre.com.br/SSD%202TB%20NVMe',
        inStock: true,
      }
    ],
    specs: {
      'Capacidade': '2 TB (2000 GB)',
      'Interface': 'PCIe 4.0 x4 NVMe',
      'Leitura': '3500 MB/s',
      'Gravação': '2800 MB/s'
    }
  },

  // ==========================================
  // FONTES DE ALIMENTAÇÃO (PSUs)
  // ==========================================
  {
    id: 'psu-msi-mag-a500dn',
    name: 'Fonte MSI MAG A500DN 500W 80 Plus Standard',
    category: 'psu',
    brand: 'MSI',
    model: 'MAG A500DN',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 310,
    lowestPriceCash: 249.00,
    lowestPriceInstallments: 292.94,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 249.00,
        priceInstallments: 292.94,
        url: 'https://www.kabum.com.br/busca/Fonte%20500W%2080%20Plus',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'Terabyte',
        priceCash: 259.00,
        priceInstallments: 304.71,
        url: 'https://www.terabyteshop.com.br/busca?busca=Fonte%20500W%2080%20Plus',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 255.00,
        priceInstallments: 300.00,
        url: 'https://www.pichau.com.br/search?q=Fonte%20500W%2080%20Plus',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 279.00,
        priceInstallments: 292.94,
        url: 'https://www.amazon.com.br/s?k=Fonte%20500W%2080%20Plus',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 269.00,
        priceInstallments: 310.00,
        url: 'https://lista.mercadolivre.com.br/Fonte%20500W%2080%20Plus',
        inStock: true,
      }
    ],
    specs: {
      'Potência': '500 Watts',
      'Eficiência': '80 Plus Standard (PFC Ativo)',
      'Proteções': 'OVP, OCP, OPP, OTP, SCP',
      'Ventoinha': '120mm silenciosa'
    },
    tdpWattage: 500
  },
  {
    id: 'psu-msi-mag-a650bn',
    name: 'Fonte MSI MAG A650BN 650W 80 Plus Bronze PFC Ativo',
    category: 'psu',
    brand: 'MSI',
    model: 'MAG A650BN',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 950,
    lowestPriceCash: 299.90,
    lowestPriceInstallments: 352.82,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 299.90,
        priceInstallments: 352.82,
        url: 'https://www.kabum.com.br/busca/MSI%20MAG%20A650BN',
        inStock: true,
        isLowest: true,
        badge: 'Recomendação de Ouro TecLab'
      },
      {
        storeName: 'Terabyte',
        priceCash: 319.00,
        priceInstallments: 375.29,
        url: 'https://www.terabyteshop.com.br/busca?busca=MSI%20MAG%20A650BN',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 309.00,
        priceInstallments: 363.53,
        url: 'https://www.pichau.com.br/search?q=MSI%20MAG%20A650BN',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 349.00,
        priceInstallments: 352.82,
        url: 'https://www.amazon.com.br/s?k=MSI%20MAG%20A650BN',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 329.00,
        priceInstallments: 380.00,
        url: 'https://lista.mercadolivre.com.br/MSI%20MAG%20A650BN',
        inStock: true,
      }
    ],
    specs: {
      'Potência': '650 Watts',
      'Certificação': '80 Plus Bronze',
      'Testada e Aprovada': 'Aprovada no canal TecLab com componentes confiáveis',
      'Conectores PCIe': '2x 6+2 pinos'
    },
    tdpWattage: 650
  },
  {
    id: 'psu-corsair-rm750e',
    name: 'Fonte Corsair RM750e 750W 80 Plus Gold Modular',
    category: 'psu',
    brand: 'Corsair',
    model: 'RM750e',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewCount: 420,
    lowestPriceCash: 629.00,
    lowestPriceInstallments: 740.00,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 629.00,
        priceInstallments: 740.00,
        url: 'https://www.kabum.com.br/busca/Corsair%20750W%20Gold',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'Terabyte',
        priceCash: 659.00,
        priceInstallments: 775.29,
        url: 'https://www.terabyteshop.com.br/busca?busca=Corsair%20750W%20Gold',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 649.00,
        priceInstallments: 763.53,
        url: 'https://www.pichau.com.br/search?q=Corsair%20750W%20Gold',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 689.00,
        priceInstallments: 740.00,
        url: 'https://www.amazon.com.br/s?k=Corsair%20750W%20Gold',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 660.00,
        priceInstallments: 780.00,
        url: 'https://lista.mercadolivre.com.br/Corsair%20750W%20Gold',
        inStock: true,
      }
    ],
    specs: {
      'Potência': '750 Watts',
      'Certificação': '80 Plus Gold e Cybenetics Platinum',
      'Cabeamento': '100% Full Modular',
      'Conector PCIe 5.0': 'Cabo 12VHPWR incluso para RTX série 40'
    },
    tdpWattage: 750
  },

  // ==========================================
  // COOLERS
  // ==========================================
  {
    id: 'cooler-deepcool-ag400',
    name: 'Air Cooler DeepCool AG400 120mm LED',
    category: 'cooler',
    brand: 'DeepCool',
    model: 'AG400',
    image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 520,
    lowestPriceCash: 149.00,
    lowestPriceInstallments: 175.29,
    stores: [
      {
        storeName: 'Terabyte',
        priceCash: 149.00,
        priceInstallments: 175.29,
        url: 'https://www.terabyteshop.com.br/busca?busca=DeepCool%20AG400',
        inStock: true,
        isLowest: true,
        badge: 'Rei do Custo-Benefício'
      },
      {
        storeName: 'KaBuM!',
        priceCash: 159.00,
        priceInstallments: 187.06,
        url: 'https://www.kabum.com.br/busca/DeepCool%20AG400',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 155.00,
        priceInstallments: 182.35,
        url: 'https://www.pichau.com.br/search?q=DeepCool%20AG400',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 169.00,
        priceInstallments: 175.29,
        url: 'https://www.amazon.com.br/s?k=DeepCool%20AG400',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 160.00,
        priceInstallments: 189.00,
        url: 'https://lista.mercadolivre.com.br/DeepCool%20AG400',
        inStock: true,
      }
    ],
    specs: {
      'Tipo': 'Air Cooler Torre Única 120mm',
      'Heatpipes': '4x Heatpipes de contato direto',
      'Altura': '150 mm (cabe na maioria dos gabinetes)',
      'Compatibilidade': 'AM4, AM5, LGA1700, LGA1200'
    },
    dimensions: { height: 150 }
  },
  {
    id: 'cooler-watercooler-240mm',
    name: 'Water Cooler Rise Mode Gamer Black 240mm RGB',
    category: 'cooler',
    brand: 'Rise Mode',
    model: 'Gamer Black 240mm',
    image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=400&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 380,
    lowestPriceCash: 289.00,
    lowestPriceInstallments: 340.00,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 289.00,
        priceInstallments: 340.00,
        url: 'https://www.kabum.com.br/busca/Water%20Cooler%20240mm',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'Terabyte',
        priceCash: 299.00,
        priceInstallments: 351.76,
        url: 'https://www.terabyteshop.com.br/busca?busca=Water%20Cooler%20240mm',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 295.00,
        priceInstallments: 347.06,
        url: 'https://www.pichau.com.br/search?q=Water%20Cooler%20240mm',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 319.00,
        priceInstallments: 340.00,
        url: 'https://www.amazon.com.br/s?k=Water%20Cooler%20240mm',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 309.00,
        priceInstallments: 359.00,
        url: 'https://lista.mercadolivre.com.br/Water%20Cooler%20240mm',
        inStock: true,
      }
    ],
    specs: {
      'Tipo': 'Water Cooler Selado (AIO) 240mm',
      'Radiador': 'Alumínio com 2 fans 120mm RGB',
      'Compatibilidade': 'AM4, AM5, LGA1700, LGA1200',
      'TDP Suportado': 'Até 220W'
    },
    dimensions: { radiatorSize: 240 }
  },

  // ==========================================
  // GABINETES (Cases)
  // ==========================================
  {
    id: 'case-pichau-hx300-glass',
    name: 'Gabinete Gamer Pichau HX300 Glass Preto',
    category: 'case',
    brand: 'Pichau',
    model: 'HX300 Glass',
    image: 'https://images.unsplash.com/photo-1587202372579-224e7561f528?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 620,
    lowestPriceCash: 239.00,
    lowestPriceInstallments: 281.18,
    stores: [
      {
        storeName: 'Pichau',
        priceCash: 239.00,
        priceInstallments: 281.18,
        url: 'https://www.pichau.com.br/search?q=Gabinete%20Gamer%20Vidro%20Lateral',
        inStock: true,
        isLowest: true,
        badge: 'Melhor no PIX'
      },
      {
        storeName: 'Terabyte',
        priceCash: 249.00,
        priceInstallments: 292.94,
        url: 'https://www.terabyteshop.com.br/busca?busca=Gabinete%20Gamer',
        inStock: true,
      },
      {
        storeName: 'KaBuM!',
        priceCash: 259.00,
        priceInstallments: 304.71,
        url: 'https://www.kabum.com.br/busca/Gabinete%20Gamer',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 279.00,
        priceInstallments: 281.18,
        url: 'https://www.amazon.com.br/s?k=Gabinete%20Gamer',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 265.00,
        priceInstallments: 309.00,
        url: 'https://lista.mercadolivre.com.br/Gabinete%20Gamer',
        inStock: true,
      }
    ],
    specs: {
      'Lateral': 'Vidro Temperado',
      'Placas Suportadas': 'Micro-ATX e Mini-ITX',
      'Comprimento Máx. GPU': '310 mm',
      'Altura Máx. Cooler': '160 mm',
      'Suporte Water Cooler': 'Até 240mm'
    },
    clearances: {
      maxGpuLength: 310,
      maxCpuCoolerHeight: 160,
      radiatorSupport: ['120mm', '240mm']
    }
  },
  {
    id: 'case-montech-air-903-max',
    name: 'Gabinete Gamer Montech Air 903 Max (4 Fans 140mm PWM Inclusas)',
    category: 'case',
    brand: 'Montech',
    model: 'Air 903 Max',
    image: 'https://images.unsplash.com/photo-1587202372579-224e7561f528?w=400&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewCount: 480,
    lowestPriceCash: 379.90,
    lowestPriceInstallments: 446.94,
    stores: [
      {
        storeName: 'Terabyte',
        priceCash: 379.90,
        priceInstallments: 446.94,
        url: 'https://www.terabyteshop.com.br/busca?busca=Montech%20Air%20903%20Max',
        inStock: true,
        isLowest: true,
        badge: 'Rei do Airflow'
      },
      {
        storeName: 'KaBuM!',
        priceCash: 399.00,
        priceInstallments: 469.41,
        url: 'https://www.kabum.com.br/busca/Montech%20Air%20903',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 389.00,
        priceInstallments: 457.65,
        url: 'https://www.pichau.com.br/search?q=Montech%20Air%20903',
        inStock: true,
      },
      {
        storeName: 'Amazon BR',
        priceCash: 429.00,
        priceInstallments: 446.94,
        url: 'https://www.amazon.com.br/s?k=Montech%20Air%20903',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 410.00,
        priceInstallments: 479.00,
        url: 'https://lista.mercadolivre.com.br/Montech%20Air%20903',
        inStock: true,
      }
    ],
    specs: {
      'Fans Inclusas': '4x 140mm PWM ARGB de alto fluxo de ar',
      'Placas Suportadas': 'E-ATX, ATX, Micro-ATX, Mini-ITX',
      'Comprimento Máx. GPU': '400 mm (cabe RTX 4090)',
      'Altura Máx. Cooler': '180 mm',
      'Suporte Water Cooler': 'Até 360mm frontal e superior'
    },
    clearances: {
      maxGpuLength: 400,
      maxCpuCoolerHeight: 180,
      radiatorSupport: ['120mm', '240mm', '280mm', '360mm']
    }
  },

  // ==========================================
  // MONITORES (Monitors)
  // ==========================================
  {
    id: 'mon-lg-ultragear-24-180hz',
    name: 'Monitor Gamer LG UltraGear 24" IPS 180Hz 1ms HDR10 FreeSync',
    category: 'monitor',
    brand: 'LG',
    model: 'UltraGear 24GS60F-B',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 780,
    lowestPriceCash: 899.90,
    lowestPriceInstallments: 1058.71,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash: 899.90,
        priceInstallments: 1058.71,
        url: 'https://www.kabum.com.br/busca/LG%20UltraGear%2024%20180Hz',
        inStock: true,
        isLowest: true,
        badge: 'O Mais Vendido'
      },
      {
        storeName: 'Amazon BR',
        priceCash: 929.00,
        priceInstallments: 1058.71,
        url: 'https://www.amazon.com.br/s?k=LG%20UltraGear%2024%20180Hz',
        inStock: true,
      },
      {
        storeName: 'Terabyte',
        priceCash: 939.00,
        priceInstallments: 1104.71,
        url: 'https://www.terabyteshop.com.br/busca?busca=LG%20UltraGear%2024%20180Hz',
        inStock: true,
      },
      {
        storeName: 'Pichau',
        priceCash: 929.00,
        priceInstallments: 1092.94,
        url: 'https://www.pichau.com.br/search?q=LG%20UltraGear%2024%20180Hz',
        inStock: true,
      },
      {
        storeName: 'Mercado Livre',
        priceCash: 940.00,
        priceInstallments: 1099.00,
        url: 'https://lista.mercadolivre.com.br/LG%20UltraGear%2024%20180Hz',
        inStock: true,
      }
    ],
    specs: {
      'Tamanho': '23.8 Polegadas',
      'Painel': 'IPS com cores reais (sRGB 99%)',
      'Taxa de Atualização': '180 Hz',
      'Tempo de Resposta': '1ms MBR',
      'Conexões': 'HDMI e DisplayPort'
    }
  }
];
