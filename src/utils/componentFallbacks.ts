import { PCComponent, ComponentCategory } from '../types/pc';

export function createFallbackComponent(id: string): PCComponent {
  const normId = id.toLowerCase();
  let name = 'Componente';
  let category: ComponentCategory = 'cpu';
  let priceCash = 500;
  let tdp: number | undefined = 65;
  let socket: string | undefined = 'AM4';
  let memoryType: 'DDR4' | 'DDR5' | undefined = 'DDR4';

  if (normId.includes('5600')) {
    name = 'AMD Ryzen 5 5600';
    category = 'cpu';
    priceCash = 799.90;
    tdp = 65;
    socket = 'AM4';
  } else if (normId.includes('12400')) {
    name = 'Intel Core i5-12400F';
    category = 'cpu';
    priceCash = 699.90;
    tdp = 65;
    socket = 'LGA1700';
  } else if (normId.includes('5700x3d')) {
    name = 'AMD Ryzen 7 5700X3D';
    category = 'cpu';
    priceCash = 1399.00;
    tdp = 105;
    socket = 'AM4';
  } else if (normId.includes('7600')) {
    name = 'AMD Ryzen 5 7600';
    category = 'cpu';
    priceCash = 1349.00;
    tdp = 65;
    socket = 'AM5';
    memoryType = 'DDR5';
  } else if (normId.includes('7800x3d')) {
    name = 'AMD Ryzen 7 7800X3D';
    category = 'cpu';
    priceCash = 2799.00;
    tdp = 120;
    socket = 'AM5';
    memoryType = 'DDR5';
  } else if (normId.includes('rx6600') || normId.includes('6600')) {
    name = 'AMD Radeon RX 6600 8GB';
    category = 'gpu';
    priceCash = 1399.00;
    tdp = 132;
    socket = undefined;
    memoryType = undefined;
  } else if (normId.includes('6750')) {
    name = 'AMD Radeon RX 6750 XT 12GB';
    category = 'gpu';
    priceCash = 2399.00;
    tdp = 250;
    socket = undefined;
    memoryType = undefined;
  } else if (normId.includes('4060ti') || normId.includes('4060-ti')) {
    name = 'NVIDIA GeForce RTX 4060 Ti 8GB';
    category = 'gpu';
    priceCash = 2499.00;
    tdp = 160;
    socket = undefined;
    memoryType = undefined;
  } else if (normId.includes('4060')) {
    name = 'NVIDIA GeForce RTX 4060 8GB';
    category = 'gpu';
    priceCash = 1899.00;
    tdp = 115;
    socket = undefined;
    memoryType = undefined;
  } else if (normId.includes('4070super') || normId.includes('4070-super')) {
    name = 'NVIDIA GeForce RTX 4070 SUPER 12GB';
    category = 'gpu';
    priceCash = 4199.00;
    tdp = 220;
    socket = undefined;
    memoryType = undefined;
  } else if (normId.includes('4080')) {
    name = 'NVIDIA GeForce RTX 4080 SUPER 16GB';
    category = 'gpu';
    priceCash = 7499.00;
    tdp = 320;
    socket = undefined;
    memoryType = undefined;
  } else if (normId.includes('b550')) {
    name = 'MSI B550M PRO-VDH WiFi';
    category = 'motherboard';
    priceCash = 699.00;
    socket = 'AM4';
    memoryType = 'DDR4';
    tdp = undefined;
  } else if (normId.includes('b650')) {
    name = 'ASUS Prime B650M-A WiFi';
    category = 'motherboard';
    priceCash = 1149.00;
    socket = 'AM5';
    memoryType = 'DDR5';
    tdp = undefined;
  } else if (normId.includes('b760') || normId.includes('h610')) {
    name = 'MSI PRO H610M-E';
    category = 'motherboard';
    priceCash = 479.00;
    socket = 'LGA1700';
    memoryType = 'DDR4';
    tdp = undefined;
  } else if (normId.includes('ram') && normId.includes('ddr5')) {
    name = 'Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz';
    category = 'ram';
    priceCash = 849.00;
    memoryType = 'DDR5';
    socket = undefined;
    tdp = undefined;
  } else if (normId.includes('ram')) {
    name = 'Kingston Fury Beast 8GB DDR4 3200MHz';
    category = 'ram';
    priceCash = 149.90;
    memoryType = 'DDR4';
    socket = undefined;
    tdp = undefined;
  } else if (normId.includes('nv2') || normId.includes('ssd')) {
    name = 'SSD Kingston NV2 1TB NVMe M.2';
    category = 'storage';
    priceCash = 399.90;
    socket = undefined;
    memoryType = undefined;
    tdp = undefined;
  } else if (normId.includes('hx300') || normId.includes('903') || normId.includes('case')) {
    name = 'Gabinete Montech Air 903 Max';
    category = 'case';
    priceCash = 379.90;
    socket = undefined;
    memoryType = undefined;
    tdp = undefined;
  } else if (normId.includes('a650bn') || normId.includes('psu') || normId.includes('750e') || normId.includes('leadex')) {
    name = 'Fonte MSI MAG A650BN 650W 80 Plus Bronze';
    category = 'psu';
    priceCash = 299.90;
    tdp = 650;
    socket = undefined;
    memoryType = undefined;
  } else if (normId.includes('ak400') || normId.includes('peerless') || normId.includes('cooler') || normId.includes('lt720')) {
    name = 'Air Cooler DeepCool AK400';
    category = 'cooler';
    priceCash = 159.90;
    socket = undefined;
    memoryType = undefined;
    tdp = undefined;
  } else if (normId.includes('mon')) {
    name = 'Monitor LG UltraGear 24 180Hz IPS';
    category = 'monitor';
    priceCash = 899.90;
    socket = undefined;
    memoryType = undefined;
    tdp = undefined;
  }

  return {
    id,
    name,
    category,
    brand: name.split(' ')[0] || 'Hardware',
    model: name,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 50,
    lowestPriceCash: priceCash,
    lowestPriceInstallments: Math.round(priceCash * 1.176 * 100) / 100,
    stores: [
      {
        storeName: 'KaBuM!',
        priceCash,
        priceInstallments: Math.round(priceCash * 1.176 * 100) / 100,
        url: `https://www.kabum.com.br/busca/${encodeURIComponent(name)}`,
        inStock: true,
        isLowest: true,
      }
    ],
    specs: { 'Info': name },
    tdpWattage: tdp,
    socket,
    memoryType,
  };
}
