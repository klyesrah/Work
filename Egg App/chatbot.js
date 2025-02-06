/* chatbot.js: Provides farming tips based on user queries */

const chatbotResponses = {
    "how to increase egg production": "Ensure hens receive a balanced diet, plenty of water, and enough daylight.",
    "best food for hens": "Layer feed supplemented with crushed oyster shells and grains works well.",
    "how to prevent diseases": "Maintain cleanliness, provide proper ventilation, and consider regular vaccinations.",
    "why are my chickens not laying eggs": "It could be due to stress, poor nutrition, or seasonal changes. Check their care routine."
  };
  
  function chatbotReply() {
    const question = document.getElementById("chatInput").value.toLowerCase();
    const response = chatbotResponses[question] || "I'm sorry, I don't have an answer for that. Please try rephrasing your question.";
    document.getElementById("chatOutput").innerHTML = `<p>${response}</p>`;
  }
  
  document.getElementById("askButton").addEventListener("click", chatbotReply);
  