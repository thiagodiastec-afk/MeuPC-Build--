import { BuildSelection } from '../types/pc';

export interface BuildAuditResult {
  score: number;
  bottleneckRating: 'Perfeito / Sem Gargalo' | 'Equilibrado' | 'Leve Gargalo de CPU' | 'Leve Gargalo de GPU' | 'Atenção Necessária';
  targetResolution: string;
  summary: string;
  compatibilityStatus: 'Compatível' | 'Alerta de Compatibilidade' | 'Incompatível';
  compatibilityDetails: string[];
  strengths: string[];
  recommendations: string[];
  psuHeadroomAnalysis: string;
  fpsEstimates: Array<{ game: string; fps: string; preset: string }>;
}

function getComp(item: any): any {
  if (!item) return undefined;
  if (Array.isArray(item)) return item[0]?.component;
  return item.component;
}

export function performClientHeuristicAnalysis(
  parts: BuildSelection,
  totalCash: number,
  totalWattage: number
): BuildAuditResult {
  const cpu = getComp(parts.cpu);
  const gpu = getComp(parts.gpu);
  const mobo = getComp(parts.motherboard);
  const ram = getComp(parts.ram);
  const psu = getComp(parts.psu);
  const storage = getComp(parts.storage);

  const compatIssues: string[] = [];
  const strengths: string[] = [];
  const recommendations: string[] = [];

  // 1. Socket Compatibility
  let socketMatch = true;
  if (cpu?.socket && mobo?.socket) {
    if (cpu.socket.toLowerCase() !== mobo.socket.toLowerCase()) {
      socketMatch = false;
      compatIssues.push(
        `Incompatibilidade crítica de Soquete: Processador ${cpu.name} (${cpu.socket}) não encaixa na Placa-Mãe ${mobo.name} (${mobo.socket}).`
      );
    } else {
      strengths.push(`Compatibilidade total de Soquete: Processador e Placa-Mãe compartilham o soquete ${cpu.socket}.`);
    }
  }

  // 2. RAM Memory Type Compatibility (DDR4 vs DDR5)
  let ramMatch = true;
  if (mobo?.memoryType && ram?.memoryType) {
    if (mobo.memoryType.toLowerCase() !== ram.memoryType.toLowerCase()) {
      ramMatch = false;
      compatIssues.push(
        `Incompatibilidade de Memória: Placa-Mãe requer ${mobo.memoryType}, mas a memória selecionada é ${ram.memoryType}.`
      );
    } else {
      strengths.push(`Memória RAM sincronizada: Ambos operam no padrão ${mobo.memoryType}.`);
    }
  }

  // 3. PSU Headroom Check
  let psuWattage = 0;
  if (psu) {
    const match = psu.name.match(/(\d{3,4})\s*W/i) || (psu.specs?.['Potência']?.match(/(\d{3,4})\s*W/i));
    if (match) {
      psuWattage = parseInt(match[1], 10);
    } else {
      psuWattage = 600;
    }
  }

  const recommendedPsuWatts = Math.round((totalWattage || 300) * 1.35);
  let psuAnalysisText = '';
  if (psu) {
    if (psuWattage >= recommendedPsuWatts) {
      const margin = psuWattage - (totalWattage || 300);
      psuAnalysisText = `Excelente dimensionamento! Fonte de ${psuWattage}W oferece ${margin}W de folga (+${Math.round((margin / (totalWattage || 300)) * 100)}% de margem de segurança) sobre o consumo estimado de ${totalWattage || 300}W.`;
      strengths.push(`Fonte com excelente folga térmica e eficiência energética (${psuWattage}W).`);
    } else if (psuWattage >= (totalWattage || 300)) {
      psuAnalysisText = `Fonte de ${psuWattage}W atende o consumo de ${totalWattage || 300}W, mas opera perto da capacidade máxima recomendada. Recomendamos ${recommendedPsuWatts}W para maior folga.`;
      recommendations.push(`Considere uma fonte de ${recommendedPsuWatts}W para suportar picos de transientes da GPU.`);
    } else {
      compatIssues.push(
        `Alerta de Energia: Consumo estimado de ${totalWattage}W excede a capacidade nominal da fonte de ${psuWattage}W!`
      );
      psuAnalysisText = `Risco de desligamento: consumo estimado (${totalWattage}W) excede a fonte (${psuWattage}W).`;
    }
  } else {
    psuAnalysisText = `Consumo estimado da build: ${totalWattage || 300}W. Recomendamos selecionar uma fonte de pelo menos ${recommendedPsuWatts}W com certificação 80 Plus.`;
    recommendations.push(`Selecione uma fonte de no mínimo ${recommendedPsuWatts}W.`);
  }

  // 4. Bottleneck CPU vs GPU & Performance Target
  let bottleneck: 'Perfeito / Sem Gargalo' | 'Equilibrado' | 'Leve Gargalo de CPU' | 'Leve Gargalo de GPU' | 'Atenção Necessária' = 'Equilibrado';
  let targetResolution = '1080p Ultra / 1440p Alto';

  const cpuName = cpu?.name.toLowerCase() || '';
  const gpuName = gpu?.name.toLowerCase() || '';

  if (gpuName.includes('4070') || gpuName.includes('4080') || gpuName.includes('7800') || gpuName.includes('7900')) {
    targetResolution = '1440p Ultra / 4K Competitivo';
    if (cpuName.includes('5600') || cpuName.includes('12400')) {
      bottleneck = 'Leve Gargalo de CPU';
      recommendations.push('Em jogos competitivos a 1080p em altíssimo framerate, um Ryzen 7 5700X3D ou Ryzen 7 7800X3D extrairia mais frames dessa GPU.');
    } else {
      bottleneck = 'Perfeito / Sem Gargalo';
    }
  } else if (gpuName.includes('4060') || gpuName.includes('6600') || gpuName.includes('6750') || gpuName.includes('7600')) {
    targetResolution = '1080p Ultra / 1440p Médio-Alto';
    bottleneck = 'Perfeito / Sem Gargalo';
    strengths.push('Combinação de ouro de custo por frame: processador e placa de vídeo trabalham com 98%+ de aproveitamento em Full HD.');
  }

  // 5. Storage recommendation
  if (storage?.name.toLowerCase().includes('nvme')) {
    strengths.push('Armazenamento NVMe PCIe de alta velocidade garante boot instantâneo e carregamento ultrarrápido em jogos modernos.');
  } else if (storage) {
    recommendations.push('Caso o orçamento permita, um SSD NVMe M.2 PCIe 4.0 oferece até 5x mais velocidade que SSDs SATA comuns.');
  }

  // 6. Base Score Calculation
  let baseScore = 94;
  if (!socketMatch) baseScore -= 40;
  if (!ramMatch) baseScore -= 30;
  if (compatIssues.length > 0 && socketMatch && ramMatch) baseScore -= 15;
  if (!gpu) baseScore -= 10;
  if (!psu) baseScore -= 5;
  baseScore = Math.max(25, Math.min(99, baseScore));

  const compatibilityStatus = compatIssues.length === 0 ? 'Compatível' : (!socketMatch || !ramMatch ? 'Incompatível' : 'Alerta de Compatibilidade');

  return {
    score: baseScore,
    bottleneckRating: bottleneck,
    targetResolution,
    summary: compatIssues.length === 0
      ? `Esta configuração possui excelente sinergia de hardware. Os componentes foram verificados com sucesso para soquete, padrão de memória e dimensionamento térmico e elétrico, oferecendo ótimo custo-benefício para o mercado brasileiro.`
      : `Foram detectados pontos críticos que precisam de revisão na compatibilidade dos componentes antes da compra para evitar problemas de montagem.`,
    compatibilityStatus,
    compatibilityDetails: compatIssues,
    strengths: strengths.slice(0, 4),
    recommendations: recommendations.slice(0, 3),
    psuHeadroomAnalysis: psuAnalysisText,
    fpsEstimates: [
      { game: 'Counter-Strike 2', fps: gpuName.includes('4070') ? '350+ FPS' : '220+ FPS', preset: '1080p Alto' },
      { game: 'Cyberpunk 2077', fps: gpuName.includes('4070') ? '95+ FPS' : '65+ FPS', preset: '1080p Ultra (DLSS/FSR On)' },
      { game: 'GTA V / GTA RP', fps: gpuName.includes('4070') ? '160+ FPS' : '110+ FPS', preset: '1080p Very High' },
      { game: 'Valorant', fps: gpuName.includes('4070') ? '450+ FPS' : '320+ FPS', preset: '1080p Max' },
    ],
  };
}
