const fs = require('fs');
let code = fs.readFileSync('src/components/BuildTable.tsx', 'utf8');

code = code.replace(
  "  Headphones: <Headphones className=\"w-5 h-5\" />,\n};",
  "  Headphones: <Headphones className=\"w-5 h-5\" />,\n  Armchair: <Armchair className=\"w-5 h-5\" />,\n  Mic: <Mic className=\"w-5 h-5\" />,\n  Square: <Square className=\"w-5 h-5\" />,\n};"
);

fs.writeFileSync('src/components/BuildTable.tsx', code);
