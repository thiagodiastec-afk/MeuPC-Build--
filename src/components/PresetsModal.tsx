import React from 'react';
import { 
  X, 
  Layers, 
  Check, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  Gamepad2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PresetBuild, BuildSelection } from '../types/pc';
import { PRESET_BUILDS } from '../data/presets';
import { RAW_COMPONENTS } from '../data/componentsDatabase';
import { createFallbackComponent } from '../utils/componentFallbacks';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (name: string, parts: BuildSelection) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  const handleApplyPreset = (preset: PresetBuild) => {
    const parts: BuildSelection = {};
    const findComp = (id?: string) => (id ? (RAW_COMPONENTS.find(c => c.id === id) || createFallbackComponent(id)) : undefined);

    if (preset.componentIds.cpu) {
      const c = findComp(preset.componentIds.cpu);
      if (c) parts.cpu = { component: c, quantity: 1 };
    }
    if (preset.componentIds.cooler) {
      const c = findComp(preset.componentIds.cooler);
      if (c) parts.cooler = { component: c, quantity: 1 };
    }
    if (preset.componentIds.gpu) {
      const c = findComp(preset.componentIds.gpu);
      if (c) parts.gpu = { component: c, quantity: 1 };
    }
    if (preset.componentIds.motherboard) {
      const c = findComp(preset.componentIds.motherboard);
      if (c) parts.motherboard = { component: c, quantity: 1 };
    }
    if (preset.componentIds.ram) {
      const c = findComp(preset.componentIds.ram.id);
      if (c) parts.ram = [{ component: c, quantity: preset.componentIds.ram.quantity }];
    }
    if (preset.componentIds.storage) {
      parts.storage = preset.componentIds.storage.map(s => {
        const c = findComp(s.id);
        return c ? { component: c, quantity: s.quantity } : null;
      }).filter(Boolean) as any;
    }
    if (preset.componentIds.case) {
      const c = findComp(preset.componentIds.case);
      if (c) parts.case = { component: c, quantity: 1 };
    }
    if (preset.componentIds.psu) {
      const c = findComp(preset.componentIds.psu);
      if (c) parts.psu = { component: c, quantity: 1 };
    }
    if (preset.componentIds.monitor) {
      const c = findComp(preset.componentIds.monitor);
      if (c) parts.monitor = { component: c, quantity: 1 };
    }

    onSelectPreset(preset.title, parts);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Builds Prontas & Recomendadas</h2>
              <p className="text-xs text-slate-400">Configurações balanceadas e testadas pela comunidade e especialistas</p>
            </div>
          </div>

          <button
            id="close-presets-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-transparent hover:border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets List */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_BUILDS.map((preset) => (
            <div
              key={preset.id}
              className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-blue-500/40 hover:bg-white/[0.06] rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {preset.tier}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Alvo: <strong className="text-slate-200">{preset.targetResolution}</strong>
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white group-hover:text-blue-400 transition-colors">
                  {preset.title}
                </h3>
                <p className="text-xs text-blue-400/90 font-medium mt-0.5">
                  {preset.subtitle}
                </p>

                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Preço estimado à vista</div>
                  <div className="text-lg font-black font-mono text-blue-400">
                    R$ {preset.approxPriceCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <button
                  id={`apply-preset-${preset.id}`}
                  onClick={() => handleApplyPreset(preset)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Carregar Build</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-slate-950/60 backdrop-blur-md flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
