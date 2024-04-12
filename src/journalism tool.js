// foodWinePairing.js
import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

async function main() {
  say("Welcome to our virtual Michelin star dining experience!");

  // Load the wine and food list from the JSON file
  const pairings = await loadPairings("./src/BiasedNewsdataset.json");

  // Ask the user for their preferences
  const occasion1 = await ask(
    "My name is G and I will be your server tonight, how are you doing this evening?",
  );

  const occasion = await ask("Is this a special occasion? (Yes/No)");
  const tastePreference = await ask(
    "Do you prefer light and fresh, or rich and bold flavors?",
  );
  const dietaryRestrictions = await ask(
    "Do you have any dietary restrictions we should be aware of?",
  );

  // Generate a food and wine pairing based on the user's preferences
  const pairingString = await gptPrompt(
    `
    Given the user's preferences, suggest a food and wine pairing like a Michelin star server at the restaurant named itria. The occasion is ${occasion}, the taste preference is ${tastePreference}, and the dietary restrictions are ${dietaryRestrictions}. Use the following lists of wines and foods to determine the best pairing: ${
      JSON.stringify(pairings)
    }.

    Provide the pairing as a string in the following format:
    "For a this occasion with a preference for ${tastePreference} flavors and considering ${dietaryRestrictions} dietary restrictions, we recommend the[Food Item] paired with [Wine Item]."

    `,
    { max_tokens: 1024, temperature: 0.9 },
  );

  say("");

  // Present the food and wine pairing to the user
  say(pairingString);

  say("We hope you enjoy your Michelin star dining experience!");
}

// Function to load wine and food pairings from a JSON file
async function loadPairings(filePath) {
  try {
    const decoder = new TextDecoder("utf-8");
    const data = await Deno.readFile(filePath);
    const json = decoder.decode(data);
    return JSON.parse(json);
  } catch (error) {
    say(`Failed to load pairings from ${filePath}: ${error}`);
    return null;
  }
}

main();
