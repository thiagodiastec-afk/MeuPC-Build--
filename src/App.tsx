import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { 
  BuildSelection, 
  ComponentCategory, 
  PCComponent, 
  SavedBuild, 
  SelectedItem 
} from './types/pc';
import { auth, signInWithGoogle, signOut, saveUserBuild, getUserBuilds, deleteUserBuild, getCatalogComponents } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { checkBuildCompatibility } from './utils/compatibility';
import { 
  calculateTotals, 
  loadActiveBuildState, 
  saveActiveBuildState, 
  loadSavedBuilds, 
  persistSavedBuilds 
} from './utils/storage';
import { Header } from './components/Header';
import { CompatibilityBar } from './components/CompatibilityBar';
import { BuildTable } from './components/BuildTable';
import { PriceSummaryCard } from './components/PriceSummaryCard';
import { ComponentPickerModal } from './components/ComponentPickerModal';
import { GameBuildCard } from './components/GameBuildCard';
import { CATEGORY_INFO, RAW_COMPONENTS, setRawComponents } from './data/componentsDatabase';

// Lazy loaded modals to optimize chunk size
const AiBuildModal = lazy(() => import('./components/AiBuildModal').then(m => ({ default: m.AiBuildModal })));
const AiAnalysisModal = lazy(() => import('./components/AiAnalysisModal').then(m => ({ default: m.AiAnalysisModal })));
const AiChatAssistant = lazy(() => import('./components/AiChatAssistant').then(m => ({ default: m.AiChatAssistant })));
const PresetsModal = lazy(() => import('./components/PresetsModal').then(m => ({ default: m.PresetsModal })));
const SavedBuildsDrawer = lazy(() => import('./components/SavedBuildsDrawer').then(m => ({ default: m.SavedBuildsDrawer })));
const ExportShareModal = lazy(() => import('./components/ExportShareModal').then(m => ({ default: m.ExportShareModal })));
const PerformanceModal = lazy(() => import('./components/PerformanceModal').then(m => ({ default: m.PerformanceModal })));
const ComponentComparisonModal = lazy(() => import('./components/ComponentComparisonModal').then(m => ({ default: m.ComponentComparisonModal })));
const PriceComparisonModal = lazy(() => import('./components/PriceComparisonModal').then(m => ({ default: m.PriceComparisonModal })));
const GameBuildModal = lazy(() => import('./components/GameBuildModal').then(m => ({ default: m.GameBuildModal })));
const UrlValidatorModal = lazy(() => import('./components/UrlValidatorModal').then(m => ({ default: m.UrlValidatorModal })));
import { 
  Sparkles, 
  HelpCircle, 
  Layers, 
  ShieldCheck, 
  Flame, 
  ArrowRight,
  TrendingDown,
  Info,
  Radio
} from 'lucide-react';

