import { 
  BuildSelection, 
  CompatibilityReport, 
  CompatibilityIssue, 
  SelectedItem, 
  PhysicalClearanceReport, 
  BottleneckAnalysisReport,
  PCComponent 
} from '../types/pc';

export function calculateBuildWattage(parts: BuildSelection): { estimatedWattage: number; recommendedPsuWattage: number } {
  let wattage = 65; // Base system wattage (Motherboard, chipset, fans, sensors)

  // CPU
  const cpu = parts.cpu as SelectedItem | undefined;
  if (cpu?.component?.tdpWattage) {
    wattage += cpu.component.tdpWattage;
  }

  // GPU
  const gpu = parts.gpu as SelectedItem | undefined;
  if (gpu?.component?.tdpWattage) {
    wattage += gpu.component.tdpWattage;
  }

  // Cooler (Fans / Pump)
  const cooler = parts.cooler as SelectedItem | undefined;
  if (cooler?.component) {
    if (cooler.component.coolerType?.startsWith('Water')) {
      wattage += 20; // Pump + multiple fans
    } else {
      wattage += 8; // Air cooler fan
    }
  }

  // RAM
  const ramItems = Array.isArray(parts.ram) ? parts.ram : parts.ram ? [parts.ram] : [];
  ramItems.forEach(item => {
    wattage += (item.quantity || 1) * 5; // ~5W per stick
  });

  // Storage
  const storageItems = Array.isArray(parts.storage) ? parts.storage : parts.storage ? [parts.storage] : [];
  storageItems.forEach(item => {
    wattage += (item.quantity || 1) * 8; // ~8W per SSD/HDD
  });

  // Fans
  const fanItems = Array.isArray(parts.case_fan) ? parts.case_fan : parts.case_fan ? [parts.case_fan] : [];
  fanItems.forEach(item => {
    wattage += (item.quantity || 1) * 4;
  });

  const estimatedWattage = Math.round(wattage);
  // Recommended PSU includes a ~35% safety headroom for transient spikes
  const recommendedPsuWattage = Math.max(450, Math.ceil((estimatedWattage * 1.35) / 50) * 50);

  return { estimatedWattage, recommendedPsuWattage };
}

// Evaluate CPU tier (1 = Entry, 2 = Mainstream, 3 = High Mid, 4 = High End, 5 = Enthusiast)
function getCpuTier(cpu?: PCComponent): number {
  if (!cpu) return 2;
  const name = cpu.name.toLowerCase();
  if (name.includes('7800x3d') || name.includes('14900k') || name.includes('7950x') || name.includes('14700k')) return 5;
  if (name.includes('7600') || name.includes('5700x3d') || name.includes('14600k') || name.includes('13600k') || name.includes('5800x')) return 4;
  if (name.includes('5600') || name.includes('12400') || name.includes('13400') || name.includes('5500') || name.includes('12600')) return 3;
  if (name.includes('4500') || name.includes('3600') || name.includes('10400') || name.includes('12100') || name.includes('i3')) return 2;
  return 1;
}

// Evaluate GPU tier (1 = Entry 1080p, 2 = Mainstream 1080p, 3 = Solid 1440p, 4 = High 1440p/4K, 5 = Extreme 4K)
function getGpuTier(gpu?: PCComponent): number {
  if (!gpu) return 0;
  const name = gpu.name.toLowerCase();
  if (name.includes('4090') || name.includes('4080') || name.includes('7900 xtx')) return 5;
  if (name.includes('4070 ti') || name.includes('4070 super') || name.includes('7900 xt') || name.includes('7800 xt')) return 4;
  if (name.includes('4070') || name.includes('6750 xt') || name.includes('7700 xt') || name.includes('6800') || name.includes('3070')) return 3;
  if (name.includes('4060') || name.includes('7600') || name.includes('6600') || name.includes('3060') || name.includes('2060')) return 2;
  if (name.includes('1650') || name.includes('580') || name.includes('6500') || name.includes('1050')) return 1;
  return 2;
}

