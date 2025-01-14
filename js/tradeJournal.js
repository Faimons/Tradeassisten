// js/tradeJournal.js

export function updateJournal(trade) {
  console.log("Aktualisiere Journal mit Trade:", trade);
  const list = document.getElementById("entries-list");
  if (list) {
    const entry = document.createElement("li");
    entry.innerHTML = `
      <strong>${trade.date}</strong><br>
      ${trade.symbol ? `Symbol: ${trade.symbol}<br>` : ''}
      ${trade.type ? `Typ: ${trade.type}<br>` : ''}
      ${trade.lot ? `Lot: ${trade.lot}<br>` : ''}
      ${trade.openprice ? `Einstieg: ${trade.openprice}<br>` : ''}
      ${trade.closeprice ? `Ausstieg: ${trade.closeprice}<br>` : ''}
      ${trade.profit ? `Profit/Verlust: ${trade.profit}<br>` : ''}
      ${trade.comment ? `Kommentar: ${trade.comment}<br>` : ''}
    `;
    list.appendChild(entry);
  } else {
    console.error('Element mit ID "entries-list" nicht gefunden.');
  }
}

export function renderJournal(trades) {
  console.log("Rendern des Journals mit Trades:", trades);
  const list = document.getElementById("entries-list");
  if (list) {
    list.innerHTML = ''; // Liste leeren

    trades.forEach(trade => {
      const entry = document.createElement("li");
      entry.innerHTML = `
        <strong>${trade.date}</strong><br>
        ${trade.symbol ? `Symbol: ${trade.symbol}<br>` : ''}
        ${trade.type ? `Typ: ${trade.type}<br>` : ''}
        ${trade.lot ? `Lot: ${trade.lot}<br>` : ''}
        ${trade.openprice ? `Einstieg: ${trade.openprice}<br>` : ''}
        ${trade.closeprice ? `Ausstieg: ${trade.closeprice}<br>` : ''}
        ${trade.profit ? `Profit/Verlust: ${trade.profit}<br>` : ''}
        ${trade.comment ? `Kommentar: ${trade.comment}<br>` : ''}
      `;
      list.appendChild(entry);
    });
  } else {
    console.error('Element mit ID "entries-list" nicht gefunden.');
  }
}
