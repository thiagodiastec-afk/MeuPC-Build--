import React, { useState } from 'react';
import { 
  X, 
  FolderHeart, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Calendar, 
  Cpu, 
  Gamepad2,
  HardDrive,
  Zap,
  ArrowRight,
  Search,
  Download,
  Upload,
  Edit2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BuildSelection, SavedBuild, SelectedItem } from '../types/pc';

import { User } from 'firebase/auth';

interface SavedBuildsDrawerProps {
  user?: User | null;
  onSignIn?: () => void;
  isOpen: boolean;
  onClose: () => void;
  savedBuilds: SavedBuild[];
  onLoadBuild: (build: SavedBuild) => void;
  onSaveCurrentBuild: (customName?: string) => void;
  onDeleteBuild: (id: string) => void;
  onDuplicateBuild: (id: string) => void;
  currentBuildName: string;
}

export const SavedBuildsDrawer: React.FC<SavedBuildsDrawerProps> = ({
  isOpen,
  onClose,
  savedBuilds,
  onLoadBuild,
  onSaveCurrentBuild,
  onDeleteBuild,
  onDuplicateBuild,
  currentBuildName,
  user,
  onSignIn,
}) => {
  const [newSaveName, setNewSaveName] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveCurrentBuild(newSaveName.trim() || currentBuildName);
    setNewSaveName('');
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  const getFirstItem = (raw: SelectedItem | SelectedItem[] | undefined) => {
    if (!raw) return undefined;
    return Array.isArray(raw) ? raw[0]?.component : raw.component;
  };

  const filteredBuilds = savedBuilds.filter(b => 
    b.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedBuilds, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `meupc-builds-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/90 backdrop-blur-2xl border-l border-white/10 w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FolderHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Minhas Builds Salvas</h2>
              <p className="text-xs text-slate-400">{savedBuilds.length} builds guardadas localmente</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {savedBuilds.length > 0 && (
              <button
                id="export-saved-builds-btn"
                onClick={handleExportJSON}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-transparent hover:border-white/10"
                title="Exportar backup JSON"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              id="close-saved-builds-drawer-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-transparent hover:border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* Save Current Build Prompt */}
        {!user && (
          <div className="p-3 bg-blue-500/10 border-b border-blue-500/20 text-center flex flex-col items-center gap-2">
            <span className="text-[11px] text-blue-300 font-medium">Faça login para salvar suas builds na nuvem e não perder nada!</span>
            <button onClick={onSignIn} className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg transition-colors">
              Fazer Login com Google
            </button>
          </div>
        )}
        <div className="p-4 bg-white/[0.02] backdrop-blur-md border-b border-white/10 space-y-3">

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Salvar configuração atual
            </label>
            <div className="flex items-center gap-2">
              <input
                id="save-build-name-input"
                type="text"
                placeholder={currentBuildName || 'Ex: PC Gamer RTX 4070...'}
                value={newSaveName}
                onChange={(e) => setNewSaveName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
                className="flex-1 bg-slate-950/60 text-slate-200 text-xs px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 backdrop-blur-md placeholder:text-slate-500"
              />
              <button
                id="confirm-save-build-btn"
                onClick={handleSave}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-lg shadow-blue-600/20 active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Salvar</span>
              </button>
            </div>
          </div>

          {savedBuilds.length > 2 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Filtrar builds salvas..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-950/40 text-slate-300 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-white/5 focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
              />
            </div>
          )}
        </div>

        {/* Saved Builds List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredBuilds.length === 0 ? (
            <div className="text-center py-16">
              <FolderHeart className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-400">
                {savedBuilds.length === 0 ? 'Nenhuma build salva ainda' : 'Nenhuma build encontrada'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {savedBuilds.length === 0 
                  ? 'Salve a configuração que você está montando para acessar ou editar mais tarde.'
                  : 'Tente outro termo na busca acima.'}
              </p>
            </div>
          ) : (
            filteredBuilds.map((build) => {
              const cpu = getFirstItem(build.parts.cpu);
              const gpu = getFirstItem(build.parts.gpu);
              const ram = getFirstItem(build.parts.ram);
              const mobo = getFirstItem(build.parts.motherboard);

              return (
                <div
                  key={build.id}
                  className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-blue-500/40 transition-all space-y-3 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-extrabold text-white leading-snug">{build.name}</h4>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(build.updatedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-black text-blue-400">
                        R$ {build.totalCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-slate-400">à vista</div>
                    </div>
                  </div>

                  {/* Quick Component Highlights */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {cpu && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10 font-medium truncate max-w-[180px]">
                        <Cpu className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="truncate">{cpu.model || cpu.name}</span>
                      </span>
                    )}
                    {gpu && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-emerald-300 border border-emerald-500/20 font-medium truncate max-w-[180px]">
                        <Gamepad2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{gpu.model || gpu.name}</span>
                      </span>
                    )}
                    {ram && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10 font-medium">
                        {ram.memoryType || 'RAM'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onDuplicateBuild(build.id)}
                        className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-white/10 transition-colors"
                        title="Duplicar build"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteBuild(build.id)}
                        className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-white/10 transition-colors"
                        title="Excluir build"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        onLoadBuild(build);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white font-bold text-xs flex items-center gap-1 transition-all border border-blue-500/20"
                    >
                      <span>Carregar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