export function evaluateBottleneckAndBalance(
  cpu?: PCComponent,
  gpu?: PCComponent,
  ramSticksCount: number = 0,
  ramSpeed: number = 0
): BottleneckAnalysisReport {
  if (!cpu && !gpu) {
    return {
      score: 100,
      type: 'balanced',
      summary: 'Adicione CPU e GPU para análise de equilíbrio e gargalo.',
      idealResolution: '1080p',
      cpuTier: 0,
      gpuTier: 0,
      notes: [],
    };
  }

  const cpuTier = getCpuTier(cpu);
  const gpuTier = getGpuTier(gpu);
  const notes: string[] = [];

  // Single stick RAM bandwidth penalty note
  if (ramSticksCount === 1) {
    notes.push('Penalidade de largura de banda: Usar apenas 1 pente de RAM reduz a taxa de transferência em até 30% em jogos competitivos.');
  }

  if (!gpu) {
    return {
      score: 85,
      type: 'balanced',
      summary: cpu?.integratedGraphics 
        ? 'Sistema com gráficos integrados adequado para tarefas diárias e jogos casuais leves.'
        : 'Sem placa de vídeo dedicada detectada.',
      idealResolution: '1080p',
      cpuTier,
      gpuTier: 0,
      notes,
    };
  }

  const tierDiff = cpuTier - gpuTier;

  // CPU Bottleneck (Weak CPU paired with monster GPU)
  if (tierDiff <= -2) {
    notes.push(`O processador (${cpu?.model || 'CPU'}) pode limitar a taxa máxima de quadros da placa (${gpu?.model || 'GPU'}) em resoluções menores como 1080p.`);
    notes.push('Recomendação: Suba a resolução para 1440p ou 4K para transferir a carga para a GPU, ou considere um upgrade de CPU.');
    return {
      score: Math.max(55, 100 - Math.abs(tierDiff) * 20),
      type: 'cpu_bottleneck',
      summary: 'Potencial gargalo de CPU detectado em taxas altas de FPS.',
      idealResolution: gpuTier >= 4 ? '4K' : '1440p',
      cpuTier,
      gpuTier,
      notes,
    };
  }

  // GPU Bottleneck (Super high-end CPU paired with entry GPU)
  if (tierDiff >= 2) {
    notes.push(`O processador (${cpu?.model || 'CPU'}) possui folga extrema para a placa gráfica (${gpu?.model || 'GPU'}).`);
    notes.push('Seu sistema rodará com estabilidade máxima de 1% low, mas a GPU atingirá 100% de uso rapidamente.');
    return {
      score: Math.max(70, 100 - Math.abs(tierDiff) * 12),
      type: 'gpu_bottleneck',
      summary: 'GPU atingirá limite antes da CPU (cenário padrão e saudável para jogos).',
      idealResolution: gpuTier <= 2 ? '1080p' : '1440p',
      cpuTier,
      gpuTier,
      notes,
    };
  }

  // Balanced
  let idealRes: '1080p' | '1440p' | '4K' = '1080p';
  if (gpuTier >= 5) idealRes = '4K';
  else if (gpuTier >= 3) idealRes = '1440p';

  notes.push(`Excelente sinergia entre ${cpu?.model || 'CPU'} e ${gpu?.model || 'GPU'}.`);
  notes.push(`Configuração ideal para rodar jogos em ${idealRes} com alta fidelidade.`);

  return {
    score: 96,
    type: 'balanced',
    summary: `Configuração equilibrada e otimizada para ${idealRes}.`,
    idealResolution: idealRes,
    cpuTier,
    gpuTier,
    notes,
  };
}

