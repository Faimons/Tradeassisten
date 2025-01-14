// js/checklist.js

export function initializeChecklist() {
  console.log("Initialisiere Checkliste...");
  const checkButton = document.getElementById("check-button");
  if (checkButton) {
    checkButton.addEventListener("click", function () {
      console.log("Check-Button geklickt");
      
      // Sammle alle benutzerdefinierten Checklisten-Items
      const checklistForm = document.getElementById("checklist-form");
      const checkboxes = checklistForm.querySelectorAll("input[type='checkbox']");
      let allChecked = true;
      checkboxes.forEach(cb => {
        if (!cb.checked) {
          allChecked = false;
        }
      });

      const result = document.getElementById("checklist-result");

      if (allChecked) {
        result.textContent = "✅ Alle Regeln eingehalten! Du kannst traden.";
        result.classList.remove("red");
        result.classList.add("green");
      } else {
        result.textContent = "❌ Regeln nicht eingehalten! Kein Trading erlaubt.";
        result.classList.remove("green");
        result.classList.add("red");
      }
    });
  } else {
    console.error('Element mit ID "check-button" nicht gefunden.');
  }
}
