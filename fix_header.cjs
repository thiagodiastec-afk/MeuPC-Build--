const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace("onClearBuild: () => void;", "onClearBuild: () => void;\n  user?: any;\n  onSignIn?: () => void;\n  onSignOut?: () => void;");

code = code.replace("  onClearBuild,\n  totalCash", "  onClearBuild,\n  user,\n  onSignIn,\n  onSignOut,\n  totalCash");

fs.writeFileSync('src/components/Header.tsx', code);
