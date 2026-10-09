const fs = require('fs');
const code = fs.readFileSync('src/components/BuildTable.tsx', 'utf8');
if (!code.includes("'keyboard'")) {
  console.log("Needs update");
}
