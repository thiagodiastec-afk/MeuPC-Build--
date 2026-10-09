import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  ExternalLink, Search,
  Cpu, 
  Fan, 
  Gamepad2, 
  CircuitBoard, 
  Layers, 
  HardDrive, 
  Box, 
  Zap, 
  Tv, 
  MonitorDot, 
  Keyboard, 
  Mouse, 
  Headphones, 
  Wind,
  Store,
  Scale,
  Armchair,
  Mic,
  Square,
  Pencil,
  RotateCcw,
  Check,
  X,
  DollarSign,
  AlertCircle,
  Radio,
  Sparkles
} from 'lucide-react';
import { BuildSelection, ComponentCategory, SelectedItem, PCComponent } from '../types/pc';
import { CATEGORY_INFO } from '../data/componentsDatabase';
import { getStoreProductUrl, getOfficialStoreSearchUrl } from '../utils/storeUrls';
import { SafeExternalLink } from './SafeExternalLink';
import { StorePriceLinksMenu } from './StorePriceLinksMenu';

interface BuildTableProps {
  parts: BuildSelection;
  onOpenPicker: (category: ComponentCategory) => void;
  onRemoveItem: (category: ComponentCategory, index?: number) => void;
  onChangeQuantity: (category: ComponentCategory, newQty: number, index?: number) => void;
  onCompareCategory?: (category: ComponentCategory, preselected?: PCComponent[]) => void;
  onComparePrice?: (component: PCComponent) => void;
  onUpdateItemPrice?: (category: ComponentCategory, priceCash?: number, priceInstallments?: number, selectedStore?: string, index?: number) => void;
}

const CATEGORY_ORDER: ComponentCategory[] = [
  'cpu',
  'cooler',
  'gpu',
  'motherboard',
  'ram',
  'storage',
  'case',
  'psu',
  'os',
  'monitor',
  'case_fan',
  'keyboard',
  'mouse',
  'headset',
  'mousepad',
  'microphone',
  'chair',
];

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-5 h-5" />,
  Fan: <Fan className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  CircuitBoard: <CircuitBoard className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  HardDrive: <HardDrive className="w-5 h-5" />,
  Box: <Box className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  MonitorDot: <MonitorDot className="w-5 h-5" />,
  Tv: <Tv className="w-5 h-5" />,
  Wind: <Wind className="w-5 h-5" />,
  Keyboard: <Keyboard className="w-5 h-5" />,
  Mouse: <Mouse className="w-5 h-5" />,
  Headphones: <Headphones className="w-5 h-5" />,
  Armchair: <Armchair className="w-5 h-5" />,
  Mic: <Mic className="w-5 h-5" />,
  Square: <Square className="w-5 h-5" />,
};

interface EditingState {
  category: ComponentCategory;
  item: SelectedItem;
  index?: number;
  cashInput: string;
  installmentInput: string;
  storeInput: string;
}

