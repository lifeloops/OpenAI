import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

async function main() {
  say("Welcome to your virtual wine vault");

  // Ask the user for their preferences
  const food = await ask("What food are you enjoying tonight?");
  const tastePreference = await ask(
    "Would you prefer flavors that are light and refreshing, or rich and intense?",
  );
  const type = await ask("Any preference for a wine type?");

  // Use GPT to generate a food and wine pairing based on the user's preferences
  const pairingPrompt = `
  Recommend a wine with name and explanation that pairs well with ${food}, considering a preference 
for ${tastePreference}, preference for flavors, and preference for the type of wine ${type} including its name. Detail the vintage characteristics, grape varieties used, the wine's region, vineyard 
farming practices, and the vinification process. Provide background on the winery's establishment, the wine's 
body, and a summary. 
  `;
  const pairingRecommendation = await gptPrompt(pairingPrompt, {
    max_tokens: 1024,
    temperature: 0.9,
  });

  say("\nBased on your preferences, we recommend the following pairing:");

  // Present the food and wine pairing to the user
  say(pairingRecommendation);

  // Optionally, fetch more information about the recommended wine from the web
  const wineName = ""; // You need to extract wine name from pairingRecommendation
  const [wineInfo, price] = await fetchWineInfo(wineName);
  const source = "Example Source"; // Replace "Example Source" with the actual source of information
  say(
    `Here's more about your recommended wine (Source: ${source}): ${wineInfo}`,
  );
  say(`The price of the recommended wine is: ${price}`);

  say("We hope you enjoy your Michelin star dining experience!");
}

// Function to simulate fetching wine information from the web
async function fetchWineInfo(wineName) {
  // Replace this with your actual logic to fetch wine information
  const fetchedInfo = `Description of ${wineName} fetched from the web`;
  const price = "$50"; // Example price, replace with actual fetched price
  return [fetchedInfo, price];
}

main();
