// js/settingsManager.js

import { applyRiskManagement } from './riskManager.js';

export function initializeSettingsManager() {
  console.log("Initialisiere Einstellungen...");

  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    console.error("Kein aktueller Benutzer gefunden.");
    return;
  }

  // Schlüssel für den aktuellen Benutzer
  const settingsKey = `settings_${currentUser}`;
  const rulesKey = `rules_${currentUser}`;
  const checklistKey = `checklist_${currentUser}`;

  // Einstellungsrad Toggle
  const settingsWheel = document.querySelector(".settings-wheel");
  if (settingsWheel) {
    settingsWheel.addEventListener("click", function () {
      settingsWheel.classList.toggle("open");
      console.log("Settings Wheel geklickt");
    });
  } else {
    console.error('Element mit Klasse "settings-wheel" nicht gefunden.');
  }

  // Einstellungen verarbeiten
  const settingsForm = document.getElementById("settings-form");
  if (settingsForm) {
    settingsForm.addEventListener("change", function () {
      console.log("Einstellungen geändert");
      const riskManagement = document.getElementById("risk-management").checked;
      const maxRisk = parseFloat(document.getElementById("max-risk").value) || 2;
      const startingCapital = parseFloat(document.getElementById("starting-capital").value) || 1000;
      const maxTradesPerDay = parseInt(document.getElementById("max-trades-per-day").value) || 2;

      // Speichere die Einstellungen in localStorage unter einem benutzerspezifischen Schlüssel
      const settings = {
        riskManagement: riskManagement,
        maxRisk: riskManagement ? maxRisk : 2,
        startingCapital,
        maxTradesPerDay
      };
      localStorage.setItem(settingsKey, JSON.stringify(settings));
      console.log("Einstellungen gespeichert für", currentUser, ":", settings);

      // Enable/Disable max-risk input based on riskManagement checkbox
      document.getElementById("max-risk").disabled = !riskManagement;
    });
  } else {
    console.error('Element mit ID "settings-form" nicht gefunden.');
  }

  // Funktionen zum Hinzufügen von Regeln und Checklisten-Items
  const addRuleButton = document.getElementById("add-rule-button");
  const addChecklistItemButton = document.getElementById("add-checklist-item-button");

  if (addRuleButton) {
    addRuleButton.addEventListener("click", function () {
      const newRule = prompt("Gib die neue Trading-Regel ein:");
      if (newRule && newRule.trim() !== "") {
        addRule(currentUser, newRule.trim());
      } else {
        alert("Die Regel darf nicht leer sein!");
      }
    });
  }

  if (addChecklistItemButton) {
    addChecklistItemButton.addEventListener("click", function () {
      const newItem = prompt("Gib das neue Checklisten-Item ein:");
      if (newItem && newItem.trim() !== "") {
        addChecklistItem(currentUser, newItem.trim());
      } else {
        alert("Das Checklisten-Item darf nicht leer sein!");
      }
    });
  }

  // Einstellungen beim Laden wiederherstellen
  window.addEventListener("load", function () {
    console.log("Lade Einstellungen für Benutzer...");
    const settings = JSON.parse(localStorage.getItem(settingsKey)) || {};
    document.getElementById("risk-management").checked = settings.riskManagement || false;
    document.getElementById("max-risk").value = settings.maxRisk || 2;
    document.getElementById("max-risk").disabled = !settings.riskManagement;

    document.getElementById("starting-capital").value = settings.startingCapital || 1000;
    document.getElementById("max-trades-per-day").value = settings.maxTradesPerDay || 2;

    console.log("Einstellungen geladen für", currentUser, ":", settings);

    // Laden und Rendern der benutzerspezifischen Regeln und Checklisten
    loadAndRenderRules(currentUser, rulesKey);
    loadAndRenderChecklist(currentUser, checklistKey);
  });
}

function addRule(user, rule) {
  const rulesKey = `rules_${user}`;
  let rules = JSON.parse(localStorage.getItem(rulesKey)) || [
    "Maximal 2% des Kontos pro Trade riskieren.",
    "Maximal 2 Trades pro Tag.",
    "Kein Trading außerhalb der festgelegten Handelszeiten (z. B. 9–11 Uhr).",
    "Nach jedem verlorenen Trade eine Pause von 15 Minuten machen."
  ];
  rules.push(rule);
  localStorage.setItem(rulesKey, JSON.stringify(rules));
  renderRules(rules);
  console.log("Neue Regel hinzugefügt:", rule);
  alert(`Neue Regel hinzugefügt: "${rule}"`);
}

function addChecklistItem(user, item) {
  const checklistKey = `checklist_${user}`;
  let checklist = JSON.parse(localStorage.getItem(checklistKey)) || [
    "Ist der Trade gemäß den Regeln?",
    "Bin ich emotional stabil und klar im Kopf?",
    "Habe ich das Risiko berechnet?"
  ];
  checklist.push(item);
  localStorage.setItem(checklistKey, JSON.stringify(checklist));
  renderChecklist(checklist, user);
  console.log("Neues Checklisten-Item hinzugefügt:", item);
  alert(`Neues Checklisten-Item hinzugefügt: "${item}"`);
}

function loadAndRenderRules(user, key) {
  const rules = JSON.parse(localStorage.getItem(key)) || [
    "Maximal 2% des Kontos pro Trade riskieren.",
    "Maximal 2 Trades pro Tag.",
    "Kein Trading außerhalb der festgelegten Handelszeiten (z. B. 9–11 Uhr).",
    "Nach jedem verlorenen Trade eine Pause von 15 Minuten machen."
  ];
  renderRules(rules);
}

