const fs = require('fs');
let code = fs.readFileSync('src/components/SavedBuildsDrawer.tsx', 'utf8');

code = code.replace(
  "interface SavedBuildsDrawerProps {",
  `import { User } from 'firebase/auth';\n\ninterface SavedBuildsDrawerProps {\n  user?: User | null;\n  onSignIn?: () => void;`
);

code = code.replace(
  "currentBuildName: string;\n}",
  "currentBuildName: string;\n  user?: any;\n  onSignIn?: () => void;\n}"
);

code = code.replace(
  "  currentBuildName,\n}: SavedBuildsDrawerProps) => {",
  "  currentBuildName,\n  user,\n  onSignIn,\n}: SavedBuildsDrawerProps) => {"
);

const loginPromptHtml = `
        {/* Save Current Build Prompt */}
        {!user && (
          <div className="p-3 bg-blue-500/10 border-b border-blue-500/20 text-center flex flex-col items-center gap-2">
            <span className="text-[11px] text-blue-300 font-medium">Faça login para salvar suas builds na nuvem e não perder nada!</span>
            <button onClick={onSignIn} className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg transition-colors">
              Fazer Login com Google
            </button>
          </div>
        )}
        <div className="p-4 bg-white/[0.02] backdrop-blur-md border-b border-white/10 space-y-3">
`;

code = code.replace(`        {/* Save Current Build Prompt */}\n        <div className="p-4 bg-white/[0.02] backdrop-blur-md border-b border-white/10 space-y-3">`, loginPromptHtml);

fs.writeFileSync('src/components/SavedBuildsDrawer.tsx', code);
