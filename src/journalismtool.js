// foodWinePairing.js
import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

async function main() {
  say("Hello! I am your data scraper assistant.");

  // Ask the user for specific words for filtering
  const filterWords = await ask(
    "Please provide specific words or phrases for filtering:",
  );

  // Ask the user if they have predetermined trends or want GPT to identify them
  const predeterminedTrends = await ask(
    "Do you have predetermined trends you are looking for? (yes/no)"
  );

  let trends;
  if (predeterminedTrends.toLowerCase() === 'yes') {
    trends = await ask("Please specify the predetermined trends you are looking for:");
  } else {
    trends = "Identify trends based on data analysis.";
  }

  // Load the wine and food list from the JSON file
  const pairings = await loadPairings("./src/BiasedNewsdataset.json");

  // Generate a food and wine pairing based on the user's preferences
  const pairingString = await gptPrompt(
    `
    Analyze the dataset to identify prominent ${trends}. Present the insights through categorized bullet points, highlighting significant patterns based on "${filterWords}"
    ${JSON.stringify(pairings)}.

    Provide the pairing as a string in the following format:
    This is the info.
    `,
    { max_tokens: 1024, temperature: 0.9 },
  );

  say("");

  // Display the generated pairing
  say(pairingString);

  say("THIS IS THE DATA!");
}

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
