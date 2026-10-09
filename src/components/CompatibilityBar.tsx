import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Info,
  Layers,
  Ruler,
  Cpu,
  Gauge,
  Check
} from 'lucide-react';
import { CompatibilityReport, IssueGranularCategory } from '../types/pc';

interface CompatibilityBarProps {
  report: CompatibilityReport;
  onOpenAiAnalysis: () => void;
}

export const CompatibilityBar: React.FC<CompatibilityBarProps> = ({
  report,
  onOpenAiAnalysis,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | IssueGranularCategory>('all');

  const { isCompatible, hasWarnings, issues, estimatedWattage, recommendedPsuWattage, psuStatus, clearances, bottleneck } = report;

  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;

  const filteredIssues = activeCategory === 'all' 
    ? issues 
    : issues.filter(i => (i.issueCategory || 'structural') === activeCategory);

  const categoryCounts = {
    structural: issues.filter(i => i.issueCategory === 'structural' || !i.issueCategory).length,
    clearance: issues.filter(i => i.issueCategory === 'clearance').length,
    memory: issues.filter(i => i.issueCategory === 'memory').length,
    bottleneck: issues.filter(i => i.issueCategory === 'bottleneck').length,
    power: issues.filter(i => i.issueCategory === 'power').length,
  };

  return (
    <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Left: Status Badge */}
        <div className="flex items-center gap-3.5">
          {isCompatible && !hasWarnings ? (
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : !isCompatible ? (
            <div className="h-11 w-11 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 shrink-0 shadow-lg shadow-red-500/10">
              <XCircle className="w-6 h-6" />
            </div>
          ) : (
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
              <AlertTriangle className="w-6 h-6" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>
                  {isCompatible && !hasWarnings
                    ? 'Compatibilidade: 100% Compatível'
                    : !isCompatible
                    ? `Incompatibilidade Detectada (${errorCount} ${errorCount === 1 ? 'erro' : 'erros'})`
                    : `Avisos de Montagem (${warningCount} ${warningCount === 1 ? 'alerta' : 'alertas'})`}
                </span>
                {isCompatible && !hasWarnings && (
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </h3>

              <button
                id="toggle-issues-details-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10 inline-flex items-center gap-1 font-medium transition-colors backdrop-blur-md"
              >
                {isExpanded ? 'Ocultar diagnóstico' : 'Ver diagnóstico detalhado'}
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-0.5">
              {isCompatible && !hasWarnings
                ? 'Sockets, frequências de RAM, folgas de GPU/Cooler, fonte e equilíbrio de hardware verificados.'
                : !isCompatible
                ? 'Existem peças que não se encaixam fisicamente ou apresentam conflito crítico.'
                : 'Peças funcionam, mas há avisos sobre folga, memórias ou balanceamento.'}
            </p>
          </div>
        </div>

        {/* Center: Power & TDP Gauge */}
        <div className="flex flex-wrap items-center gap-3.5 bg-white/[0.03] backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Consumo Estimado</div>
              <div className="text-sm font-mono font-bold text-blue-400">
                ~{estimatedWattage} W
              </div>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Fonte Sugerida</div>
            <div className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1">
              <span>{recommendedPsuWattage} W+</span>
              {psuStatus === 'optimal' && <span className="text-[10px] text-emerald-300 font-sans font-normal">✅ Ideal</span>}
              {psuStatus === 'tight' && <span className="text-[10px] text-amber-300 font-sans font-normal">⚠️ Justa</span>}
              {psuStatus === 'insufficient' && <span className="text-[10px] text-red-400 font-sans font-normal">❌ Baixa</span>}
            </div>
          </div>

          {bottleneck && (
            <>
              <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Equilíbrio / Gargalo</div>
                <div className="text-sm font-bold text-slate-200 flex items-center gap-1">
                  <span className={bottleneck.score >= 90 ? 'text-emerald-400' : bottleneck.score >= 75 ? 'text-blue-400' : 'text-amber-400'}>
                    {bottleneck.score}%
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-300 font-medium">
                    {bottleneck.idealResolution}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* AI Advisor Trigger */}
          <button
            id="open-ai-analysis-btn"
            onClick={onOpenAiAnalysis}
            className="ml-auto flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Análise IA</span>
          </button>
        </div>

      </div>

      {/* Expandable Diagnostic Panel */}
      {isExpanded && (
        <div className="mt-5 pt-4 border-t border-white/10 space-y-4 animate-in fade-in duration-200">
          
          {/* Quick Metrics Bar (Clearance, RAM & Balance) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* GPU Clearance Metric */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Ruler className="w-3.5 h-3.5 text-blue-400" />
                  Folga da Placa de Vídeo
                </span>
                {clearances?.gpuClearance ? (
                  <span className={`font-mono font-bold text-xs ${
                    clearances.gpuClearance.status === 'exceeded' ? 'text-red-400' :
                    clearances.gpuClearance.status === 'tight' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {clearances.gpuClearance.marginMm >= 0 ? `+${clearances.gpuClearance.marginMm}mm` : `${clearances.gpuClearance.marginMm}mm`}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Sem GPU ou Gabinete</span>
                )}
              </div>
              {clearances?.gpuClearance ? (
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>GPU: {clearances.gpuClearance.gpuLength}mm</span>
                  <span>Gabinete: {clearances.gpuClearance.caseMaxLength}mm</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">Adicione GPU e Gabinete para medir a folga.</p>
              )}
            </div>

            {/* Cooler Height Metric */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Ruler className="w-3.5 h-3.5 text-blue-400" />
                  Altura do Air Cooler
                </span>
                {clearances?.coolerClearance ? (
                  <span className={`font-mono font-bold text-xs ${
                    clearances.coolerClearance.status === 'exceeded' ? 'text-red-400' :
                    clearances.coolerClearance.status === 'tight' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {clearances.coolerClearance.marginMm >= 0 ? `+${clearances.coolerClearance.marginMm}mm` : `${clearances.coolerClearance.marginMm}mm`}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Sem Cooler ou Gabinete</span>
                )}
              </div>
              {clearances?.coolerClearance ? (
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Cooler: {clearances.coolerClearance.coolerHeight}mm</span>
                  <span>Gabinete: {clearances.coolerClearance.caseMaxHeight}mm</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">Adicione Cooler e Gabinete para medir a folga.</p>
              )}
            </div>

            {/* Bottleneck & Gaming Target */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                  Alvo de Resolução
                </span>
                <span className="font-bold text-xs text-blue-400">
                  {bottleneck?.idealResolution || '1080p'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {bottleneck?.summary || 'Equilíbrio padrão do sistema.'}
              </p>
            </div>

          </div>

          {/* Granular Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>Todos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {issues.length}
              </span>
            </button>

            <button
              onClick={() => setActiveCategory('structural')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === 'structural'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>Estrutural & Sockets</span>
              {categoryCounts.structural > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {categoryCounts.structural}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveCategory('clearance')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === 'clearance'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>Folgas Físicas</span>
              {categoryCounts.clearance > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {categoryCounts.clearance}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveCategory('memory')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === 'memory'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>Memória & Frequência</span>
              {categoryCounts.memory > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {categoryCounts.memory}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveCategory('bottleneck')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === 'bottleneck'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>Gargalo & Equilíbrio</span>
              {categoryCounts.bottleneck > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {categoryCounts.bottleneck}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveCategory('power')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeCategory === 'power'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>Energia & Fonte</span>
              {categoryCounts.power > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {categoryCounts.power}
                </span>
              )}
            </button>
          </div>

          {/* Issues List */}
          {filteredIssues.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Nenhum problema ou aviso encontrado nesta categoria. Tudo em perfeita ordem!</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed backdrop-blur-md ${
                    issue.type === 'error'
                      ? 'bg-red-500/10 border-red-500/30 text-red-200'
                      : issue.type === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {issue.type === 'error' ? (
                      <XCircle className="w-4 h-4 text-red-400" />
                    ) : issue.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 font-bold text-sm mb-0.5 flex-wrap">
                      <span>{issue.title}</span>
                      {issue.metric && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 border border-white/10 text-white font-normal">
                          {issue.metric.current} / limite: {issue.metric.limit} ({issue.metric.margin})
                        </span>
                      )}
                    </div>
                    <div className="text-slate-300">{issue.message}</div>
                    {issue.recommendation && (
                      <div className="mt-2 p-2 rounded-lg bg-black/20 border border-white/5 text-[11px] text-slate-300 flex items-start gap-1.5">
                        <span className="font-bold text-blue-400 shrink-0">💡 Sugestão:</span>
                        <span>{issue.recommendation}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

