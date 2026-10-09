const fs = require('fs');
let code = fs.readFileSync('src/components/BuildTable.tsx', 'utf8');

code = code.replace(
  "  onUpdateItemPrice,\n}) => {",
  "  onUpdateItemPrice,\n  onComparePrice,\n}) => {"
);

fs.writeFileSync('src/components/BuildTable.tsx', code);
