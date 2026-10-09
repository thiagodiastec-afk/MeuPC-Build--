import React, { useState } from 'react';
import { 
  CreditCard, 
  Banknote, 
  Sparkles, 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  Store,
  Flame,
  ChevronDown,
  ChevronUp,
  Radio,
  RefreshCw,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { BuildSelection, SelectedItem } from '../types/pc';
import { getStoreProductUrl, STORE_METAS } from '../utils/storeUrls';
import { SafeExternalLink } from './SafeExternalLink';
import { PriceHistoryChart } from './PriceHistoryChart';

interface PriceSummaryCardProps {
  parts: BuildSelection;
  totalCash: number;
  totalInstallments: number;
  savings: number;
  partsCount: number;
  onOpenShare: () => void;
  onOpenAiAnalysis: () => void;
  onOpenUrlValidator?: () => void;
}

export const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  parts,
  totalCash,
  totalInstallments,
  savings,
  partsCount,
  onOpenShare,
  onOpenAiAnalysis,
  onOpenUrlValidator,
}) => {
  const [expandedStore, setExpandedStore] = useState<string | null>(null);

  // Extract all store links for the "Buy in Stores" breakdown
  const storeGroups = React.useMemo(() => {
    const map = new Map<string, { count: number; totalCash: number; items: { name: string; url: string; price: number }[] }>();

    Object.values(parts).forEach(itemOrList => {
      if (!itemOrList) return;
      const items = Array.isArray(itemOrList) ? itemOrList : [itemOrList];
      items.forEach((item: SelectedItem) => {
        const lowestStore = item.component.stores.find(s => s.isLowest) || item.component.stores[0];
        const storeName = item.selectedStore || lowestStore?.storeName || 'Kabum';
        const price = item.customPriceCash ?? item.component.lowestPriceCash;
        const qty = item.quantity || 1;
        const url = getStoreProductUrl(storeName, item.component.name, lowestStore?.url, item.component.id);

        if (!map.has(storeName)) {
          map.set(storeName, { count: 0, totalCash: 0, items: [] });
        }
        const g = map.get(storeName)!;
        g.count += qty;
        g.totalCash += price * qty;
        g.items.push({ name: item.component.name, url, price: price * qty });
      });
    });

    return Array.from(map.entries());
  }, [parts]);

  return (
    <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl sticky top-24 print-summary-card">
      <h3 className="text-base font-extrabold text-white print:text-slate-900 flex items-center justify-between mb-4">
        <span>Resumo dos Valores</span>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 font-semibold backdrop-blur-md print:bg-slate-100 print:text-slate-800 print:border-slate-300">
          {partsCount} {partsCount === 1 ? 'item' : 'itens'}
        </span>
      </h3>

      {/* Main Total à Vista */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-4 print-summary-box">
        <div className="flex items-center justify-between text-xs text-slate-400 print:text-slate-700 font-medium mb-1">
          <span className="flex items-center gap-1.5 text-blue-400 print:text-blue-700 font-semibold">
            <Banknote className="w-4 h-4" />
            Total à Vista (PIX / Boleto)
          </span>
          <span className="text-blue-400 print:text-blue-800 font-bold bg-blue-500/10 print:bg-blue-50 px-2 py-0.5 rounded-md border border-blue-500/20 print:border-blue-200">
            Melhor Preço
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-black font-mono text-blue-400 print-total-cash tracking-tight">
          R$ {totalCash.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        {savings > 0 && (
          <div className="text-[11px] text-slate-400 print:text-slate-600 mt-1 flex items-center gap-1">
            <span>Você economiza</span>
            <strong className="text-emerald-400 print:text-emerald-700 font-mono font-bold">
              R$ {savings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
            <span>pagando à vista!</span>
          </div>
        )}
      </div>

      {/* Total a Prazo */}
      <div className="flex items-center justify-between text-xs py-2 border-b border-white/10 print:border-slate-200 text-slate-300 print:text-slate-800">
        <span className="flex items-center gap-1.5 text-slate-400 print:text-slate-600">
          <CreditCard className="w-3.5 h-3.5" />
          Total a Prazo (Cartão de Crédito)
        </span>
        <span className="font-mono font-bold text-slate-100 print:text-slate-900 print-total-inst">
          R$ {totalInstallments.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Installments Simulation */}
      <div className="flex items-center justify-between text-xs py-2 border-b border-white/10 print:border-slate-200 text-slate-400 print:text-slate-600">
        <span>Parcelamento sugerido:</span>
        <span className="font-mono font-semibold text-slate-200 print:text-slate-800">
          12x de R$ {(totalInstallments / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Store Breakdown Checklist */}
      {storeGroups.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10 print:border-slate-200">
          <div className="text-xs font-bold text-slate-300 print:text-slate-900 mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-cyan-400 print:text-blue-700" />
              <span>Onde Comprar (Melhores Lojas)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-normal no-print">Clique para ver as peças</span>
          </div>

          <div className="space-y-2">
            {storeGroups.map(([storeName, data]) => {
              const isExpanded = expandedStore === storeName;
              return (
                <div
                  key={storeName}
                  className="rounded-xl border border-white/10 print:border-slate-200 bg-white/[0.03] print:bg-slate-50 backdrop-blur-md overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedStore(isExpanded ? null : storeName)}
                    className="flex items-center justify-between text-xs p-2.5 hover:bg-white/[0.05] cursor-pointer transition-all select-none print:cursor-default"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-slate-400 no-print">
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-blue-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-200 print:text-slate-900 flex items-center gap-1.5">
                          <span>{storeName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 print:bg-slate-200 text-blue-400 print:text-slate-800 font-medium">
                            {data.count} {data.count === 1 ? 'peça' : 'peças'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-blue-400 print:text-blue-700">
                        R$ {data.totalCash.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Items with Direct Store Links on screen */}
                  {isExpanded && (
                    <div className="px-3 pb-2.5 pt-1 border-t border-white/5 space-y-1.5 bg-black/20 no-print">
                      {data.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex items-center justify-between text-[11px] gap-2 py-1 border-b border-white/5 last:border-0"
                        >
                          <span className="text-slate-300 truncate max-w-[170px] sm:max-w-[200px]" title={item.name}>
                            {item.name}
                          </span>
                          <SafeExternalLink
                            id={`summary-buy-link-${itemIdx}`}
                            href={item.url}
                            fallbackStore={storeName}
                            fallbackProductName={item.name}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/20 transition-all shrink-0"
                            title={`Comprar ${item.name} na loja ${storeName} (Abre em nova aba com URL formatada com encodeURIComponent)`}
                          >
                            <span>Comprar na Loja</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </SafeExternalLink>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Price History & Variation Trend Chart (Recharts) */}
      <div className="no-print">
        <PriceHistoryChart
          parts={parts}
          totalCash={totalCash}
          totalInstallments={totalInstallments}
          partsCount={partsCount}
        />
      </div>

      {/* Action Buttons - Hidden during printing */}
      <div className="mt-5 space-y-2.5 no-print">
        <button
          id="summary-ai-analyze-btn"
          onClick={onOpenAiAnalysis}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 transition-all backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Analisar Gargalos & Compatibilidade (IA)</span>
        </button>

        {onOpenUrlValidator && (
          <button
            id="summary-url-validator-btn"
            onClick={onOpenUrlValidator}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition-all backdrop-blur-md"
            title="Verificar se todas as URLs de compra estão no padrão correto sem risco de 404"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auditar Links de Lojas (Anti-404)</span>
          </button>
        )}

        <button
          id="summary-share-btn"
          onClick={onOpenShare}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartilhar ou Salvar Lista</span>
        </button>
      </div>

    </div>
  );
};
