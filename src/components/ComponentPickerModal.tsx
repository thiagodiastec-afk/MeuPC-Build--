import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Plus, 
  Check, 
  Store, 
  Zap, 
  AlertCircle,
  Tag,
  ArrowUpDown,
  SlidersHorizontal,
  Scale
} from 'lucide-react';
import { ComponentCategory, PCComponent, BuildSelection } from '../types/pc';
import { CATEGORY_INFO } from '../data/componentsDatabase';
import { POPULAR_CATEGORY_SUGGESTIONS } from '../data/categorySuggestions';
import { HARDWARE_CATALOG, createStoreLinks } from '../data/hardware';
import { StorePriceLinksMenu } from './StorePriceLinksMenu';

interface ComponentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ComponentCategory;
  onSelectComponent: (component: PCComponent) => void;
  currentBuild: BuildSelection;
  onOpenCompare?: (category: ComponentCategory, preselectedComponents: PCComponent[]) => void;
}

export const ComponentPickerModal: React.FC<ComponentPickerModalProps> = ({
  isOpen,
  onClose,
  category,
  onSelectComponent,
  currentBuild,
  onOpenCompare,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('price_asc');
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);

  const categoryMeta = CATEGORY_INFO[category] || { label: 'Componente', description: '' };
  const popularSuggestions = POPULAR_CATEGORY_SUGGESTIONS[category] || [];

  // Filter hardware catalog strictly for the current category
  const categoryComponents = useMemo(() => {
    return HARDWARE_CATALOG.filter((c) => c.category === category);
  }, [category]);

  // Extract unique brands in this category
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    categoryComponents.forEach((c) => {
      if (c.brand) brands.add(c.brand);
    });
    return Array.from(brands);
  }, [categoryComponents]);

  // Filter & Sort
  const filteredComponents = useMemo(() => {
    let list = [...categoryComponents];

    // Filter by Brand
    if (selectedBrand !== 'all') {
      list = list.filter((c) => c.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Filter by Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter((c) => {
        const nameMatch = c.name.toLowerCase().includes(q);
        const brandMatch = c.brand?.toLowerCase().includes(q);
        const modelMatch = c.model?.toLowerCase().includes(q);
        const socketMatch = c.socket?.toLowerCase().includes(q);
        const memMatch = c.memoryType?.toLowerCase().includes(q);
        const specsMatch = c.specs && Object.values(c.specs).some((v) => String(v).toLowerCase().includes(q));
        return nameMatch || brandMatch || modelMatch || socketMatch || memMatch || specsMatch;
      });
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'price_asc') {
        return a.lowestPriceCash - b.lowestPriceCash;
      }
      if (sortBy === 'price_desc') {
        return b.lowestPriceCash - a.lowestPriceCash;
      }
      return (b.rating || 5) - (a.rating || 5);
    });

    return list;
  }, [categoryComponents, selectedBrand, searchTerm, sortBy]);

  if (!isOpen) return null;

  const handleSelect = (component: PCComponent) => {
    setSelectedItemName(component.name);
    onSelectComponent(component);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  // If user searches for a specific custom component not in catalog, allow 1-click addition
  const handleAddCustomSearch = () => {
    if (!searchTerm.trim()) return;
    const cleanName = searchTerm.trim();
    const customComp: PCComponent = {
      id: `custom-${Date.now()}`,
      name: cleanName,
      category,
      brand: cleanName.split(' ')[0] || 'Custom',
      model: cleanName,
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
      lowestPriceCash: 450,
      lowestPriceInstallments: 529.20,
      rating: 4.8,
      reviewCount: 15,
      stores: createStoreLinks(cleanName).map((s, idx) => ({
        storeName: s.storeName,
        priceCash: 450,
        priceInstallments: 529.20,
        url: s.url,
        inStock: true,
        isLowest: idx === 0,
        badge: s.badge
      })),
      specs: {
        'Modelo': cleanName,
        'Busca Dinâmica': 'Preços ao vivo via link direto'
      }
    };
    handleSelect(customComp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Selecionar {categoryMeta.label}
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {filteredComponents.length} {filteredComponents.length === 1 ? 'opção' : 'opções'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{categoryMeta.description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Filters */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-900/80 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Buscar por modelo, marca, soquete (ex: ${popularSuggestions[0] || 'Ryzen'})...`}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Brand Filter */}
            {availableBrands.length > 1 && (
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="all">Todas as Marcas</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            )}

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="price_asc">Menor Preço (PIX)</option>
              <option value="price_desc">Maior Preço</option>
              <option value="rating">Mais Bem Avaliados</option>
            </select>
          </div>

          {/* Quick Category Chips */}
          {popularSuggestions.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1 mr-1">
                <Tag className="w-3 h-3 text-blue-400" />
                Populares:
              </span>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
                  !searchTerm ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                Todos
              </button>
              {popularSuggestions.map((sug) => {
                const isActive = searchTerm.toLowerCase() === sug.toLowerCase();
                return (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setSearchTerm(sug)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {sug}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Components List Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-white/5">
          {filteredComponents.length > 0 ? (
            filteredComponents.map((comp) => {
              const isSelected = selectedItemName === comp.name;

              return (
                <div
                  key={comp.id}
                  className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/10 transition-all group"
                >
                  {/* Left: Image & Specs */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <img
                      src={comp.image}
                      alt={comp.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-800 border border-white/10 shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          {comp.brand || 'Hardware'}
                        </span>
                        {comp.socket && (
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            Soquete {comp.socket}
                          </span>
                        )}
                        {comp.memoryType && (
                          <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                            {comp.memoryType}
                          </span>
                        )}
                        {comp.tdpWattage && (
                          <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" />
                            {comp.tdpWattage}W
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                        {comp.name}
                      </h3>

                      {comp.specs && (
                        <div className="text-[11px] text-slate-400 line-clamp-1 flex items-center gap-2 flex-wrap">
                          {Object.entries(comp.specs).slice(0, 3).map(([key, val]) => (
                            <span key={key} className="bg-slate-800/60 px-1.5 py-0.5 rounded text-slate-300">
                              <strong className="text-slate-400">{key}:</strong> {val}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Prices & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    {/* Price Block */}
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 sm:justify-end">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>À vista no PIX</span>
                      </div>
                      <div className="text-base sm:text-lg font-black font-mono text-emerald-400">
                        R$ {comp.lowestPriceCash.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        ou 10x de R$ {(comp.lowestPriceInstallments / 10).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Deep Store Links Dropdown */}
                      <StorePriceLinksMenu partName={comp.name} buttonVariant="compact" />

                      {/* Select / Add Button */}
                      <button
                        type="button"
                        onClick={() => handleSelect(comp)}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-md ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-600/30'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Adicionado!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Adicionar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Nenhum componente encontrado para "{searchTerm}"</p>
                <p className="text-xs text-slate-400">
                  Deseja adicionar este modelo mesmo assim para pesquisar preços nas lojas?
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCustomSearch}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar "{searchTerm}" à Máquina</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer / Direct Store Link Guarantee */}
        <div className="px-5 py-3 border-t border-white/10 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-cyan-400" />
            <span>Links Diretos de Cotação: KaBuM!, TerabyteShop, Pichau, Amazon BR e Mercado Livre</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Catálogo 100% Client-Side • Zero Cota de API
          </div>
        </div>
      </div>
    </div>
  );
};