export function checkBuildCompatibility(parts: BuildSelection): CompatibilityReport {
  const issues: CompatibilityIssue[] = [];
  const { estimatedWattage, recommendedPsuWattage } = calculateBuildWattage(parts);

  const cpu = (parts.cpu as SelectedItem | undefined)?.component;
  const mobo = (parts.motherboard as SelectedItem | undefined)?.component;
  const gpu = (parts.gpu as SelectedItem | undefined)?.component;
  const cooler = (parts.cooler as SelectedItem | undefined)?.component;
  const pcCase = (parts.case as SelectedItem | undefined)?.component;
  const psu = (parts.psu as SelectedItem | undefined)?.component;
  
  const ramItems = Array.isArray(parts.ram) ? parts.ram : parts.ram ? [parts.ram] : [];
  const storageItems = Array.isArray(parts.storage) ? parts.storage : parts.storage ? [parts.storage] : [];

  const totalRamSticks = ramItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const primaryRam = ramItems[0]?.component;

  const clearances: PhysicalClearanceReport = {};

  // =========================================================================
  // 1. STRUCTURAL: Socket Compatibility (CPU vs Motherboard)
  // =========================================================================
  if (cpu && mobo) {
    if (cpu.socket && mobo.socket && cpu.socket !== mobo.socket) {
      issues.push({
        type: 'error',
        category: 'motherboard',
        issueCategory: 'structural',
        title: 'Incompatibilidade de Socket (Processador e Placa-mãe)',
        message: `O processador ${cpu.name} utiliza o socket ${cpu.socket}, enquanto a placa-mãe ${mobo.name} possui socket ${mobo.socket}. Eles não se encaixam fisicamente.`,
        recommendation: `Escolha uma placa-mãe com socket ${cpu.socket} (ex: chipsets compatíveis).`,
      });
    }
  }

  // =========================================================================
  // 2. MEMORY: RAM Type, Channels, Slots & Speed Compatibility
  // =========================================================================
  if (mobo && ramItems.length > 0) {
    ramItems.forEach(({ component: ram }) => {
      if (ram?.memoryType && mobo.memoryType && ram.memoryType !== mobo.memoryType) {
        issues.push({
          type: 'error',
          category: 'ram',
          issueCategory: 'memory',
          title: `Incompatibilidade de Tipo de Memória RAM (${ram.memoryType} vs ${mobo.memoryType})`,
          message: `A memória selecionada é ${ram.memoryType}, mas a placa-mãe ${mobo.name} suporta exclusivamente memórias ${mobo.memoryType}.`,
          recommendation: `Troque por módulos de memória ${mobo.memoryType}.`,
        });
      }
    });

    // RAM Slots limit check
    if (mobo.ramSlots && totalRamSticks > mobo.ramSlots) {
      issues.push({
        type: 'error',
        category: 'ram',
        issueCategory: 'memory',
        title: 'Excesso de Pentes de Memória RAM',
        message: `Você selecionou ${totalRamSticks} pentes de memória RAM, mas a placa-mãe ${mobo.name} possui apenas ${mobo.ramSlots} slots DIMM.`,
        recommendation: `Reduza a quantidade de pentes para no máximo ${mobo.ramSlots} ou utilize módulos de maior capacidade individual.`,
      });
    }
  }

  // RAM Single Channel Advisory
  if (totalRamSticks === 1) {
    issues.push({
      type: 'warning',
      category: 'ram',
      issueCategory: 'memory',
      title: 'Alerta de Canal Único (Single Channel) na Memória RAM',
      message: 'Você selecionou apenas 1 pente de memória RAM. Rodar em Single Channel corta a largura de banda de memória pela metade, causando perda de 15% a 25% de FPS e micro-travamentos em jogos.',
      recommendation: 'Recomendamos utilizar 2 pentes (ex: 2x 8GB ou 2x 16GB) para ativar o Dual Channel.',
    });
  }

  // RAM Speed & Sweet Spot Advice
  if (cpu && primaryRam?.memorySpeed) {
    const isAM5 = cpu.socket === 'AM5';
    const isAM4 = cpu.socket === 'AM4';
    const isIntelDDR5 = cpu.socket === 'LGA1700' && primaryRam.memoryType === 'DDR5';

    if (isAM5 && primaryRam.memorySpeed < 5600) {
      issues.push({
        type: 'info',
        category: 'ram',
        issueCategory: 'memory',
        title: 'Dica de Frequência de Memória para Plataforma AM5',
        message: `A memória selecionada opera a ${primaryRam.memorySpeed}MHz. A arquitetura AMD Ryzen série 7000/9000 atinge seu "Sweet Spot" de desempenho e baixa latência (1:1 IF) com memórias DDR5 de 6000MHz CL30 com perfil AMD EXPO.`,
        recommendation: 'Se possível, opte por um kit DDR5 6000MHz CL30 ou CL32.',
      });
    } else if (isAM4 && primaryRam.memorySpeed > 3600) {
      issues.push({
        type: 'info',
        category: 'ram',
        issueCategory: 'memory',
        title: 'Frequência de RAM acima do controlador AM4',
        message: `A memória opera a ${primaryRam.memorySpeed}MHz. Na plataforma AM4, frequências acima de 3600MHz podem desarmar o Infinity Fabric 1:1, exigindo ajuste manual de timings na BIOS.`,
        recommendation: 'DDR4 3200MHz ou 3600MHz CL16 são as frequências mais plug-and-play para AM4.',
      });
    } else if (isIntelDDR5 && primaryRam.memorySpeed >= 6400) {
      issues.push({
        type: 'info',
        category: 'ram',
        issueCategory: 'memory',
        title: 'Perfil XMP de Alta Frequência Intel',
        message: `Memória DDR5 ${primaryRam.memorySpeed}MHz de alta velocidade selecionada. Certifique-se de ativar o perfil Intel XMP 3.0 na BIOS para usufruir da velocidade contratada.`,
      });
    }
  }

  // =========================================================================
  // 3. PHYSICAL CLEARANCE: Dimensions, Air Cooler & GPU Margins
  // =========================================================================

  // Motherboard Form Factor vs Case Support
  if (mobo && pcCase) {
    if (mobo.formFactor && pcCase.supportedFormFactors) {
      if (!pcCase.supportedFormFactors.includes(mobo.formFactor)) {
        issues.push({
          type: 'error',
          category: 'case',
          issueCategory: 'clearance',
          title: 'Tamanho da Placa-mãe incompatível com o Gabinete',
          message: `A placa-mãe ${mobo.name} é do formato ${mobo.formFactor}, porém o gabinete ${pcCase.name} suporta apenas [${pcCase.supportedFormFactors.join(', ')}].`,
          recommendation: `Escolha um gabinete compatível com o formato ${mobo.formFactor} ou uma placa-mãe menor.`,
        });
      }
    }
  }

  // GPU Length vs Case Max GPU Length
  if (gpu && pcCase && gpu.gpuLength && pcCase.maxGpuLength) {
    const margin = pcCase.maxGpuLength - gpu.gpuLength;
    clearances.gpuClearance = {
      gpuLength: gpu.gpuLength,
      caseMaxLength: pcCase.maxGpuLength,
      marginMm: margin,
      status: margin < 0 ? 'exceeded' : margin <= 15 ? 'tight' : 'ok',
    };

    if (margin < 0) {
      issues.push({
        type: 'error',
        category: 'gpu',
        issueCategory: 'clearance',
        title: 'Comprimento da Placa de Vídeo excede o Gabinete',
        message: `A placa de vídeo ${gpu.name} tem ${gpu.gpuLength}mm de comprimento, excedendo o espaço máximo do gabinete (${pcCase.maxGpuLength}mm) por ${Math.abs(margin)}mm.`,
        recommendation: `Escolha um gabinete com suporte a GPUs de no mínimo ${gpu.gpuLength + 15}mm ou uma GPU mais compacta.`,
        metric: {
          current: `${gpu.gpuLength} mm`,
          limit: `${pcCase.maxGpuLength} mm`,
          margin: `${margin} mm`,
        },
      });
    } else if (margin <= 15) {
      issues.push({
        type: 'warning',
        category: 'gpu',
        issueCategory: 'clearance',
        title: 'Folga Física Estreita para Placa de Vídeo',
        message: `A placa de vídeo tem ${gpu.gpuLength}mm e o gabinete suporta até ${pcCase.maxGpuLength}mm (folga de apenas ${margin}mm). A instalação pode ser apertada se houver ventoinhas frontais ou radiador montado na frente.`,
        recommendation: 'Verifique se há espaço suficiente caso instale um Water Cooler na parte frontal do gabinete.',
        metric: {
          current: `${gpu.gpuLength} mm`,
          limit: `${pcCase.maxGpuLength} mm`,
          margin: `+${margin} mm`,
        },
      });
    }
  }

  // Cooler Height vs Case Max Cooler Clearance
  if (cooler && pcCase && cooler.coolerHeight && pcCase.maxCoolerHeight) {
    const margin = pcCase.maxCoolerHeight - cooler.coolerHeight;
    clearances.coolerClearance = {
      coolerHeight: cooler.coolerHeight,
      caseMaxHeight: pcCase.maxCoolerHeight,
      marginMm: margin,
      status: margin < 0 ? 'exceeded' : margin <= 5 ? 'tight' : 'ok',
    };

    if (margin < 0) {
      issues.push({
        type: 'error',
        category: 'cooler',
        issueCategory: 'clearance',
        title: 'Altura do Air Cooler excede a tampa lateral do Gabinete',
        message: `O cooler ${cooler.name} possui ${cooler.coolerHeight}mm de altura, ultrapassando a folga máxima do gabinete (${pcCase.maxCoolerHeight}mm) por ${Math.abs(margin)}mm. A tampa de vidro não fechará.`,
        recommendation: `Escolha um gabinete mais largo (mínimo ${cooler.coolerHeight + 5}mm) ou um cooler de menor altura.`,
        metric: {
          current: `${cooler.coolerHeight} mm`,
          limit: `${pcCase.maxCoolerHeight} mm`,
          margin: `${margin} mm`,
        },
      });
    } else if (margin <= 5) {
      issues.push({
        type: 'warning',
        category: 'cooler',
        issueCategory: 'clearance',
        title: 'Air Cooler rente ao Vidro Lateral',
        message: `O cooler possui ${cooler.coolerHeight}mm e a altura máxima do gabinete é ${pcCase.maxCoolerHeight}mm (folga milimétrica de ${margin}mm). Verifique se memórias RAM de perfil alto não forçarão o fan do cooler para cima.`,
        metric: {
          current: `${cooler.coolerHeight} mm`,
          limit: `${pcCase.maxCoolerHeight} mm`,
          margin: `+${margin} mm`,
        },
      });
    }
  }

  // Water Cooler (Radiator) vs Case Support
  if (cooler && pcCase && cooler.coolerType?.startsWith('Water')) {
    const is360 = cooler.coolerType.includes('360');
    const is240 = cooler.coolerType.includes('240');
    const isMicroCase = pcCase.formFactor === 'Micro-ATX' && !pcCase.supportedFormFactors?.includes('ATX');

    if (is360 && isMicroCase) {
      issues.push({
        type: 'warning',
        category: 'cooler',
        issueCategory: 'clearance',
        title: 'Compatibilidade de Radiador 360mm em Gabinete Compacto',
        message: `Você selecionou um Water Cooler de 360mm em um gabinete compacto (${pcCase.name}). Gabinetes Micro-ATX compactos geralmente suportam no máximo radiadores de 240mm no topo.`,
        recommendation: 'Confira as especificações do gabinete ou considere um Water Cooler 240mm.',
      });
    }
  }

  // High-Power GPU 12VHPWR Connector Note
  if (gpu && (gpu.name.includes('4070') || gpu.name.includes('4080') || gpu.name.includes('4090'))) {
    issues.push({
      type: 'info',
      category: 'gpu',
      issueCategory: 'clearance',
      title: 'Atenção ao Conector 12VHPWR / 16 Pinos PCIe 5.0',
      message: `A placa ${gpu.model} utiliza o novo conector 12VHPWR (16 pinos). Mantenha uma folga de pelo menos 30mm entre o conector e o vidro lateral para evitar dobrar o cabo bruscamente.`,
    });
  }

  // =========================================================================
  // 4. DISPLAY / INTEGRATED GRAPHICS
  // =========================================================================
  if (cpu && !gpu && cpu.integratedGraphics === false) {
    issues.push({
      type: 'warning',
      category: 'gpu',
      issueCategory: 'structural',
      title: 'Ausência de Saída de Vídeo (Sem Placa de Vídeo nem Gráficos Integrados)',
      message: `O processador ${cpu.name} não possui chip gráfico integrado e nenhuma placa de vídeo foi adicionada. O computador não conseguirá dar vídeo no monitor.`,
      recommendation: 'Adicione uma placa de vídeo dedicada ou escolha um processador com sufixo com vídeo integrado (ex: Ryzen sem sufixo F ou Intel sem F).',
    });
  }

  // =========================================================================
  // 5. POWER SUPPLY (PSU) HEADROOM & CAPACITY
  // =========================================================================
  let psuStatus: CompatibilityReport['psuStatus'] = 'none';
  if (psu && psu.psuWattage) {
    const supply = psu.psuWattage;
    if (supply < estimatedWattage) {
      psuStatus = 'insufficient';
      issues.push({
        type: 'error',
        category: 'psu',
        issueCategory: 'power',
        title: 'Fonte de Alimentação Insuficiente',
        message: `A fonte selecionada (${supply}W) é menor do que o consumo mínimo estimado do sistema (${estimatedWattage}W). O computador desligará ou sofrerá instabilidade sob carga pesada.`,
        recommendation: `Selecione uma fonte com pelo menos ${recommendedPsuWattage}W de potência.`,
        metric: {
          current: `${supply} W`,
          limit: `${estimatedWattage} W (mínimo)`,
          margin: `${supply - estimatedWattage} W`,
        },
      });
    } else if (supply < recommendedPsuWattage) {
      psuStatus = 'tight';
      issues.push({
        type: 'warning',
        category: 'psu',
        issueCategory: 'power',
        title: 'Fonte com Margem de Segurança Reduzida',
        message: `A fonte (${supply}W) suporta a carga contínua estimada (${estimatedWattage}W), porém a margem recomendada para transientes de GPU é de pelo menos ${recommendedPsuWattage}W.`,
        recommendation: `Para maior longevidade e silêncio da fonte, prefira uma unidade de ${recommendedPsuWattage}W+.`,
        metric: {
          current: `${supply} W`,
          limit: `${recommendedPsuWattage} W (recomendado)`,
        },
      });
    } else if (supply > estimatedWattage * 2.5 && estimatedWattage > 150) {
      psuStatus = 'excessive';
      issues.push({
        type: 'info',
        category: 'psu',
        issueCategory: 'power',
        title: 'Fonte Superdimensionada',
        message: `A fonte (${supply}W) é significativamente maior do que o consumo estimado do seu setup (${estimatedWattage}W).`,
        recommendation: `Você pode economizar escolhendo uma fonte de ${recommendedPsuWattage}W com certificação 80 Plus Gold.`,
      });
    } else {
      psuStatus = 'optimal';
    }
  }

  // =========================================================================
  // 6. STORAGE M.2 SLOTS
  // =========================================================================
  if (mobo && storageItems.length > 0) {
    const m2Count = storageItems
      .filter(s => s.component.storageType === 'NVMe M.2')
      .reduce((acc, s) => acc + (s.quantity || 1), 0);
    if (mobo.m2Slots && m2Count > mobo.m2Slots) {
      issues.push({
        type: 'warning',
        category: 'storage',
        issueCategory: 'structural',
        title: 'Mais SSDs M.2 do que Slots Disponíveis na Placa-mãe',
        message: `Você adicionou ${m2Count} SSDs M.2 NVMe, mas a placa-mãe ${mobo.name} tem apenas ${mobo.m2Slots} slots M.2 integrados. O SSD excedente exigirá um adaptador PCIe.`,
        recommendation: `Escolha uma placa-mãe com mais slots M.2 ou um SSD de maior capacidade individual.`,
      });
    }
  }

  // =========================================================================
  // 7. BOTTLENECK & HARDWARE BALANCE ANALYSIS
  // =========================================================================
  const bottleneck = evaluateBottleneckAndBalance(
    cpu, 
    gpu, 
    totalRamSticks, 
    primaryRam?.memorySpeed || 0
  );

  if (bottleneck.type === 'cpu_bottleneck') {
    issues.push({
      type: 'warning',
      category: 'cpu',
      issueCategory: 'bottleneck',
      title: 'Aviso de Gargalo de Processador (CPU Bottleneck)',
      message: bottleneck.notes[0] || 'O processador selecionado pode limitar a taxa máxima de FPS em resoluções mais baixas (1080p).',
      recommendation: bottleneck.notes[1] || 'Considere emparelhar com um processador mais potente ou jogar em resolução 1440p/4K.',
    });
  }

  const hasErrors = issues.some(i => i.type === 'error');
  const hasWarnings = issues.some(i => i.type === 'warning');

  return {
    isCompatible: !hasErrors,
    hasWarnings,
    issues,
    estimatedWattage,
    recommendedPsuWattage,
    psuStatus,
    clearances,
    bottleneck,
  };
}

