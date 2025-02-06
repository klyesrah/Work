/* disease.js: Handles disease detection using a detailed symptom database */

const diseaseDatabase = {
    "coughing": "Avian Influenza",
    "diarrhea": "Salmonella",
    "swollen eyes": "Newcastle Disease",
    "lethargy": "Marek’s Disease",
    "ruffled feathers": "Fowl Pox",
    "weak legs": "Vitamin D Deficiency",
    "pale comb": "Anemia",
    "gasping for air": "Respiratory Infection"
  };
  
  function checkDisease() {
    const symptom = document.getElementById("symptomInput").value.toLowerCase();
    let result = "No known disease detected. If symptoms persist, consult a veterinarian.";
    for (const key in diseaseDatabase) {
      if (symptom.includes(key)) {
        result = `Possible Disease: ${diseaseDatabase[key]}`;
        break;
      }
    }
    document.getElementById("diseaseOutput").innerHTML = `<p>${result}</p>`;
  }
  
  document.getElementById("checkButton").addEventListener("click", checkDisease);
  