const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');
code = code.replace("interface HeaderProps {", "interface HeaderProps {\n  user?: User | null;\n  onSignIn?: () => void;\n  onSignOut?: () => void;");
fs.writeFileSync('src/components/Header.tsx', code);
