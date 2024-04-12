import { ask } from "./shared/cli.js";
// Remove unnecessary import { gptPrompt } from "./shared/openai.js";

// Function to interact with ChatGPT API
async function chatGPTQuery(query) {
  // Implementation to interact with ChatGPT API
  // Make HTTP request to ChatGPT API endpoint
  // Return response
}

// Function to fetch data from DuckDuckGo API
async function fetchWineAndSakeInfo(keyword) {
  // Implementation to fetch data from DuckDuckGo API
  // Make HTTP request to DuckDuckGo API endpoint with the keyword
  // Return relevant information about wines and sakes
}

// Function to recommend pairings based on user preferences
async function recommendPairings(userPreferences) {
  // Implementation to recommend pairings based on user preferences
  // Utilize ChatGPT and DuckDuckGo APIs to generate recommendations
  // Return recommended pairings
}

// Main function to handle user interaction
async function main() {
  // Display welcome message and options to the user
  console.log("Welcome to the Virtual Wine & Sake Vault!");
  console.log("Choose an option:");
  console.log("1. Explore a random new wine or sake.");
  console.log(
    "2. Get a wine or sake pairing recommendation based on food and occasion.",
  );

  // Prompt user for choice
  const { choice } = await ask({
    name: "choice",
    message: "Enter your choice (1 or 2):",
  });

  if (choice === "1") {
    // Option 1: Explore a random new wine or sake
    const response = await chatGPTQuery("Recommend a random wine or sake.");
    console.log("Recommended wine or sake:", response);
  } else if (choice === "2") {
    // Option 2: Get a wine or sake pairing recommendation based on food and occasion
    const food = await ask({
      name: "food",
      message: "Enter the type of food you're having:",
    });
    const occasion = await ask({
      name: "occasion",
      message: "Enter the occasion:",
    });

    // Formulate user preferences object
    const userPreferences = {
      food: food,
      occasion: occasion,
    };

    // Get pairing recommendations
    const pairings = await recommendPairings(userPreferences);
    console.log("Recommended pairings:", pairings);
  } else {
    console.log("Invalid choice. Please choose 1 or 2.");
  }
}

// Run the main function
main();
