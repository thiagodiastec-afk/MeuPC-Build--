const fs = require('fs');
let code = fs.readFileSync('src/components/BuildTable.tsx', 'utf8');

code = code.replace(
  "  Store,\n  Scale,",
  "  Store,\n  Scale,\n  Armchair,\n  Mic,\n  Square,"
);

fs.writeFileSync('src/components/BuildTable.tsx', code);
