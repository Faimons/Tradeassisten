// js/tradeManager.js

import { applyRiskManagement } from './riskManager.js';
import { updateJournal, renderJournal } from './tradeJournal.js';
import { refreshCharts } from './chartManager.js';

export function initializeTradeManager() {
  console.log("Initialisiere Trade Manager...");
  let trades = [];

  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    console.error("Kein aktueller Benutzer gefunden.");
    return;
  }

  // Schlüssel für die Trades des aktuellen Benutzers
  const tradesKey = `trades_${currentUser}`;

  // Laden der Trades aus localStorage beim Laden der Seite
  window.addEventListener("load", function () {
    const storedTrades = JSON.parse(localStorage.getItem(tradesKey)) || [];
    trades = storedTrades;
    renderJournal(trades);
    refreshCharts(trades);
    console.log("Trades geladen für", currentUser, ":", trades);
  });

  // Manueller Trade speichern
  const manualSaveButton = document.getElementById("manual-save-button");
  if (manualSaveButton) {
    manualSaveButton.addEventListener("click", function () {
      console.log("Manueller Save Button geklickt");
      const symbol = document.getElementById("symbol").value.trim();
      const type = document.getElementById("type").value;
      const lot = parseFloat(document.getElementById("lot").value);
      const openprice = parseFloat(document.getElementById("openprice").value);
      const closeprice = parseFloat(document.getElementById("closeprice").value) || 0;
      const profit = parseFloat(document.getElementById("profit").value) || 0;
      const comment = document.getElementById("comment").value.trim();

      console.log("Eingegebene Werte:", { symbol, type, lot, openprice, closeprice, profit, comment });

      if (symbol && type && lot > 0 && openprice > 0) {
        const trade = {
          symbol,
          type,
          lot,
          openprice,
          closeprice,
          profit,
          comment,
          date: new Date().toLocaleString()
        };

        if (applyRiskManagement(trade, trades)) {
          saveTrade(trade);
          document.getElementById("manual-trade-form").reset();
        } else {
          alert("Maximales Risiko pro Tag überschritten oder maximale Trades pro Tag erreicht!");
        }
      } else {
        alert("Bitte fülle alle erforderlichen Felder aus!");
      }
    });
  } else {
    console.error('Element mit ID "manual-save-button" nicht gefunden.');
  }

  // Funktion zum Speichern von Trades
  function saveTrade(trade) {
    console.log("Speichere Trade:", trade);
    trades.push(trade);
    localStorage.setItem(tradesKey, JSON.stringify(trades));
    updateJournal(trade);
    refreshCharts(trades);
    console.log("Trade gespeichert und Charts aktualisiert.");
  }
}
