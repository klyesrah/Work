// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/* script.js: Combined functionality for Egg Production Tracking, Disease Detection with Trend Graphs, and Farm Chatbot */

/* ========================= Firebase Initialization ========================= */
// Use the Firebase config you provided
const firebaseConfig = {
    apiKey: "AIzaSyDKrWi3OKa73VkEDXYpiaanV3nUojZI9gM",
    authDomain: "egg-app-13cc5.firebaseapp.com",
    projectId: "egg-app-13cc5",
    storageBucket: "egg-app-13cc5.firebasestorage.app",
    messagingSenderId: "394489846474",
    appId: "1:394489846474:web:50ca1066b28a80c1fdb233",
    measurementId: "G-DSWZ6FHK0R"
  };
  
  // Initialize Firebase (v8 compatibility syntax)
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  /* ========================= Egg Production Tracking ========================= */
  /* ========================= Disease Detection with Trend Graph and Visuals ========================= */
if (document.getElementById("symptomInput")) {
  // Detailed disease database
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

  // Function to check disease, update visuals, and log the event
  function checkDisease() {
    const symptom = document.getElementById("symptomInput").value.toLowerCase();
    let result = "No known disease detected. If symptoms persist, consult a veterinarian.";
    let detectedDisease = null;
    for (const key in diseaseDatabase) {
      if (symptom.includes(key)) {
        detectedDisease = diseaseDatabase[key];
        result = `Possible Disease: ${detectedDisease}`;
        break;
      }
    }
    document.getElementById("diseaseOutput").innerHTML = `<p>${result}</p>`;

    // Update page background color and image based on disease severity:
    // - Serious: red background, warning image  
    // - Moderate: orange background, caution image  
    // - Neutral/Unknown: green background, healthy image
    if (detectedDisease) {
      if (detectedDisease === "Avian Influenza" || detectedDisease === "Marek’s Disease" || detectedDisease === "Respiratory Infection") {
        document.body.style.backgroundColor = "#FF6961"; // light red for serious conditions
        document.getElementById("diseaseImage").src = "images/serious.png"; // image for serious disease
      } else if (detectedDisease === "Salmonella" || detectedDisease === "Newcastle Disease" || detectedDisease === "Fowl Pox") {
        document.body.style.backgroundColor = "#FFD700"; // golden/orange for moderate conditions
        document.getElementById("diseaseImage").src = "images/moderate.png"; // image for moderate disease
      } else {
        document.body.style.backgroundColor = "#77DD77"; // light green for neutral or less severe conditions
        document.getElementById("diseaseImage").src = "images/neutral.png"; // image for neutral condition
      }
      logDiseaseEvent(detectedDisease);
      // Update disease trend graph after a short delay to allow logging
      setTimeout(fetchDiseaseData, 1000);
    } else {
      // No disease detected: healthy background and image
      document.body.style.backgroundColor = "#77DD77"; // green for health
      document.getElementById("diseaseImage").src = "images/healthy.png";
    }
  }

  document.getElementById("checkButton").addEventListener("click", checkDisease);

  /* --------------------- Disease Trend Graph Code --------------------- */
  let diseaseTrendData = {};  // Object to store counts of each disease
  let diseaseChart;

  // Log a detected disease event to the database (using Firebase Firestore, for example)
  async function logDiseaseEvent(disease) {
    try {
      await db.collection("DiseaseDetection").add({
        disease: disease,
        date: new Date().toISOString()
      });
      console.log("Disease event logged:", disease);
    } catch (error) {
      console.error("Error logging disease event:", error);
    }
  }

  // Fetch disease detection events from the database and update the trend chart
  async function fetchDiseaseData() {
    try {
      const snapshot = await db.collection("DiseaseDetection").orderBy("date").get();
      diseaseTrendData = {}; // Reset counts
      snapshot.forEach(doc => {
        const data = doc.data();
        const disease = data.disease;
        if (diseaseTrendData[disease]) {
          diseaseTrendData[disease]++;
        } else {
          diseaseTrendData[disease] = 1;
        }
      });
      updateDiseaseChart();
    } catch (error) {
      console.error("Error fetching disease data:", error);
    }
  }

  // Create or update the disease trend chart using Chart.js (bar chart)
  function updateDiseaseChart() {
    const ctx = document.getElementById("diseaseChart").getContext("2d");
    const diseases = Object.keys(diseaseTrendData);
    const counts = diseases.map(d => diseaseTrendData[d]);

    if (!diseaseChart) {
      diseaseChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: diseases,
          datasets: [{
            label: "Disease Detections",
            data: counts,
            backgroundColor: "red"
          }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } }
        }
      });
    } else {
      diseaseChart.data.labels = diseases;
      diseaseChart.data.datasets[0].data = counts;
      diseaseChart.update();
    }
  }

  // Fetch disease data when the page loads
  fetchDiseaseData();
}
