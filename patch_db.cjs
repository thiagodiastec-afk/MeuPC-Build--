const fs = require('fs');
let code = fs.readFileSync('src/data/componentsDatabase.ts', 'utf8');

code = code.replace(
  "    iconName: 'Wind',\n    description: 'Ventoinhas extras para refrigeração',\n    multiple: true,\n  },\n};",
  `    iconName: 'Wind',\n    description: 'Ventoinhas extras para refrigeração',\n    multiple: true,\n  },\n  chair: {\n    label: 'Cadeira Gamer',\n    iconName: 'Armchair',\n    description: 'Conforto e ergonomia para longas horas',\n  },\n  microphone: {\n    label: 'Microfone',\n    iconName: 'Mic',\n    description: 'Microfone de mesa ou condensador',\n  },\n  mousepad: {\n    label: 'Mousepad',\n    iconName: 'Square',\n    description: 'Superfície para o seu mouse e teclado',\n  },\n};`
);

const newComponents = `
  {
    id: 'chair-thunderx3-tc3',
    category: 'chair',
    name: 'Cadeira Gamer ThunderX3 TC3',
    brand: 'ThunderX3',
    model: 'TC3',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&q=80',
    rating: 4.8,
    reviewCount: 420,
    stores: [
      { storeName: 'Kabum', priceCash: 999.99, priceInstallments: 1176.45, url: '#', inStock: true },
      { storeName: 'Pichau', priceCash: 1050.00, priceInstallments: 1200.00, url: '#', inStock: true }
    ],
    lowestPriceCash: 999.99,
    lowestPriceInstallments: 1176.45,
    specs: { material: 'Couro Sintético', encosto: 'Ajustável 180°', pesoMax: '150kg' }
  },
  {
    id: 'chair-dt3-sports',
    category: 'chair',
    name: 'Cadeira Gamer DT3 Sports Elise',
    brand: 'DT3 Sports',
    model: 'Elise Fabric',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&q=80',
    rating: 4.9,
    reviewCount: 310,
    stores: [
      { storeName: 'Terabyte', priceCash: 1250.00, priceInstallments: 1450.00, url: '#', inStock: true },
      { storeName: 'Kabum', priceCash: 1299.99, priceInstallments: 1499.99, url: '#', inStock: true }
    ],
    lowestPriceCash: 1250.00,
    lowestPriceInstallments: 1450.00,
    specs: { material: 'Tecido Respirável', encosto: 'Ajustável 160°', pesoMax: '130kg' }
  },
  {
    id: 'mic-hyperx-quadcast',
    category: 'microphone',
    name: 'Microfone HyperX QuadCast S RGB',
    brand: 'HyperX',
    model: 'QuadCast S',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80',
    rating: 4.9,
    reviewCount: 890,
    stores: [
      { storeName: 'Kabum', priceCash: 899.99, priceInstallments: 1058.81, url: '#', inStock: true },
      { storeName: 'Amazon BR', priceCash: 920.00, priceInstallments: 1000.00, url: '#', inStock: true }
    ],
    lowestPriceCash: 899.99,
    lowestPriceInstallments: 1000.00,
    specs: { conexao: 'USB-C', rgb: 'Sim', padroesPolares: '4' }
  },
  {
    id: 'mic-fifine-ampligame',
    category: 'microphone',
    name: 'Microfone Fifine Ampligame A8',
    brand: 'Fifine',
    model: 'Ampligame A8',
    image: 'https://images.unsplash.com/photo-1626279147573-0fba200e60bd?w=400&q=80',
    rating: 4.8,
    reviewCount: 450,
    stores: [
      { storeName: 'Mercado Livre', priceCash: 350.00, priceInstallments: 390.00, url: '#', inStock: true },
      { storeName: 'Kabum', priceCash: 380.00, priceInstallments: 420.00, url: '#', inStock: true }
    ],
    lowestPriceCash: 350.00,
    lowestPriceInstallments: 390.00,
    specs: { conexao: 'USB', rgb: 'Sim', suporte: 'Shock Mount' }
  },
  {
    id: 'mousepad-fallen',
    category: 'mousepad',
    name: 'Mousepad Gamer Fallen Pantera Extended',
    brand: 'Fallen',
    model: 'Pantera Extended',
    image: 'https://images.unsplash.com/photo-1628169152202-601956795f7c?w=400&q=80',
    rating: 4.9,
    reviewCount: 620,
    stores: [
      { storeName: 'Kabum', priceCash: 120.00, priceInstallments: 140.00, url: '#', inStock: true },
      { storeName: 'Pichau', priceCash: 125.00, priceInstallments: 145.00, url: '#', inStock: true }
    ],
    lowestPriceCash: 120.00,
    lowestPriceInstallments: 140.00,
    specs: { tamanho: '900x400mm', borda: 'Costurada', espessura: '5mm' }
  }
];

export const RAW_COMPONENTS = [`;

code = code.replace("export const RAW_COMPONENTS: PCComponent[] = [", newComponents);
fs.writeFileSync('src/data/componentsDatabase.ts', code);
