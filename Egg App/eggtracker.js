/* eggTracker.js: Egg production logging, chart updating, and Firebase integration */

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyDKrWi3OKa73VkEDXYpiaanV3nUojZI9gM",
    authDomain: "egg-app-13cc5.firebaseapp.com",
    projectId: "egg-app-13cc5",
    storageBucket: "egg-app-13cc5.firebasestorage.app",
    messagingSenderId: "394489846474",
    appId: "1:394489846474:web:50ca1066b28a80c1fdb233",
    measurementId: "G-DSWZ6FHK0R"
  };
  
  // Initialize Firebase (using the v8 compatibility syntax for simplicity)
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Global variables for chart and data
  let eggData = [];
  let eggChart;
  
  // Log egg production data to Firebase and update the chart
  async function logEggProduction() {
    const eggCountInput = document.getElementById("eggCount");
    const count = parseInt(eggCountInput.value);
    if (isNaN(count)) {
      alert("Please enter a valid egg count!");
      return;
    }
    try {
      // Save data to Firestore
      await db.collection("EggProduction").add({
        dailyEggsCollected: count,
        date: new Date().toISOString()
      });
      console.log("Egg count logged to Firebase");
      eggData.push(count);
      updateChart();
      eggCountInput.value = ""; // Clear input
    } catch (error) {
      console.error("Error logging egg count:", error);
    }
  }
  
  // Update or create the Chart.js line chart
  function updateChart() {
    const ctx = document.getElementById("eggChart").getContext("2d");
    if (!eggChart) {
      eggChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: eggData.map((_, i) => `Day ${i + 1}`),
          datasets: [{
            label: 'Egg Production',
            data: eggData,
            borderColor: 'blue',
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    } else {
      eggChart.data.labels = eggData.map((_, i) => `Day ${i + 1}`);
      eggChart.data.datasets[0].data = eggData;
      eggChart.update();
    }
  }
  
  // Retrieve existing egg production data from Firebase on page load
  async function fetchEggData() {
    try {
      const snapshot = await db.collection("EggProduction").orderBy("date").get();
      snapshot.forEach(doc => {
        const data = doc.data();
        eggData.push(data.dailyEggsCollected);
      });
      updateChart();
    } catch (error) {
      console.error("Error fetching egg data:", error);
    }
  }
  
  // Event listener for the "Log" button
  document.getElementById("logButton").addEventListener("click", logEggProduction);
  
  // Fetch existing data when the page loads
  fetchEggData();
  