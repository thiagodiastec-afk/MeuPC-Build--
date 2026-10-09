const fs = require('fs');

function generatePriceHistory(basePrice) {
  const history = [];
  const now = new Date();
  
  // Generate 6 months of data
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 15);
    const dateStr = d.toISOString().split('T')[0];
    
    // Add some random fluctuation (-15% to +15%)
    const fluctuation = 1 + ((Math.random() * 30 - 15) / 100);
    const historyPrice = Math.round(basePrice * fluctuation * 100) / 100;
    
    history.push(`{ date: '${dateStr}', priceCash: ${historyPrice} }`);
  }
  return history.join(', ');
}

let code = fs.readFileSync('src/data/componentsDatabase.ts', 'utf8');

// Use regex to inject priceHistory after lowestPriceInstallments
code = code.replace(/(lowestPriceInstallments:\s*[\d.]+),/g, (match, p1) => {
  // We need to parse out the base price from somewhere nearby, but since regex replace is hard to track back, 
  // I will just extract it from the match itself if I were matching lowestPriceCash, but it's easier to match lowestPriceCash.
  return match;
});

// Better approach:
let updatedCode = code.replace(/lowestPriceCash:\s*([\d.]+),\s*lowestPriceInstallments:\s*([\d.]+),/g, (match, lowestCash, lowestInst) => {
  const base = parseFloat(lowestCash);
  const histStr = generatePriceHistory(base);
  return `${match}\n    priceHistory: [${histStr}],`;
});

fs.writeFileSync('src/data/componentsDatabase.ts', updatedCode);
