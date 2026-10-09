const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf8');

code = code.replace(
  "hmr: process.env.DISABLE_HMR === 'true' ? false : { clientPort: 443 },",
  "hmr: process.env.DISABLE_HMR === 'true' ? { overlay: false } : { clientPort: 443, overlay: false },"
);

fs.writeFileSync('vite.config.ts', code);
