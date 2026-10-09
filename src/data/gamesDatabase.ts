export interface GameInfo {
  id: string;
  name: string;
  category: 'Competitivo' | 'Triplo-A' | 'Battle Royale' | 'Simulação & RPG';
  popularInBrazil?: boolean;
  image: string;
  tagline: string;
  description: string;
  engine: string;
  hardwareDemands: {
    cpuFocus: string;
    gpuFocus: string;
    ramFocus: string;
    techFeatures: string[]; // e.g. ['DLSS 3', 'FSR 3', 'Ray Tracing', 'DirectStorage', 'Anti-Lag']
  };
  keyAdvice: string;
  minSpecsText: string;
  recSpecsText: string;
  // Base FPS scaling factors
  baseFps: {
    entry: { '1080p': number; '1440p': number; '4k': number; setting: string };
    recommended: { '1080p': number; '1440p': number; '4k': number; setting: string };
    supreme: { '1080p': number; '1440p': number; '4k': number; setting: string };
  };
}

export const GAMES_DATABASE: GameInfo[] = [
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    category: 'Competitivo',
    popularInBrazil: true,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    tagline: 'O FPS competitivo mais jogado do Brasil na Source 2',
    description: 'Com a Source 2, CS2 passou a exigir muito mais da GPU (efeitos de fumaça volumétrica e iluminação) sem deixar de ser altamente dependente de CPUs com alto IPC e cache L3 (como os Ryzen X3D).',
    engine: 'Source 2 (Vulkan / DX11)',
    hardwareDemands: {
      cpuFocus: 'Extremo (Cache 3D)',
      gpuFocus: 'Médio',
      ramFocus: '16-32 GB Dual Channel',
      techFeatures: ['NVIDIA Reflex', 'AMD Anti-Lag 2', 'High Refresh Rate (144Hz/240Hz)'],
    },
    keyAdvice: 'Para jogar a 240Hz+ sem quedas nos tiroteios e fumaças, priorize CPUs como Ryzen 7 5700X3D ou Ryzen 7 7800X3D pareados com ao menos uma RX 6600 ou RTX 4060.',
    minSpecsText: 'Intel i5-7500 / Ryzen 5 1600 | GTX 1060 6GB | 8GB RAM',
    recSpecsText: 'Ryzen 5 5600 / i5-12400F | RX 6600 / RTX 4060 | 16GB Dual Channel DDR4/DDR5',
    baseFps: {
      entry: { '1080p': 165, '1440p': 120, '4k': 70, setting: 'Médio / Competitivo' },
      recommended: { '1080p': 280, '1440p': 210, '4k': 125, setting: 'Alto / 1080p' },
      supreme: { '1080p': 460, '1440p': 340, '4k': 195, setting: 'Máximo / 240Hz+' },
    },
  },
  {
    id: 'valorant',
    name: 'Valorant',
    category: 'Competitivo',
    popularInBrazil: true,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    tagline: 'O shooter tático da Riot Games focado em alta taxa de quadros e latência zero',
    description: 'Valorant é extremamente leve na GPU e tem seu desempenho quase 100% atrelado ao processador e à velocidade de memória RAM. CPUs rápidas garantem 300+ FPS constantes para monitores de 240Hz/360Hz.',
    engine: 'Unreal Engine 4',
    hardwareDemands: {
      cpuFocus: 'Alto',
      gpuFocus: 'Leve',
      ramFocus: '16 GB',
      techFeatures: ['NVIDIA Reflex', 'Baixa Latência', 'Suporte a Monitores 360Hz'],
    },
    keyAdvice: 'Qualquer GPU dedicada moderna entrega centenas de frames. O segredo para bater recordes de FPS é investir num Ryzen 5 5600 ou AM5.',
    minSpecsText: 'Intel i3-4150 | GT 730 | 4GB RAM',
    recSpecsText: 'Intel i5-12400F / Ryzen 5 5600 | RX 6600 / GTX 1650 | 16GB RAM',
    baseFps: {
      entry: { '1080p': 240, '1440p': 190, '4k': 130, setting: 'Alto' },
      recommended: { '1080p': 380, '1440p': 310, '4k': 210, setting: 'Máximo' },
      supreme: { '1080p': 580, '1440p': 450, '4k': 320, setting: 'Máximo / 360Hz' },
    },
  },
  {
    id: 'cyberpunk2077',
    name: 'Cyberpunk 2077: Phantom Liberty',
    category: 'Triplo-A',
    popularInBrazil: true,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    tagline: 'O padrão de ouro em fidelidade visual, Ray Tracing e Path Tracing',
    description: 'Um dos jogos mais pesados já lançados. Exige GPUs potentes com muita VRAM (12GB+), núcleos tensores dedicados para DLSS 3.5 Frame Generation e CPUs de ao menos 6 núcleos / 12 threads rápidos.',
    engine: 'REDengine 4 (DX12 Ultimate)',
    hardwareDemands: {
      cpuFocus: 'Alto',
      gpuFocus: 'Extremo (VRAM 12GB+)',
      ramFocus: '32 GB Recomendado',
      techFeatures: ['DLSS 3.5 Frame Generation', 'Path Tracing Completo', 'Ray Reconstruction', 'DirectStorage'],
    },
    keyAdvice: 'Para jogar com Ray Tracing e gráficos no Ultra em 1080p/1440p, a RTX 4070 SUPER ou RX 6750 XT são as escolhas definitivas.',
    minSpecsText: 'Core i7-6700 / Ryzen 5 1600 | GTX 1060 6GB / RX 580 | 12GB RAM',
    recSpecsText: 'Core i7-12700 / Ryzen 7 7700 | RTX 3070 / RX 6700 XT | 16GB RAM | SSD NVMe',
    baseFps: {
      entry: { '1080p': 65, '1440p': 42, '4k': 22, setting: 'Médio / FSR Balanceado' },
      recommended: { '1080p': 95, '1440p': 68, '4k': 38, setting: 'Ultra / DLSS Qualidade' },
      supreme: { '1080p': 145, '1440p': 110, '4k': 72, setting: 'Ray Tracing Overdrive + DLSS 3' },
    },
  },
  {
    id: 'gtav_gta6',
    name: 'GTA V / GTA VI Ready',
    category: 'Triplo-A',
    popularInBrazil: true,
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80',
    tagline: 'O clássico absoluto e a preparação para o lançamento mais esperado da década',
    description: 'GTA V e FiveM (servidores de RP com mods) demandam muita memória RAM (16GB a 32GB) e processadores rápidos. Uma build preparada para GTA VI necessita de plataforma moderna (AM5 / LGA1700 com 8 núcleos) e GPU de 12GB+ VRAM.',
    engine: 'RAGE Engine (Rockstar)',
    hardwareDemands: {
      cpuFocus: 'Alto',
      gpuFocus: 'Alto',
      ramFocus: '32 GB Recomendado',
      techFeatures: ['FiveM Mod Support', 'DirectX 12', 'DirectStorage SSD'],
    },
    keyAdvice: 'Se você joga FiveM ou quer estar 100% pronto para o GTA VI no PC, escolha no mínimo 32GB de RAM DDR4/DDR5 e uma GPU como a RX 6750 XT 12GB ou RTX 4070.',
    minSpecsText: 'Intel i5-3470 | GTX 660 2GB | 8GB RAM',
    recSpecsText: 'Ryzen 5 5600 / i5-12400F | RX 6600 / RTX 4060 | 16GB-32GB RAM | SSD',
    baseFps: {
      entry: { '1080p': 130, '1440p': 95, '4k': 55, setting: 'Muito Alto' },
      recommended: { '1080p': 175, '1440p': 130, '4k': 80, setting: 'Ultra / Modded' },
      supreme: { '1080p': 220, '1440p': 175, '4k': 115, setting: 'Ultra 4K / FiveM Pesado' },
    },
  },
  {
    id: 'warzone',
    name: 'Call of Duty: Warzone & BO6',
    category: 'Battle Royale',
    popularInBrazil: true,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    tagline: 'O battle royale mais dinâmico e pesado dos consoles e PC',
    description: 'Warzone é conhecido por consumir muita VRAM e largura de banda de memória RAM. CPUs com alto cache (Ryzen X3D) e GPUs Radeon / GeForce intermediárias garantem fluidez e zero micro-stutters.',
    engine: 'IW 9.0 Engine (DX12)',
    hardwareDemands: {
      cpuFocus: 'Alto',
      gpuFocus: 'Alto',
      ramFocus: '16-32 GB Dual Channel',
      techFeatures: ['DLSS 3 / FSR 3', 'NVIDIA Reflex', 'FidelityFX CAS'],
    },
    keyAdvice: 'O jogo se beneficia bastante de Dual Channel de alta frequência e SSD NVMe de leitura rápida para carregar texturas em tempo real.',
    minSpecsText: 'Core i5-6600 / Ryzen 5 1400 | GTX 960 / RX 470 | 8GB RAM',
    recSpecsText: 'Core i7-8700K / Ryzen 7 3700X | RTX 3060 / RX 6600 XT | 16GB RAM | SSD',
    baseFps: {
      entry: { '1080p': 90, '1440p': 65, '4k': 38, setting: 'Competitivo / Balanceado' },
      recommended: { '1080p': 140, '1440p': 105, '4k': 60, setting: 'Alto / FSR / DLSS' },
      supreme: { '1080p': 210, '1440p': 160, '4k': 95, setting: 'Ultra / 144Hz+' },
    },
  },
  {
    id: 'fortnite',
    name: 'Fortnite (Unreal Engine 5.4)',
    category: 'Battle Royale',
    popularInBrazil: true,
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=600&auto=format&fit=crop&q=80',
    tagline: 'Lumen, Nanite e o Battle Royale favorito de todas as idades',
    description: 'Pode ser configurado no Modo Desempenho para atingir 240Hz+ em PCs modestos, ou no DX12 com Lumen & Nanite para gráficos dignos de cinema que desafiam as placas mais fortes.',
    engine: 'Unreal Engine 5.4 (Nanite & Lumen)',
    hardwareDemands: {
      cpuFocus: 'Alto',
      gpuFocus: 'Médio',
      ramFocus: '16 GB',
      techFeatures: ['Modo Desempenho Alpha', 'Nanite Geometria', 'Lumen Iluminação Global', 'NVIDIA Reflex'],
    },
    keyAdvice: 'Se você joga competitivo, o Modo Desempenho roda a 200+ FPS em setups de entrada. Se quer beleza máxima em DX12, a RTX 4060 ou RX 6750 XT brilham.',
    minSpecsText: 'Core i3-3225 | Intel HD 4000 | 8GB RAM',
    recSpecsText: 'Core i5-12400F / Ryzen 5 5600 | RTX 3050 / RX 6600 | 16GB RAM',
    baseFps: {
      entry: { '1080p': 145, '1440p': 100, '4k': 55, setting: 'Médio DX12 / Alto Modo Desemp.' },
      recommended: { '1080p': 220, '1440p': 155, '4k': 85, setting: 'Alto DX12 / 240FPS Desemp.' },
      supreme: { '1080p': 340, '1440p': 240, '4k': 130, setting: 'Lumen / Nanite Ultra + DLSS' },
    },
  },
  {
    id: 'blackmyth_wukong',
    name: 'Black Myth: Wukong',
    category: 'Triplo-A',
    popularInBrazil: true,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    tagline: 'O fenômeno global do Rei Macaco com Unreal Engine 5 e Full Ray Tracing',
    description: 'Exige muito poder gráfico, com suporte intensivo a upscalers (DLSS/FSR/TSR) e Frame Generation. Necessita de SSD NVMe veloz para streaming contínuo de cenários detalhados.',
    engine: 'Unreal Engine 5 (DX12)',
    hardwareDemands: {
      cpuFocus: 'Médio',
      gpuFocus: 'Extremo (VRAM 12GB+)',
      ramFocus: '16-32 GB Dual Channel',
      techFeatures: ['Full Ray Tracing', 'DLSS 3 Frame Gen', 'FSR 3 Frame Gen', 'TSR Upscaling'],
    },
    keyAdvice: 'Fundamental ter GPU com no mínimo 8GB (idealmente 12GB+) de VRAM e suporte a Frame Generation para manter 60-90 FPS estáveis.',
    minSpecsText: 'Core i5-6600 / Ryzen 5 1600 | GTX 1060 6GB / RX 580 | 16GB RAM',
    recSpecsText: 'Core i7-9700 / Ryzen 5 5500 | RTX 2060 / RX 5700 XT | 16GB RAM | SSD',
    baseFps: {
      entry: { '1080p': 58, '1440p': 38, '4k': 20, setting: 'Médio / TSR 67%' },
      recommended: { '1080p': 85, '1440p': 62, '4k': 36, setting: 'Alto / DLSS/FSR Qualidade' },
      supreme: { '1080p': 130, '1440p': 98, '4k': 65, setting: 'Cinemático / Frame Gen On' },
    },
  },
  {
    id: 'eafc25',
    name: 'EA SPORTS FC 25 (FIFA)',
    category: 'Simulação & RPG',
    popularInBrazil: true,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    tagline: 'O simulador de futebol mais jogado do país com HyperMotionV e Frostbite',
    description: 'Com o motor Frostbite atualizado e modelos de jogadores realistas, EA FC 25 requer GPU dedicada e boa CPU para manter 60/120/144 FPS travados sem micro-travamentos nas cobranças de falta e replays.',
    engine: 'Frostbite Engine',
    hardwareDemands: {
      cpuFocus: 'Médio',
      gpuFocus: 'Médio',
      ramFocus: '16 GB',
      techFeatures: ['HyperMotionV', 'DirectX 12', 'Suporte a Monitores Ultrawide'],
    },
    keyAdvice: 'Uma build econômica com Ryzen 5 5600 ou i5-12400F e RX 6600 já roda o jogo com mais de 120 FPS cravados em 1080p Ultra.',
    minSpecsText: 'Intel i5-6600K / Ryzen 5 1600 | GTX 1050 Ti 4GB | 8GB RAM',
    recSpecsText: 'Intel i7-6700 / Ryzen 7 2700X | GTX 1660 / RX 5600 XT | 12GB RAM',
    baseFps: {
      entry: { '1080p': 120, '1440p': 85, '4k': 50, setting: 'Ultra' },
      recommended: { '1080p': 180, '1440p': 130, '4k': 80, setting: 'Ultra / 144Hz' },
      supreme: { '1080p': 240, '1440p': 190, '4k': 120, setting: 'Ultra 4K 120Hz' },
    },
  },
  {
    id: 'rdr2',
    name: 'Red Dead Redemption 2',
    category: 'Triplo-A',
    popularInBrazil: true,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    tagline: 'Uma obra de arte viva com iluminação volumétrica e física avançada',
    description: 'RDR2 ainda é uma das referências mundiais de beleza gráfica e exige poder de GPU e bom buffer de memória RAM.',
    engine: 'RAGE Engine (Vulkan / DX12)',
    hardwareDemands: {
      cpuFocus: 'Médio',
      gpuFocus: 'Alto',
      ramFocus: '16 GB',
      techFeatures: ['Vulkan API', 'DLSS / FSR 2.0', 'Física de Terreno & Neve'],
    },
    keyAdvice: 'A API Vulkan costuma entregar mais estabilidade de FPS. Uma RX 6600 ou RTX 4060 entrega 70-90 FPS no Ultra/Alto em 1080p.',
    minSpecsText: 'Core i5-2500K | GTX 770 2GB | 8GB RAM',
    recSpecsText: 'Core i7-4770K / Ryzen 5 1500X | GTX 1060 6GB / RX 480 | 12GB RAM',
    baseFps: {
      entry: { '1080p': 72, '1440p': 48, '4k': 26, setting: 'Alto / Otimizado' },
      recommended: { '1080p': 105, '1440p': 75, '4k': 45, setting: 'Ultra / DLSS Qualidade' },
      supreme: { '1080p': 155, '1440p': 118, '4k': 74, setting: 'Ultra Máximo 4K' },
    },
  },
  {
    id: 'lol',
    name: 'League of Legends',
    category: 'Competitivo',
    popularInBrazil: true,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    tagline: 'O MOBA mais popular do planeta',
    description: 'Jogo extremamente otimizado que roda até em gráficos integrados modernos com facilidade. Processadores rápidos garantem 200+ FPS mesmo nas teamfights mais caóticas.',
    engine: 'Custom Riot Engine (DX11)',
    hardwareDemands: {
      cpuFocus: 'Médio',
      gpuFocus: 'Leve',
      ramFocus: '8-16 GB',
      techFeatures: ['DirectX 11', 'Vanguard Anti-Cheat'],
    },
    keyAdvice: 'Qualquer setup gamer atual roda LoL com extrema folga acima de 180-240 FPS.',
    minSpecsText: 'Intel Core i3-530 | Intel HD Graphics 4000 | 4GB RAM',
    recSpecsText: 'Intel Core i5-3300 / Ryzen 3 1200 | GTX 560 / Radeon HD 6950 | 8GB RAM',
    baseFps: {
      entry: { '1080p': 280, '1440p': 220, '4k': 160, setting: 'Muito Alto' },
      recommended: { '1080p': 450, '1440p': 360, '4k': 240, setting: 'Máximo' },
      supreme: { '1080p': 650, '1440p': 500, '4k': 360, setting: 'Máximo Competitivo' },
    },
  },
  {
    id: 'eldenring',
    name: 'Elden Ring & Shadow of the Erdtree',
    category: 'Simulação & RPG',
    popularInBrazil: true,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    tagline: 'O aclamado RPG da FromSoftware com vastas Terras Intermédias',
    description: 'Travado nativamente a 60 FPS no motor da FromSoftware, exige hardware equilibrado para manter 60 FPS contínuos sem quedas em áreas de mundo aberto e chefes com magias intensas.',
    engine: 'FromSoftware Engine (DX12)',
    hardwareDemands: {
      cpuFocus: 'Médio',
      gpuFocus: 'Alto',
      ramFocus: '16 GB',
      techFeatures: ['Ray Tracing Opcional', 'HDR', 'DirectX 12'],
    },
    keyAdvice: 'Para jogar a 60 FPS cravados em 1080p ou 1440p com Ray Tracing, uma RTX 4060 ou RX 6750 XT é a escolha certeira.',
    minSpecsText: 'Intel i5-8400 / Ryzen 3 3300X | GTX 1060 3GB / RX 580 | 12GB RAM',
    recSpecsText: 'Intel i7-8700K / Ryzen 5 3600X | GTX 1070 8GB / RX Vega 56 | 16GB RAM',
    baseFps: {
      entry: { '1080p': 60, '1440p': 55, '4k': 35, setting: 'Alto (Lock 60 FPS)' },
      recommended: { '1080p': 60, '1440p': 60, '4k': 50, setting: 'Máximo (Lock 60 FPS)' },
      supreme: { '1080p': 60, '1440p': 60, '4k': 60, setting: 'Máximo + Ray Tracing 4K' },
    },
  },
  {
    id: 'minecraft_rtx',
    name: 'Minecraft (Java com Shaders / Bedrock RTX)',
    category: 'Simulação & RPG',
    popularInBrazil: true,
    image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=600&auto=format&fit=crop&q=80',
    tagline: 'Shaders volumétricos, packs de texturas 4K e Ray Tracing',
    description: 'Minecraft Java com Shaders (Complementary / Iris / Distant Horizons) exige altíssimo poder single-core da CPU e muita memória RAM alocada. Já a versão Bedrock RTX utiliza Ray Tracing total com núcleos RT da GPU.',
    engine: 'Java / Bedrock (RTX DirectX Raytracing)',
    hardwareDemands: {
      cpuFocus: 'Alto',
      gpuFocus: 'Alto',
      ramFocus: '16-32 GB Dual Channel',
      techFeatures: ['Ray Tracing DXR', 'Iris Shaders / Sodium', 'Distant Horizons LODs'],
    },
    keyAdvice: '32GB de RAM e GPUs RTX da NVIDIA entregam o melhor resultado para Shaders pesados e pacotes com centenas de mods.',
    minSpecsText: 'Intel i3-3210 / AMD A8-7600 | Intel HD 4000 | 4GB RAM',
    recSpecsText: 'Intel i5-12400F / Ryzen 5 5600 | GTX 1660 / RTX 3060 | 16GB RAM',
    baseFps: {
      entry: { '1080p': 90, '1440p': 65, '4k': 40, setting: 'Shaders Médios' },
      recommended: { '1080p': 145, '1440p': 105, '4k': 62, setting: 'Shaders Ultra / BSL' },
      supreme: { '1080p': 220, '1440p': 160, '4k': 95, setting: 'Bedrock RTX / Shaders 4K' },
    },
  },
];
