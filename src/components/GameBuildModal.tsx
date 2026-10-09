import React, { useState, useMemo } from 'react';
import { 
  X, 
  Gamepad2, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Search, 
  Zap, 
  Cpu, 
  Tv, 
  Activity, 
  ShieldCheck, 
  Sliders, 
  Info, 
  ArrowLeft,
  Flame,
  Award,
  Crown,
  Monitor,
  HardDrive
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BuildSelection, PCComponent } from '../types/pc';
import { GAMES_DATABASE, GameInfo } from '../data/gamesDatabase';
import { generateGameTailoredBuilds, GameTierBuild } from '../utils/gameBuildGenerator';
import { CATEGORY_INFO } from '../data/componentsDatabase';

interface GameBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBuild: (name: string, parts: BuildSelection) => void;
  initialGameId?: string;
}

export const GameBuildModal: React.FC<GameBuildModalProps> = ({
  isOpen,
  onClose,
  onApplyBuild,
  initialGameId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedGame, setSelectedGame] = useState<GameInfo | null>(() => {
    if (initialGameId) {
      return GAMES_DATABASE.find(g => g.id === initialGameId) || GAMES_DATABASE[0];
    }
    return GAMES_DATABASE[0];
  });
  const [selectedResolution, setSelectedResolution] = useState<'1080p' | '1440p' | '4k'>('1080p');
  const [selectedExperience, setSelectedExperience] = useState<'competitivo' | 'balanceado' | 'ultra' | 'economico'>('balanceado');
  const [expandedTier, setExpandedTier] = useState<string | null>('recommended');

  // Filter games based on search and category
  const filteredGames = useMemo(() => {
    return GAMES_DATABASE.filter(g => {
      const matchSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.engine.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'Todos' || g.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  // Generate tailored builds for the currently selected game
  const recommendations = useMemo(() => {
    if (!selectedGame) return null;
    return generateGameTailoredBuilds(selectedGame, selectedResolution, selectedExperience);
  }, [selectedGame, selectedResolution, selectedExperience]);

  if (!isOpen) return null;

  const handleApply = (tier: GameTierBuild) => {
    if (!selectedGame) return;
    const buildName = `PC Ideal para ${selectedGame.name} (${tier.tierLabel})`;
    onApplyBuild(buildName, tier.parts);
    
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
    });
    
    onClose();
  };

  const categories = ['Todos', 'Competitivo', 'Triplo-A', 'Battle Royale', 'Simulação & RPG'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Montador de PC por Jogo Ideal
                </h2>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  100% Compatível & Balanceado
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Escolha o jogo que você quer jogar e receba a configuração perfeita com estimativa de FPS real
              </p>
            </div>
          </div>

          <button
            id="close-game-builder-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-transparent hover:border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split into Game Selector sidebar/grid and Recommended Tiers */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          
          {/* Left Column: Game Choice & Search */}
          <div className="w-full lg:w-80 xl:w-96 flex flex-col bg-slate-950/40 p-4 sm:p-5 gap-4 shrink-0">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5 text-blue-400" />
                  1. Escolha o seu Jogo
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {filteredGames.length} títulos
                </span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="game-search-input"
                  type="text"
                  placeholder="Buscar jogo (CS2, GTA, Cyberpunk...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Cards List */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] lg:max-h-none pr-1">
              {filteredGames.map((game) => {
                const isSelected = selectedGame?.id === game.id;
                return (
                  <button
                    key={game.id}
                    id={`select-game-${game.id}`}
                    onClick={() => setSelectedGame(game)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 group relative overflow-hidden ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10 text-white'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05] text-slate-300'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-white/10 relative">
                      <img
                        src={game.image}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {game.popularInBrazil && (
                        <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" title="Muito popular no Brasil" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs sm:text-sm truncate text-white group-hover:text-blue-400 transition-colors">
                          {game.name}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {game.tagline}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/5">
                          {game.category}
                        </span>
                        <span className="text-[9px] text-blue-400/80 font-medium">
                          {game.engine}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Game Hardware Demand summary */}
            {selectedGame && (
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-2 mt-auto">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Exigências de Hardware</span>
                  <span className="text-blue-400">{selectedGame.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Demanda CPU:</span>
                    <strong className="text-slate-200">{selectedGame.hardwareDemands.cpuFocus}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px]">Demanda GPU:</span>
                    <strong className="text-slate-200">{selectedGame.hardwareDemands.gpuFocus}</strong>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  <span className="text-slate-300 font-semibold">Memória RAM:</span> {selectedGame.hardwareDemands.ramFocus}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Game Overview, Target Resolution/Experience, and 3 Tailored Tiers */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto">
            
            {selectedGame && (
              <>
                {/* Game Banner Header */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                  <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: `url(${selectedGame.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
                  
                  <div className="relative z-10 space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {selectedGame.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Motor: <strong className="text-slate-200">{selectedGame.engine}</strong>
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {selectedGame.name}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedGame.description}
                    </p>
                  </div>

                  <div className="relative z-10 flex flex-wrap sm:flex-col items-end gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Conselho Técnico</span>
                      <p className="text-xs text-emerald-400 font-medium max-w-xs text-left sm:text-right">
                        {selectedGame.keyAdvice}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Target Configuration Preferences: Resolution & Gameplay Focus */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Resolution selector */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-blue-400" />
                      Resolução de Jogo:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {(['1080p', '1440p', '4k'] as const).map((res) => (
                        <button
                          key={res}
                          onClick={() => setSelectedResolution(res)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selectedResolution === res
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                              : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          {res === '1080p' ? 'Full HD (1080p)' : res === '1440p' ? 'Quad HD (1440p)' : '4K Ultra (2160p)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Experience goal */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Objetivo de Desempenho:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { id: 'balanceado', label: 'Ultra 60-120 FPS' },
                        { id: 'competitivo', label: '⚡ Competitivo 144Hz+' },
                        { id: 'economico', label: '💡 Mais Econômico' },
                      ].map((exp) => (
                        <button
                          key={exp.id}
                          onClick={() => setSelectedExperience(exp.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selectedExperience === exp.id
                              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                              : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          {exp.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* The 3 Tailored Tiers */}
                {recommendations && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-400" />
                        Setups Recomendados para {selectedGame.name} em {selectedResolution.toUpperCase()}
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">
                        Selecione a opção que melhor cabe no seu bolso
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {recommendations.tiers.map((tier) => {
                        const isExpanded = expandedTier === tier.tierId;
                        const isRecommended = tier.tierId === 'recommended';

                        const fpsValue = selectedResolution === '1080p'
                          ? tier.estimatedFps.fps1080p
                          : selectedResolution === '1440p'
                          ? tier.estimatedFps.fps1440p
                          : tier.estimatedFps.fps4k;

                        const cpu = tier.parts.cpu?.component;
                        const gpu = tier.parts.gpu?.component;
                        const ram = Array.isArray(tier.parts.ram) ? tier.parts.ram[0]?.component : undefined;
                        const ssd = Array.isArray(tier.parts.storage) ? tier.parts.storage[0]?.component : undefined;
                        const cooler = tier.parts.cooler?.component;

                        return (
                          <div
                            key={tier.tierId}
                            className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden relative shadow-xl backdrop-blur-xl ${
                              isRecommended
                                ? 'bg-blue-950/20 border-blue-500/40 ring-1 ring-blue-500/20'
                                : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                            }`}
                          >
                            {/* Card Top / Header */}
                            <div className="p-5">
                              
                              {/* Badges */}
                              <div className="flex items-center justify-between gap-2 mb-2.5">
                                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${tier.badgeColor}`}>
                                  {tier.tierLabel}
                                </span>
                                {isRecommended && (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500 text-white shadow-md shadow-blue-500/30">
                                    ★ Escolha Ideal
                                  </span>
                                )}
                                {tier.tierId === 'supreme' && (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500 text-white shadow-md shadow-purple-500/30 flex items-center gap-1">
                                    <Crown className="w-3 h-3" /> Top Tier
                                  </span>
                                )}
                              </div>

                              {/* Title & Subtitle */}
                              <h5 className="text-base font-extrabold text-white">
                                {tier.tierSubtitle}
                              </h5>

                              {/* FPS Gauge Box */}
                              <div className="mt-3.5 p-3.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-center justify-between">
                                <div>
                                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                                    FPS Estimado ({selectedResolution})
                                  </div>
                                  <div className="flex items-baseline gap-1.5 mt-0.5">
                                    <span className={`text-2xl font-black font-mono ${
                                      fpsValue >= 144 ? 'text-emerald-400' : fpsValue >= 60 ? 'text-blue-400' : 'text-amber-400'
                                    }`}>
                                      {fpsValue}
                                    </span>
                                    <span className="text-xs text-slate-400 font-bold">FPS</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    Preset: {tier.estimatedFps.setting}
                                  </div>
                                </div>

                                <div className="text-right">
                                  <div className="text-[10px] text-slate-400 uppercase font-bold">Estabilidade</div>
                                  <div className="text-xs font-black text-emerald-400 font-mono">
                                    {tier.estimatedFps.consistencyScore}%
                                  </div>
                                  <div className="text-[9px] text-slate-400">Zero gargalo</div>
                                </div>
                              </div>

                              {/* Technical Explanation */}
                              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                                {tier.whyThisBuild}
                              </p>

                              {/* Hardware Specs Quick List */}
                              <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs">
                                <div className="flex items-center justify-between text-slate-300">
                                  <span className="text-slate-400 flex items-center gap-1.5">
                                    <Cpu className="w-3.5 h-3.5 text-blue-400" /> Processador:
                                  </span>
                                  <span className="font-semibold text-right truncate max-w-[170px]" title={cpu?.name}>
                                    {cpu?.model || cpu?.name}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between text-slate-300">
                                  <span className="text-slate-400 flex items-center gap-1.5">
                                    <Gamepad2 className="w-3.5 h-3.5 text-purple-400" /> Placa de Vídeo:
                                  </span>
                                  <span className="font-semibold text-right truncate max-w-[170px]" title={gpu?.name}>
                                    {gpu?.model || gpu?.name}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between text-slate-300">
                                  <span className="text-slate-400 flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5 text-emerald-400" /> Memória:
                                  </span>
                                  <span className="font-semibold text-right truncate max-w-[170px]" title={ram?.name}>
                                    {ram?.specs?.['Capacidade'] || '16GB Dual Channel'}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between text-slate-300">
                                  <span className="text-slate-400 flex items-center gap-1.5">
                                    <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Armazenamento:
                                  </span>
                                  <span className="font-semibold text-right truncate max-w-[170px]" title={ssd?.name}>
                                    {ssd?.specs?.['Capacidade'] || '1TB NVMe M.2'}
                                  </span>
                                </div>
                              </div>

                              {/* Highlights Pill List */}
                              <div className="mt-3.5 space-y-1">
                                {tier.highlights.map((h, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                    <Check className="w-3 h-3 text-blue-400 shrink-0" />
                                    <span>{h}</span>
                                  </div>
                                ))}
                              </div>

                            </div>

                            {/* Card Bottom / Action */}
                            <div className="p-4 bg-slate-950/60 border-t border-white/10 flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-[10px] text-slate-400">Total à vista no PIX</div>
                                  <div className="text-lg font-black font-mono text-blue-400">
                                    R$ {tier.totalCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    ou 12x de R$ {(tier.totalInstallments / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                  <span>100% Compatível</span>
                                </div>
                              </div>

                              <button
                                id={`apply-game-tier-${tier.tierId}`}
                                onClick={() => handleApply(tier)}
                                className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                                  isRecommended
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                }`}
                              >
                                <Check className="w-4 h-4" />
                                <span>Carregar Esta Configuração</span>
                              </button>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-950/80 backdrop-blur-md flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Preços reais atualizados das principais lojas brasileiras (Kabum, Terabyte, Pichau, Amazon)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
