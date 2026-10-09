const fs = require('fs');
let code = fs.readFileSync('src/data/componentsDatabase.ts', 'utf8');

// Find the line "};" after headset: {...}
// Replace the stray object literals with a proper array assignment.

code = code.replace(
  /};\s+{\s+id: 'chair-thunderx3-tc3'/g,
  "};\n\nexport const RAW_COMPONENTS: PCComponent[] = [\n  {\n    id: 'chair-thunderx3-tc3'"
);

// We need to remove the trailing part that we incorrectly added.
// Let's search for "export const RAW_COMPONENTS = [" and remove it if it's there.
code = code.replace(
  /\nexport const RAW_COMPONENTS = \[\n  \{\n    id: 'cpu-amd-r5-5600',/g,
  ",\n  {\n    id: 'cpu-amd-r5-5600',"
);

fs.writeFileSync('src/data/componentsDatabase.ts', code);
