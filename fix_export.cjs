const fs = require('fs');
let code = fs.readFileSync('src/components/ExportShareModal.tsx', 'utf8');

code = code.replace("import { BuildSelection", "import { toPng } from 'html-to-image';\nimport { jsPDF } from 'jspdf';\nimport { Download, Image as ImageIcon } from 'lucide-react';\nimport { BuildSelection");

fs.writeFileSync('src/components/ExportShareModal.tsx', code);
