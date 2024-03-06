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

  // Ask the user for their preferences
  const food = await ask(
    `${colors.fgYellow}1. What specific food or dish do you want to pair the wine with?`,
  ); // Style the question with yellow color
  const flavorPreference = await ask(
    `${colors.fgYellow}2. Your flavor preferences - do you like fruity, earthy, spicy, floral, etc.?`,
  );
  const wineType = await ask(
    `${colors.fgYellow}3. The type of wine you prefer - red, white, rosé, sparkling, dessert wine, etc.`,
  );
  const wineCharacteristics = await ask(
    `${colors.fgYellow}4. Any specific wine characteristics you're looking for, such as vintage, grape variety, or organic/biodynamic certification.`,
  );
  const wineRegion = await ask(
    `${colors.fgYellow}5. Any particular wine region you're interested in exploring.`,
  );
  const wineBody = await ask(
    `${colors.fgYellow}6. The body of wine you typically enjoy - light-bodied, medium-bodied, or full-bodied.`,
  );

  // Use GPT to generate a food and wine pairing based on the user's preferences
  const pairingPrompt = `
    Recommend a wine with name and explanation that pairs well with ${food}, considering a preference 
      for ${flavorPreference}, preference for flavors, and preference for the type of wine ${wineType}. Detail the vintage characteristics, grape varieties used, the wine's region, vineyard 
      farming practices, and the vinification process. Provide background on the winery's establishment, the wine's 
      body, and a summary. do not provide a wine if the ${food} & ${flavorPreference} are missing.
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
main();
