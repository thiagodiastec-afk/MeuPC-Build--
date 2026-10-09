const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
code = code.replace(
  "import { ComponentComparisonModal } from './components/ComponentComparisonModal';",
  "import { ComponentComparisonModal } from './components/ComponentComparisonModal';\nimport { PriceComparisonModal } from './components/PriceComparisonModal';"
);

// Fallback if it's dynamically imported:
code = code.replace(
  "const ComponentComparisonModal = lazy(() => import('./components/ComponentComparisonModal').then(m => ({ default: m.ComponentComparisonModal })));",
  "const ComponentComparisonModal = lazy(() => import('./components/ComponentComparisonModal').then(m => ({ default: m.ComponentComparisonModal })));\nconst PriceComparisonModal = lazy(() => import('./components/PriceComparisonModal').then(m => ({ default: m.PriceComparisonModal })));"
);

// Add state
code = code.replace(
  "  const [compareCategory, setCompareCategory] = useState<ComponentCategory>('cpu');",
  "  const [compareCategory, setCompareCategory] = useState<ComponentCategory>('cpu');\n  const [priceCompareComponent, setPriceCompareComponent] = useState<PCComponent | null>(null);"
);

// Add onComparePrice to BuildTable
code = code.replace(
  "              onCompareCategory={handleOpenCompare}",
  "              onCompareCategory={handleOpenCompare}\n              onComparePrice={(comp) => setPriceCompareComponent(comp)}"
);

// Add Modal component in JSX
const modalJSX = `
        {priceCompareComponent && (
          <PriceComparisonModal
            isOpen={!!priceCompareComponent}
            onClose={() => setPriceCompareComponent(null)}
            component={priceCompareComponent}
          />
        )}
`;
code = code.replace(
  "        {isCompareOpen && (",
  modalJSX + "        {isCompareOpen && ("
);

fs.writeFileSync('src/App.tsx', code);
