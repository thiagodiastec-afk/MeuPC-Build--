const fs = require('fs');
let code = fs.readFileSync('src/data/componentsDatabase.ts', 'utf8');

code = code.replace(
  "  headset: {\n    label: 'Headset / Fone',\n    iconName: 'Headphones',\n    description: 'Áudio imersivo e microfone para comunicação',\n  },\n};",
  "  headset: {\n    label: 'Headset / Fone',\n    iconName: 'Headphones',\n    description: 'Áudio imersivo e microfone para comunicação',\n  },\n  chair: {\n    label: 'Cadeira Gamer',\n    iconName: 'Armchair',\n    description: 'Conforto e ergonomia para longas horas',\n  },\n  microphone: {\n    label: 'Microfone',\n    iconName: 'Mic',\n    description: 'Microfone de mesa ou condensador',\n  },\n  mousepad: {\n    label: 'Mousepad',\n    iconName: 'Square',\n    description: 'Superfície para o seu mouse e teclado',\n  },\n};"
);

fs.writeFileSync('src/data/componentsDatabase.ts', code);
