import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

async function main() {
  say("Welcome! Let's hear a light bulb joke.");

  const subject = await ask(
    "Enter a subject to hear a light bulb joke about: ",
  );

  const prompt = `
        Generate a light bulb joke about ${subject} in a sassy and sarcastic tone.
    `;

  try {
    const joke = await gptPrompt(prompt, {
      max_tokens: 128,
      temperature: 0.7, // Adjust temperature for creativity
    });

    say(`Here's the joke: ${joke}`);
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

main();
