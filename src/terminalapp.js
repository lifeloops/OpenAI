import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";
// Import a function to make web requests. This is pseudocode and needs to be replaced with actual implementation based on your environment.
// import { fetchWineInfo } from "./shared/web.js";

async function main() {
  say("Welcome to your virtual wine vault");

  // Ask the user for their preferences
  const occasion = await ask("What food are you enjoying tonight?");
  const tastePreference = await ask(
    "Would you prefer flavors that are light and refreshing, or rich and intense?",
  );
  const dietaryRestrictions = await ask(
    "Do you have any dietary restrictions we should be aware of?",
  );

  // Use GPT to generate a food and wine pairing based on the user's preferences
  const pairingPrompt = `
    Recommend a wine that pairs well with ${occasion}, considering a preference for ${tastePreference} flavors and taking into account the following dietary restrictions: ${dietaryRestrictions}. Provide a brief explanation for the choice.
  `;
  const pairingRecommendation = await gptPrompt(pairingPrompt, {
    max_tokens: 1024,
    temperature: 0.9,
  });

  say("\nBased on your preferences, we recommend the following pairing:");

  // Present the food and wine pairing to the user
  say(pairingRecommendation);

  // Optionally, fetch more information about the recommended wine from the web
  // This is pseudocode and needs to be replaced with actual implementation based on your environment.
  // const wineInfo = await fetchWineInfo(recommendedWine);
  // say(`Here's more about your recommended wine: ${wineInfo}`);

  say("We hope you enjoy your Michelin star dining experience!");
}

// Function to simulate fetching wine information from the web
// This is pseudocode and needs to be replaced with actual implementation based on your environment.
/*
async function fetchWineInfo(wineName) {
  const response = await fetch(`https://wineapi.example.com/info?wine=${encodeURIComponent(wineName)}`);
  if (!response.ok) throw new Error('Failed to fetch wine information');
  const data = await response.json();
  return data.description;
}
*/

main();
