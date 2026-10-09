const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const lines = code.split('\n');
const newLines = [];
let foundImport = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("import { RAW_COMPONENTS } from './src/data/componentsDatabase';")) {
    if (!foundImport) {
      foundImport = true;
      newLines.push(lines[i]);
    }
  } else {
    newLines.push(lines[i]);
  }
}

fs.writeFileSync('server.ts', newLines.join('\n'));
