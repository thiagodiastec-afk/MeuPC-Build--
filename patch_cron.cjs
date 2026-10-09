const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const importCron = `import cron from 'node-cron';\n`;
if (!code.includes('import cron')) {
  code = code.replace("import express from 'express';", "import express from 'express';\n" + importCron);
  
  const cronJob = `
// ==========================================
// BACKGROUND CRON JOBS
// ==========================================
// Roda o robô de indexação a cada 1 hora para simular a varredura das lojas parceiras
cron.schedule('0 * * * *', async () => {
  console.log('[CRON] Iniciando robô de indexação automático (de hora em hora)...');
  try {
    const result = await runIndexingCycle();
    console.log('[CRON] Robô finalizado com sucesso:', result);
  } catch (error) {
    console.error('[CRON] Erro ao rodar o robô de indexação:', error);
  }
});
`;

  code = code.replace("async function startServer() {", cronJob + "\nasync function startServer() {");
  fs.writeFileSync('server.ts', code);
}
