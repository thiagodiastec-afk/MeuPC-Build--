import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Radio, 
  ExternalLink, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  Sparkles, 
  AlertCircle, 
  Store, 
  Zap, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  Globe,
  Tag
} from 'lucide-react';
import { 
  searchLivePrice, 
  LivePriceSearchResult, 
  LiveStoreOffer 
} from '../services/livePricesApi';
import { BuildSelection, ComponentCategory, PCComponent, SelectedItem } from '../types/pc';
import { CATEGORY_INFO, RAW_COMPONENTS } from '../data/componentsDatabase';
import { getStoreProductUrl, getGoogleShoppingUrl } from '../utils/storeUrls';
import { SafeExternalLink } from './SafeExternalLink';

interface LivePriceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialCategory?: ComponentCategory;
  currentBuild: BuildSelection;
  onApplyPrice: (
    category: ComponentCategory,
    priceCash: number,
    priceInstallments: number,
    storeName: string,
    index?: number
  ) => void;
  onAddCustomComponent?: (component: PCComponent) => void;
}

const POPULAR_SEARCH_PRESETS = [
  'Ryzen 7 5700X3D',
  'Ryzen 5 5600',
  'Ryzen 7 7800X3D',
  'RTX 4060 8GB',
  'RTX 4070 SUPER 12GB',
  'RX 6750 XT 12GB',
  'SSD Kingston NV2 1TB',
  'MSI B550M PRO-VDH',
  'Fonte MSI MAG A650BN',
  'Water Cooler Rise Mode 240',
];

