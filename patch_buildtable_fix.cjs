const fs = require('fs');
let code = fs.readFileSync('src/components/BuildTable.tsx', 'utf8');

code = code.replace(
  "onCompareCategory?: (category: ComponentCategory, preselected?: PCComponent[]) => void;",
  "onCompareCategory?: (category: ComponentCategory, preselected?: PCComponent[]) => void;\n  onComparePrice?: (component: PCComponent) => void;"
);

code = code.replace(
  "  onUpdateItemPrice,\n}: BuildTableProps",
  "  onUpdateItemPrice,\n  onComparePrice,\n}: BuildTableProps"
);

fs.writeFileSync('src/components/BuildTable.tsx', code);
