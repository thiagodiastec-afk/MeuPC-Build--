const fs = require('fs');
let code = fs.readFileSync('src/components/PriceComparisonModal.tsx', 'utf8');

const newImports = `import React, { useState } from 'react';
import { X, ExternalLink, AlertCircle, ShoppingCart, CheckCircle2, Search, History, RefreshCw } from 'lucide-react';`;
code = code.replace(/import React from 'react';\nimport { X, ExternalLink, AlertCircle, ShoppingCart, CheckCircle2, Search, History } from 'lucide-react';/, newImports);

const newStates = `  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [verifiedPrices, setVerifiedPrices] = useState<Record<number, { priceCash: number, verified: boolean }>>({});

  const handleVerifyLive = async (idx: number, storeName: string, url: string, currentPrice: number) => {
    setVerifyingId(idx);
    try {
      const response = await fetch('/api/verify-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentName: component.name,
          storeName,
          url,
          currentPrice
        })
      });
      const data = await response.json();
      if (data.success) {
        setVerifiedPrices(prev => ({
          ...prev,
          [idx]: { priceCash: data.verifiedPrice, verified: data.found !== false }
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifyingId(null);
    }
  };`;

code = code.replace("  if (!isOpen || !component) return null;", newStates + "\n\n  if (!isOpen || !component) return null;");

const storeMapping = `        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {comparisonList.map((store, idx) => {
            const isVerifying = verifyingId === idx;
            const verifiedData = verifiedPrices[idx];
            const displayPriceCash = verifiedData?.priceCash || store.priceCash;
            const displayPriceInst = verifiedData?.priceCash ? verifiedData.priceCash * 1.15 : store.priceInstallments;
            
            return (
            <div 
              key={idx}`;

code = code.replace(/        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">\n          {comparisonList.map\(\(store, idx\) => \(\n            <div \n              key={idx}/, storeMapping);

const buttonMapping = `                    <div className="text-sm sm:text-lg font-black text-emerald-400 flex items-center justify-end gap-2">
                      R$ {displayPriceCash.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {verifiedData?.verified && <CheckCircle2 className="w-4 h-4 text-emerald-500" title="Preço atualizado e verificado ao vivo!" />}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400">
                      à vista no PIX
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      ou R$ {displayPriceInst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} a prazo
                    </div>
                  </div>
                ) : (
                  <div className="text-right text-xs text-slate-400">
                    Preço sob consulta
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  {store.isExact && !verifiedData && (
                    <button
                      onClick={() => handleVerifyLive(idx, store.storeName, store.url as string, store.priceCash)}
                      disabled={isVerifying}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] sm:text-xs transition-all shadow-md bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/30 w-full"
                    >
                      <RefreshCw className={\`w-3.5 h-3.5 \${isVerifying ? 'animate-spin' : ''}\`} />
                      {isVerifying ? 'Verificando...' : 'Verificar ao Vivo'}
                    </button>
                  )}
                  <button
                    onClick={() => openSafeExternalUrl(store.url as string)}
                    className={\`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 shrink-0 \${
                      store.isExact 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20' 
                        : 'bg-white/10 hover:bg-white/20 text-slate-200 shadow-black/20'
                    }\`}
                  >
                    {store.isExact ? (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span className="hidden sm:inline">Comprar</span>
                        <span className="sm:hidden">Ir</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Buscar</span>
                      </>
                    )}
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </button>
                </div>
              </div>
            </div>
          )})}
        </div>`;

// Use regex matching to replace from 'R$ {store.priceCash.toLocaleString' to the end of map
code = code.replace(/<div className="text-sm sm:text-lg font-black text-emerald-400">[\s\S]*?<\/div>\n\s*<\/div>\n\s*\)\)}\n\s*<\/div>/, buttonMapping);

fs.writeFileSync('src/components/PriceComparisonModal.tsx', code);
