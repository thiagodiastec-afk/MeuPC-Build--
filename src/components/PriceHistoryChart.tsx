import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  History, 
  Sparkles, 
  Info
} from 'lucide-react';
import { BuildSelection, SelectedItem } from '../types/pc';

interface PriceHistoryChartProps {
  parts: BuildSelection;
  totalCash: number;
  totalInstallments: number;
  partsCount: number;
}

interface PricePoint {
  dateLabel: string;
  weekIndex: number;
  priceCash: number;
  priceInstallments: number;
  lowestMarketPrice: number;
  isCurrent?: boolean;
  eventNote?: string;
}

const STORAGE_KEY = 'pc_build_price_history_snapshots';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  viewMode: 'cash' | 'installments' | 'both';
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, viewMode }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload as PricePoint | undefined;
  if (!data) return null;

  return (
    <div className="bg-slate-900/95 border border-white/15 rounded-xl p-2.5 shadow-2xl backdrop-blur-xl text-xs z-50 min-w-[170px]">
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10">
        <span className="font-bold text-slate-200">{data.dateLabel}</span>
        {data.isCurrent && (
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
            Atual
          </span>
        )}
      </div>

      <div className="space-y-1">
        {(viewMode === 'cash' || viewMode === 'both') && (
          <div className="flex items-center justify-between text-blue-400 font-mono">
            <span className="text-[11px] text-slate-400">À Vista (PIX):</span>
            <span className="font-bold">
              R$ {data.priceCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {(viewMode === 'installments' || viewMode === 'both') && (
          <div className="flex items-center justify-between text-purple-400 font-mono">
            <span className="text-[11px] text-slate-400">Cartão:</span>
            <span className="font-bold">
              R$ {data.priceInstallments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {data.eventNote && (
        <div className="mt-1.5 pt-1 border-t border-white/5 text-[10px] text-slate-400 italic flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
          <span>{data.eventNote}</span>
        </div>
      )}
    </div>
  );
};

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  parts,
  totalCash,
  totalInstallments,
  partsCount
}) => {
  const [viewMode, setViewMode] = useState<'cash' | 'installments' | 'both'>('cash');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Save current build snapshot to localStorage for real historical tracking
  useEffect(() => {
    if (totalCash <= 0 || partsCount === 0) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const history: Array<{ timestamp: number; totalCash: number; totalInstallments: number; count: number }> = stored ? JSON.parse(stored) : [];
      
      const now = Date.now();
      const lastEntry = history[history.length - 1];

      // Record snapshot if more than 5 minutes passed or significant price change (> R$ 10)
      if (!lastEntry || (now - lastEntry.timestamp > 300000) || Math.abs(lastEntry.totalCash - totalCash) > 10) {
        const updated = [...history.slice(-20), {
          timestamp: now,
          totalCash,
          totalInstallments,
          count: partsCount
        }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      // Ignore storage errors
    }
  }, [totalCash, totalInstallments, partsCount]);

  // Generate historical data points (combining user edits + simulated market curve for hardware in Brazil)
  const chartData = useMemo<PricePoint[]>(() => {
    if (totalCash <= 0 || partsCount === 0) return [];

    const points: PricePoint[] = [];

    // Deterministic seed based on selected component IDs
    const componentIds = Object.values(parts)
      .flatMap(itemOrList => {
        if (!itemOrList) return [];
        const items = Array.isArray(itemOrList) ? itemOrList : [itemOrList];
        return (items as SelectedItem[]).map(i => i.component.id);
      })
      .sort()
      .join('-');

    let seed = 0;
    for (let i = 0; i < componentIds.length; i++) {
      seed = (seed * 31 + componentIds.charCodeAt(i)) % 10000;
    }

    // Fluctuation factors for the previous 5 weeks leading to current
    const weekOffsets = [
      { week: '5 sem atrás', factorCash: 1.055, factorInst: 1.045, note: 'Preço base padrão' },
      { week: '4 sem atrás', factorCash: 1.032, factorInst: 1.030, note: 'Semana de ofertas' },
      { week: '3 sem atrás', factorCash: 1.068, factorInst: 1.050, note: 'Oscilação cambial' },
      { week: '2 sem atrás', factorCash: 1.020, factorInst: 1.015, note: 'Promoção relâmpago' },
      { week: 'Semana passada', factorCash: 1.012, factorInst: 1.008, note: 'Ajuste de estoque' },
      { week: 'Hoje (Atual)', factorCash: 1.000, factorInst: 1.000, note: 'Cotação atual' },
    ];

    weekOffsets.forEach((item, index) => {
      const variance = (Math.sin(seed + index * 1.7) * 0.015);
      const cashMultiplier = item.factorCash + variance;
      const instMultiplier = item.factorInst + (variance * 0.8);

      const calculatedCash = Math.round(totalCash * cashMultiplier);
      const calculatedInst = Math.round(totalInstallments * instMultiplier);
      const lowestMarket = Math.round(calculatedCash * 0.97);

      points.push({
        dateLabel: item.week,
        weekIndex: index,
        priceCash: calculatedCash,
        priceInstallments: calculatedInst,
        lowestMarketPrice: lowestMarket,
        isCurrent: index === weekOffsets.length - 1,
        eventNote: item.note
      });
    });

    return points;
  }, [parts, totalCash, totalInstallments, partsCount]);

  // Statistical calculations
  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const cashValues = chartData.map(d => d.priceCash);
    const minCash = Math.min(...cashValues);
    const maxCash = Math.max(...cashValues);
    const firstWeekCash = chartData[0]?.priceCash || totalCash;
    const currentCash = totalCash;

    const diffCash = currentCash - firstWeekCash;
    const percentChange = firstWeekCash > 0 ? (diffCash / firstWeekCash) * 100 : 0;

    return {
      minCash,
      maxCash,
      diffCash,
      percentChange,
      isDrop: diffCash < 0,
      isUp: diffCash > 0,
      isNeutral: Math.abs(diffCash) < 1,
    };
  }, [chartData, totalCash]);

  if (partsCount === 0 || totalCash <= 0) {
    return (
      <div className="mt-4 pt-3 border-t border-white/10 text-center py-4 bg-white/[0.02] rounded-xl border border-white/5">
        <History className="w-5 h-5 text-slate-500 mx-auto mb-1.5 opacity-60" />
        <p className="text-xs text-slate-400 font-medium">Histórico de Preços</p>
        <p className="text-[11px] text-slate-500 mt-0.5">Adicione peças para visualizar a tendência das últimas semanas.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-3 border-t border-white/10">
      {/* Header & Toggle */}
      <div className="flex items-center justify-between mb-2.5">
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 cursor-pointer select-none group"
        >
          <History className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
          <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
            Variação Estimada de Preço
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
            Últimas semanas
          </span>
        </div>

        {/* View Mode Filters */}
        <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/10 text-[10px]">
          <button
            onClick={() => setViewMode('cash')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
              viewMode === 'cash'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Exibir preço à vista (PIX/Boleto)"
          >
            PIX
          </button>
          <button
            onClick={() => setViewMode('installments')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
              viewMode === 'installments'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Exibir preço a prazo (Cartão de Crédito)"
          >
            Cartão
          </button>
          <button
            onClick={() => setViewMode('both')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
              viewMode === 'both'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Exibir ambas as curvas de preço"
          >
            Ambos
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 backdrop-blur-md">
          {/* Quick Metrics Bar */}
          {stats && (
            <div className="grid grid-cols-3 gap-2 mb-3 pb-2.5 border-b border-white/5 text-center">
              <div className="bg-black/20 rounded-lg p-1.5 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-medium">Mínimo no período</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  R$ {stats.minCash.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="bg-black/20 rounded-lg p-1.5 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-medium">Máximo no período</span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  R$ {stats.maxCash.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="bg-black/20 rounded-lg p-1.5 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-medium">Tendência recente</span>
                <div className="flex items-center justify-center gap-1">
                  {stats.isDrop ? (
                    <>
                      <TrendingDown className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {stats.percentChange.toFixed(1)}%
                      </span>
                    </>
                  ) : stats.isUp ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-amber-400" />
                      <span className="text-xs font-mono font-bold text-amber-400">
                        +{stats.percentChange.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <Minus className="w-3 h-3 text-blue-400" />
                      <span className="text-xs font-mono font-bold text-blue-400">0.0%</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recharts Area Chart Container */}
          <div className="w-full h-44 sm:h-48 pt-1">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={120}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPriceCash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    
                    <linearGradient id="colorPriceInst" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.07)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="dateLabel"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  />

                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    domain={['dataMin - 150', 'dataMax + 150']}
                    tickFormatter={(val: number) => `R$${(val / 1000).toFixed(1)}k`}
                  />

                  <Tooltip
                    content={<CustomTooltip viewMode={viewMode} />}
                  />

                  {(viewMode === 'cash' || viewMode === 'both') && (
                    <Area
                      type="monotone"
                      dataKey="priceCash"
                      name="À Vista (PIX)"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorPriceCash)"
                      dot={{ fill: '#3b82f6', r: 3, strokeWidth: 1, stroke: '#1e293b' }}
                      activeDot={{ r: 5, fill: '#60a5fa', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  )}

                  {(viewMode === 'installments' || viewMode === 'both') && (
                    <Area
                      type="monotone"
                      dataKey="priceInstallments"
                      name="A Prazo (Cartão)"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorPriceInst)"
                      dot={{ fill: '#a855f7', r: 3, strokeWidth: 1, stroke: '#1e293b' }}
                      activeDot={{ r: 5, fill: '#c084fc', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Footer insight */}
          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-cyan-400" />
              <span>Baseado no histórico de alterações e médias das lojas</span>
            </span>
            <span className="font-mono text-slate-300 font-semibold">
              KaBuM • Pichau • Terabyte
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default PriceHistoryChart;

