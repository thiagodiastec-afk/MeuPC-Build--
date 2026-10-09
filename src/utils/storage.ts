import { BuildSelection, SavedBuild, SelectedItem } from '../types/pc';

const STORAGE_ACTIVE_BUILD_KEY = 'meupc_active_build_v2';
const STORAGE_SAVED_BUILDS_KEY = 'meupc_saved_builds_v2';

export function calculateTotals(parts: BuildSelection): {
  totalCash: number;
  totalInstallments: number;
  savings: number;
  partsCount: number;
} {
  let totalCash = 0;
  let totalInstallments = 0;
  let partsCount = 0;

  Object.values(parts).forEach(itemOrList => {
    if (!itemOrList) return;
    const items = Array.isArray(itemOrList) ? itemOrList : [itemOrList];
    items.forEach((item: SelectedItem) => {
      const qty = item.quantity || 1;
      const cash = item.customPriceCash ?? item.component.lowestPriceCash;
      const inst = item.customPriceInstallments ?? item.component.lowestPriceInstallments;

      totalCash += cash * qty;
      totalInstallments += inst * qty;
      partsCount += qty;
    });
  });

  const savings = Math.max(0, totalInstallments - totalCash);

  return {
    totalCash: Number(totalCash.toFixed(2)),
    totalInstallments: Number(totalInstallments.toFixed(2)),
    savings: Number(savings.toFixed(2)),
    partsCount,
  };
}

export function loadSavedBuilds(): SavedBuild[] {
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_BUILDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved builds:', e);
    return [];
  }
}

export function persistSavedBuilds(builds: SavedBuild[]): void {
  try {
    localStorage.setItem(STORAGE_SAVED_BUILDS_KEY, JSON.stringify(builds));
  } catch (e) {
    console.error('Failed to persist saved builds:', e);
  }
}

export function loadActiveBuildState(): { name: string; parts: BuildSelection } {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_BUILD_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.parts && Object.keys(parsed.parts).length > 0) {
        return {
          name: parsed.name || 'Meu PC Gamer',
          parts: parsed.parts,
        };
      }
    }
  } catch (e) {
    console.error('Failed to load active build:', e);
  }

  // A máquina inicial inicia vazia com slots prontos para busca online em tempo real
  return {
    name: 'Meu PC Gamer',
    parts: {},
  };
}

export function saveActiveBuildState(name: string, parts: BuildSelection): void {
  try {
    localStorage.setItem(STORAGE_ACTIVE_BUILD_KEY, JSON.stringify({ name, parts }));
  } catch (e) {
    console.error('Failed to save active build:', e);
  }
}
