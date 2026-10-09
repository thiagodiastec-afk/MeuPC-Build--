import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  Gamepad2, 
  PieChart, 
  Flame, 
  Trophy, 
  Tv,
  CheckCircle2
} from 'lucide-react';
import { BuildSelection, SelectedItem } from '../types/pc';
import { estimateGamePerformance } from '../utils/gamePerformance';

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  parts: BuildSelection;
  totalCash: number;
  onOpenGameBuilder?: (gameId?: string) => void;
}

export const PerformanceModal: React.FC<PerformanceModalProps> = ({
  isOpen,
  onClose,
  parts,
  totalCash,
  onOpenGameBuilder,
}) => {
  const [selectedResolution, setSelectedResolution] = useState<'1080p' | '1440p' | '4k'>('1080p');

  if (!isOpen) return null;

  const benchmarks = estimateGamePerformance(parts);
  const cpu = (parts.cpu as SelectedItem | undefined)?.component;
  const gpu = (parts.gpu as SelectedItem | undefined)?.component;

  // Calculate budget allocation percentages
  const budgetShares: { name: string; cost: number; percent: number; color: string }[] = [];
  const colorPalette = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-teal-500'];

  let colorIdx = 0;
  Object.entries(parts).forEach(([category, itemOrList]) => {
    if (!itemOrList) return;
    const items = Array.isArray(itemOrList) ? itemOrList : [itemOrList];
    let catCost = 0;
    items.forEach(i => {
      catCost += (i.customPriceCash ?? i.component.lowestPriceCash) * (i.quantity || 1);
    });
    if (catCost > 0 && totalCash > 0) {
      budgetShares.push({
        name: category.toUpperCase(),
        cost: catCost,
        percent: Math.round((catCost / totalCash) * 100),
        color: colorPalette[colorIdx % colorPalette.length],
      });
      colorIdx++;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Desempenho Estimado em Jogos</h2>
              <p className="text-xs text-slate-400">
                Simulação de FPS médios baseados no conjunto {cpu?.name || 'CPU'} + {gpu?.name || 'Placa Gráfica'}
              </p>
            </div>
          </div>

          <button
            id="close-performance-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-transparent hover:border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resolution Tabs */}
        <div className="px-6 py-3 bg-white/[0.02] backdrop-blur-md border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-1">Resolução Alvo:</span>
            {(['1080p', '1440p', '4k'] as const).map((res) => (
              <button
                key={res}
                onClick={() => setSelectedResolution(res)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedResolution === res
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {res === '1080p' ? 'Full HD (1080p)' : res === '1440p' ? 'Quad HD (1440p)' : '4K Ultra HD (2160p)'}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            {gpu ? (
              <span className="text-blue-400 font-semibold">GPU Dedicada detectada</span>
            ) : (
              <span className="text-amber-400 font-semibold">Gráficos Integrados</span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Game FPS Benchmark Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-blue-400" />
              <span>Taxa de Quadros por Segundo (FPS Médio)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {benchmarks.map((game, idx) => {
                const fps = selectedResolution === '1080p'
                  ? game.fps1080p
                  : selectedResolution === '1440p'
                  ? game.fps1440p
                  : game.fps4k;

                const isCompetitive = fps >= 144;
                const isFluid = fps >= 60;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-blue-500/30 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-white">{game.gameName}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 font-semibold">
                          {game.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Preset: {game.setting}</div>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-black font-mono text-white flex items-baseline gap-1">
                          <span className={fps >= 100 ? 'text-blue-400' : fps >= 60 ? 'text-cyan-400' : 'text-amber-400'}>
                            {fps}
                          </span>
                          <span className="text-xs text-slate-400 font-bold">FPS</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isCompetitive ? '⚡ Ultra Fluido (144Hz+)' : isFluid ? '✅ 60+ FPS Suave' : '⚠️ ~30 FPS Jogável'}
                        </div>
                      </div>

                      {/* Visual gauge bar */}
                      <div className="w-28 bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            fps >= 100 ? 'bg-blue-500' : fps >= 60 ? 'bg-cyan-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, (fps / 240) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {onOpenGameBuilder && (
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex justify-end">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenGameBuilder();
                          }}
                          className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                        >
                          <Gamepad2 className="w-3.5 h-3.5" />
                          <span>Ver Setup Ideal para {game.gameName} →</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget Allocation Breakdown */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span>Distribuição do Orçamento por Categoria</span>
            </h3>

            {/* Visual Bar */}
            <div className="h-4 w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden flex mb-3">
              {budgetShares.map((share, i) => (
                <div
                  key={i}
                  className={`${share.color} transition-all`}
                  style={{ width: `${share.percent}%` }}
                  title={`${share.name}: ${share.percent}% (R$ ${share.cost.toFixed(2)})`}
                />
              ))}
            </div>

            {/* Legend pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {budgetShares.map((share, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10">
                  <div className={`w-2.5 h-2.5 rounded-full ${share.color} shrink-0`} />
                  <div className="truncate">
                    <div className="font-bold text-slate-200">{share.name} ({share.percent}%)</div>
                    <div className="text-[10px] text-slate-400 font-mono">R$ {share.cost.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-slate-950/60 backdrop-blur-md flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
