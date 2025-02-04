// Firebase setup
const firebaseConfig = {
    apiKey: "AIzaSyDKrWi3OKa73VkEDXYpiaanV3nUojZI9gM",
    authDomain: "egg-app-13cc5.firebaseapp.com",
    projectId: "egg-app-13cc5",
    storageBucket: "egg-app-13cc5.firebasestorage.app",
    messagingSenderId: "394489846474",
    appId: "1:394489846474:web:50ca1066b28a80c1fdb233",
    measurementId: "G-DSWZ6FHK0R"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let eggData = [];
let eggChart;

function logEggProduction() {
    let count = document.getElementById("eggCount").value;
    if (count === "") {
        alert("Please enter the number of eggs!");
        return;
    }
    
    count = parseInt(count);
    eggData.push(count);

    db.collection("eggProduction").add({
        count: count,
        date: new Date().toISOString()
    }).then(() => console.log("Data stored"))
    .catch(error => console.error("Error: ", error));

    updateChart();
}

function updateChart() {
    if (!eggChart) {
        let ctx = document.getElementById("eggChart").getContext("2d");
        eggChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: eggData.map((_, i) => `Day ${i + 1}`),
                datasets: [{
                    label: "Egg Production",
                    data: eggData,
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: false
                }]
            }
        });
    } else {
        eggChart.data.labels = eggData.map((_, i) => `Day ${i + 1}`);
        eggChart.data.datasets[0].data = eggData;
        eggChart.update();
    }
}

// Retrieve data from Firebase
db.collection("eggProduction").get().then(snapshot => {
    snapshot.forEach(doc => {
        eggData.push(doc.data().count);
    });
    updateChart();
});

// Disease Checker
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
    let symptom = document.getElementById("symptomInput").value.toLowerCase();
    let result = diseaseDatabase[symptom] || "No disease found.";
    document.getElementById("diseaseOutput").innerText = result;
}

// Chatbot Assistant
const chatbotResponses = {
    "how to increase egg production": "Ensure hens get enough calcium, light exposure, and a balanced diet.",
    "best food for hens": "Layer feed, crushed oyster shells, and grains.",
    "how to prevent diseases": "Regular vaccinations, clean environment, and fresh water daily.",
    "why are my chickens not laying eggs": "Could be stress, poor diet, or molting season."
};

function chatbotReply() {
    let question = document.getElementById("chatInput").value.toLowerCase();
    let response = chatbotResponses[question] || "I don’t know, try asking another way.";
    document.getElementById("chatOutput").innerText = response;
}
