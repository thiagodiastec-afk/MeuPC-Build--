const fs = require('fs');
let code = fs.readFileSync('src/types/pc.ts', 'utf8');

code = code.replace(
  "  | 'headset'\n  | 'case_fan';",
  "  | 'headset'\n  | 'case_fan'\n  | 'chair'\n  | 'microphone'\n  | 'mousepad';"
);

fs.writeFileSync('src/types/pc.ts', code);
