import React from 'react';
import { Gamepad2, Sparkles, ChevronRight, Trophy, Flame } from 'lucide-react';
import { GAMES_DATABASE } from '../data/gamesDatabase';

interface GameBuildCardProps {
  onOpenGameBuilder: (gameId?: string) => void;
}

export const GameBuildCard: React.FC<GameBuildCardProps> = ({ onOpenGameBuilder }) => {
  const topGames = GAMES_DATABASE.slice(0, 5);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-purple-950/40 backdrop-blur-2xl border border-blue-500/20 p-4 sm:p-5 shadow-2xl relative overflow-hidden group">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-64 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Info */}
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> NOVO: Montar por Jogo
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              100% Compatível e Testado
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>Quer um PC feito sob medida para o seu jogo favorito?</span>
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            Escolha o jogo (CS2, GTA V/VI, Cyberpunk, Valorant, Warzone...) e receba a configuração perfeita com cálculo de FPS real e menor preço no Brasil.
          </p>
        </div>

        {/* Right: Quick Game Badges and Action Button */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 mr-2">
            {topGames.map((game) => (
              <button
                key={game.id}
                onClick={() => onOpenGameBuilder(game.id)}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 text-[11px] font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1"
                title={`Montar PC ideal para ${game.name}`}
              >
                <span>{game.name}</span>
              </button>
            ))}
          </div>

          <button
            id="open-game-builder-banner-btn"
            onClick={() => onOpenGameBuilder()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 active:scale-95 group/btn"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Escolher Meu Jogo</span>
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
