import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";
import figlet from "npm:figlet@1.6.0";
import dedent from "npm:dedent@1.5.1";
import boxen from "npm:boxen@7.1.1";
import chalk from "npm:chalk@5.3.0";

console.log(
  chalk.red(figlet.textSync("Wine Vault", { horizontalLayout: "full" })),
);

async function main() {
  say(chalk.blue("Welcome to your virtual wine and sake vault!!!"));

  const mainChoice = await ask(
    chalk.blue("Are you looking to pair (1) or do Research (2)"),
  );

  if (mainChoice === "1") {
    const pairingChoice = await ask(
      chalk.green(
        "Are you looking to (1) Explore something new or (2) Pair with a specific meal?",
      ),
    );

    if (pairingChoice === "1") {
      await exploreNew();
    } else if (pairingChoice === "2") {
      await pairSpecificMeal();
    } else {
      say(
        chalk.green(
          "Invalid choice, please restart the app and select a valid option.",
        ),
      );
    }
  } else if (mainChoice === "2") {
    await conductResearch();
  } else {
    say(
      chalk.green(
        "Invalid choice, please restart the app and select a valid option.",
      ),
    );
  }

  say(chalk.yellow("Thank you for using the wine vault!"));
}

async function exploreNew() {
  const flavorOptions = ["Fruity", "Earthy", "Spicy", "Floral", "None"];
  const wineTypeOptions = [
    "Red",
    "White",
    "Rosé",
    "Sparkling",
    "Dessert wine",
    "None",
  ];

  const flavorPreference = await multipleChoiceQuestion(
    chalk.green("What are your flavor preferences?", flavorOptions),
  );
  const wineType = await multipleChoiceQuestion(chalk.green(
    "What type of wine or sake do you prefer?",
    wineTypeOptions,
  ));

  const recommendation = await gptPrompt(
    `Recommend a wine or sake based on preferences: ${flavorPreference}, ${wineType}.`,
    { max_tokens: 1024, temperature: 0.9 },
  );

  say(`Based on your preferences, we recommend: ${recommendation}`);
  await askForMoreInfo(recommendation);
}

async function pairSpecificMeal() {
  const food = await ask(
    "What specific food or dish do you want to pair the wine or sake with?",
  );
  const flavorOptions = ["Fruity", "Earthy", "Spicy", "Floral", "None"];
  const wineTypeOptions = [
    "Red",
    "White",
    "Rosé",
    "Sparkling",
    "Dessert wine",
    "None",
  ];

  const flavorPreference = await multipleChoiceQuestion(
    "What are your flavor preferences?",
    flavorOptions,
  );
  const wineType = await multipleChoiceQuestion(
    "What type of wine or sake do you prefer?",
    wineTypeOptions,
  );

  const recommendation = await gptPrompt(
    `Please recommend a wine or sake that pairs well with ${food}, considering preferences: ${flavorPreference}, ${wineType}. Avoid duplicates and ensure readability.`,
    { max_tokens: 1024, temperature: 0.9 },
  );

  say(`Based on your meal and preferences, we recommend: ${recommendation}`);
  await askForMoreInfo(recommendation);
}

async function conductResearch() {
  const researchTopic = await ask("What are you looking to research?");
  const expertiseLevels = ["Beginner", "Intermediate", "Expert"];
  const expertiseLevel = await multipleChoiceQuestion(
    "Choose your level of expertise",
    expertiseLevels,
  );

  const researchInfo = await gptPrompt(
    `Find information on: ${researchTopic}, for a ${expertiseLevel} level of expertise.`,
    { max_tokens: 1024, temperature: 0.9 },
  );

  say(
    `Based on your inquiry, here is the information we found: ${researchInfo}`,
  );
}

async function multipleChoiceQuestion(question, options) {
  const choiceIndex = await ask(
    `${question} (${
      options.map((option, index) => `${index + 1}. ${option}`).join(", ")
    })`,
  );
  return options[parseInt(choiceIndex) - 1];
}

async function askForMoreInfo(recommendation) {
  const moreInfoChoice = await ask(
    "Would you like more information about this recommendation? (1) Yes (2) No",
  );

  if (moreInfoChoice === "1") {
    // Confirm the chosen pairing
    const chosenPairing = await ask(
      "Please confirm the pairing you chose. Type your response below:",
    );
    say(`You have chosen: ${chosenPairing}`);

    const infoOptions = [
      "Vintage characteristics",
      "Grape varieties",
      "Region",
      "Vineyard farming practices",
      "Vinification process",
      "All",
    ];
    const selectedInfo = await multipleChoiceQuestion(
      "What type of information would you like to know?",
      infoOptions,
    );
    const detailedInfo = await gptPrompt(
      `Provide detailed information on ${selectedInfo} for the recommended wine/sake: ${recommendation}.`,
      { max_tokens: 1024, temperature: 0.9 },
    );

    say(`Here is the detailed information on ${selectedInfo}: ${detailedInfo}`);
  }
}

main();
