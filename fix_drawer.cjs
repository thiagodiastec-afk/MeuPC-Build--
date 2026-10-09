const fs = require('fs');
let code = fs.readFileSync('src/components/SavedBuildsDrawer.tsx', 'utf8');

code = code.replace("  user?: any;\n  onSignIn?: () => void;\n}", "}");

code = code.replace("  currentBuildName,\n}) => {", "  currentBuildName,\n  user,\n  onSignIn,\n}) => {");

fs.writeFileSync('src/components/SavedBuildsDrawer.tsx', code);
