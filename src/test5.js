// main.js
import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

async function main() {
  say("Welcome to Wine & Sake Vault!");

  const userInput = await ask(
    "What are you looking for today? Explore new options or search for specific pairings based on food?",
  );

  const response = await gptPrompt(userInput);

  say("Here are some recommendations:");
  say(response);

  const infoChoice = await ask(
    "Do you want more information about the wine or sake? (vinification, wine body, pairing practices)",
  );

  // Handle user's choice for more information
  // Depending on the choice, fetch and display the relevant information

  say("Thank you for using Wine & Sake Vault!");
}

main();