export const LivePriceSearchModal: React.FC<LivePriceSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  initialCategory,
  currentBuild,
  onApplyPrice,
  onAddCustomComponent,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | ''>(initialCategory || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LivePriceSearchResult | null>(null);
  const [groundingSources, setGroundingSources] = useState<Array<{ title: string; url: string }>>([]);
  const [verifiedTimestamp, setVerifiedTimestamp] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [searchStep, setSearchStep] = useState<string>('');

  // Extract items from current build for quick chips
  const buildItems = React.useMemo(() => {
    const items: Array<{ category: ComponentCategory; name: string; id: string; cash: number; index?: number }> = [];
    Object.entries(currentBuild).forEach(([cat, val]) => {
      if (!val) return;
      const category = cat as ComponentCategory;
      if (Array.isArray(val)) {
        (val as SelectedItem[]).forEach((it, idx) => {
          items.push({
            category,
            name: it.component.name,
            id: it.component.id,
            cash: it.customPriceCash ?? it.component.lowestPriceCash,
            index: idx,
          });
        });
      } else {
        const item = val as SelectedItem;
        items.push({
          category,
          name: item.component.name,
          id: item.component.id,
          cash: item.customPriceCash ?? item.component.lowestPriceCash,
        });
      }
    });
    return items;
  }, [currentBuild]);

  // Trigger search on initial open if query is provided
  useEffect(() => {
    if (isOpen) {
      setAppliedSuccess(false);
      if (initialQuery) {
        setSearchTerm(initialQuery);
        handleExecuteSearch(initialQuery, initialCategory);
      } else if (buildItems.length > 0 && !result) {
        setSearchTerm(buildItems[0].name);
        setSelectedCategory(buildItems[0].category);
      }
    }
  }, [isOpen, initialQuery, initialCategory]);

  const handleExecuteSearch = async (queryText?: string, cat?: ComponentCategory | '') => {
    const q = (queryText !== undefined ? queryText : searchTerm).trim();
    if (!q) return;

    setIsLoading(true);
    setError(null);
    setAppliedSuccess(false);
    setSearchStep('Conectando ao motor de busca e rastreando lojas brasileiras...');

    try {
      setTimeout(() => setSearchStep('Consultando KaBuM!, Pichau, Terabyte, Amazon BR e Mercado Livre...'), 1200);
      setTimeout(() => setSearchStep('Extraindo menores cotações no PIX e parcelamento no cartão...'), 2800);

      const targetCat = cat !== undefined ? cat : selectedCategory;
      const response = await searchLivePrice(q, targetCat || undefined);

      if (response && response.success && response.data) {
        setResult(response.data);
        setGroundingSources(response.groundingSources || []);
        setVerifiedTimestamp(response.timestamp || new Date().toISOString());
        setError(null);
      } else {
        setError('Não foi possível obter os preços em tempo real no momento, tente novamente em instantes');
      }
    } catch (err: any) {
      setError('Não foi possível obter os preços em tempo real no momento, tente novamente em instantes');
    } finally {
      setIsLoading(false);
      setSearchStep('');
    }
  };

  const handleApplyToBuild = (store: LiveStoreOffer) => {
    // Determine category
    const cat = (selectedCategory || initialCategory || 'cpu') as ComponentCategory;
    
    // Check if there is a matching item in the build
    const matchingBuildItem = buildItems.find(it => 
      it.category === cat || it.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingBuildItem) {
      onApplyPrice(
        matchingBuildItem.category,
        store.priceCash,
        store.priceInstallments,
        store.storeName,
        matchingBuildItem.index
      );
    } else if (onAddCustomComponent) {
      const prodName = result?.productName || searchTerm;
      const matchedComp = RAW_COMPONENTS.find(c => 
        (c.category === cat && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        c.name.toLowerCase() === prodName.toLowerCase()
      );

      if (matchedComp) {
        onAddCustomComponent({
          ...matchedComp,
          lowestPriceCash: store.priceCash,
          lowestPriceInstallments: store.priceInstallments,
          stores: [
            {
              storeName: store.storeName as any,
              priceCash: store.priceCash,
              priceInstallments: store.priceInstallments,
              url: store.url,
              inStock: store.inStock,
            },
            ...matchedComp.stores.filter(s => s.storeName !== store.storeName)
          ]
        });
      } else {
        const newComp: PCComponent = {
          id: `custom-${cat}-${Date.now()}`,
          name: prodName,
          brand: prodName.split(' ')[0] || 'Hardware',
          model: prodName,
          category: cat,
          image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
          lowestPriceCash: store.priceCash,
          lowestPriceInstallments: store.priceInstallments,
          rating: 4.9,
          reviewCount: 20,
          stores: [
            {
              storeName: store.storeName as any,
              priceCash: store.priceCash,
              priceInstallments: store.priceInstallments,
              url: store.url,
              inStock: store.inStock,
            }
          ],
          specs: {
            'Loja Selecionada': store.storeName,
            'Preço à Vista': `R$ ${store.priceCash.toFixed(2)}`,
            'Preço a Prazo': `R$ ${store.priceInstallments.toFixed(2)}`,
          }
        };
        onAddCustomComponent(newComp);
      }
    } else {
      onApplyPrice(
        cat,
        store.priceCash,
        store.priceInstallments,
        store.storeName
      );
    }

    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-blue-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-blue-900/30 overflow-hidden text-slate-100 relative">
        
        {/* Top Glowing Ambient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 animate-pulse" />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between gap-4 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Motor de Pesquisa em Tempo Real
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Web Radar
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pesquisa ativa em tempo real com Google Search Grounding em KaBuM!, Pichau, Terabyte, Amazon BR e Mercado Livre.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Live Search Input Bar */}
          <div className="space-y-3">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteSearch();
              }}
              className="flex flex-col sm:flex-row gap-2.5"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="live-price-search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite o nome do processador, placa de vídeo, SSD, fonte..."
                  className="w-full bg-slate-950/80 border border-white/15 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                  autoFocus
                />
              </div>

              {/* Category Filter Selector */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ComponentCategory)}
                className="bg-slate-950/80 border border-white/15 focus:border-blue-500 rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="">Todas as Categorias</option>
                {Object.entries(CATEGORY_INFO).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.label}</option>
                ))}
              </select>

              <button
                id="execute-live-search-btn"
                type="submit"
                disabled={isLoading || !searchTerm.trim()}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rastreando...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Pesquisar ao Vivo</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Component Shortcuts from Active Build */}
            {buildItems.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-blue-400" /> Na sua build:
                </span>
                {buildItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchTerm(item.name);
                      setSelectedCategory(item.category);
                      handleExecuteSearch(item.name, item.category);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all whitespace-nowrap shrink-0 ${
                      searchTerm === item.name 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold' 
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Mais buscados:
              </span>
              {POPULAR_SEARCH_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchTerm(preset);
                    handleExecuteSearch(preset);
                  }}
                  className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-800/80 hover:bg-blue-500/20 text-slate-400 hover:text-blue-300 border border-white/5 hover:border-blue-500/30 transition-all whitespace-nowrap shrink-0"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Radar Animation State */}
          {isLoading && (
            <div className="p-8 rounded-3xl bg-slate-950/60 border border-blue-500/20 text-center space-y-4 shadow-xl">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-ping" />
                <div className="absolute inset-2 rounded-full border border-cyan-400/40 animate-pulse" />
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/40 text-white">
                  <Radio className="w-6 h-6 animate-spin" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">
                  Rastreando Ofertas no Brasil em Tempo Real...
                </h3>
                <p className="text-xs text-blue-300 font-mono mt-1 animate-pulse">
                  {searchStep || 'Conectando ao motor de pesquisa...'}
                </p>
              </div>

              <div className="flex justify-center items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> KaBuM!</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> TerabyteShop</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Pichau</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Amazon BR</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
                <div>
                  <strong className="font-bold block text-sm text-amber-300">Aviso</strong>
                  <span>{error}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleExecuteSearch()}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Tentar novamente
              </button>
            </div>
          )}

          {/* Applied to Build Banner */}
          {appliedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Preço em tempo real aplicado com sucesso na sua build!</span>
              </div>
              <span className="text-[11px] text-emerald-200">Valores atualizados na tabela</span>
            </div>
          )}

          {/* Live Search Results */}
          {result && !isLoading && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Product Header & Lowest Price Highlight Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                      Resultado da Busca em Tempo Real
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {result.productName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={getGoogleShoppingUrl(result.productName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Comparar no Google Shopping Brasil"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      <span>Google Shopping</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>

                {/* Lowest Price Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-blue-500/20">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">
                      Menor Preço Encontrado (PIX / À Vista)
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                        R$ {result.lowestPriceCash.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        {result.bestStore || 'Menor Oferta'}
                      </span>
                    </div>
                    {result.lowestPriceInstallments > result.lowestPriceCash && (
                      <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                        Economia de R$ {(result.lowestPriceInstallments - result.lowestPriceCash).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({Math.round((1 - result.lowestPriceCash / result.lowestPriceInstallments) * 100)}% OFF no PIX)
                      </div>
                    )}
                  </div>

                  <div className="sm:border-l sm:border-white/10 sm:pl-4">
                    <span className="text-xs text-slate-400 font-medium block">
                      Preço a Prazo (Cartão até 12x)
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl sm:text-2xl font-black text-blue-300 font-mono">
                        R$ {result.lowestPriceInstallments.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        (12x de R$ {(result.lowestPriceInstallments / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Parcelamento no cartão de crédito em até 12x
                    </div>
                  </div>
                </div>

                {/* Timestamp and Accuracy Disclaimer */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>
                      Preço verificado em{' '}
                      <strong className="text-blue-300">
                        {verifiedTimestamp ? new Date(verifiedTimestamp).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR')}
                      </strong>
                    </span>
                  </div>
                  <span className="text-slate-400 italic">
                    Valores sujeitos a alteração e disponibilidade no site do lojista.
                  </span>
                </div>

                {/* Market Analysis Insight */}
                {result.marketAnalysis && (
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-blue-300 font-bold">Análise de Mercado em Tempo Real: </strong>
                      <span>{result.marketAnalysis}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stores Real-Time Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-blue-400" />
                    Cotação por Loja Brasileira (Tempo Real)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {result.stores.length} lojas verificadas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {result.stores.map((store, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        store.isLowest
                          ? 'bg-blue-950/30 border-blue-500/50 shadow-lg shadow-blue-500/10'
                          : 'bg-slate-950/50 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                            store.isLowest ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300'
                          }`}>
                            {store.storeName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm text-white">{store.storeName}</span>
                              {store.isLowest && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                                  Menor Preço
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <span className={`h-1.5 w-1.5 rounded-full ${store.inStock ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                              {store.inStock ? 'Em estoque' : 'Consultar disponibilidade'}
                            </span>
                          </div>
                        </div>

                        {store.badge && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white/5 border border-white/10 text-slate-300">
                            {store.badge}
                          </span>
                        )}
                      </div>

                      {/* Prices */}
                      <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">À Vista (PIX)</span>
                          <span className="text-lg font-black text-emerald-400 font-mono">
                            R$ {store.priceCash.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cartão 12x</span>
                          <span className="text-sm font-bold text-slate-300 font-mono">
                            R$ {store.priceInstallments.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <SafeExternalLink
                          id={`live-store-buy-btn-${idx}`}
                          href={getStoreProductUrl(store.storeName as any, result.productName, store.url)}
                          fallbackStore={store.storeName as any}
                          fallbackProductName={result.productName}
                          className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          title={`Comprar ${result.productName} na loja ${store.storeName} (Abre em nova aba com URL formatada com encodeURIComponent)`}
                        >
                          <span>Comprar na Loja</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </SafeExternalLink>

                        <button
                          onClick={() => handleApplyToBuild(store)}
                          className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-95"
                          title="Atualizar o valor e loja na sua build ativa"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>Aplicar na Build</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grounding Web Sources Citation Links */}
              {groundingSources.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Fontes Web Verificadas em Tempo Real (Google Grounding):</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {groundingSources.map((source, sIdx) => (
                      <SafeExternalLink
                        key={sIdx}
                        href={source.url}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-blue-400 hover:text-blue-300 border border-white/10 flex items-center gap-1 transition-colors truncate max-w-xs"
                      >
                        <span className="truncate">{source.title || source.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </SafeExternalLink>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Preços obtidos via varredura ao vivo da internet.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-semibold transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