export default function App() {
  // Active Build State
  const [buildName, setBuildName] = useState<string>('Meu PC Gamer (Custo x Benefício)');
  const [parts, setParts] = useState<BuildSelection>({});
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [user, setUser] = useState<User | null>(null);


  const [catalogLoaded, setCatalogLoaded] = useState(false);
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const cloudComponents = await getCatalogComponents();
        if (cloudComponents && cloudComponents.length > 0) {
          setRawComponents(cloudComponents as PCComponent[]);
        }
      } catch (e) {
        console.error("Error fetching cloud catalog", e);
      } finally {
        setCatalogLoaded(true);
      }
    };
    loadCatalog();
  }, []);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch cloud builds
        try {
          const cloudBuilds = await getUserBuilds(currentUser.uid);
          if (cloudBuilds && cloudBuilds.length > 0) {
            setSavedBuilds(cloudBuilds as SavedBuild[]);
            persistSavedBuilds(cloudBuilds as SavedBuild[]);
          }
        } catch (e) {
          console.error("Error fetching cloud builds", e);
        }
      }
    });
    return () => unsubscribe();
  }, []);


  // Modals & Drawers Visibility
  const [pickerCategory, setPickerCategory] = useState<ComponentCategory | null>(null);
  const [isAiBuilderOpen, setIsAiBuilderOpen] = useState(false);
  const [isAiAnalysisOpen, setIsAiAnalysisOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isSavedBuildsOpen, setIsSavedBuildsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareCategory, setCompareCategory] = useState<ComponentCategory>('cpu');
  const [priceCompareComponent, setPriceCompareComponent] = useState<PCComponent | null>(null);
  const [compareInitialComponents, setCompareInitialComponents] = useState<PCComponent[]>([]);
  const [isGameBuilderOpen, setIsGameBuilderOpen] = useState(false);
  const [gameBuilderInitialId, setGameBuilderInitialId] = useState<string | undefined>(undefined);
  
  const [isUrlValidatorOpen, setIsUrlValidatorOpen] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const initial = loadActiveBuildState();
    setBuildName(initial.name);
    setParts(initial.parts);
    setSavedBuilds(loadSavedBuilds());
  }, []);

  // Save active build to LocalStorage on change
  useEffect(() => {
    if (Object.keys(parts).length > 0 || buildName) {
      saveActiveBuildState(buildName, parts);
    }
  }, [buildName, parts]);

  // Compatibility Calculation
  const compatibilityReport = useMemo(() => {
    return checkBuildCompatibility(parts);
  }, [parts]);

  // Totals Calculation
  const { totalCash, totalInstallments, savings, partsCount } = useMemo(() => {
    return calculateTotals(parts);
  }, [parts]);

  // Handlers
  const handleOpenPicker = (category: ComponentCategory) => {
    setPickerCategory(category);
  };

  const handleClosePicker = () => {
    setPickerCategory(null);
  };

  const handleOpenCompare = (category: ComponentCategory = 'cpu', initialList: PCComponent[] = []) => {
    setCompareCategory(category);
    setCompareInitialComponents(initialList);
    setIsCompareOpen(true);
  };

  const handleOpenGameBuilder = (gameId?: string) => {
    setGameBuilderInitialId(gameId);
    setIsGameBuilderOpen(true);
  };

  const handleSelectComponent = (comp: PCComponent) => {
    const cat = comp.category || pickerCategory || compareCategory;
    const isMultiple = CATEGORY_INFO[cat]?.multiple;

    setParts((prev) => {
      const next = { ...prev };

      if (isMultiple) {
        const existing = (next[cat] as SelectedItem[]) || [];
        // Check if already in the list
        const foundIdx = existing.findIndex(e => e.component.id === comp.id);
        if (foundIdx >= 0) {
          const updated = [...existing];
          updated[foundIdx] = {
            ...updated[foundIdx],
            quantity: updated[foundIdx].quantity + 1,
          };
          next[cat] = updated;
        } else {
          next[cat] = [...existing, { component: comp, quantity: 1 }];
        }
      } else {
        next[cat] = { component: comp, quantity: 1 };
      }

      return next;
    });

    handleClosePicker();
  };

  const handleRemoveItem = (category: ComponentCategory, index?: number) => {
    setParts((prev) => {
      const next = { ...prev };
      const val = next[category];

      if (Array.isArray(val) && typeof index === 'number') {
        const copy = [...val];
        copy.splice(index, 1);
        if (copy.length === 0) {
          delete next[category];
        } else {
          next[category] = copy;
        }
      } else {
        delete next[category];
      }

      return next;
    });
  };

  const handleChangeQuantity = (category: ComponentCategory, newQty: number, index?: number) => {
    setParts((prev) => {
      const next = { ...prev };
      const val = next[category];

      if (Array.isArray(val) && typeof index === 'number') {
        const copy = [...val];
        if (newQty <= 0) {
          copy.splice(index, 1);
          if (copy.length === 0) delete next[category];
          else next[category] = copy;
        } else {
          copy[index] = { ...copy[index], quantity: newQty };
          next[category] = copy;
        }
      } else if (val && !Array.isArray(val)) {
        if (newQty <= 0) {
          delete next[category];
        } else {
          next[category] = { ...val, quantity: newQty };
        }
      }

      return next;
    });
  };

  const handleUpdateItemPrice = (
    category: ComponentCategory,
    priceCash?: number,
    priceInstallments?: number,
    selectedStore?: string,
    index?: number
  ) => {
    setParts((prev) => {
      const next = { ...prev };
      const val = next[category];

      if (Array.isArray(val) && typeof index === 'number' && val[index]) {
        const copy = [...val];
        copy[index] = {
          ...copy[index],
          customPriceCash: priceCash !== undefined ? priceCash : copy[index].customPriceCash,
          customPriceInstallments: priceInstallments !== undefined ? priceInstallments : copy[index].customPriceInstallments,
          selectedStore: selectedStore || copy[index].selectedStore,
        };
        next[category] = copy;
      } else if (val && !Array.isArray(val)) {
        next[category] = {
          ...val,
          customPriceCash: priceCash !== undefined ? priceCash : val.customPriceCash,
          customPriceInstallments: priceInstallments !== undefined ? priceInstallments : val.customPriceInstallments,
          selectedStore: selectedStore || val.selectedStore,
        };
      } else if (!val) {
        // Find matching component in RAW_COMPONENTS or build a fallback
        const matchedComp = RAW_COMPONENTS.find(c => c.category === category) || {
          id: `item-${category}-${Date.now()}`,
          name: CATEGORY_INFO[category]?.label || category,
          brand: 'Hardware',
          model: CATEGORY_INFO[category]?.label || category,
          category,
          lowestPriceCash: priceCash || 100,
          lowestPriceInstallments: priceInstallments || Math.round((priceCash || 100) * 1.15 * 100) / 100,
          rating: 4.8,
          reviewCount: 10,
          stores: [
            {
              storeName: (selectedStore as any) || 'KaBuM!',
              priceCash: priceCash || 100,
              priceInstallments: priceInstallments || Math.round((priceCash || 100) * 1.15 * 100) / 100,
              url: '',
              inStock: true,
            }
          ],
          specs: {}
        };

        const isMultiple = CATEGORY_INFO[category]?.multiple;
        if (isMultiple) {
          next[category] = [{
            component: matchedComp,
            quantity: 1,
            customPriceCash: priceCash,
            customPriceInstallments: priceInstallments,
            selectedStore
          }];
        } else {
          next[category] = {
            component: matchedComp,
            quantity: 1,
            customPriceCash: priceCash,
            customPriceInstallments: priceInstallments,
            selectedStore
          };
        }
      }

      return next;
    });
  };

  const handleApplyAllPrices = (updates: Array<{category: ComponentCategory; priceCash: number; priceInstallments: number; selectedStore: string; index?: number;}>) => {
    setParts((prev) => {
      const next = { ...prev };
      updates.forEach(upd => {
        const val = next[upd.category];
        if (Array.isArray(val) && typeof upd.index === 'number' && val[upd.index]) {
          const copy = [...val];
          copy[upd.index] = {
            ...copy[upd.index],
            customPriceCash: upd.priceCash,
            customPriceInstallments: upd.priceInstallments,
            selectedStore: upd.selectedStore || copy[upd.index].selectedStore,
          };
          next[upd.category] = copy;
        } else if (val && !Array.isArray(val)) {
          next[upd.category] = {
            ...val,
            customPriceCash: upd.priceCash,
            customPriceInstallments: upd.priceInstallments,
            selectedStore: upd.selectedStore || val.selectedStore,
          };
        }
      });
      return next;
    });
  };

  const handleClearBuild = () => {
    if (window.confirm('Deseja realmente limpar todas as peças selecionadas desta build?')) {
      setParts({});
      setBuildName('Minha Nova Build');
    }
  };

  const handleRenameBuild = (name: string) => {
    setBuildName(name);
  };

  const handleApplyPresetOrAi = (name: string, newParts: BuildSelection) => {
    setBuildName(name);
    setParts(newParts);
  };

  
  const handleSaveCurrentBuild = (customName?: string) => {
    const name = customName || buildName;
    const newBuild: SavedBuild = {
      id: 'build-' + Date.now(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parts,
      totalCash,
      totalInstallments,
    };

    const updated = [newBuild, ...savedBuilds];
    setSavedBuilds(updated);
    persistSavedBuilds(updated);
    
    if (user) {
      saveUserBuild(user.uid, newBuild).catch(e => console.error(e));
    }
  };

  const handleDeleteSavedBuild = async (id: string) => {
    const updated = savedBuilds.filter(b => b.id !== id);
    setSavedBuilds(updated);
    persistSavedBuilds(updated);
    
    if (user) {
      deleteUserBuild(user.uid, id).catch(e => console.error(e));
    }
  };

  const handleDuplicateSavedBuild = async (id: string) => {
    const item = savedBuilds.find(b => b.id === id);
    if (!item) return;

    const duplicated: SavedBuild = {
      ...item,
      id: 'build-' + Date.now(),
      name: `${item.name} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [duplicated, ...savedBuilds];
    setSavedBuilds(updated);
    persistSavedBuilds(updated);

    if (user) {
      saveUserBuild(user.uid, duplicated).catch(e => console.error(e));
    }
  };

  const handleLoadSavedBuild = (build: SavedBuild) => {
    setBuildName(build.name);
    setParts(build.parts);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-blue-500 selection:text-white print:bg-white print:text-slate-900">
      {/* Frosted Glass Ambient Lighting Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none z-0 ambient-glow no-print" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none z-0 ambient-glow no-print" />
      <div className="fixed top-[40%] right-[20%] w-[35%] h-[35%] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none z-0 ambient-glow no-print" />
      
      {/* Top Main Navigation Header */}
      <div className="no-print header-actions-bar">
        <Header
          buildName={buildName}
          onRenameBuild={handleRenameBuild}
          onOpenPresets={() => setIsPresetsOpen(true)}
          onOpenAiBuilder={() => setIsAiBuilderOpen(true)}
          onOpenAiAnalysis={() => setIsAiAnalysisOpen(true)}
          onOpenSavedBuilds={() => setIsSavedBuildsOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          onOpenPerformance={() => setIsPerformanceOpen(true)}
          onOpenAiChat={() => setIsAiChatOpen(true)}
          onOpenCompare={() => handleOpenCompare('cpu')}
          onOpenGameBuilder={() => handleOpenGameBuilder()}
          onClearBuild={handleClearBuild}
          totalCash={totalCash}
          partsCount={partsCount}
          user={user}
          onSignIn={signInWithGoogle}
          onSignOut={signOut}
        />
      </div>

      {/* Hero Quick Notification & Tips Bar */}
      <div className="relative z-10 bg-white/[0.03] backdrop-blur-xl border-b border-white/10 py-2.5 px-3 sm:px-6 no-print tips-banner">
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400/50" />
            <span className="font-bold text-cyan-400">Catálogo & Deep Links Oficiais:</span>
            <span>Preços médios de mercado calibrados e consulta direta com 1 clique nas 5 maiores lojas do Brasil.</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Preços 100% Determinísticos</span>
            </div>
            <span className="text-white/10">|</span>
            <button
              onClick={() => handleOpenGameBuilder()}
              className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>PC por Jogo</span>
            </button>
            <span className="text-white/10">|</span>
            <button
              onClick={() => setIsPresetsOpen(true)}
              className="text-slate-400 hover:text-blue-400 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Builds Prontas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exclusivo para Impressão: Cabeçalho Executivo do Orçamento */}
      <div className="hidden print:block print-only border-b-2 border-slate-800 pb-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900 tracking-tight">MeuPC Build</span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-300">
                Orçamento de Hardware
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">{buildName}</h1>
          </div>
          <div className="text-right text-xs text-slate-600 space-y-0.5">
            <div><strong>Emissão:</strong> {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
            <div><strong>Total de Peças:</strong> {partsCount} itens</div>
            <div>
              <strong>Status:</strong>{' '}
              <span className={compatibilityReport.isCompatible ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                {compatibilityReport.isCompatible ? '✓ 100% Compatível' : 'Avisos de Compatibilidade'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Container */}
      <main className="relative z-10 flex-1 max-w-7xl 2xl:max-w-[1480px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 print:p-0 print:m-0 print:space-y-4">
        
        {/* Game-Based PC Builder Banner Card */}
        <div className="no-print game-builder-banner">
          <GameBuildCard onOpenGameBuilder={handleOpenGameBuilder} />
        </div>

        {/* Real-time Compatibility Bar */}
        <div className="no-print">
          <CompatibilityBar
            report={compatibilityReport}
            onOpenAiAnalysis={() => setIsAiAnalysisOpen(true)}
          />
        </div>

        {/* 2-Column Responsive Layout: Build Table + Summary Card */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start print:block">
          
          {/* Main Parts Table (9 cols on desktop) */}
          <div id="build-table-capture" className="xl:col-span-9 space-y-6 print:space-y-4">
            <BuildTable
              parts={parts}
              onOpenPicker={handleOpenPicker}
              onRemoveItem={handleRemoveItem}
              onChangeQuantity={handleChangeQuantity}
              onCompareCategory={handleOpenCompare}
              onComparePrice={(comp) => setPriceCompareComponent(comp)}
              onUpdateItemPrice={handleUpdateItemPrice}
            />

            {/* Quick Tips & Guide Card with Frosted Glass styling */}
            <div className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-xs text-slate-300 space-y-2.5 shadow-xl no-print quick-tips-guide">
              <div className="flex items-center gap-2 text-white font-bold">
                <div className="p-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Info className="w-4 h-4" />
                </div>
                <span>Como funciona o MeuPC Build & Radar de Preços?</span>
              </div>
              <p className="leading-relaxed text-slate-400">
                1. Selecione cada componente para o seu computador. O sistema analisa automaticamente a compatibilidade de socket, memória RAM, TDP da fonte e comprimento do gabinete.
              </p>
              <p className="leading-relaxed text-slate-400">
                2. Use o novo botão <strong className="text-cyan-400">📡 Preços ao Vivo</strong> ou clique no ícone de radar em qualquer peça para fazer uma varredura em tempo real nos maiores e-commerces do Brasil (KaBuM!, Pichau, Terabyte e Amazon).
              </p>
            </div>
          </div>

          {/* Sticky Price Summary & Actions (3 cols on desktop) */}
          <div className="xl:col-span-3">
            <PriceSummaryCard
              parts={parts}
              totalCash={totalCash}
              totalInstallments={totalInstallments}
              savings={savings}
              partsCount={partsCount}
              onOpenShare={() => setIsShareOpen(true)}
              onOpenAiAnalysis={() => setIsAiAnalysisOpen(true)}
              onOpenUrlValidator={() => setIsUrlValidatorOpen(true)}
            />
          </div>

        </div>

      </main>

      {/* Exclusivo para Impressão: Rodapé de Autenticidade e Cotações */}
      <div className="hidden print:block print-only print-footer-info">
        <div>
          <span>Relatório gerado por <strong>MeuPC Build</strong> • Cotações pesquisadas em KaBuM!, TerabyteShop, Pichau e Amazon Brasil.</span>
        </div>
        <div>
          <span>Página 1 de 1</span>
        </div>
      </div>

      {/* Footer with Frosted Glass */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/60 backdrop-blur-xl text-slate-400 text-xs py-8 px-4 sm:px-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/10">
              PC
            </div>
            <p>© {new Date().getFullYear()} MeuPC Build - Comparador de Peças & Motor de Preços em Tempo Real.</p>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Preços informativos obtidos via busca em tempo real nas lojas brasileiras.</span>
          </div>
        </div>
      </footer>

      {/* Modal / Drawer Dialogs */}
      <div className="no-print">
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
            <div className="p-4 bg-slate-900 rounded-xl border border-white/10 text-slate-300 font-medium">Carregando módulo...</div>
          </div>
        }>
          {pickerCategory && (
            <ComponentPickerModal
              isOpen={!!pickerCategory}
              category={pickerCategory}
              onClose={handleClosePicker}
              onSelectComponent={handleSelectComponent}
              currentBuild={parts}
              onOpenCompare={handleOpenCompare}
            />
          )}

        {isAiBuilderOpen && (
          <AiBuildModal
            isOpen={isAiBuilderOpen}
            onClose={() => setIsAiBuilderOpen(false)}
            onApplyBuild={handleApplyPresetOrAi}
          />
        )}

        {isAiAnalysisOpen && (
          <AiAnalysisModal
            isOpen={isAiAnalysisOpen}
            onClose={() => setIsAiAnalysisOpen(false)}
            parts={parts}
            totalCash={totalCash}
            totalWattage={compatibilityReport.estimatedWattage}
          />
        )}

        {isPresetsOpen && (
          <PresetsModal
            isOpen={isPresetsOpen}
            onClose={() => setIsPresetsOpen(false)}
            onSelectPreset={handleApplyPresetOrAi}
          />
        )}

        {isSavedBuildsOpen && (
          <SavedBuildsDrawer
            isOpen={isSavedBuildsOpen}
            onClose={() => setIsSavedBuildsOpen(false)}
            savedBuilds={savedBuilds}
            onLoadBuild={handleLoadSavedBuild}
            onSaveCurrentBuild={handleSaveCurrentBuild}
            onDeleteBuild={handleDeleteSavedBuild}
            onDuplicateBuild={handleDuplicateSavedBuild}
            currentBuildName={buildName}
            user={user}
            onSignIn={signInWithGoogle}
          />
        )}

        {isShareOpen && (
          <ExportShareModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            buildName={buildName}
            parts={parts}
            totalCash={totalCash}
            totalInstallments={totalInstallments}
          />
        )}

        {isPerformanceOpen && (
          <PerformanceModal
            isOpen={isPerformanceOpen}
            onClose={() => setIsPerformanceOpen(false)}
            parts={parts}
            totalCash={totalCash}
            onOpenGameBuilder={(gameId) => handleOpenGameBuilder(gameId)}
          />
        )}

        {isGameBuilderOpen && (
          <GameBuildModal
            isOpen={isGameBuilderOpen}
            onClose={() => setIsGameBuilderOpen(false)}
            initialGameId={gameBuilderInitialId}
            onApplyBuild={handleApplyPresetOrAi}
          />
        )}

        {isAiChatOpen && (
          <AiChatAssistant
            isOpen={isAiChatOpen}
            onClose={() => setIsAiChatOpen(false)}
            currentBuild={parts}
          />
        )}


        {priceCompareComponent && (
          <PriceComparisonModal
            isOpen={!!priceCompareComponent}
            onClose={() => setPriceCompareComponent(null)}
            component={priceCompareComponent}
          />
        )}
        {isCompareOpen && (
          <ComponentComparisonModal
            isOpen={isCompareOpen}
            onClose={() => setIsCompareOpen(false)}
            category={compareCategory}
            initialComponents={compareInitialComponents}
            onSelectComponent={(comp) => {
              handleSelectComponent(comp);
              setIsCompareOpen(false);
            }}
          />
        )}

        {isUrlValidatorOpen && (
          <UrlValidatorModal
            isOpen={isUrlValidatorOpen}
            onClose={() => setIsUrlValidatorOpen(false)}
            parts={parts}
          />
        )}
        </Suspense>
      </div>

    </div>
  );
}
