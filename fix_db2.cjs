const fs = require('fs');
let code = fs.readFileSync('src/data/componentsDatabase.ts', 'utf8');

code = code.replace(
  "  }\n];\n\nexport const RAW_COMPONENTS = [",
  "  },"
);

fs.writeFileSync('src/data/componentsDatabase.ts', code);
