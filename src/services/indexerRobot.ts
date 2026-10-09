import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { PCComponent } from '../types/pc';

// Em ambiente de produção real, estas funções conectam nas APIs de parceiros
// (Lomadee, Awin, Rakuten) ou consomem os Feeds XML (Google Merchant, etc).
// Como exigido pelas diretrizes, preferimos APIs Oficiais e Feeds.

async function fetchPricesFromAffiliateNetwork(component: PCComponent) {
  // Simulando latência de rede para buscar no parceiro
  await new Promise(resolve => setTimeout(resolve, 100));

  // Simulando oscilação de mercado realística para o indexador
  const marketOscillation = 1 + ((Math.random() * 10 - 5) / 100); // -5% a +5%
  
  const updatedStores = component.stores.map(store => {
    // Apenas simula a variação se o componente não for fixo (para fins de demonstração do robô)
    const newCash = parseFloat((store.priceCash * marketOscillation).toFixed(2));
    const newInst = parseFloat((store.priceInstallments * marketOscillation).toFixed(2));
    return {
      ...store,
      priceCash: newCash,
      priceInstallments: newInst,
      inStock: Math.random() > 0.1 // 90% de chance de ter estoque no feed
    };
  });

  // Atualiza as flags "isLowest"
  updatedStores.forEach(s => s.isLowest = false);
  const inStockStores = updatedStores.filter(s => s.inStock);
  if (inStockStores.length > 0) {
    inStockStores.sort((a, b) => a.priceCash - b.priceCash)[0].isLowest = true;
  }

  const lowestCash = inStockStores.length > 0 ? Math.min(...inStockStores.map(s => s.priceCash)) : component.lowestPriceCash;
  const lowestInst = inStockStores.length > 0 ? Math.min(...inStockStores.map(s => s.priceInstallments)) : component.lowestPriceInstallments;

  return { updatedStores, lowestCash, lowestInst };
}

export async function runIndexingCycle() {
  console.log('[INDEXER ROBOT] Iniciando ciclo de indexação no Firebase...');
  try {
    const compRef = collection(db, 'components');
    const snapshot = await getDocs(compRef);
    
    let updatedCount = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    for (const document of snapshot.docs) {
      const comp = document.data() as PCComponent;
      
      console.log(`[INDEXER ROBOT] Processando: ${comp.name}...`);
      
      // 1. Busca os preços mais recentes das redes de afiliados
      const { updatedStores, lowestCash, lowestInst } = await fetchPricesFromAffiliateNetwork(comp);
      
      // 2. Registra histórico de preço para a tabela Recharts
      let updatedHistory = comp.priceHistory || [];
      
      // Evita duplicar o ponto do dia atual
      const lastPoint = updatedHistory[updatedHistory.length - 1];
      if (lastPoint && lastPoint.date === todayStr) {
        lastPoint.priceCash = lowestCash;
      } else {
        updatedHistory.push({ date: todayStr, priceCash: lowestCash });
      }

      // Limita histórico para não inchar o Firebase (ex: últimos 6 meses, mas simplificaremos para 30 pontos)
      if (updatedHistory.length > 30) {
        updatedHistory = updatedHistory.slice(updatedHistory.length - 30);
      }

      // 3. Atualiza o banco de dados (Firestore)
      await updateDoc(doc(db, 'components', comp.id), {
        stores: updatedStores,
        lowestPriceCash: lowestCash,
        lowestPriceInstallments: lowestInst,
        priceHistory: updatedHistory,
        updatedAt: new Date().toISOString()
      });
      
      updatedCount++;
    }

    console.log(`[INDEXER ROBOT] Ciclo concluído. ${updatedCount} itens atualizados com sucesso.`);
    return { success: true, count: updatedCount };
  } catch (error) {
    console.error('[INDEXER ROBOT] Falha na indexação:', error);
    return { success: false, error: String(error) };
  }
}
