const fs = require('fs');
let code = fs.readFileSync('src/data/componentsDatabase.ts', 'utf8');

code = code.replace(/priceCash:\s*([\d.]+)/g, (match, p1) => {
  return `priceCash: ${(parseFloat(p1) * 2.8).toFixed(2)}`;
});

code = code.replace(/priceInstallments:\s*([\d.]+)/g, (match, p1) => {
  return `priceInstallments: ${(parseFloat(p1) * 2.8).toFixed(2)}`;
});

code = code.replace(/lowestPriceCash:\s*([\d.]+)/g, (match, p1) => {
  return `lowestPriceCash: ${(parseFloat(p1) * 2.8).toFixed(2)}`;
});

code = code.replace(/lowestPriceInstallments:\s*([\d.]+)/g, (match, p1) => {
  return `lowestPriceInstallments: ${(parseFloat(p1) * 2.8).toFixed(2)}`;
});

fs.writeFileSync('src/data/componentsDatabase.ts', code);
