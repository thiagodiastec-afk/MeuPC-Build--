import React, { useState } from 'react';
import { 
  Sparkles, 
  FolderHeart, 
  Layers, 
  Share2, 
  Trash2, 
  Activity,
  Bot,
  Scale,
  Gamepad2,
  Radio,
  RefreshCw,
  Search
} from 'lucide-react';

import { User } from 'firebase/auth';

interface HeaderProps {
  user?: User | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
  buildName: string;
  onRenameBuild: (name: string) => void;
  onOpenPresets: () => void;
  onOpenAiBuilder: () => void;
  onOpenAiAnalysis: () => void;
  onOpenSavedBuilds: () => void;
  onOpenShare: () => void;
  onOpenPerformance: () => void;
  onOpenAiChat: () => void;
  onOpenCompare: () => void;
  onOpenGameBuilder: () => void;
  onClearBuild: () => void;
  totalCash: number;
  partsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  buildName,
  onRenameBuild,
  onOpenPresets,
  onOpenAiBuilder,
  onOpenAiAnalysis,
  onOpenSavedBuilds,
  onOpenShare,
  onOpenPerformance,
  onOpenAiChat,
  onOpenCompare,
  onOpenGameBuilder,
  onClearBuild,
  user,
  onSignIn,
  onSignOut,
  totalCash,
  partsCount,
}) => {
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [tempName, setTempName] = React.useState(buildName);

  React.useEffect(() => {
    setTempName(buildName);
  }, [buildName]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onRenameBuild(tempName.trim());
    } else {
      setTempName(buildName);
    }
    setIsEditingName(false);
  };


  return (
    <header className="sticky top-0 z-30 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 text-white shadow-xl shadow-black/40">
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
          
          {/* Brand & Active Build Title */}
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1 sm:flex-initial">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 text-white font-black text-lg sm:text-xl tracking-tight shrink-0">
                P
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-white">BuildCraft</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                    PC
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-none">Monte seu PC & Preços Brasil</p>
              </div>
            </div>

            <div className="hidden md:block h-7 w-[1px] bg-white/10 shrink-0" />

            {/* Editable Build Name & Price Badge */}
            <div className="min-w-0 max-w-[150px] xs:max-w-[200px] sm:max-w-[240px] md:max-w-[280px]">
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    id="build-name-input"
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    onBlur={handleSaveName}
                    autoFocus
                    className="bg-white/10 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-lg border border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full backdrop-blur-md"
                  />
                </div>
              ) : (
                <button
                  id="rename-build-button"
                  onClick={() => setIsEditingName(true)}
                  className="flex items-center gap-1.5 group text-left hover:bg-white/5 px-1.5 py-0.5 rounded-lg transition-colors w-full"
                  title="Clique para renomear esta build"
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-200 truncate group-hover:text-blue-400">
                    {buildName}
                  </span>
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-300 shrink-0">✏️</span>
                </button>
              )}
              
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-1.5 truncate">
                <span className="whitespace-nowrap">{partsCount} {partsCount === 1 ? 'peça' : 'peças'}</span>
                <span className="text-white/20">•</span>
                <span className="text-blue-400 font-mono font-bold whitespace-nowrap">
                  R$ {totalCash.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Bar Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            <button
              id="game-builder-btn"
              onClick={onOpenGameBuilder}
              className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/15 text-white shadow-md transition-all active:scale-95 border border-white/15 whitespace-nowrap shrink-0"
              title="Montar PC ideal e 100% compatível para o jogo escolhido"
            >
              <Gamepad2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden md:inline">PC por Jogo</span>
            </button>

            {/* AI PC Builder Wizard */}
            <button
              id="ai-builder-btn"
              onClick={onOpenAiBuilder}
              className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-95 whitespace-nowrap shrink-0"
              title="Assistente de montagem com Inteligência Artificial"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden md:inline">Montar com IA</span>
              <span className="md:hidden">IA</span>
            </button>

            <div className="hidden lg:block h-6 w-[1px] bg-white/10 shrink-0 mx-0.5" />

            {/* Compare Tool */}
            <button
              id="compare-components-header-btn"
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-95 whitespace-nowrap shrink-0"
              title="Comparar especificações e preços de até 4 componentes"
            >
              <Scale className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="hidden xl:inline">Comparar</span>
            </button>

            <div className="hidden lg:block h-6 w-[1px] bg-white/10 shrink-0 mx-0.5" />

            {/* Presets */}
            <button
              id="presets-btn"
              onClick={onOpenPresets}
              className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-95 whitespace-nowrap shrink-0"
              title="Ver builds prontas recomendadas por faixa de preço"
            >
              <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="hidden xl:inline">Builds Prontas</span>
            </button>

            {/* Performance Benchmark / FPS Simulator */}
            <button
              id="performance-btn"
              onClick={onOpenPerformance}
              className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-95 whitespace-nowrap shrink-0"
              title="Simulador de Desempenho e FPS em Jogos"
            >
              <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="hidden 2xl:inline">Desempenho</span>
            </button>

            {/* Saved Builds */}
            <button
              id="saved-builds-btn"
              onClick={onOpenSavedBuilds}
              className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-95 whitespace-nowrap shrink-0"
              title="Minhas Builds Salvas"
            >
              <FolderHeart className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="hidden 2xl:inline">Salvas</span>
            </button>

            <div className="hidden sm:block h-6 w-[1px] bg-white/10 shrink-0 mx-0.5" />

            
            {/* User Auth */}
            {user ? (
              <button
                onClick={onSignOut}
                className="flex items-center gap-2 p-1 pr-3 sm:pr-4 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all shrink-0"
                title="Sair da Conta"
              >
                <img src={user.photoURL} alt="Avatar" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full" />
                <span className="text-[10px] sm:text-xs font-semibold hidden md:block truncate max-w-[100px]">{user.displayName?.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/20 backdrop-blur-md transition-all shrink-0 active:scale-95 border border-blue-500/50"
                title="Fazer login para salvar na nuvem"
              >
                <span className="hidden md:inline">Entrar</span>
                <span className="md:hidden">Login</span>
              </button>
            )}
            
            {/* Share / Export */}

            <button
              id="share-build-btn"
              onClick={onOpenShare}
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all shrink-0"
              title="Compartilhar / Exportar Build"
            >
              <Share2 className="w-4 h-4 text-blue-400 shrink-0" />
            </button>

            {/* AI Assistant Chat button */}
            <button
              id="ai-chat-btn"
              onClick={onOpenAiChat}
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all shrink-0"
              title="Tirar dúvidas com o Técnico IA"
            >
              <Bot className="w-4 h-4 text-amber-400 shrink-0" />
            </button>

            {/* Clear button */}
            <button
              id="clear-build-btn"
              onClick={onClearBuild}
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-300 border border-white/10 backdrop-blur-md transition-all shrink-0"
              title="Limpar todas as peças da build atual"
            >
              <Trash2 className="w-4 h-4 shrink-0" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};


