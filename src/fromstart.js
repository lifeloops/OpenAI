// Importing necessary modules
import { gptPrompt } from "./shared/openai.js";
import { ask, say } from "./shared/cli.js";

// Main function to start the program
async function main() {
  // Greeting message
  say("Welcome to the Wine & Sake Vault!");

  // Prompting user for name and hometown
  const name = await ask("What is your name?");
  const town = await ask("Where are you from?");

  // Displaying user's information
  say(`Hello, ${name} from ${town}!`);

  // Asking user for preference - exploring new options, searching for pairings, or getting recommendations
  const preference = await ask(
    "Do you want to explore new options, search for pairings, or get recommendations?",
  );

  if (preference.toLowerCase().includes("explore")) {
    // If user wants to explore new options
    const recommendation = await gptPrompt(
      "Suggest me a wine recommendation.",
      { temperature: 0.7 },
    );
    say(`Here's a recommendation for you:\n"${recommendation}"`);
  } else if (preference.toLowerCase().includes("pairings")) {
    // If user wants to search for pairings
    const food = await ask("What food would you like to pair?");
    const pairingType = await ask("Do you prefer wine or sake for pairing?");

    // Generating pairing recommendation
    const pairingRecommendation = await gptPrompt(
      `Suggest me a ${pairingType} to pair with ${food}.`,
      { temperature: 0.7 },
    );
    say(
      `Here's a pairing recommendation for ${food} with ${pairingType}:\n"${pairingRecommendation}"`,
    );
  } else if (preference.toLowerCase().includes("recommendations")) {
    // If user wants general wine or sake recommendations
    const recommendationType = await ask(
      "Do you want wine or sake recommendation?",
    );
    if (recommendationType.toLowerCase().includes("wine")) {
      const recommendation = await gptPrompt(
        "Suggest me a wine recommendation.",
        { temperature: 0.7 },
      );
      say(`Here's a wine recommendation for you:\n"${recommendation}"`);
    } else if (recommendationType.toLowerCase().includes("sake")) {
      const recommendation = await gptPrompt(
        "Suggest me a sake recommendation.",
        { temperature: 0.7 },
      );
      say(`Here's a sake recommendation for you:\n"${recommendation}"`);
    } else {
      say("Sorry, I couldn't understand your preference. Please try again.");
    }
  }

  // Asking user for more information about the recommended option
  const moreInfo = await ask(
    "Would you like more information about the recommended option?",
  );
  if (moreInfo.toLowerCase().includes("yes")) {
    const infoType = await ask(
      "What type of information would you like (e.g., vinification, wine body, pairing practices)?",
    );
    // Fetching more information based on user's preference
    const info = await gptPrompt(
      `Tell me more about ${infoType} of the recommended option.`,
      { temperature: 0.7 },
    );
    say(`Here's more information about ${infoType}:\n"${info}"`);
  }

  // Farewell message
  say("Thank you for visiting the Wine & Sake Vault! Enjoy your drink!");
}

// Calling the main function to start the program
main();
