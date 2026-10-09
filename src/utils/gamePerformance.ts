import { BuildSelection, SelectedItem } from '../types/pc';

export interface GameBenchmark {
  gameName: string;
  category: 'Competitivo' | 'Triplo-A' | 'Battle Royale';
  fps1080p: number;
  fps1440p: number;
  fps4k: number;
  setting: string;
}

export function estimateGamePerformance(parts: BuildSelection): GameBenchmark[] {
  const cpu = (parts.cpu as SelectedItem | undefined)?.component;
  const gpu = (parts.gpu as SelectedItem | undefined)?.component;

  // Multipliers based on GPU power
  let gpuPower = 1.0;
  if (!gpu) {
    if (cpu?.integratedGraphics) {
      gpuPower = 0.25; // Basic iGPU
    } else {
      gpuPower = 0; // No display
    }
  } else {
    switch (gpu.id) {
      case 'gpu-amd-rx6600':
        gpuPower = 1.0;
        break;
      case 'gpu-nvidia-rtx4060':
        gpuPower = 1.25;
        break;
      case 'gpu-amd-rx6750xt':
        gpuPower = 1.55;
        break;
      case 'gpu-nvidia-rtx4070super':
        gpuPower = 2.45;
        break;
      case 'gpu-nvidia-rtx4080super':
        gpuPower = 3.85;
        break;
      default:
        gpuPower = 1.0;
    }
  }

  // CPU factor
  let cpuFactor = 1.0;
  if (cpu) {
    if (cpu.id === 'cpu-amd-r7-7800x3d') cpuFactor = 1.35;
    else if (cpu.id === 'cpu-amd-r7-5700x3d') cpuFactor = 1.22;
    else if (cpu.id === 'cpu-amd-r5-7600' || cpu.id === 'cpu-intel-i5-14600k') cpuFactor = 1.18;
    else if (cpu.id === 'cpu-intel-i7-14700k') cpuFactor = 1.28;
    else if (cpu.id === 'cpu-amd-r5-5600' || cpu.id === 'cpu-intel-i5-12400f') cpuFactor = 1.0;
  }

  if (gpuPower === 0) {
    return [];
  }

  const games: { name: string; category: GameBenchmark['category']; base1080p: number; base1440p: number; base4k: number; setting: string }[] = [
    {
      name: 'Counter-Strike 2',
      category: 'Competitivo',
      base1080p: 210,
      base1440p: 160,
      base4k: 95,
      setting: 'Alto / Competitivo',
    },
    {
      name: 'Valorant',
      category: 'Competitivo',
      base1080p: 320,
      base1440p: 260,
      base4k: 180,
      setting: 'Máximo',
    },
    {
      name: 'Cyberpunk 2077',
      category: 'Triplo-A',
      base1080p: 68,
      base1440p: 46,
      base4k: 24,
      setting: 'Ultra (Sem RT)',
    },
    {
      name: 'Call of Duty: Warzone',
      category: 'Battle Royale',
      base1080p: 105,
      base1440p: 74,
      base4k: 42,
      setting: 'Balanceado',
    },
    {
      name: 'Grand Theft Auto V',
      category: 'Triplo-A',
      base1080p: 145,
      base1440p: 110,
      base4k: 65,
      setting: 'Muito Alto',
    },
    {
      name: 'Fortnite (Unreal Engine 5)',
      category: 'Battle Royale',
      base1080p: 130,
      base1440p: 90,
      base4k: 50,
      setting: 'Médio / DX12',
    },
    {
      name: 'Black Myth: Wukong',
      category: 'Triplo-A',
      base1080p: 62,
      base1440p: 42,
      base4k: 22,
      setting: 'Alto / TSR 67%',
    },
  ];

  return games.map(g => ({
    gameName: g.name,
    category: g.category,
    fps1080p: Math.round(g.base1080p * Math.sqrt(gpuPower) * cpuFactor),
    fps1440p: Math.round(g.base1440p * gpuPower * Math.sqrt(cpuFactor)),
    fps4k: Math.round(g.base4k * (gpuPower * 1.1)),
    setting: g.setting,
  }));
}