export const BuildTable: React.FC<BuildTableProps> = ({
  parts,
  onOpenPicker,
  onRemoveItem,
  onChangeQuantity,
  onCompareCategory,
  onUpdateItemPrice,
  onComparePrice,
}) => {
  const [editingItem, setEditingItem] = useState<EditingState | null>(null);

  const handleStartEdit = (category: ComponentCategory, item: SelectedItem, index?: number) => {
    const currentCash = item.customPriceCash ?? item.component.lowestPriceCash;
    const currentInst = item.customPriceInstallments ?? item.component.lowestPriceInstallments;
    const currentStore = item.selectedStore ?? item.component.stores.find(s => s.isLowest)?.storeName ?? item.component.stores[0]?.storeName ?? 'Kabum';

    setEditingItem({
      category,
      item,
      index,
      cashInput: currentCash.toFixed(2),
      installmentInput: currentInst.toFixed(2),
      storeInput: currentStore,
    });
  };

  const handleSavePrice = () => {
    if (!editingItem || !onUpdateItemPrice) return;

    const parsedCash = parseFloat(editingItem.cashInput.replace(',', '.'));
    const parsedInst = parseFloat(editingItem.installmentInput.replace(',', '.'));

    if (isNaN(parsedCash) || parsedCash <= 0) {
      alert('Por favor insira um preço à vista válido.');
      return;
    }

    const finalInst = isNaN(parsedInst) || parsedInst <= 0 ? parsedCash * 1.176 : parsedInst;

    onUpdateItemPrice(
      editingItem.category,
      parsedCash,
      finalInst,
      editingItem.storeInput,
      editingItem.index
    );

    setEditingItem(null);
  };

  const handleResetToDefault = () => {
    if (!editingItem || !onUpdateItemPrice) return;
    onUpdateItemPrice(
      editingItem.category,
      undefined,
      undefined,
      undefined,
      editingItem.index
    );
    setEditingItem(null);
  };

  return (
    <div className="space-y-3">
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl print-table-container">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
          <table className="w-full text-left border-collapse min-w-[760px] sm:min-w-[840px] xl:min-w-[960px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-3 sm:px-5 w-32 sm:w-40 whitespace-nowrap">Componente</th>
                <th className="py-3.5 px-3 sm:px-4 min-w-[240px] sm:min-w-[280px]">Peça Selecionada</th>
                <th className="py-3.5 px-2 sm:px-3 text-center w-14 sm:w-16 whitespace-nowrap">Qtd.</th>
                <th className="py-3.5 px-3 sm:px-4 text-right w-32 sm:w-36 whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <span>Faixa Estimada (PIX)</span>
                  </div>
                </th>
                <th className="py-3.5 px-3 sm:px-4 text-right w-28 sm:w-32 hidden xl:table-cell print-show-col whitespace-nowrap">A Prazo</th>
                <th className="py-3.5 px-3 sm:px-5 text-right w-36 sm:w-44 whitespace-nowrap print-hide-col no-print">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {CATEGORY_ORDER.map((category) => {
                const info = CATEGORY_INFO[category];
                const rawItem = parts[category];
                const isMultiple = info.multiple;
                const items: SelectedItem[] = rawItem
                  ? Array.isArray(rawItem)
                    ? rawItem
                    : [rawItem]
                  : [];

                if (items.length === 0) {
                  // Empty state row with Frosted Glass look
                  return (
                    <tr key={category} className="hover:bg-white/[0.03] transition-colors group print-empty-row no-print">
                      <td className="py-3.5 px-3 sm:px-5 align-middle">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all shrink-0">
                            {ICON_MAP[info.iconName] || <Box className="w-4 h-4 sm:w-5 sm:h-5" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-slate-200 truncate">{info.label}</div>
                            <div className="text-[10px] text-slate-400 hidden sm:block truncate">{info.description}</div>
                          </div>
                        </div>
                      </td>
                      <td colSpan={5} className="py-3.5 px-3 sm:px-4 align-middle">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            id={`add-btn-${category}`}
                            onClick={() => onOpenPicker(category)}
                            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all backdrop-blur-md whitespace-nowrap"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Adicionar {info.label}</span>
                          </button>

                          {onCompareCategory && (
                            <button
                              id={`compare-category-btn-${category}`}
                              onClick={() => onCompareCategory(category)}
                              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10 transition-all backdrop-blur-md whitespace-nowrap"
                              title={`Comparar modelos de ${info.label}`}
                            >
                              <Scale className="w-3.5 h-3.5 text-blue-400" />
                              <span>Comparar</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }

                // Render selected item(s)
                return (
                  <React.Fragment key={category}>
                    {items.map((item, index) => {
                      const comp = item.component;
                      const qty = item.quantity || 1;
                      const isCustomPrice = item.customPriceCash !== undefined;
                      const unitCash = item.customPriceCash ?? comp.lowestPriceCash;
                      const unitInst = item.customPriceInstallments ?? comp.lowestPriceInstallments;
                      const priceCash = unitCash * qty;
                      const priceInst = unitInst * qty;
                      const activeStoreName = item.selectedStore || comp.stores.find(s => s.isLowest)?.storeName || comp.stores[0]?.storeName || 'Kabum';
                      const storeMatch = comp.stores.find(s => s.storeName === activeStoreName) || comp.stores[0];

                      return (
                        <tr key={`${category}-${index}`} className="hover:bg-white/[0.06] transition-colors">
                          {/* Component Type Header */}
                          <td className="py-3.5 px-3 sm:px-5 align-middle">
                            <div className="flex items-center gap-2.5 sm:gap-3">
                              <div className="p-2 sm:p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 print:border-slate-300 print:bg-slate-100 print:text-slate-700">
                                {ICON_MAP[info.iconName] || <Box className="w-4 h-4 sm:w-5 sm:h-5" />}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs sm:text-sm font-bold text-slate-200 print:text-slate-900 truncate">{info.label}</div>
                                {isMultiple && items.length > 1 && (
                                  <div className="text-[10px] text-slate-400 print:text-slate-600">Unidade #{index + 1}</div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Product Info */}
                          <td className="py-3.5 px-3 sm:px-4 align-middle">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={comp.image}
                                alt={comp.name}
                                className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-xl bg-slate-900 border border-white/10 shrink-0 print-component-img"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs sm:text-sm font-bold text-slate-100 print:text-slate-900 hover:text-blue-400 transition-colors leading-snug break-words">
                                  {comp.name}
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                  {comp.socket && (
                                    <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-semibold border border-white/10 whitespace-nowrap print-spec-badge">
                                      Socket {comp.socket}
                                    </span>
                                  )}
                                  {comp.memoryType && (
                                    <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-semibold border border-white/10 whitespace-nowrap print-spec-badge">
                                      {comp.memoryType}
                                    </span>
                                  )}
                                  {comp.tdpWattage && (
                                    <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20 whitespace-nowrap print-spec-badge">
                                      {comp.tdpWattage}W
                                    </span>
                                  )}
                                  {activeStoreName && (
                                    <>
                                      <SafeExternalLink
                                        id={`buy-btn-${category}-${index}`}
                                        href={getStoreProductUrl(activeStoreName, comp.name, storeMatch?.url, comp.id)}
                                        fallbackStore={activeStoreName}
                                        fallbackProductName={comp.name}
                                        fallbackProductId={comp.id}
                                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 hover:text-blue-200 font-bold border border-blue-500/30 hover:border-blue-400/50 whitespace-nowrap transition-colors group/store shadow-sm no-print"
                                        title={`Comprar ${comp.name} na loja ${activeStoreName} (Abre em nova aba com busca oficial codificada)`}
                                      >
                                        <Store className="w-3 h-3 text-blue-400" />
                                        <span>Comprar na {activeStoreName}</span>
                                        <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover/store:opacity-100 transition-opacity" />
                                      </SafeExternalLink>
                                      
                                      {/* Store name printed badge */}
                                      <span className="hidden print:inline-block print-spec-badge font-semibold">
                                        Loja: {activeStoreName}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                  <StorePriceLinksMenu partName={comp.name} buttonVariant="compact" />
                                  <span className="text-[10px] text-slate-500 mr-1 font-semibold uppercase tracking-wider hidden sm:inline-block">Atalhos:</span>
                                  {['Kabum', 'Terabyte', 'Pichau', 'Amazon BR', 'Mercado Livre'].map(store => (
                                    <SafeExternalLink
                                      key={store}
                                      href={getOfficialStoreSearchUrl(store, comp.name)}
                                      className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-blue-500/15 text-slate-400 hover:text-blue-300 border border-white/10 hover:border-blue-500/30 transition-colors no-print"
                                      title={`Buscar ${comp.name} na ${store}`}
                                    >
                                      {store}
                                    </SafeExternalLink>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Quantity */}
                          <td className="py-3.5 px-2 sm:px-3 text-center align-middle whitespace-nowrap">
                            {isMultiple ? (
                              <div className="inline-flex items-center border border-white/10 rounded-lg bg-white/5 p-0.5 backdrop-blur-md print:border-none print:bg-transparent">
                                <button
                                  id={`qty-minus-${category}-${index}`}
                                  onClick={() => onChangeQuantity(category, Math.max(1, qty - 1), index)}
                                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-white/10 text-xs font-bold transition-colors no-print"
                                >
                                  -
                                </button>
                                <span className="w-5 sm:w-6 text-center text-xs font-bold text-slate-200 print:text-slate-900">{qty}x</span>
                                <button
                                  id={`qty-plus-${category}-${index}`}
                                  onClick={() => onChangeQuantity(category, qty + 1, index)}
                                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-white/10 text-xs font-bold transition-colors no-print"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-slate-400 print:text-slate-900">1x</span>
                            )}
                          </td>

                          {/* Price Cash - Clickable to edit on screen, clean on print */}
                          <td className="py-3.5 px-3 sm:px-4 text-right align-middle whitespace-nowrap">
                            <button
                              onClick={() => handleStartEdit(category, item, index)}
                              className="group/price text-right inline-flex flex-col items-end hover:opacity-80 transition-all cursor-pointer no-print"
                              title="Clique para ajustar o preço conforme a oferta na loja"
                            >
                              <div className="flex items-center gap-1">
                                <span className="text-xs sm:text-sm font-mono font-bold text-blue-400 group-hover/price:underline">
                                  R$ {priceCash.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <Pencil className="w-2.5 h-2.5 text-slate-500 opacity-0 group-hover/price:opacity-100 transition-opacity" />
                              </div>
                              <div className="flex items-center gap-1 text-[10px]">
                                {isCustomPrice && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                    Manual
                                  </span>
                                )}
                                <span className="text-slate-400">no PIX/Boleto</span>
                              </div>
                            </button>

                            {/* Print version of cash price */}
                            <div className="hidden print:block text-right">
                              <div className="print-price-cash font-mono">
                                R$ {priceCash.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div className="text-[8pt] text-slate-500">à vista (PIX)</div>
                            </div>
                          </td>

                          {/* Price Installments */}
                          <td className="py-3.5 px-3 sm:px-4 text-right align-middle hidden xl:table-cell print-show-col whitespace-nowrap">
                            <div className="text-xs font-mono font-medium text-slate-300 print:text-slate-800 print-price-inst">
                              R$ {priceInst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-[10px] text-slate-400 print:text-slate-500 text-[7.5pt]">em até 12x</div>
                          </td>

                          {/* Actions - Hidden on print */}
                          <td className="py-3.5 px-3 sm:px-5 text-right align-middle whitespace-nowrap print-hide-col no-print">
                            <div className="flex items-center justify-end gap-1 sm:gap-1.5 shrink-0">
                              <button
                                id={`edit-price-btn-${category}-${index}`}
                                onClick={() => handleStartEdit(category, item, index)}
                                className="p-1.5 sm:p-2 rounded-lg bg-white/5 text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 border border-white/10 transition-colors backdrop-blur-md"
                                title="Ajustar preço / loja manualmente"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              {onCompareCategory && (
                                <button
                                  id={`compare-btn-${category}-${index}`}
                                  onClick={() => onCompareCategory(category, [comp])}
                                  className="p-1.5 sm:p-2 rounded-lg bg-white/5 text-slate-400 hover:text-blue-300 hover:bg-blue-500/10 border border-white/10 transition-colors backdrop-blur-md"
                                  title="Comparar com outras opções"
                                >
                                  <Scale className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                id={`change-btn-${category}-${index}`}
                                onClick={() => onOpenPicker(category)}
                                className="p-1.5 sm:p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors backdrop-blur-md"
                                title="Trocar por outra peça"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                              {onComparePrice && (
                                <button
                                  onClick={() => onComparePrice(item.component)}
                                  className="p-1.5 sm:p-2 px-2 sm:px-3 rounded-lg bg-blue-500/10 text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500/20 transition-all backdrop-blur-md flex items-center gap-1.5 shadow-lg shadow-blue-500/10 whitespace-nowrap"
                                  title="Comparar Preços nas Lojas"
                                >
                                  <Search className="w-3.5 h-3.5 shrink-0" />
                                  <span className="text-[10px] sm:text-xs font-bold hidden xl:inline">Lojas</span>
                                </button>
                              )}
                              <button
                                id={`remove-btn-${category}-${index}`}
                                onClick={() => onRemoveItem(category, index)}
                                className="p-1.5 sm:p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-white/10 transition-colors backdrop-blur-md"
                                title="Remover peça"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Add more button for multiple items */}
                    {isMultiple && (
                      <tr className="bg-white/[0.01] print-empty-row no-print">
                        <td colSpan={6} className="py-2.5 px-4 sm:px-6 text-right">
                          <button
                            id={`add-more-btn-${category}`}
                            onClick={() => onOpenPicker(category)}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 font-semibold transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Adicionar outro {info.label.toLowerCase()}</span>
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Helpful Price Tip banner */}
      <div className="flex items-start sm:items-center justify-between text-[11px] text-slate-300 px-3.5 py-2 rounded-xl bg-blue-950/30 border border-blue-500/20 shadow-sm no-print tips-banner">
        <div className="flex items-start sm:items-center gap-2">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong className="text-white font-semibold">Faixa de Preço Estimada / Média de Mercado:</strong> Os valores exibidos são referências e podem variar com frequência nas lojas (promoções relâmpago, cupons e estoque). Utilize o botão <strong className="text-blue-300">"Consultar na Loja"</strong> ou o <strong className="text-cyan-300">Radar em Tempo Real</strong> para conferir as ofertas de hoje.
          </span>
        </div>
      </div>

      {/* Interactive Price & Store Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Ajustar Preço da Peça</h3>
                  <p className="text-[11px] text-slate-400 truncate max-w-[260px]">
                    {editingItem.item.component.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Store Presets */}
            {editingItem.item.component.stores.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Sugestões da Base de Preços:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {editingItem.item.component.stores.map((s, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => {
                        setEditingItem({
                          ...editingItem,
                          cashInput: s.priceCash.toFixed(2),
                          installmentInput: s.priceInstallments.toFixed(2),
                          storeInput: s.storeName,
                        });
                      }}
                      className={`text-left p-2 rounded-xl border text-xs transition-all ${
                        editingItem.storeInput === s.storeName
                          ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{s.storeName}</span>
                        {s.isLowest && (
                          <span className="text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                            Menor
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                        R$ {s.priceCash.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Form Inputs */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Loja de Compra:
                </label>
                <select
                  value={editingItem.storeInput}
                  onChange={(e) => setEditingItem({ ...editingItem, storeInput: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Kabum">Kabum</option>
                  <option value="Terabyte">Terabyte</option>
                  <option value="Pichau">Pichau</option>
                  <option value="Amazon BR">Amazon BR</option>
                  <option value="Mercado Livre">Mercado Livre</option>
                  <option value="Outra Loja">Outra Loja</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    À Vista no PIX (R$):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.cashInput}
                    onChange={(e) => setEditingItem({ ...editingItem, cashInput: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-blue-400 font-bold focus:outline-none focus:border-blue-500"
                    placeholder="Ex: 899.99"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    A Prazo / Cartão (R$):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.installmentInput}
                    onChange={(e) => setEditingItem({ ...editingItem, installmentInput: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
                    placeholder="Ex: 1058.80"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                title="Voltar ao preço de referência original"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restaurar Padrão</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSavePrice}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Preço</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


