import { PCComponent, ComponentCategory } from '../types/pc';

export const CATEGORY_INFO: Record<
  ComponentCategory,
  { label: string; iconName: string; description: string; multiple?: boolean }
> = {
  cpu: {
    label: 'Processador',
    iconName: 'Cpu',
    description: 'O cérebro do seu computador (CPU)',
  },
  cooler: {
    label: 'Cooler do Processador',
    iconName: 'Fan',
    description: 'Air Cooler ou Water Cooler para refrigeração',
  },
  gpu: {
    label: 'Placa de Vídeo',
    iconName: 'Gamepad2',
    description: 'Responsável pelo processamento gráfico e jogos (GPU)',
  },
  motherboard: {
    label: 'Placa-mãe',
    iconName: 'CircuitBoard',
    description: 'Conecta todos os componentes do sistema',
  },
  ram: {
    label: 'Memória RAM',
    iconName: 'Layers',
    description: 'Memória de acesso rápido temporário (DDR4 ou DDR5)',
    multiple: true,
  },
  storage: {
    label: 'Armazenamento',
    iconName: 'HardDrive',
    description: 'SSD NVMe M.2, SATA ou HD para seus arquivos e jogos',
    multiple: true,
  },
  case: {
    label: 'Gabinete',
    iconName: 'Box',
    description: 'Chassi para acomodar com bom fluxo de ar',
  },
  psu: {
    label: 'Fonte de Alimentação',
    iconName: 'Zap',
    description: 'Fornece energia estável para todo o sistema (PSU)',
  },
  os: {
    label: 'Sistema Operacional',
    iconName: 'MonitorDot',
    description: 'Windows 11, Linux ou Outro',
  },
  monitor: {
    label: 'Monitor',
    iconName: 'Tv',
    description: 'Taxa de atualização, resolução e painel',
  },
  case_fan: {
    label: 'Ventoinhas / Fans',
    iconName: 'Wind',
    description: 'Fans extras para fluxo de ar e iluminação ARGB',
    multiple: true,
  },
  keyboard: {
    label: 'Teclado',
    iconName: 'Keyboard',
    description: 'Teclado mecânico ou de membrana',
  },
  mouse: {
    label: 'Mouse',
    iconName: 'Mouse',
    description: 'Mouse gamer com sensor de precisão',
  },
  headset: {
    label: 'Headset / Fone',
    iconName: 'Headphones',
    description: 'Áudio imersivo e microfone para comunicação',
  },
  chair: {
    label: 'Cadeira Gamer',
    iconName: 'Armchair',
    description: 'Conforto e ergonomia para longas horas',
  },
  microphone: {
    label: 'Microfone',
    iconName: 'Mic',
    description: 'Microfone de mesa ou condensador',
  },
  mousepad: {
    label: 'Mousepad',
    iconName: 'Square',
    description: 'Superfície para o seu mouse e teclado',
  },
};

import { HARDWARE_CATALOG } from './hardware';

// Catálogo Oficial de Hardware Atualizado com Especificações Reais e Preços Médios de Mercado
export let RAW_COMPONENTS: PCComponent[] = [...HARDWARE_CATALOG];

export const setRawComponents = (components: PCComponent[]) => {
  if (components && components.length > 0) {
    RAW_COMPONENTS = components;
  }
};
