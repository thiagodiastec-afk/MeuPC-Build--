import { BuildSelection, PCComponent } from '../types/pc';
import { GameInfo } from '../data/gamesDatabase';
import { RAW_COMPONENTS } from '../data/componentsDatabase';
import { createFallbackComponent } from './componentFallbacks';

export interface GameTierBuild {
  tierId: 'entry' | 'recommended' | 'supreme';
  tierLabel: string;
  tierSubtitle: string;
  badgeColor: string;
  parts: BuildSelection;
  totalCash: number;
  totalInstallments: number;
  estimatedFps: {
    fps1080p: number;
    fps1440p: number;
    fps4k: number;
    setting: string;
    consistencyScore: number; // e.g. 98%
    experienceVerdict: string;
  };
  whyThisBuild: string;
  highlights: string[];
}

export interface GameBuildRecommendations {
  game: GameInfo;
  targetResolution: '1080p' | '1440p' | '4k';
  targetExperience: 'competitivo' | 'balanceado' | 'ultra' | 'economico';
  tiers: GameTierBuild[];
}

function findComp(id: string): PCComponent {
  return RAW_COMPONENTS.find(c => c.id === id) || createFallbackComponent(id);
}

function calculateTotals(parts: BuildSelection): { cash: number; installments: number } {
  let cash = 0;
  let inst = 0;

  Object.values(parts).forEach(itemOrList => {
    if (!itemOrList) return;
    const items = Array.isArray(itemOrList) ? itemOrList : [itemOrList];
    items.forEach(item => {
      const qty = item.quantity || 1;
      cash += (item.customPriceCash ?? item.component.lowestPriceCash) * qty;
      inst += (item.customPriceInstallments ?? item.component.lowestPriceInstallments) * qty;
    });
  });

  return { cash, installments: inst };
}

