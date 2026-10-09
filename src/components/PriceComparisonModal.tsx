import React, { useMemo, useState } from 'react';
import { X, ExternalLink, ShoppingCart, Search, AlertCircle, CheckCircle2, TrendingDown, History, RefreshCw } from 'lucide-react';
import { PCComponent, StorePrice } from '../types/pc';
import { openSafeExternalUrl } from '../utils/urlManager';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PriceComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: PCComponent | null;
}

const STORE_COLORS: Record<string, string> = {
  'Kabum': 'bg-orange-500',
  'Terabyte': 'bg-red-600',
  'Pichau': 'bg-rose-500',
  'Amazon BR': 'bg-sky-500',
  'Mercado Livre': 'bg-yellow-500',
};

const OFFICIAL_STORES = ['Kabum', 'Terabyte', 'Pichau', 'Amazon BR', 'Mercado Livre'];

export const PriceComparisonModal: React.FC<PriceComparisonModalProps> = ({
  isOpen,
  onClose,
  component,
}) => {
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [verifiedPrices, setVerifiedPrices] = useState<Record<number, { priceCash: number, verified: boolean }>>({});

  const handleVerifyLive = async (idx: number, storeName: string, url: string, currentPrice: number) => {
    setVerifyingId(idx);
    try {
      const response = await fetch('/api/verify-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentName: component.name,
          storeName,
          url,
          currentPrice
        })
      });
      const data = await response.json();
      if (data.success) {
        setVerifiedPrices(prev => ({
          ...prev,
          [idx]: { priceCash: data.verifiedPrice, verified: data.found !== false }
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifyingId(null);
    }
  };

  if (!isOpen || !component) return null;

  const getFallbackUrl = (storeName: string, term: string) => {
    const query = encodeURIComponent(term);
    switch (storeName) {
      case 'Kabum': return `https://www.kabum.com.br/busca/${query}`;
      case 'Terabyte': return `https://www.terabyteshop.com.br/busca?str=${query}`;
      case 'Pichau': return `https://www.pichau.com.br/search?q=${query}`;
      case 'Mercado Livre': return `https://lista.mercadolivre.com.br/${query}`;
      case 'Amazon BR': return `https://www.amazon.com.br/s?k=${query}`;
      default: return `https://www.google.com.br/search?tbm=shop&q=${query}`;
    }
  };

  const comparisonList = useMemo(() => {
    // 1. Get exact matches from the database
    const exactMatches = component.stores.map(store => ({
      ...store,
      isExact: true,
      color: STORE_COLORS[store.storeName] || 'bg-blue-500',
    }));

    // 2. Find missing stores to provide deterministic Buscapé-style search links
    const presentStoreNames = exactMatches.map(s => s.storeName);
    const missingStores = OFFICIAL_STORES.filter(s => !presentStoreNames.includes(s));

    const fallbackMatches = missingStores.map(storeName => ({
      storeName,
      priceCash: 0,
      priceInstallments: 0,
      url: getFallbackUrl(storeName, `${component.brand} ${component.model}`),
      inStock: false,
      isLowest: false,
      isExact: false,
      color: STORE_COLORS[storeName] || 'bg-slate-500',
    }));

    // 3. Sort exactly matched stores by price ascending
    const sortedExact = exactMatches.sort((a, b) => a.priceCash - b.priceCash);
    
    // Tag the new lowest price amongst exact matches
    if (sortedExact.length > 0) {
      sortedExact.forEach(s => s.isLowest = false);
      sortedExact[0].isLowest = true;
    }

    return [...sortedExact, ...fallbackMatches];
  }, [component]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Comparador de Preços</h2>
              <p className="text-xs text-slate-400">Encontre a melhor oferta nas principais lojas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-transparent hover:border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Overview */}
        <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-xl border border-white/10 p-2 shrink-0 flex items-center justify-center overflow-hidden">
            <img src={component.image} alt={component.name} className="w-full h-full object-contain mix-blend-screen" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">{component.brand}</div>
            <h3 className="text-sm sm:text-base font-extrabold text-white truncate">{component.name}</h3>
            <div className="text-xs text-slate-400 mt-1 truncate">{component.model}</div>
          </div>
        </div>

        {/* Price History Chart */}
        {component.priceHistory && component.priceHistory.length > 0 && (
          <div className="p-4 sm:p-6 border-b border-white/10 bg-slate-900/50">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-slate-400" />
              <h4 className="text-sm font-bold text-slate-300">Histórico de Preço (6 Meses)</h4>
            </div>
            <div className="h-32 sm:h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={component.priceHistory} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return d.toLocaleDateString('pt-BR', { month: 'short' });
                    }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickFormatter={(val) => `R$${val}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Preço']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
                  />
                  <Area type="monotone" dataKey="priceCash" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Store List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {comparisonList.map((store, idx) => {
            const isVerifying = verifyingId === idx;
            const verifiedData = verifiedPrices[idx];
            const displayPriceCash = verifiedData?.priceCash || store.priceCash;
            const displayPriceInst = verifiedData?.priceCash ? verifiedData.priceCash * 1.15 : store.priceInstallments;
            
            return (
            <div 
              key={idx}
              className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border backdrop-blur-md transition-all \${
                store.isLowest 
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              {store.isLowest && (
                <div className="absolute -top-3 left-4 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Melhor Preço
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className={`w-2 h-10 rounded-full \${store.color}`} />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {store.storeName}
                    {!store.isExact && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                        Busca Direta
                      </span>
                    )}
                  </h4>
                  {store.isExact ? (
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Em Estoque
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Search className="w-3 h-3" /> Buscar disponibilidade
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                {store.isExact ? (
                  <div className="text-right">
                                        <div className="text-sm sm:text-lg font-black text-emerald-400 flex items-center justify-end gap-2">
                      R$ {displayPriceCash.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {verifiedData?.verified && <CheckCircle2 className="w-4 h-4 text-emerald-500" title="Preço atualizado e verificado ao vivo!" />}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400">
                      à vista no PIX
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      ou R$ {displayPriceInst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} a prazo
                    </div>
                  </div>
                ) : (
                  <div className="text-right text-xs text-slate-400">
                    Preço sob consulta
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  {store.isExact && !verifiedData && (
                    <button
                      onClick={() => handleVerifyLive(idx, store.storeName, store.url as string, store.priceCash)}
                      disabled={isVerifying}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] sm:text-xs transition-all shadow-md bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/30 w-full"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                      {isVerifying ? 'Verificando...' : 'Verificar ao Vivo'}
                    </button>
                  )}
                  <button
                    onClick={() => openSafeExternalUrl(store.url as string)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 shrink-0 ${
                      store.isExact 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20' 
                        : 'bg-white/10 hover:bg-white/20 text-slate-200 shadow-black/20'
                    }`}
                  >
                    {store.isExact ? (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span className="hidden sm:inline">Comprar</span>
                        <span className="sm:hidden">Ir</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Buscar</span>
                      </>
                    )}
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </button>
                </div>
              </div>
            </div>
          )})}
        </div>
        
        {/* Footer info */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 backdrop-blur-md flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Atenção:</strong> Os preços e o estoque nas lojas parceiras podem sofrer alterações a qualquer momento sem aviso prévio. Recomendamos verificar o link da loja para confirmar o valor final antes de fechar sua compra.
          </p>
        </div>

      </div>
    </div>
  );
};
