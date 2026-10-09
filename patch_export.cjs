const fs = require('fs');
let code = fs.readFileSync('src/components/ExportShareModal.tsx', 'utf8');

const imports = `import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Download, Image as ImageIcon } from 'lucide-react';
`;
code = code.replace("import { Share2, Copy, Check, X, Link2, FileText, Code2, MessageSquare, Printer } from 'lucide-react';", 
"import { Share2, Copy, Check, X, Link2, FileText, Code2, MessageSquare, Printer, Download, Image as ImageIcon } from 'lucide-react';\nimport { toPng } from 'html-to-image';\nimport { jsPDF } from 'jspdf';");

const exportHtml = `
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
`;
code = code.replace(`          <button\n            onClick={onClose}`, exportHtml);

fs.writeFileSync('src/components/ExportShareModal.tsx', code);
