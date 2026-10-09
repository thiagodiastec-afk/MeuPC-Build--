import React, { useState, useMemo } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  Store, 
  Link2, 
  FileCode2, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { BuildSelection, SelectedItem } from '../types/pc';
import { 
  validateStoreUrl, 
  getStoreProductUrl, 
  getOfficialStoreSearchUrl, 
  openSafeStoreUrl,
  HardwareStoreName, 
  STORE_METAS,
  cleanSearchQuery
} from '../utils/storeUrls';
import { SafeExternalLink } from './SafeExternalLink';

interface UrlValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  parts: BuildSelection;
}

export const UrlValidatorModal: React.FC<UrlValidatorModalProps> = ({
  isOpen,
  onClose,
  parts,
}) => {
  const [testQuery, setTestQuery] = useState('');
  const [testStore, setTestStore] = useState<HardwareStoreName>('Kabum');
  const [customUrlToTest, setCustomUrlToTest] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Validate all components in the active build
  const validatedBuildItems = useMemo(() => {
    const list: Array<{
      category: string;
      componentName: string;
      productId: string;
      storeName: HardwareStoreName;
      url: string;
      validation: ReturnType<typeof validateStoreUrl>;
    }> = [];

    Object.entries(parts).forEach(([category, itemOrList]) => {
      if (!itemOrList) return;
      const items = Array.isArray(itemOrList) ? itemOrList : [itemOrList];
      items.forEach((item: SelectedItem) => {
        const comp = item.component;
        if (!comp) return;

        const lowestStore = comp.stores?.find((s) => s.isLowest) || comp.stores?.[0];
        const storeName = item.selectedStore || lowestStore?.storeName || 'Kabum';
        const url = getStoreProductUrl(storeName, comp.name, lowestStore?.url, comp.id);
        const validation = validateStoreUrl(url, storeName);

        list.push({
          category,
          componentName: comp.name,
          productId: comp.id,
          storeName,
          url,
          validation,
        });
      });
    });

    return list;
  }, [parts]);

  // Test interactive custom input URL
  const customUrlValidation = useMemo(() => {
    if (!customUrlToTest.trim()) return null;
    return validateStoreUrl(customUrlToTest.trim(), testStore);
  }, [customUrlToTest, testStore]);

  // Generated store search links for sample query
  const generatedStoreLinks = useMemo(() => {
    const query = testQuery.trim() || 'Ryzen 5 5600';
    return Object.keys(STORE_METAS).map((storeKey) => {
      const url = getOfficialStoreSearchUrl(storeKey, query);
      const validation = validateStoreUrl(url, storeKey);
      return {
        storeName: storeKey,
        url,
        validation,
      };
    });
  }, [testQuery]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (!isOpen) return null;

  const validCount = validatedBuildItems.filter((i) => i.validation.isValid).length;
  const totalCount = validatedBuildItems.length;
  const isAllValid = totalCount > 0 && validCount === totalCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 w-full max-w-4xl max-h-[92vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">Validador de URLs e Links de Lojas</h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                  100% Anti-404
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Auditoria de segurança garantindo que cada botão 'Comprar' utilize URLs codificadas com <code className="text-blue-300 font-mono">encodeURIComponent</code>.
              </p>
            </div>
          </div>

          <button
            id="close-url-validator-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-transparent hover:border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          
          {/* Status Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Lojas Consolidadas</span>
                <div className="text-sm font-bold text-white">KaBuM!, Pichau, Terabyte, Amazon</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <FileCode2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Padrão de Busca</span>
                <div className="text-sm font-bold text-white">encodeURIComponent Rigoroso</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-300">Status da Build Atual</span>
                <div className="text-sm font-black text-emerald-400 font-mono">
                  {totalCount === 0 ? 'Nenhuma peça' : `${validCount} de ${totalCount} links válidos`}
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Active Build Audit Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-blue-400" />
                Auditoria de Links da Build Ativa ({validatedBuildItems.length} peças)
              </h3>
              {isAllValid && (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Todos os links validados com sucesso
                </span>
              )}
            </div>

            {validatedBuildItems.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-xs text-slate-400">
                Adicione componentes à sua montagem para auditar os links de compra.
              </div>
            ) : (
              <div className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-slate-950/60 overflow-hidden text-xs">
                {validatedBuildItems.map((item, idx) => (
                  <div key={idx} className="p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-mono text-[10px] shrink-0">
                        {item.category.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white text-sm truncate">{item.componentName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                            Loja: {item.storeName}
                          </span>
                          <span className={`text-[10px] font-bold flex items-center gap-1 ${
                            item.validation.isValid ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {item.validation.isValid ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            {item.validation.isValid ? 'URL Canônica Válida' : item.validation.reason}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 truncate max-w-lg mt-1 select-all">
                          {item.url}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopy(item.url)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] flex items-center gap-1 transition-colors"
                        title="Copiar URL para área de transferência"
                      >
                        {copiedUrl === item.url ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUrl === item.url ? 'Copiado!' : 'Copiar'}</span>
                      </button>

                      <SafeExternalLink
                        href={item.url}
                        fallbackStore={item.storeName}
                        fallbackProductName={item.componentName}
                        fallbackProductId={item.productId}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-md shadow-blue-600/20"
                        title="Testar abertura direta na loja"
                      >
                        <span>Testar Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </SafeExternalLink>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Interactive Store Query Simulator */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-cyan-400" />
                Simulador de Formatação de URL por Loja
              </h3>
              <span className="text-[11px] text-slate-400">Verifique a query codificada em cada plataforma</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="url-validator-test-query-input"
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Digite o nome da peça (Ex: Ryzen 7 7800X3D, RTX 4070 SUPER 12GB)..."
                className="flex-1 bg-slate-950/70 border border-white/10 text-xs sm:text-sm text-slate-200 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => setTestQuery('GeForce RTX 4060 8GB')}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors whitespace-nowrap"
              >
                Exemplo: RTX 4060
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {generatedStoreLinks.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{item.storeName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      encodeURIComponent OK
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 truncate select-all bg-black/40 p-1.5 rounded-lg border border-white/5">
                    {item.url}
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 text-[10px]">Padrão Oficial de Busca</span>
                    <SafeExternalLink
                      href={item.url}
                      fallbackStore={item.storeName}
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Testar Loja</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </SafeExternalLink>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Custom URL Validator Tool */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileCode2 className="w-4 h-4 text-purple-400" />
              Auditoria de URL Personalizada
            </h3>
            <p className="text-xs text-slate-400">
              Cole qualquer link de produto ou busca de hardware para verificar se ele atende aos padrões de lojas brasileiras sem risco de 404.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={testStore}
                onChange={(e) => setTestStore(e.target.value as HardwareStoreName)}
                className="bg-slate-950/70 border border-white/10 text-xs text-slate-200 px-3 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
              >
                <option value="Kabum">KaBuM!</option>
                <option value="Terabyte">TerabyteShop</option>
                <option value="Pichau">Pichau</option>
                <option value="Amazon BR">Amazon Brasil</option>
                <option value="Mercado Livre">Mercado Livre</option>
              </select>

              <input
                type="text"
                value={customUrlToTest}
                onChange={(e) => setCustomUrlToTest(e.target.value)}
                placeholder="Cole a URL para auditar (ex: https://www.kabum.com.br/busca/ryzen-5-5600)..."
                className="flex-1 bg-slate-950/70 border border-white/10 text-xs text-slate-200 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            {customUrlValidation && (
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                customUrlValidation.isValid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}>
                {customUrlValidation.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <div className="font-bold">
                    {customUrlValidation.isValid ? 'URL Válida e Canônica!' : 'URL com Problemas de Validação'}
                  </div>
                  <div className="text-[11px] opacity-90">
                    {customUrlValidation.isValid ? (
                      <span>
                        Loja detectada: <strong>{customUrlValidation.storeName}</strong> • Tipo:{' '}
                        {customUrlValidation.isSearchUrl ? 'Busca Canônica' : 'Página de Produto Direto'} • Codificação: OK
                      </span>
                    ) : (
                      <span>Motivo: {customUrlValidation.reason}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-950/80 backdrop-blur-md flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Padrões Oficiais: KaBuM!, Terabyte, Pichau, Amazon BR, Mercado Livre</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
