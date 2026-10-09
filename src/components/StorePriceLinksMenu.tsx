import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, ChevronDown, Store, ShoppingBag } from 'lucide-react';

interface StorePriceLinksMenuProps {
  partName: string;
  className?: string;
  buttonVariant?: 'primary' | 'secondary' | 'compact' | 'pill';
}

interface StoreOption {
  name: string;
  url: string;
  tag: string;
  color: string;
  bg: string;
  border: string;
}

export function getStoreDeepLinks(partName: string): StoreOption[] {
  const enc = encodeURIComponent(partName.trim());
  return [
    {
      name: 'KaBuM!',
      url: `https://www.kabum.com.br/busca/${enc}`,
      tag: 'PIX com Desconto',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 hover:bg-orange-500/20',
      border: 'border-orange-500/30',
    },
    {
      name: 'TerabyteShop',
      url: `https://www.terabyteshop.com.br/busca?busca=${enc}`,
      tag: 'Melhor no PIX',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 hover:bg-amber-500/20',
      border: 'border-amber-500/30',
    },
    {
      name: 'Pichau',
      url: `https://www.pichau.com.br/search?q=${enc}`,
      tag: 'Frete Rápido',
      color: 'text-red-400',
      bg: 'bg-red-500/10 hover:bg-red-500/20',
      border: 'border-red-500/30',
    },
    {
      name: 'Amazon Brasil',
      url: `https://www.amazon.com.br/s?k=${enc}`,
      tag: 'Prime & Parcelado',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 hover:bg-cyan-500/20',
      border: 'border-cyan-500/30',
    },
    {
      name: 'Mercado Livre',
      url: `https://lista.mercadolivre.com.br/${enc}`,
      tag: 'Envio Full',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 hover:bg-yellow-500/20',
      border: 'border-yellow-500/30',
    },
  ];
}

export const StorePriceLinksMenu: React.FC<StorePriceLinksMenuProps> = ({
  partName,
  className = '',
  buttonVariant = 'secondary',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const stores = getStoreDeepLinks(partName);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const buttonStyles = {
    primary:
      'bg-blue-600/90 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/20 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all',
    secondary:
      'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all',
    compact:
      'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 hover:text-cyan-200 border border-cyan-500/20 px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all',
    pill:
      'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all',
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonStyles[buttonVariant]}
        title="Consultar preços em tempo real nas principais lojas do Brasil"
      >
        <Store className="w-3.5 h-3.5 text-cyan-400" />
        <span>Ver Preços nas Lojas</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/80 z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white">Cotação Direta nas Lojas</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">5 Lojas BR</span>
          </div>

          <p className="text-[11px] text-slate-400 mb-2.5 leading-tight line-clamp-1" title={partName}>
            Buscando: <span className="text-slate-200 font-medium">{partName}</span>
          </p>

          <div className="space-y-1.5">
            {stores.map((store) => (
              <a
                key={store.name}
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between p-2 rounded-xl border ${store.border} ${store.bg} transition-all group`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${store.color}`}>{store.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-slate-300 font-medium">
                    {store.tag}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-300 group-hover:text-white font-semibold">
                  <span>Ver Ofertas</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/10 text-[10px] text-slate-500 text-center">
            Abre a busca oficial da loja em nova aba com preços e estoque ao vivo
          </div>
        </div>
      )}
    </div>
  );
};
