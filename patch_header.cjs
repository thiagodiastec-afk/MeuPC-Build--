const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(
  "interface HeaderProps {",
  `import { User } from 'firebase/auth';\n\ninterface HeaderProps {\n  user?: User | null;\n  onSignIn?: () => void;\n  onSignOut?: () => void;`
);

code = code.replace(
  "onClearBuild: () => void;\n}",
  "onClearBuild: () => void;\n  user?: any;\n  onSignIn?: () => void;\n  onSignOut?: () => void;\n}"
);

code = code.replace(
  "  onClearBuild,\n}: HeaderProps) => {",
  "  onClearBuild,\n  user,\n  onSignIn,\n  onSignOut,\n}: HeaderProps) => {"
);

const loginButtonHtml = `
            {/* User Auth */}
            {user ? (
              <button
                onClick={onSignOut}
                className="flex items-center gap-2 p-1 pr-3 sm:pr-4 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all shrink-0"
                title="Sair da Conta"
              >
                <img src={user.photoURL} alt="Avatar" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full" />
                <span className="text-[10px] sm:text-xs font-semibold hidden md:block truncate max-w-[100px]">{user.displayName?.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/20 backdrop-blur-md transition-all shrink-0 active:scale-95 border border-blue-500/50"
                title="Fazer login para salvar na nuvem"
              >
                <span className="hidden md:inline">Entrar</span>
                <span className="md:hidden">Login</span>
              </button>
            )}
            
            {/* Share / Export */}
`;

code = code.replace("{/* Share / Export */}", loginButtonHtml);

fs.writeFileSync('src/components/Header.tsx', code);
