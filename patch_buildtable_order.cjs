const fs = require('fs');
let code = fs.readFileSync('src/components/BuildTable.tsx', 'utf8');

code = code.replace(
  "  Keyboard,\n  Mouse,\n  Headphones,\n  Wind,\n  Store,",
  "  Keyboard,\n  Mouse,\n  Headphones,\n  Wind,\n  Store,\n  Armchair,\n  Mic,\n  Square,"
);

code = code.replace(
  "  'case_fan',\n  'keyboard',\n  'mouse',\n  'headset',\n];",
  "  'case_fan',\n  'keyboard',\n  'mouse',\n  'headset',\n  'mousepad',\n  'microphone',\n  'chair',\n];"
);

code = code.replace(
  "  Wind: <Wind className=\"w-5 h-5\" />,\n};",
  "  Wind: <Wind className=\"w-5 h-5\" />,\n  Armchair: <Armchair className=\"w-5 h-5\" />,\n  Mic: <Mic className=\"w-5 h-5\" />,\n  Square: <Square className=\"w-5 h-5\" />,\n};"
);

fs.writeFileSync('src/components/BuildTable.tsx', code);
