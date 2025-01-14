// js/riskManager.js

export function applyRiskManagement(newTrade, trades) {
  console.log("Überprüfe Risikomanagement...");
  const settings = JSON.parse(localStorage.getItem("settings")) || {};
  let isRiskOk = true;

  if (settings.riskManagement) {
    const maxRisk = settings.maxRisk || 2;
    const today = new Date().toLocaleDateString();

    // Berechne das bereits riskierten Risiko heute
    const todaysTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date).toLocaleDateString();
      return tradeDate === today;
    });

    // Berechne das bereits riskierten Risiko
    const totalRisked = todaysTrades.reduce((sum, trade) => {
      // Annahme: 'profit' repräsentiert das Risiko
      return sum + (trade.profit > 0 ? trade.profit : Math.abs(trade.profit));
    }, 0);

    const tradeRisk = newTrade.profit > 0 ? newTrade.profit : Math.abs(newTrade.profit);
    if ((totalRisked + tradeRisk) > maxRisk) {
      isRiskOk = false;
    }
  }

  // Überprüfe maximale Trades pro Tag
  const settingsForTrades = JSON.parse(localStorage.getItem("settings")) || {};
  const todayForTrades = new Date().toLocaleDateString();
  const todaysTradesForCount = trades.filter(trade => {
    const tradeDate = new Date(trade.date).toLocaleDateString();
    return tradeDate === todayForTrades;
  });

  if (todaysTradesForCount.length >= (settingsForTrades.maxTradesPerDay || 2)) {
    isRiskOk = false;
  }

  console.log("Risikomanagement Ergebnis:", isRiskOk);
  return isRiskOk;
}
