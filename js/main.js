// js/main.js

import { initializeChecklist } from './checklist.js';
import { initializeTradeManager } from './tradeManager.js';
import { initializeSettingsManager } from './settingsManager.js';
import { initializeChartManager } from './chartManager.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log("Initialisiere Module...");
  initializeLogin();
});

// Registriere den Service Worker für die PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

function initializeLogin() {
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button"); // Logout-Button im Header

  if (loginButton) {
    loginButton.addEventListener("click", function () {
      const username = document.getElementById("username").value.trim();
      if (username) {
        console.log("Benutzer eingeloggt:", username);
        // Speichere den aktuellen Benutzer
        localStorage.setItem("currentUser", username);
        // Zeige den Hauptinhalt und verstecke das Login
        document.getElementById("login").style.display = "none";
        document.getElementById("main-content").style.display = "block";
        // Zeige den Logout-Button
        logoutButton.style.display = "inline-block";
        // Initialisiere die Module mit benutzerspezifischen Einstellungen
        initializeSettingsManager();
        initializeChecklist();
        initializeChartManager();
        initializeTradeManager();
      } else {
        alert("Bitte gib einen Benutzernamen ein!");
      }
    });
  } else {
    console.error('Element mit ID "login-button" nicht gefunden.');
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        console.log("Benutzer abgemeldet:", currentUser);
        // Entferne den aktuellen Benutzer aus localStorage
        localStorage.removeItem("currentUser");
        // Verstecke den Hauptinhalt und zeige das Login
        document.getElementById("main-content").style.display = "none";
        document.getElementById("login").style.display = "block";
        // Verstecke den Logout-Button
        logoutButton.style.display = "none";
        // Optional: Reset-Formulare und andere UI-Elemente
      }
    });
  } else {
    console.error('Element mit ID "logout-button" nicht gefunden.');
  }

  // Überprüfe, ob ein Benutzer bereits eingeloggt ist
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    console.log("Benutzer bereits eingeloggt:", currentUser);
    document.getElementById("login").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    // Zeige den Logout-Button
    logoutButton.style.display = "inline-block";
    initializeSettingsManager();
    initializeChecklist();
    initializeChartManager();
    initializeTradeManager();
  }
}
