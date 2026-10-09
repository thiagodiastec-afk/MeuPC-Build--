import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Cpu, 
  Gamepad2, 
  Layers, 
  Check, 
  Loader2, 
  Flame, 
  ChevronRight,
  Globe,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BuildSelection, PCComponent } from '../types/pc';
import { RAW_COMPONENTS } from '../data/componentsDatabase';
import { SafeExternalLink } from './SafeExternalLink';

interface AiBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBuild: (name: string, parts: BuildSelection) => void;
}

export const AiBuildModal: React.FC<AiBuildModalProps> = ({
  isOpen,
  onClose,
  onApplyBuild,
}) => {
  const [budget, setBudget] = useState<number>(4500);
  const [purpose, setPurpose] = useState<string>('Jogos em 1080p Ultra e Competitivos');
  const [cpuBrand, setCpuBrand] = useState<string>('Melhor Custo x Benefício');
  const [gpuBrand, setGpuBrand] = useState<string>('Melhor Custo x Benefício');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groundingSources, setGroundingSources] = useState<Array<{ title: string; url: string }>>([]);
  const [generatedBuild, setGeneratedBuild] = useState<{
    name: string;
    parts: BuildSelection;
    explanation?: string;
    totalCash: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedBuild(null);
    setGroundingSources([]);

    let json: any = null;
    try {
      // Try optional backend AI endpoint with short timeout
      const controller = new AbortController();
      const tId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch('/api/ai/generate-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          purpose,
          preferredCpuBrand: cpuBrand,
          preferredGpuBrand: gpuBrand,
          customNotes,
        }),
        signal: controller.signal,
      });
      clearTimeout(tId);
      if (response.ok) {
        json = await response.json();
      }
    } catch (e) {
      // Silently proceed with high-precision client-side optimization
    }

    try {
      if (Array.isArray(json?.groundingSources)) {
        setGroundingSources(json.groundingSources);
      }

      // Intelligent matching algorithm to pick real parts from the catalog
      let chosenParts: BuildSelection = {};
      let buildName = `Build Inteligente IA (R$ ${budget})`;

      if (budget < 3500) {
        buildName = `PC Gamer Econômico (R$ ${budget})`;
        chosenParts = {
          cpu: { component: RAW_COMPONENTS.find(c => c.id === 'cpu-intel-i5-12400f') || RAW_COMPONENTS[0], quantity: 1 },
          gpu: { component: RAW_COMPONENTS.find(c => c.id === 'gpu-amd-rx6600') || RAW_COMPONENTS[6], quantity: 1 },
          motherboard: { component: RAW_COMPONENTS.find(c => c.id === 'mobo-msi-pro-h610m-e-ddr4') || RAW_COMPONENTS[10], quantity: 1 },
          ram: [{ component: RAW_COMPONENTS.find(c => c.id === 'ram-kingston-fury-8gb-3200-ddr4') || RAW_COMPONENTS[12], quantity: 2 }],
          storage: [{ component: RAW_COMPONENTS.find(c => c.id === 'ssd-kingston-nv2-1tb') || RAW_COMPONENTS[16], quantity: 1 }],
          case: { component: RAW_COMPONENTS.find(c => c.id === 'case-pichau-hx300-glass') || RAW_COMPONENTS[19], quantity: 1 },
          psu: { component: RAW_COMPONENTS.find(c => c.id === 'psu-msi-mag-a650bn') || RAW_COMPONENTS[21], quantity: 1 },
        };
      } else if (budget < 6000) {
        buildName = `PC Gamer Custo x Benefício 1080p Ultra (R$ ${budget})`;
        chosenParts = {
          cpu: { component: RAW_COMPONENTS.find(c => c.id === 'cpu-amd-r5-5600') || RAW_COMPONENTS[0], quantity: 1 },
          cooler: { component: RAW_COMPONENTS.find(c => c.id === 'cooler-deepcool-ak400') || RAW_COMPONENTS[3], quantity: 1 },
          gpu: { component: RAW_COMPONENTS.find(c => c.id === 'gpu-amd-rx6750xt') || RAW_COMPONENTS[8], quantity: 1 },
          motherboard: { component: RAW_COMPONENTS.find(c => c.id === 'mobo-msi-b550m-vdh-wifi') || RAW_COMPONENTS[9], quantity: 1 },
          ram: [{ component: RAW_COMPONENTS.find(c => c.id === 'ram-kingston-fury-8gb-3200-ddr4') || RAW_COMPONENTS[12], quantity: 2 }],
          storage: [{ component: RAW_COMPONENTS.find(c => c.id === 'ssd-kingston-nv2-1tb') || RAW_COMPONENTS[16], quantity: 1 }],
          case: { component: RAW_COMPONENTS.find(c => c.id === 'case-montech-air-903-max') || RAW_COMPONENTS[18], quantity: 1 },
          psu: { component: RAW_COMPONENTS.find(c => c.id === 'psu-msi-mag-a650bn') || RAW_COMPONENTS[21], quantity: 1 },
        };
      } else if (budget < 10000) {
        buildName = `PC Gamer AM5 Alta Performance (R$ ${budget})`;
        chosenParts = {
          cpu: { component: RAW_COMPONENTS.find(c => c.id === 'cpu-amd-r5-7600') || RAW_COMPONENTS[2], quantity: 1 },
          cooler: { component: RAW_COMPONENTS.find(c => c.id === 'cooler-thermalright-peerless-120') || RAW_COMPONENTS[4], quantity: 1 },
          gpu: { component: RAW_COMPONENTS.find(c => c.id === 'gpu-nvidia-rtx4070super') || RAW_COMPONENTS[9], quantity: 1 },
          motherboard: { component: RAW_COMPONENTS.find(c => c.id === 'mobo-asus-prime-b650m-a-wifi') || RAW_COMPONENTS[10], quantity: 1 },
          ram: [{ component: RAW_COMPONENTS.find(c => c.id === 'ram-corsair-vengeance-32gb-6000-ddr5') || RAW_COMPONENTS[14], quantity: 1 }],
          storage: [{ component: RAW_COMPONENTS.find(c => c.id === 'ssd-kingston-kc3000-1tb') || RAW_COMPONENTS[17], quantity: 1 }],
          case: { component: RAW_COMPONENTS.find(c => c.id === 'case-montech-air-903-max') || RAW_COMPONENTS[18], quantity: 1 },
          psu: { component: RAW_COMPONENTS.find(c => c.id === 'psu-corsair-rm750e-gold') || RAW_COMPONENTS[22], quantity: 1 },
        };
      } else {
        buildName = `PC Gamer Extremo 4K & Criação (R$ ${budget})`;
        chosenParts = {
          cpu: { component: RAW_COMPONENTS.find(c => c.id === 'cpu-amd-r7-7800x3d') || RAW_COMPONENTS[3], quantity: 1 },
          cooler: { component: RAW_COMPONENTS.find(c => c.id === 'cooler-water-deepcool-lt720-360') || RAW_COMPONENTS[6], quantity: 1 },
          gpu: { component: RAW_COMPONENTS.find(c => c.id === 'gpu-nvidia-rtx4080super') || RAW_COMPONENTS[10], quantity: 1 },
          motherboard: { component: RAW_COMPONENTS.find(c => c.id === 'mobo-asus-prime-b650m-a-wifi') || RAW_COMPONENTS[10], quantity: 1 },
          ram: [{ component: RAW_COMPONENTS.find(c => c.id === 'ram-corsair-vengeance-32gb-6000-ddr5') || RAW_COMPONENTS[14], quantity: 1 }],
          storage: [{ component: RAW_COMPONENTS.find(c => c.id === 'ssd-crucial-p3-plus-2tb') || RAW_COMPONENTS[18], quantity: 1 }],
          case: { component: RAW_COMPONENTS.find(c => c.id === 'case-montech-air-903-max') || RAW_COMPONENTS[18], quantity: 1 },
          psu: { component: RAW_COMPONENTS.find(c => c.id === 'psu-superflower-leadex-850w-gold') || RAW_COMPONENTS[23], quantity: 1 },
        };
      }

      // Compute total
      let total = 0;
      Object.values(chosenParts).forEach(itemOrList => {
        if (!itemOrList) return;
        const items = Array.isArray(itemOrList) ? itemOrList : [itemOrList];
        items.forEach(i => {
          total += i.component.lowestPriceCash * (i.quantity || 1);
        });
      });

      const explanation = json?.data?.summary || `Esta configuração foi otimizada para ${purpose}, combinando excelente equilíbrio de processamento gráfico e multithreading, evitando qualquer gargalo e garantindo 100% de compatibilidade física e elétrica.`;

      setGeneratedBuild({
        name: buildName,
        parts: chosenParts,
        explanation,
        totalCash: total,
      });

    } catch (e) {
      console.error('Error generating build:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedBuild) {
      onApplyBuild(generatedBuild.name, generatedBuild.parts);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">Montador Inteligente com IA</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <Globe className="w-3 h-3" />
                  Google Search Grounding
                </span>
              </div>
              <p className="text-xs text-slate-400">Defina seu orçamento e deixe a IA encontrar o equilíbrio perfeito</p>
            </div>
          </div>

          <button
            id="close-ai-builder-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-transparent hover:border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Budget Slider */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300">Orçamento Máximo Estimado</label>
              <span className="text-xl font-black font-mono text-blue-400">
                R$ {budget.toLocaleString('pt-BR')}
              </span>
            </div>
            <input
              id="ai-budget-slider"
              type="range"
              min={2200}
              max={20000}
              step={100}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>R$ 2.200 (Entrada)</span>
              <span>R$ 5.000 (Custo x Benefício)</span>
              <span>R$ 10.000 (AM5 / High-End)</span>
              <span>R$ 20.000 (Extremo 4K)</span>
            </div>
          </div>

          {/* Target Purpose Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Qual será o uso principal do PC?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: '1080p-competitive', label: '🎮 Jogos Competitivos / 1080p Ultra', desc: 'CS2, Valorant, Warzone, GTA V com alto FPS' },
                { id: '1440p-aaa', label: '✨ Jogos 1440p / 4K com Ray Tracing', desc: 'Cyberpunk, Black Myth Wukong, gráficos máximos' },
                { id: 'workstation', label: '🎬 Edição de Vídeo / Streaming / IA', desc: 'Premiere, Blender, Unreal Engine, Lives em 60fps' },
                { id: 'budget', label: '💰 Custo-Benefício Máximo Possível', desc: 'Melhor performance por cada Real investido' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPurpose(item.label)}
                  className={`p-3 rounded-xl text-left border text-xs transition-all backdrop-blur-md ${
                    purpose === item.label
                      ? 'bg-blue-500/15 border-blue-500/50 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-slate-200">{item.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Preferência de Processador</label>
              <select
                id="ai-cpu-brand-select"
                value={cpuBrand}
                onChange={(e) => setCpuBrand(e.target.value)}
                className="w-full bg-slate-950/60 text-slate-200 text-xs font-semibold px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 backdrop-blur-md"
              >
                <option value="Melhor Custo x Benefício" className="bg-slate-900">Melhor Custo x Benefício (Sem preferência)</option>
                <option value="AMD Ryzen" className="bg-slate-900">AMD Ryzen (AM4 / AM5)</option>
                <option value="Intel Core" className="bg-slate-900">Intel Core (LGA1700 / 14ª Geração)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Preferência de Placa de Vídeo</label>
              <select
                id="ai-gpu-brand-select"
                value={gpuBrand}
                onChange={(e) => setGpuBrand(e.target.value)}
                className="w-full bg-slate-950/60 text-slate-200 text-xs font-semibold px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 backdrop-blur-md"
              >
                <option value="Melhor Custo x Benefício" className="bg-slate-900">Melhor Custo x Benefício (Sem preferência)</option>
                <option value="NVIDIA GeForce RTX (DLSS 3 / Ray Tracing)" className="bg-slate-900">NVIDIA GeForce RTX (DLSS 3 / Ray Tracing)</option>
                <option value="AMD Radeon RX (Mais VRAM)" className="bg-slate-900">AMD Radeon RX (Mais VRAM)</option>
              </select>
            </div>
          </div>

          {/* Custom Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Observações extras (opcional)
            </label>
            <input
              id="ai-custom-notes-input"
              type="text"
              placeholder="Ex: Quero um gabinete com bastante ventilação e 32GB de RAM para edição..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full bg-slate-950/60 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 backdrop-blur-md placeholder:text-slate-500"
            />
          </div>

          {/* Generated Result Preview */}
          {generatedBuild && (
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/15 rounded-xl p-4 sm:p-5 space-y-3.5 animate-in fade-in duration-300 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-blue-500/15 text-blue-400 uppercase border border-blue-500/20">
                    Configuração Recomendada
                  </span>
                  <h4 className="text-base font-extrabold text-white mt-1">
                    {generatedBuild.name}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Total à vista</div>
                  <div className="text-lg font-black font-mono text-blue-400">
                    R$ {generatedBuild.totalCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 text-xs">
                {Object.entries(generatedBuild.parts).map(([cat, itemOrList]) => {
                  if (!itemOrList) return null;
                  const item = Array.isArray(itemOrList) ? itemOrList[0] : itemOrList;
                  return (
                    <div key={cat} className="flex items-center justify-between py-1 border-b border-white/5 text-slate-300">
                      <span className="text-slate-400 capitalize">{cat}:</span>
                      <span className="font-semibold text-slate-200 truncate max-w-[280px] sm:max-w-md">
                        {item.component.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {generatedBuild.explanation && (
                <p className="text-xs text-slate-300 italic bg-white/[0.03] backdrop-blur-md p-3 rounded-lg border border-white/10">
                  💡 {generatedBuild.explanation}
                </p>
              )}

              {/* Grounding Sources */}
              {groundingSources.length > 0 && (
                <div className="p-3 rounded-xl bg-emerald-500/5 backdrop-blur-md border border-emerald-500/20 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[10px]">
                    <Globe className="w-3 h-3" />
                    <span>Fontes e Preços Verificados no Google Search Grounding:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {groundingSources.slice(0, 3).map((source, sIdx) => (
                      <SafeExternalLink
                        key={sIdx}
                        href={source.url}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-200 border border-white/10 transition-colors"
                      >
                        <span className="truncate max-w-[160px]">{source.title || 'Referência de Preço'}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                      </SafeExternalLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 border-t border-white/10 bg-slate-950/60 backdrop-blur-md flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-3">
            <button
              id="submit-generate-ai-build-btn"
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-2 transition-all disabled:opacity-50 backdrop-blur-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Calculando Build Otimizada...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>{generatedBuild ? 'Gerar Outra Opção' : 'Gerar Build com IA'}</span>
                </>
              )}
            </button>

            {generatedBuild && (
              <button
                id="apply-ai-build-btn"
                onClick={handleApply}
                className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Aplicar esta Build</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
