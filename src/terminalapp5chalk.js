import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

async function main() {
  // Define ANSI escape codes for colors
  const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    fgBlack: "\x1b[30m",
    fgRed: "\x1b[31m",
    fgGreen: "\x1b[32m",
    fgYellow: "\x1b[33m",
    fgBlue: "\x1b[34m",
    fgMagenta: "\x1b[35m",
    fgCyan: "\x1b[36m",
    fgWhite: "\x1b[37m",
    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
  };

  say(
    `${colors.bgBlack}${colors.fgGreen}Welcome to your virtual wine vault${colors.reset}`,
  ); // Style the welcome message with blue background and white foreground
  // Style the question with yellow color
  const occasion = await ask(
    `${colors.fgYellow}What is the occasion of the night?`,
  ); // Ask about the occasion of the night
  const exploration = await ask(
    `${colors.fgYellow}Is tonight a night of exploration or do you have a specific pairing in mind? (Exploration/Specific)`,
  ); // Ask if it's a night of exploration or specific pairing
  // Ask the user for their preferences
  const food = await ask(
    `${colors.fgYellow}What food are you enjoying tonight?`,
  ); // Style the question with yellow color
  const tastePreference = await ask(
    `${colors.fgYellow}Would you prefer flavors that are light and refreshing, or rich and intense (fruity, spicy, earthy, floral)??`, // Style the question with yellow color
  );
  const type = await ask(
    `${colors.fgYellow}Any preference for a wine type? (Chardonnay, Pinot Noir, Sake, Orange or Riesling)`,
  ); // Style the question with yellow color

  // Use GPT to generate a food and wine pairing based on the user's preferences
  const pairingPrompt = `
  Recommend a wine with name and explanation that pairs well with ${food}, considering a preference 
    for ${tastePreference}, preference for flavors, and preference for the type of wine ${type}. Detail the vintage characteristics, grape varieties used, the wine's region, vineyard 
    farming practices, and the vinification process. Provide background on the winery's establishment, the wine's 
    body, and a summary. do not provide a wine if the ${food} & ${tastePreference} are missing.
  `;
  const pairingRecommendation = await gptPrompt(pairingPrompt, {
    max_tokens: 1024,
    temperature: 0.9,
  });

  say(
    `${colors.bgGreen}${colors.fgBlack}Based on your preferences, we recommend the following pairing:${colors.reset}`,
  ); // Style the message with green background and black foreground

  // Present the food and wine pairing to the user
  say(pairingRecommendation);

  // Optionally, fetch more information about the recommended wine from the web
  const wineName = ""; // You need to extract wine name from pairingRecommendation
  const wineInfo = await fetchWineInfo(wineName);
  say(
    `${colors.bgCyan}${colors.fgBlack}Here's more about your recommended wine: ${wineInfo}${colors.reset}`,
  ); // Style the message with cyan background and black foreground

  say(
    `${colors.bgBlue}${colors.fgWhite}We hope you enjoy your Michelin star dining experience!${colors.reset}`,
  ); // Style the message with blue background and white foreground
}

// Function to simulate fetching wine information from the web
async function fetchWineInfo(wineName) {
  // Replace this with your actual logic to fetch wine information
  return `Description of ${wineName} fetched from the web`;
}

main();