function renderRules(rules) {
  const rulesSection = document.getElementById("rules");
  if (rulesSection) {
    const ul = rulesSection.querySelector("ul");
    if (ul) {
      ul.innerHTML = ''; // Leere die Liste
      rules.forEach((rule, index) => {
        const li = document.createElement("li");
        li.textContent = rule;
        // Button zum Entfernen der Regel
        const removeButton = document.createElement("button");
        removeButton.innerHTML = '<i class="fas fa-trash"></i>';
        removeButton.classList.add("remove-rule-button");
        removeButton.addEventListener("click", () => removeRule(user, index));
        li.appendChild(removeButton);
        ul.appendChild(li);
      });
    } else {
      console.error('Element <ul> in der Regel-Sektion nicht gefunden.');
    }
  } else {
    console.error('Element mit ID "rules" nicht gefunden.');
  }
}

function removeRule(user, index) {
  const rulesKey = `rules_${user}`;
  let rules = JSON.parse(localStorage.getItem(rulesKey)) || [
    "Maximal 2% des Kontos pro Trade riskieren.",
    "Maximal 2 Trades pro Tag.",
    "Kein Trading außerhalb der festgelegten Handelszeiten (z. B. 9–11 Uhr).",
    "Nach jedem verlorenen Trade eine Pause von 15 Minuten machen."
  ];

  if (index >= 0 && index < rules.length) {
    const removedRule = rules.splice(index, 1);
    localStorage.setItem(rulesKey, JSON.stringify(rules));
    renderRules(rules);
    console.log("Regel entfernt:", removedRule);
    alert(`Regel entfernt: "${removedRule}"`);
  } else {
    console.error("Ungültiger Index zum Entfernen der Regel:", index);
  }
}

function loadAndRenderChecklist(user, key) {
  const checklist = JSON.parse(localStorage.getItem(key)) || [
    "Ist der Trade gemäß den Regeln?",
    "Bin ich emotional stabil und klar im Kopf?",
    "Habe ich das Risiko berechnet?"
  ];
  renderChecklist(checklist, user);
}

function renderChecklist(checklist, user) {
  const checklistForm = document.getElementById("checklist-form");
  if (checklistForm) {
    // Entferne bestehende Checklisten-Items außer dem Check-Button
    const existingItems = checklistForm.querySelectorAll(".checklist-item");
    existingItems.forEach(item => item.remove());

    checklist.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("checklist-item");
      div.setAttribute('draggable', 'true');
      div.dataset.index = index;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `custom-rule-${index}`;
      
      const label = document.createElement("label");
      label.htmlFor = `custom-rule-${index}`;
      label.textContent = item;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.classList.add("remove-checklist-item");
      removeButton.innerHTML = '<i class="fas fa-trash"></i>';
      removeButton.addEventListener("click", () => removeChecklistItem(user, index));

      div.appendChild(checkbox);
      div.appendChild(label);
      div.appendChild(removeButton);

      checklistForm.insertBefore(div, document.getElementById("check-button"));
    });

    // Füge Drag-and-Drop Event Listener hinzu
    addDragAndDropListeners();
  } else {
    console.error('Element mit ID "checklist-form" nicht gefunden.');
  }
}

function removeChecklistItem(user, index) {
  const checklistKey = `checklist_${user}`;
  let checklist = JSON.parse(localStorage.getItem(checklistKey)) || [
    "Ist der Trade gemäß den Regeln?",
    "Bin ich emotional stabil und klar im Kopf?",
    "Habe ich das Risiko berechnet?"
  ];
  if (index >= 0 && index < checklist.length) {
    const removedItem = checklist.splice(index, 1);
    localStorage.setItem(checklistKey, JSON.stringify(checklist));
    renderChecklist(checklist, user);
    console.log("Checklisten-Item entfernt:", removedItem);
    alert(`Checklisten-Item entfernt: "${removedItem}"`);
  } else {
    console.error("Ungültiger Index zum Entfernen des Checklisten-Items:", index);
  }
}

// Drag-and-Drop für Checklisten-Items
function addDragAndDropListeners() {
  const checklistForm = document.getElementById("checklist-form");
  const draggableItems = checklistForm.querySelectorAll(".checklist-item");

  draggableItems.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragend', handleDragEnd);
  });
}

let dragSrcEl = null;

function handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);
  this.classList.add('dragging');
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Ermöglicht Drop
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDrop(e) {
  if (dragSrcEl !== this) {
    e.stopPropagation();
    // Ersetze das HTML des aktuellen Elements mit dem des gezogenen Elements
    this.outerHTML = e.dataTransfer.getData('text/html');
    // Aktualisiere die lokale Speicherung
    updateChecklistOrder();
    // Reinitialisiere die Event Listener nach dem Drop
    initializeSettingsManager();
  }
  return false;
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
}

function updateChecklistOrder() {
  const checklistForm = document.getElementById("checklist-form");
  const checklistItems = checklistForm.querySelectorAll(".checklist-item");
  const newChecklist = [];

  checklistItems.forEach(item => {
    const text = item.querySelector("label").textContent.trim();
    newChecklist.push(text);
  });

  const currentUser = localStorage.getItem("currentUser");
  const checklistKey = `checklist_${currentUser}`;
  localStorage.setItem(checklistKey, JSON.stringify(newChecklist));
  console.log("Checklisten-Order aktualisiert:", newChecklist);
}
