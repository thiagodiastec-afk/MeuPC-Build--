const fs = require('fs');

// Patch Header.tsx
let headerCode = fs.readFileSync('src/components/Header.tsx', 'utf8');
if (!headerCode.includes('onRunIndexer')) {
  headerCode = headerCode.replace('onSignOut?: () => void;', 'onSignOut?: () => void;\n  onRunIndexer?: () => void;\n  isIndexing?: boolean;');
  headerCode = headerCode.replace('onSignOut,\n}: HeaderProps) => {', 'onSignOut,\n  onRunIndexer,\n  isIndexing,\n}: HeaderProps) => {');
  
  const indexerBtn = `
            {/* Indexer Button */}
            <button
              onClick={onRunIndexer}
              disabled={isIndexing}
              className={\`flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold \${isIndexing ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white'} border border-white/10 backdrop-blur-md transition-all active:scale-95 whitespace-nowrap shrink-0\`}
              title="Rodar Robô de Indexação"
            >
              <span className="shrink-0">{isIndexing ? '⚙️' : '🤖'}</span>
              <span className="hidden xl:inline">{isIndexing ? 'Indexando...' : 'Robô de Busca'}</span>
            </button>
            <div className="hidden lg:block h-6 w-[1px] bg-white/10 shrink-0 mx-0.5" />
`;
  
  headerCode = headerCode.replace('{/* Presets */}', indexerBtn + '\n            {/* Presets */}');
  fs.writeFileSync('src/components/Header.tsx', headerCode);
}

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
if (!appCode.includes('handleRunIndexer')) {
  const indexerHook = `
  const [isIndexing, setIsIndexing] = useState(false);
  const handleRunIndexer = async () => {
    setIsIndexing(true);
    try {
      const response = await fetch('/api/run-indexer', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        alert(\`Robô finalizou a busca! \${data.count} componentes foram atualizados com os últimos preços dos feeds.\`);
      } else {
        alert('Erro ao rodar o robô de indexação.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro de rede ao conectar com o robô.');
    } finally {
      setIsIndexing(false);
    }
  };
`;
  
  appCode = appCode.replace('const handleSaveCurrentBuild', indexerHook + '\n  const handleSaveCurrentBuild');
  appCode = appCode.replace('onSignOut={signOut}', 'onSignOut={signOut}\n          onRunIndexer={handleRunIndexer}\n          isIndexing={isIndexing}');
  fs.writeFileSync('src/App.tsx', appCode);
}