export function generateGameTailoredBuilds(
  game: GameInfo,
  resolution: '1080p' | '1440p' | '4k' = '1080p',
  targetExperience: 'competitivo' | 'balanceado' | 'ultra' | 'economico' = 'balanceado'
): GameBuildRecommendations {
  
  // ----------------------------------------------------
  // TIER 1: ENTRADA / ACESSÍVEL (1080p 60-120+ FPS)
  // ----------------------------------------------------
  const cpuEntry = findComp('cpu-intel-i5-12400f') || findComp('cpu-amd-r5-5600')!;
  const gpuEntry = findComp('gpu-amd-rx6600')!;
  const moboEntry = findComp('mobo-msi-b760m-bomber-ddr5') || findComp('mobo-msi-b550m-vdh-wifi')!;
  // If DDR5 mobo
  const ramEntry = moboEntry.memoryType === 'DDR5'
    ? [{ component: findComp('ram-xpg-lancer-16gb-6000-ddr5-rgb') || findComp('ram-corsair-vengeance-32gb-6000-ddr5')!, quantity: 1 }]
    : [{ component: findComp('ram-kingston-fury-8gb-3200-ddr4')!, quantity: 2 }];

  const entryParts: BuildSelection = {
    cpu: { component: cpuEntry, quantity: 1 },
    gpu: { component: gpuEntry, quantity: 1 },
    motherboard: { component: moboEntry, quantity: 1 },
    ram: ramEntry,
    storage: [{ component: findComp('ssd-kingston-nv2-1tb')!, quantity: 1 }],
    case: { component: findComp('case-pichau-hx300-glass')!, quantity: 1 },
    psu: { component: findComp('psu-msi-mag-a650bn')!, quantity: 1 },
    monitor: { component: findComp('mon-lg-ultragear-24-180hz')!, quantity: 1 },
  };

  const entryTotals = calculateTotals(entryParts);
  const entryFps = game.baseFps.entry;

  const entryTier: GameTierBuild = {
    tierId: 'entry',
    tierLabel: 'Econômico Ideal',
    tierSubtitle: `${cpuEntry.model} + ${gpuEntry.model} + 16GB RAM`,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    parts: entryParts,
    totalCash: entryTotals.cash,
    totalInstallments: entryTotals.installments,
    estimatedFps: {
      fps1080p: entryFps['1080p'],
      fps1440p: entryFps['1440p'],
      fps4k: entryFps['4k'],
      setting: entryFps.setting,
      consistencyScore: 94,
      experienceVerdict: entryFps['1080p'] >= 144 ? '⚡ Altíssima fluidez competitiva' : '✅ 60+ FPS constante sem travamentos',
    },
    whyThisBuild: `Configuração com o menor investimento para rodar ${game.name} com mais de 60-120 FPS em 1080p. A Radeon RX 6600 entrega excelente eficiência energética e o processador ${cpuEntry.model} fornece poder multithread de sobra.`,
    highlights: [
      'Melhor custo por frame em 1080p',
      'Monitor 180Hz 1ms IPS incluso no orçamento',
      'SSD NVMe 1TB PCIe 4.0 ultra rápido para carregar o jogo',
      '100% compatível física e termicamente',
    ],
  };

  // ----------------------------------------------------
  // TIER 2: RECOMENDADO / CUSTO X BENEFÍCIO SWEET SPOT
  // ----------------------------------------------------
  // If the game is very CPU-bound (CS2, Valorant), Ryzen 5700X3D or Ryzen 7600 is best.
  // If GPU-heavy (Cyberpunk, Wukong), RX 6750XT 12GB or RTX 4060 is best.
  const isCompetitiveGame = game.category === 'Competitivo';
  const cpuRec = isCompetitiveGame 
    ? (findComp('cpu-amd-r7-5700x3d') || findComp('cpu-amd-r5-5600')!)
    : (findComp('cpu-amd-r5-5600') || findComp('cpu-amd-r5-7600')!);

  const gpuRec = (resolution === '1440p' || game.category === 'Triplo-A')
    ? findComp('gpu-amd-rx6750xt')!
    : (findComp('gpu-nvidia-rtx4060') || findComp('gpu-amd-rx6750xt')!);

  const moboRec = findComp('mobo-msi-b550m-vdh-wifi')!;
  const coolerRec = findComp('cooler-deepcool-ak400')!;

  const recParts: BuildSelection = {
    cpu: { component: cpuRec, quantity: 1 },
    cooler: { component: coolerRec, quantity: 1 },
    gpu: { component: gpuRec, quantity: 1 },
    motherboard: { component: moboRec, quantity: 1 },
    ram: [{ component: findComp('ram-kingston-fury-8gb-3200-ddr4')!, quantity: 2 }],
    storage: [{ component: findComp('ssd-kingston-kc3000-1tb') || findComp('ssd-kingston-nv2-1tb')!, quantity: 1 }],
    case: { component: findComp('case-montech-air-903-max')!, quantity: 1 },
    psu: { component: findComp('psu-msi-mag-a650bn')!, quantity: 1 },
    monitor: resolution === '1440p' 
      ? { component: findComp('mon-aoc-hero-27-qhd-155hz')!, quantity: 1 }
      : { component: findComp('mon-lg-ultragear-24-180hz')!, quantity: 1 },
  };

  const recTotals = calculateTotals(recParts);
  const recFps = game.baseFps.recommended;

  const recTier: GameTierBuild = {
    tierId: 'recommended',
    tierLabel: 'Recomendado (Sweet Spot)',
    tierSubtitle: `${cpuRec.model} + ${gpuRec.model} + 16GB Dual Channel`,
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    parts: recParts,
    totalCash: recTotals.cash,
    totalInstallments: recTotals.installments,
    estimatedFps: {
      fps1080p: recFps['1080p'],
      fps1440p: recFps['1440p'],
      fps4k: recFps['4k'],
      setting: recFps.setting,
      consistencyScore: 98,
      experienceVerdict: '🏆 Desempenho ideal com gráficos no Ultra e 144Hz+',
    },
    whyThisBuild: `Equilíbrio perfeito de componentes para ${game.name}. A ${gpuRec.model} com ${gpuRec.specs?.['VRAM'] || '12GB VRAM'} garante longevidade absoluta e folga de texturas, enquanto o ${cpuRec.model} garante frametimes uniformes sem micro-engasgos em tiroteios ou cidades cheias de NPCs.`,
    highlights: [
      'Gabinete Montech com 4 fans de 140mm de altíssimo fluxo de ar',
      'Air Cooler dedicado mantendo a CPU sempre abaixo de 65°C',
      'Placa-mãe com Wi-Fi 5 e Bluetooth integrados',
      'Suporte nativo a 1080p Ultra e 1440p Quad HD',
    ],
  };

  // ----------------------------------------------------
  // TIER 3: SUPREMO / MÁXIMA PERFORMANCE (AM5 / 4K / 240Hz+)
  // ----------------------------------------------------
  const cpuSupreme = findComp('cpu-amd-r7-7800x3d')!;
  const gpuSupreme = (resolution === '4k' || targetExperience === 'ultra')
    ? (findComp('gpu-nvidia-rtx4080super') || findComp('gpu-nvidia-rtx4070super')!)
    : findComp('gpu-nvidia-rtx4070super')!;

  const moboSupreme = findComp('mobo-asus-prime-b650m-a-wifi')!;
  const coolerSupreme = findComp('cooler-water-deepcool-lt720-360') || findComp('cooler-thermalright-peerless-120')!;
  const ramSupreme = findComp('ram-corsair-vengeance-32gb-6000-ddr5')!;
  const psuSupreme = findComp('psu-corsair-rm750e-gold') || findComp('psu-superflower-leadex-850w-gold')!;

  const supremeParts: BuildSelection = {
    cpu: { component: cpuSupreme, quantity: 1 },
    cooler: { component: coolerSupreme, quantity: 1 },
    gpu: { component: gpuSupreme, quantity: 1 },
    motherboard: { component: moboSupreme, quantity: 1 },
    ram: [{ component: ramSupreme, quantity: 1 }],
    storage: [{ component: findComp('ssd-crucial-p3-plus-2tb') || findComp('ssd-kingston-kc3000-1tb')!, quantity: 1 }],
    case: { component: findComp('case-montech-air-903-max')!, quantity: 1 },
    psu: { component: psuSupreme, quantity: 1 },
    monitor: { component: findComp('mon-aoc-hero-27-qhd-155hz')!, quantity: 1 },
  };

  const supremeTotals = calculateTotals(supremeParts);
  const supremeFps = game.baseFps.supreme;

  const supremeTier: GameTierBuild = {
    tierId: 'supreme',
    tierLabel: 'Supremo / Máximo FPS',
    tierSubtitle: `Ryzen 7 7800X3D + ${gpuSupreme.model} + 32GB DDR5 6000MHz`,
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    parts: supremeParts,
    totalCash: supremeTotals.cash,
    totalInstallments: supremeTotals.installments,
    estimatedFps: {
      fps1080p: supremeFps['1080p'],
      fps1440p: supremeFps['1440p'],
      fps4k: supremeFps['4k'],
      setting: supremeFps.setting,
      consistencyScore: 99.8,
      experienceVerdict: '👑 Experiência definitiva em 240Hz/360Hz ou 4K com Ray Tracing',
    },
    whyThisBuild: `A máquina dos sonhos para rodar ${game.name} no limite do motor gráfico. Com o processador gamer mais rápido do planeta (Ryzen 7 7800X3D com 96MB 3D V-Cache) e 32GB DDR5 6000MHz CL30 em conjunto com a ${gpuSupreme.model}, você terá o 1% Low mais alto do mercado e zero gargalos em qualquer resolução.`,
    highlights: [
      'O melhor processador de jogos do mundo (3D V-Cache)',
      '32GB DDR5 de baixíssima latência (6000MHz CL30 EXPO)',
      'Water Cooler 360mm de alta performance',
      'SSD NVMe 2TB PCIe 4.0 com velocidade de 5000MB/s',
      'Fonte 80 Plus Gold ATX 3.0 com cabo 12VHPWR nativo',
    ],
  };

  return {
    game,
    targetResolution: resolution,
    targetExperience,
    tiers: [entryTier, recTier, supremeTier],
  };
}
