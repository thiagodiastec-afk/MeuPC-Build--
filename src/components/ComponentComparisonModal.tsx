import React, { useState, useMemo } from 'react';
import { 
  X, 
  Scale, 
  Plus, 
  Trash2, 
  Check, 
  ExternalLink, 
  Sparkles, 
  TrendingDown, 
  Search, 
  ArrowRight,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { PCComponent, ComponentCategory, SelectedItem } from '../types/pc';
import { RAW_COMPONENTS, CATEGORY_INFO } from '../data/componentsDatabase';
import { getStoreProductUrl } from '../utils/storeUrls';
import { SafeExternalLink } from './SafeExternalLink';

interface ComponentComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: ComponentCategory;
  initialComponents?: PCComponent[];
  onSelectForBuild: (component: PCComponent) => void;
}

const COMPARISON_PRESETS: { title: string; category: ComponentCategory; componentIds: string[] }[] = [
  {
    title: 'Ryzen 5 5600 vs Core i5-12400F (Custo-Benefício)',
    category: 'cpu',
    componentIds: ['cpu-amd-r5-5600', 'cpu-intel-i5-12400f'],
  },
  {
    title: 'Ryzen 7 7800X3D vs Core i7-14700K (Gaming Topo)',
    category: 'cpu',
    componentIds: ['cpu-amd-r7-7800x3d', 'cpu-intel-i7-14700k'],
  },
  {
    title: 'RTX 4060 8GB vs RX 6750 XT 12GB (R$ 1.8k - R$ 2.2k)',
    category: 'gpu',
    componentIds: ['gpu-nvidia-rtx4060', 'gpu-amd-rx6750xt'],
  },
  {
    title: 'RTX 4070 SUPER vs RTX 4080 SUPER (1440p vs 4K)',
    category: 'gpu',
    componentIds: ['gpu-nvidia-rtx4070super', 'gpu-nvidia-rtx4080super'],
  },
  {
    title: 'Air Cooler AK400 vs Water Cooler 240mm (Refrigeração)',
    category: 'cooler',
    componentIds: ['cooler-deepcool-ak400', 'cooler-water-rise-mode-240'],
  },
  {
    title: 'Kingston NV2 1TB vs KC3000 1TB (SSD DRAM vs Standard)',
    category: 'storage',
    componentIds: ['ssd-kingston-nv2-1tb', 'ssd-kingston-kc3000-1tb'],
  },
];

const COMPATIBLE_CATEGORIES: ComponentCategory[] = [
  'cpu',
  'gpu',
  'motherboard',
  'ram',
  'storage',
  'cooler',
  'psu',
  'case',
  'monitor',
];

