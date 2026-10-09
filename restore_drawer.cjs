const fs = require('fs');
let code = fs.readFileSync('src/components/SavedBuildsDrawer.tsx', 'utf8');
code = code.replace("interface SavedBuildsDrawerProps {", "interface SavedBuildsDrawerProps {\n  user?: User | null;\n  onSignIn?: () => void;");
fs.writeFileSync('src/components/SavedBuildsDrawer.tsx', code);
