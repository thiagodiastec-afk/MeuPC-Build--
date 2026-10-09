const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace("  user?: any;\n  onSignIn?: () => void;\n  onSignOut?: () => void;\n}", "}");

fs.writeFileSync('src/components/Header.tsx', code);