export const ComponentComparisonModal: React.FC<ComponentComparisonModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'cpu',
  initialComponents = [],
  onSelectForBuild,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>(initialCategory);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (initialComponents.length > 0) {
      return initialComponents.map(c => c.id);
    }
    const defaultPreset = COMPARISON_PRESETS.find(p => p.category === initialCategory);
    return defaultPreset ? defaultPreset.componentIds : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingComponent, setIsAddingComponent] = useState(false);

  // Sync when initialCategory or initialComponents change
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
    if (initialComponents.length > 0) {
      setSelectedIds(initialComponents.map(c => c.id));
    } else {
      const preset = COMPARISON_PRESETS.find(p => p.category === (initialCategory || 'cpu'));
      if (preset && selectedIds.length === 0) {
        setSelectedIds(preset.componentIds);
      }
    }
  }, [initialCategory, initialComponents]);

  // Available components in the active category
  const categoryComponents = useMemo(() => {
    return RAW_COMPONENTS.filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  // Currently selected components to compare
  const comparedComponents = useMemo(() => {
    return selectedIds
      .map(id => initialComponents.find(c => c.id === id) || RAW_COMPONENTS.find(c => c.id === id))
      .filter((c): c is PCComponent => c !== undefined && c.category === selectedCategory);
  }, [selectedIds, selectedCategory, initialComponents]);

  // Available to add (not yet in comparison)
  const availableToAdd = useMemo(() => {
    return categoryComponents.filter(c => {
      const isSelected = selectedIds.includes(c.id);
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return !isSelected && matchesSearch;
    });
  }, [categoryComponents, selectedIds, searchQuery]);

  // Union of all spec keys across selected items
  const allSpecKeys = useMemo(() => {
    const keysSet = new Set<string>();
    comparedComponents.forEach(c => {
      Object.keys(c.specs || {}).forEach(k => keysSet.add(k));
    });
    return Array.from(keysSet);
  }, [comparedComponents]);

  if (!isOpen) return null;

  const handleSelectCategory = (cat: ComponentCategory) => {
    setSelectedCategory(cat);
    const preset = COMPARISON_PRESETS.find(p => p.category === cat);
    if (preset) {
      setSelectedIds(preset.componentIds);
    } else {
      const firstTwo = RAW_COMPONENTS.filter(c => c.category === cat).slice(0, 2).map(c => c.id);
      setSelectedIds(firstTwo);
    }
    setIsAddingComponent(false);
    setSearchQuery('');
  };

  const handleAddComponent = (id: string) => {
    if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
    setIsAddingComponent(false);
    setSearchQuery('');
  };

  const handleRemoveComponent = (id: string) => {
    setSelectedIds(selectedIds.filter(i => i !== id));
  };

  const handleApplyPreset = (preset: typeof COMPARISON_PRESETS[0]) => {
    setSelectedCategory(preset.category);
    setSelectedIds(preset.componentIds);
    setIsAddingComponent(false);
  };

  const lowestPriceCash = comparedComponents.length > 0 
    ? Math.min(...comparedComponents.map(c => c.lowestPriceCash))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 w-full max-w-6xl h-full max-h-[92vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">Comparador de Peças Lado a Lado</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {comparedComponents.length} de 4 selecionadas
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Compare especificações técnicas, preços nas melhores lojas do Brasil e encontre a melhor escolha.
              </p>
            </div>
          </div>

          <button
            id="close-comparison-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-transparent hover:border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Switcher & Presets */}
        <div className="px-6 py-3 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {COMPATIBLE_CATEGORIES.map(cat => {
              const info = CATEGORY_INFO[cat];
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span>{info.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Presets Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden md:inline">Comparações populares:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs sm:max-w-md">
              {COMPARISON_PRESETS.filter(p => p.category === selectedCategory).map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 text-[11px] font-semibold whitespace-nowrap transition-all"
                >
                  ⚡ {preset.title.split('(')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Add Component Drawer/Dropdown */}
          {isAddingComponent && (
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-blue-500/30 backdrop-blur-xl animate-in fade-in duration-150 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-400" />
                  Adicionar {CATEGORY_INFO[selectedCategory]?.label} para Comparação
                </h4>
                <button
                  onClick={() => setIsAddingComponent(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Buscar ${CATEGORY_INFO[selectedCategory]?.label} por nome, marca ou modelo...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-slate-950/70 text-slate-100 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {availableToAdd.map(comp => (
                  <button
                    key={comp.id}
                    onClick={() => handleAddComponent(comp.id)}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/40 text-left transition-all flex items-center gap-3 group"
                  >
                    <img
                      src={comp.image}
                      alt={comp.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-white/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        {comp.name}
                      </div>
                      <div className="text-[11px] font-mono font-bold text-blue-400">
                        R$ {comp.lowestPriceCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {comparedComponents.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/10 p-8">
              <Scale className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">Nenhum componente selecionado nesta categoria</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                Selecione pelo menos duas peças para visualizar o comparativo completo de especificações e valores.
              </p>
              <button
                onClick={() => setIsAddingComponent(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                Adicionar {CATEGORY_INFO[selectedCategory]?.label}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Top Row: Cards Grid with Main Info & CTAs */}
              <div className={`grid grid-cols-1 sm:grid-cols-${comparedComponents.length} gap-4`}>
                {comparedComponents.map((comp) => {
                  const isLowest = comp.lowestPriceCash === lowestPriceCash && comparedComponents.length > 1;
                  const lowestStore = comp.stores.find(s => s.isLowest) || comp.stores[0];

                  return (
                    <div
                      key={comp.id}
                      className={`relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border transition-all flex flex-col justify-between ${
                        isLowest ? 'border-emerald-500/40 shadow-xl shadow-emerald-500/5' : 'border-white/10'
                      }`}
                    >
                      {/* Top Badges & Remove Button */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        {isLowest ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            Melhor Preço
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            {comp.brand}
                          </span>
                        )}

                        <button
                          onClick={() => handleRemoveComponent(comp.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Remover da comparação"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Product Thumbnail & Name */}
                      <div className="flex items-center gap-3.5 mb-4">
                        <img
                          src={comp.image}
                          alt={comp.name}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-white/10 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                            {comp.name}
                          </h4>
                          <div className="text-[11px] text-slate-400 mt-1">
                            Modelo: <span className="text-slate-300 font-semibold">{comp.model}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-2 mb-4">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[11px] text-slate-400">À vista (PIX):</span>
                          <span className="text-base font-mono font-black text-emerald-400">
                            R$ {comp.lowestPriceCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between text-[11px] text-slate-400">
                          <span>A prazo:</span>
                          <span className="font-mono text-slate-300">
                            R$ {comp.lowestPriceInstallments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        {lowestStore && (
                          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Menor na: <strong className="text-slate-200">{lowestStore.storeName}</strong></span>
                            <SafeExternalLink
                              id={`comparison-buy-btn-${comp.id}`}
                              href={getStoreProductUrl(lowestStore.storeName, comp.name, lowestStore.url, comp.id)}
                              fallbackStore={lowestStore.storeName}
                              fallbackProductName={comp.name}
                              fallbackProductId={comp.id}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold transition-colors"
                              title={`Comprar ${comp.name} na loja ${lowestStore.storeName} (Abre em nova aba com URL formatada com encodeURIComponent)`}
                            >
                              Comprar na Loja <ExternalLink className="w-3 h-3" />
                            </SafeExternalLink>
                          </div>
                        )}
                      </div>

                      {/* Add / Swap into Build CTA */}
                      <button
                        onClick={() => {
                          onSelectForBuild(comp);
                          onClose();
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        <span>Usar na Minha Build</span>
                      </button>
                    </div>
                  );
                })}

                {/* Slot to add another component if < 4 */}
                {comparedComponents.length < 4 && (
                  <button
                    onClick={() => setIsAddingComponent(true)}
                    className="p-6 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-dashed border-white/15 hover:border-blue-500/50 flex flex-col items-center justify-center text-center transition-all group min-h-[220px]"
                  >
                    <div className="p-3 rounded-full bg-white/5 group-hover:bg-blue-500/10 text-slate-400 group-hover:text-blue-400 border border-white/10 group-hover:border-blue-500/20 mb-2 transition-all">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                      Adicionar {CATEGORY_INFO[selectedCategory]?.label}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Compare até 4 itens lado a lado
                    </span>
                  </button>
                )}
              </div>

              {/* Detailed Specs Matrix Table */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden shadow-xl">
                <div className="px-5 py-3.5 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                    Tabela Comparativa de Especificações
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {allSpecKeys.length} especificações técnicas analisadas
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01] text-slate-400">
                        <th className="py-3 px-4 font-bold w-48 bg-slate-950/40">Especificação</th>
                        {comparedComponents.map(c => (
                          <th key={c.id} className="py-3 px-4 font-bold text-slate-200">
                            {c.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {/* Price Row */}
                      <tr className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-bold text-slate-300 bg-slate-950/20">Preço Menor (À Vista)</td>
                        {comparedComponents.map(c => (
                          <td key={c.id} className="py-3 px-4 font-mono font-bold text-emerald-400">
                            R$ {c.lowestPriceCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        ))}
                      </tr>

                      {/* Store Options Row */}
                      <tr className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-bold text-slate-300 bg-slate-950/20">Lojas com Estoque</td>
                        {comparedComponents.map(c => (
                          <td key={c.id} className="py-3 px-4 text-slate-300">
                            <div className="flex flex-wrap gap-1">
                              {c.stores.map((s, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                                  {s.storeName}
                                </span>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Dynamic Specs Rows */}
                      {allSpecKeys.map(specKey => {
                        // Check if all components have the same value for this spec
                        const values = comparedComponents.map(c => String(c.specs?.[specKey] ?? '—'));
                        const isIdentical = values.every(v => v === values[0]);

                        return (
                          <tr key={specKey} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4 font-bold text-slate-300 bg-slate-950/20">
                              {specKey}
                            </td>
                            {comparedComponents.map(c => {
                              const val = c.specs?.[specKey] ?? '—';
                              return (
                                <td 
                                  key={c.id} 
                                  className={`py-3 px-4 ${
                                    !isIdentical 
                                      ? 'text-slate-100 font-medium' 
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {String(val)}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-slate-950/70 backdrop-blur-md flex items-center justify-between text-xs text-slate-400">
          <span>💡 Dica: Você pode comparar qualquer componente diretamente do catálogo clicando no botão "Comparar".</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
