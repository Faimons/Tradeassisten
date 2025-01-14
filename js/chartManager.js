// js/chartManager.js

let tradeChart;
let logChart;

export function initializeChartManager() {
  console.log("Initialisiere Charts...");
  
  // Chart.js Diagramm initialisieren
  const tradeCtx = document.getElementById('tradeChart').getContext('2d');
  tradeChart = new Chart(tradeCtx, {
    type: 'pie',
    data: {
      labels: ['Gewinne', 'Verluste'],
      datasets: [{
        label: '# deiner Trades',
        data: [0, 0],
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(244, 67, 54, 0.7)'
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(244, 67, 54, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Deine Trading-Performance'
        }
      }
    },
  });

  // Log-Chart initialisieren
  const logCtx = document.getElementById('logChart').getContext('2d');
  logChart = new Chart(logCtx, {
    type: 'line',
    data: {
      labels: [], // Datum
      datasets: [{
        label: 'Konto-Verlauf',
        data: [],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Konto-Verlauf'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Datum'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Kapital (€)'
          }
        }
      }
    },
  });
}

export function refreshCharts(trades) {
  console.log("Aktualisiere Charts mit Trades:", trades);
  updatePerformanceChart(trades);
  updateLogChart(trades);
  updateProfitLossRatio(trades);
}

function updatePerformanceChart(trades) {
  console.log("Aktualisiere Performance Chart...");
  let gewinne = 0;
  let verluste = 0;

  trades.forEach(trade => {
    const result = analyzeTrade(trade);
    if (result === 'Gewinn') gewinne++;
    if (result === 'Verlust') verluste++;
  });

  tradeChart.data.datasets[0].data = [gewinne, verluste];
  tradeChart.update();
}

function updateLogChart(trades) {
  console.log("Aktualisiere Log Chart...");
  const settings = JSON.parse(localStorage.getItem("settings")) || {};
  let capital = settings.startingCapital || 1000;
  const logData = [];
  const labels = [];

  trades.forEach(trade => {
    capital += trade.profit;
    labels.push(trade.date);
    logData.push(capital);
  });

  logChart.data.labels = labels;
  logChart.data.datasets[0].data = logData;
  logChart.update();
}

function updateProfitLossRatio(trades) {
  console.log("Aktualisiere Gewinn/Verlust-Verhältnis...");
  let gewinne = 0;
  let verluste = 0;

  trades.forEach(trade => {
    if (trade.profit > 0) gewinne++;
    if (trade.profit < 0) verluste++;
  });

  const ratio = verluste === 0 ? gewinne : (gewinne / verluste).toFixed(2);
  const ratioElement = document.getElementById("profit-loss-ratio");
  if (ratioElement) {
    ratioElement.textContent = `Gewinn/Verlust-Verhältnis: ${ratio}`;
  } else {
    console.error('Element mit ID "profit-loss-ratio" nicht gefunden.');
  }
}

function analyzeTrade(trade) {
  if (trade.profit > 0) {
    return 'Gewinn';
  } else if (trade.profit < 0) {
    return 'Verlust';
  } else {
    return null;
  }
}
