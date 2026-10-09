import React, { useEffect, useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  Gamepad2, 
  Globe, 
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { BuildSelection } from '../types/pc';
import { SafeExternalLink } from './SafeExternalLink';
import { performClientHeuristicAnalysis, BuildAuditResult } from '../utils/aiAnalysisHeuristic';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  parts: BuildSelection;
  totalCash: number;
  totalWattage: number;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  parts,
  totalCash,
  totalWattage,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<BuildAuditResult | null>(null);
  const [groundingSources, setGroundingSources] = useState<Array<{ title: string; url: string }>>([]);

  useEffect(() => {
    if (!isOpen) return;

    // Generate immediate client-side heuristic audit (instant, 100% reliable)
    const localResult = performClientHeuristicAnalysis(parts, totalCash, totalWattage);
    setAnalysisData(localResult);

    // Optional background enrichment if API route responds within 2.5 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const tryApiEnhance = async () => {
      try {
        const res = await fetch('/api/ai/analyze-build', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            build: parts,
            totalPrice: totalCash,
            totalWattage,
          }),
          signal: controller.signal,
        });

        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json?.groundingSources) && json.groundingSources.length > 0) {
            setGroundingSources(json.groundingSources);
          }
          if (json?.analysis && json.analysis.summary) {
            setAnalysisData((prev) => ({
              ...prev!,
              ...json.analysis,
              compatibilityDetails: prev?.compatibilityDetails || [],
              fpsEstimates: prev?.fpsEstimates || [],
            }));
          }
        }
      } catch (e) {
        // Silently keep heuristic results
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    tryApiEnhance();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [isOpen, parts, totalCash, totalWattage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">Auditoria de Compatibilidade & IA</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  Verificação em Tempo Real
                </span>
              </div>
              <p className="text-xs text-slate-400">Análise de Soquete, Memória, Gargalo e Dimensionamento de Fonte</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {analysisData && (
            <>
              {/* Score & Bottleneck Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Equilíbrio da Build
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      analysisData.compatibilityStatus === 'Compatível'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}>
                      {analysisData.compatibilityStatus}
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white">
                    {analysisData.bottleneckRating}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                    {analysisData.summary}
                  </p>
                </div>

                <div className="flex items-center sm:flex-col justify-center p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 min-w-[90px] self-stretch sm:self-auto">
                  <div className="text-3xl font-black font-mono">{analysisData.score}</div>
                  <div className="text-[9px] uppercase font-bold tracking-widest text-blue-300">
                    Nota / 100
                  </div>
                </div>
              </div>

              {/* Critical Compatibility Issues (if any) */}
              {analysisData.compatibilityDetails && analysisData.compatibilityDetails.length > 0 && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Atenção: Incompatibilidades Detectadas</span>
                  </div>
                  {analysisData.compatibilityDetails.map((issue, idx) => (
                    <div key={idx} className="text-red-200 pl-5 text-xs">
                      • {issue}
                    </div>
                  ))}
                </div>
              )}

              {/* Strengths */}
              {analysisData.strengths && analysisData.strengths.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pontos Fortes da Configuração</span>
                  </h4>
                  <div className="space-y-1.5">
                    {analysisData.strengths.map((str, i) => (
                      <div key={i} className="text-xs text-slate-200 bg-white/[0.02] p-2.5 rounded-xl border border-white/5 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 font-bold shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {analysisData.recommendations && analysisData.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Dicas & Upgrades Recomendados</span>
                  </h4>
                  <div className="space-y-1.5">
                    {analysisData.recommendations.map((rec, i) => (
                      <div key={i} className="text-xs text-slate-200 bg-white/[0.02] p-2.5 rounded-xl border border-white/5 flex items-start gap-2">
                        <span className="text-cyan-400 shrink-0">💡</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PSU Analysis */}
              {analysisData.psuHeadroomAnalysis && (
                <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-100 mb-0.5">Dimensionamento Elétrico da Fonte:</div>
                    <div className="text-slate-300">{analysisData.psuHeadroomAnalysis}</div>
                  </div>
                </div>
              )}

              {/* FPS Estimates */}
              {analysisData.fpsEstimates && analysisData.fpsEstimates.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Estimativa de Desempenho em Jogos Populares</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {analysisData.fpsEstimates.map((game, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                        <div className="text-[11px] font-medium text-slate-400 truncate">{game.game}</div>
                        <div className="text-sm font-black font-mono text-emerald-400 mt-0.5">{game.fps}</div>
                        <div className="text-[10px] text-slate-500 truncate">{game.preset}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grounding Sources (if loaded) */}
              {groundingSources.length > 0 && (
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px]">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Fontes do Google Search Grounding:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {groundingSources.slice(0, 4).map((source, sIdx) => (
                      <SafeExternalLink
                        key={sIdx}
                        href={source.url}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-emerald-500/20 text-slate-200 border border-white/10"
                      >
                        <span className="truncate max-w-[180px]">{source.title || 'Referência'}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </SafeExternalLink>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-6 border-t border-white/10 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
