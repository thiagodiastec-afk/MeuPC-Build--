const fs = require('fs');
let code = fs.readFileSync('src/components/BuildTable.tsx', 'utf8');

code = code.replace(
  "onCompareCategory: (category: ComponentCategory) => void;",
  "onCompareCategory: (category: ComponentCategory) => void;\n  onComparePrice?: (component: PCComponent) => void;"
);

code = code.replace(
  "  onCompareCategory,\n}: BuildTableProps)",
  "  onCompareCategory,\n  onComparePrice,\n}: BuildTableProps)"
);

const actionButtonsStr = `
                              <button
                                id={\`remove-btn-\${category}-\${index}\`}
`;

const newActionButtonsStr = `
                              {onComparePrice && (
                                <button
                                  onClick={() => onComparePrice(item.component)}
                                  className="p-1.5 sm:p-2 px-2 sm:px-3 rounded-lg bg-blue-500/10 text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500/20 transition-all backdrop-blur-md flex items-center gap-1.5 shadow-lg shadow-blue-500/10 whitespace-nowrap"
                                  title="Comparar Preços nas Lojas"
                                >
                                  <Search className="w-3.5 h-3.5 shrink-0" />
                                  <span className="text-[10px] sm:text-xs font-bold hidden xl:inline">Lojas</span>
                                </button>
                              )}
                              <button
                                id={\`remove-btn-\${category}-\${index}\`}
`;

code = code.replace(actionButtonsStr, newActionButtonsStr);

fs.writeFileSync('src/components/BuildTable.tsx', code);
