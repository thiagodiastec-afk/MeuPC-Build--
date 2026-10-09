const fs = require('fs');

let header = fs.readFileSync('src/components/Header.tsx', 'utf8');
header = header.replace("  user?: User | null;\n", "");
header = header.replace("  user?: User | null;\n", "");
header = header.replace("interface HeaderProps {\n", "interface HeaderProps {\n  user?: User | null;\n");
fs.writeFileSync('src/components/Header.tsx', header);

let drawer = fs.readFileSync('src/components/SavedBuildsDrawer.tsx', 'utf8');
drawer = drawer.replace("  user?: User | null;\n", "");
drawer = drawer.replace("  user?: User | null;\n", "");
drawer = drawer.replace("interface SavedBuildsDrawerProps {\n", "interface SavedBuildsDrawerProps {\n  user?: User | null;\n");
fs.writeFileSync('src/components/SavedBuildsDrawer.tsx', drawer);
