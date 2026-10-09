import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Printer, 
  MessageSquare, 
  Code2, 
  Link2,
  FileText
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Download, Image as ImageIcon } from 'lucide-react';
import { BuildSelection, SelectedItem } from '../types/pc';
import { openSafeExternalUrl } from '../utils/urlManager';

interface ExportShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  buildName: string;
  parts: BuildSelection;
  totalCash: number;
  totalInstallments: number;
}

export const ExportShareModal: React.FC<ExportShareModalProps> = ({
  isOpen,
  onClose,
  buildName,
  parts,
  totalCash,
  totalInstallments,
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'markdown' | 'whatsapp' | 'bbcode'>('link');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://meupc.net/build';

  // Generate formatted Markdown
  const generateMarkdown = () => {
    let md = `## 💻 ${buildName}\n\n`;
    md += `| Componente | Peça Selecionada | Loja / Melhor Oferta | À Vista (PIX) | A Prazo |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;

    Object.entries(parts).forEach(([category, itemOrList]) => {
      if (!itemOrList) return;
      const items = Array.isArray(itemOrList) ? itemOrList : [itemOrList];
      items.forEach((item: SelectedItem) => {
        const qty = item.quantity || 1;
        const priceCash = (item.customPriceCash ?? item.component.lowestPriceCash) * qty;
        const priceInst = (item.customPriceInstallments ?? item.component.lowestPriceInstallments) * qty;
        const name = qty > 1 ? `${item.component.name} (${qty}x)` : item.component.name;
        const store = item.selectedStore || item.component.stores?.find(s => s.isLowest)?.storeName || 'Melhor Oferta';
        md += `| **${category.toUpperCase()}** | ${name} | ${store} | R$ ${priceCash.toFixed(2)} | R$ ${priceInst.toFixed(2)} |\n`;
      });
    });

    md += `\n**Total à Vista (PIX/Boleto):** R$ ${totalCash.toFixed(2)}\n`;
    md += `**Total a Prazo (Cartão):** R$ ${totalInstallments.toFixed(2)}\n`;
    md += `\n*Montado e verificado no MeuPC Build com preços em tempo real*\n`;
    return md;
  };

  // Generate BBCode for old-school forums (Adrenaline, Clube do Hardware)
  const generateBBCode = () => {
    let bb = `[b]Configuração: ${buildName}[/b]\n\n`;
    Object.entries(parts).forEach(([cat, itemOrList]) => {
      if (!itemOrList) return;
      const items = Array.isArray(itemOrList) ? itemOrList : [itemOrList];
      items.forEach(i => {
        const store = i.selectedStore || i.component.stores?.find(s => s.isLowest)?.storeName || 'Melhor Oferta';
        bb += `[b]${cat.toUpperCase()}:[/b] ${i.component.name} - R$ ${i.component.lowestPriceCash.toFixed(2)} (PIX na ${store})\n`;
      });
    });
    bb += `\n[b]Total à Vista (PIX):[/b] R$ ${totalCash.toFixed(2)}`;
    bb += `\n[b]Total a Prazo (Cartão):[/b] R$ ${totalInstallments.toFixed(2)}`;
    return bb;
  };

  // Generate WhatsApp formatted text
  const generateWhatsAppText = () => {
    let text = `*💻 Minha Build: ${buildName}*\n\n`;
    Object.entries(parts).forEach(([cat, itemOrList]) => {
      if (!itemOrList) return;
      const items = Array.isArray(itemOrList) ? itemOrList : [itemOrList];
      items.forEach(i => {
        const qty = i.quantity || 1;
        const price = (i.customPriceCash ?? i.component.lowestPriceCash) * qty;
        const store = i.selectedStore || i.component.stores?.find(s => s.isLowest)?.storeName || 'Melhor Oferta';
        text += `• *${cat.toUpperCase()}:* ${i.component.name} ${qty > 1 ? `(${qty}x)` : ''} - R$ ${price.toFixed(2)} (PIX - ${store})\n`;
      });
    });
    text += `\n💵 *Total à Vista (PIX):* R$ ${totalCash.toFixed(2)}\n`;
    text += `💳 *Total a Prazo (Cartão):* R$ ${totalInstallments.toFixed(2)}\n`;
    text += `\n🔗 Link da configuração: ${currentUrl}`;
    return text;
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppText());
    openSafeExternalUrl(`https://api.whatsapp.com/send?text=${text}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Compartilhar ou Exportar Build</h2>
              <p className="text-xs text-slate-400">Envie para amigos, fóruns ou salve o orçamento</p>
            </div>
          </div>

          <button
            id="close-export-share-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-transparent hover:border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 bg-white/[0.02] backdrop-blur-md px-6 pt-2 gap-2">
          {[
            { id: 'link', label: 'Link Direto', icon: Link2 },
            { id: 'markdown', label: 'Markdown / Reddit', icon: FileText },
            { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
            { id: 'bbcode', label: 'Fóruns (Adrenaline)', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div className="bg-white/[0.03] backdrop-blur-md p-4 rounded-xl border border-white/10">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Link da sua Build</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 bg-slate-950/60 text-slate-200 text-xs px-3 py-2 rounded-lg border border-white/10 font-mono select-all backdrop-blur-md"
                  />
                  <button
                    id="copy-link-btn"
                    onClick={() => handleCopy(currentUrl)}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/20"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] backdrop-blur-md border border-white/10 text-xs text-slate-400 space-y-2">
                <p>💡 Qualquer pessoa que abrir este link verá exatamente as peças que você selecionou e o cálculo atualizado dos preços no Brasil.</p>
              </div>
            </div>
          )}

          {activeTab === 'markdown' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Tabela formatada para Reddit, GitHub e Clube do Hardware:</span>
                <button
                  id="copy-markdown-btn"
                  onClick={() => handleCopy(generateMarkdown())}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Markdown'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={10}
                value={generateMarkdown()}
                className="w-full bg-slate-950/60 backdrop-blur-md text-slate-300 text-xs font-mono p-3 rounded-xl border border-white/10 select-all"
              />
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Texto pronto para enviar no WhatsApp:</span>
                <button
                  id="open-whatsapp-btn"
                  onClick={handleOpenWhatsApp}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enviar no WhatsApp</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={10}
                value={generateWhatsAppText()}
                className="w-full bg-slate-950/60 backdrop-blur-md text-slate-300 text-xs font-mono p-3 rounded-xl border border-white/10 select-all"
              />
            </div>
          )}

          {activeTab === 'bbcode' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Formato BBCode para Adrenaline e Fóruns:</span>
                <button
                  id="copy-bbcode-btn"
                  onClick={() => handleCopy(generateBBCode())}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar BBCode'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                value={generateBBCode()}
                className="w-full bg-slate-950/60 backdrop-blur-md text-slate-300 text-xs font-mono p-3 rounded-xl border border-white/10 select-all"
              />
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-slate-950/60 backdrop-blur-md flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar em PDF</span>
          </button>


          <div className="flex gap-2">
            <button
              onClick={async () => {
                const el = document.getElementById('build-table-capture');
                if (el) {
                  const dataUrl = await toPng(el, { backgroundColor: '#020617' });
                  const link = document.createElement('a');
                  link.download = 'meu-pc-build.png';
                  link.href = dataUrl;
                  link.click();
                }
              }}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Salvar Imagem</span>
            </button>
            <button
              onClick={async () => {
                const el = document.getElementById('build-table-capture');
                if (el) {
                  const dataUrl = await toPng(el, { backgroundColor: '#020617' });
                  const pdf = new jsPDF('p', 'mm', 'a4');
                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  const imgProps = pdf.getImageProperties(dataUrl);
                  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                  pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
                  pdf.save('meu-pc-build.pdf');
                }
              }}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Baixar PDF</span>
            </button>
          </div>
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
