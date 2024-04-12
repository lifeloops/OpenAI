import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";
import figlet from "npm:figlet@1.6.0";
import chalk from "npm:chalk@5.3.0";

// Function to display ChatGPT responses in a simple table format
function displayTable(header, data) {
  const divider = "+" + "-".repeat(header.length + 2) + "+";
  const headerRow = "|" + ` ${header} `.padEnd(header.length + 2) + "|";

  say(chalk.green(divider));
  say(chalk.green(headerRow));
  say(chalk.green(divider));
  data.forEach((item) => {
    const row = "|" + ` ${item}`.padEnd(header.length + 2) + "|";
    say(chalk.green(row));
  });
  say(chalk.green(divider));
}

console.log(
  chalk.blue(
    figlet.textSync("Wine Vault", { font: "Small", horizontalLayout: "full" }),
  ),
);

async function main() {
  say(chalk.white.bgBlack.bold("Welcome to your virtual Wine Vault!!"));

  const mainChoice = await ask(
    chalk.blue.bgBlack.bold(
      "Are you looking for a wine or sake pairing (1) or do Research (2)?",
    ),
  );

  if (mainChoice === "1") {
    const pairingChoice = await multipleChoiceQuestion(
      "Are you looking to:",
      ["Explore something new", "Pair with a specific meal"],
    );

    if (pairingChoice === "Explore something new") {
      await exploreNew();
    } else if (pairingChoice === "Pair with a specific meal") {
      await pairSpecificMeal();
    } else {
      say(
        chalk.red(
          "Invalid choice, please restart the app and select a valid option.",
        ),
      );
    }
  } else if (mainChoice === "2") {
    await conductResearch();
  } else {
    say(
      chalk.red(
        "Invalid choice, please restart the app and select a valid option.",
      ),
    );
  }

  say(chalk.red.bold("Thank you for using the wine vault!"));
}

async function exploreNew() {
  const flavorOptions = ["Fruity", "Earthy", "Spicy", "Floral", "No Preference"]
    .map(
      (option) => chalk.green.bgBlack(option),
    );
  const wineTypeOptions = [
    "Red",
    "White",
    "Rosé",
    "Sparkling",
    "Dessert wine",
    "No Preference ",
  ].map((option) => chalk.green.bgBlack(option));

  const flavorPreference = await multipleChoiceQuestion(
    "What are your flavor preferences?",
    flavorOptions,
  );
  const wineType = await multipleChoiceQuestion(
    "What type of wine or sake do you prefer?",
    wineTypeOptions,
  );

  const recommendation = await gptPrompt(
    `Recommend a wine or sake based on preferences: ${flavorPreference}, ${wineType}.`,
    { max_tokens: 1024, temperature: 0.9 },
  );

  displayTable("Recommendation", [
    `Based on your preferences, we recommend: ${recommendation}`,
  ]);
  await askForMoreInfo(recommendation);
}

async function pairSpecificMeal() {
  const food = await ask(
    chalk.blue.bgBlack.bold(
      "What specific food or dish do you want to pair the wine or sake with?",
    ),
  );
  const flavorOptions = ["Fruity", "Earthy", "Spicy", "Floral", "No Preference"]
    .map(
      (option) => chalk.green.bgBlack(option),
    );
  const wineTypeOptions = [
    "Red",
    "White",
    "Rosé",
    "Sparkling",
    "Dessert wine",
    "No Preference",
  ].map((option) => chalk.green.bgBlack(option));

  const flavorPreference = await multipleChoiceQuestion(
    "What are your flavor preferences?",
    flavorOptions,
  );
  const wineType = await multipleChoiceQuestion(
    "What type of wine or sake do you prefer?",
    wineTypeOptions,
  );

  const recommendation = await gptPrompt(
    `Recommend a wine or sake that pairs well with ${food} include its complete name and years.consider preferences: ${flavorPreference}, ${wineType}.`,
    { max_tokens: 1024, temperature: 0.9 },
  );

  displayTable("Pairing Recommendation", [
    `Based on your meal and preferences, we recommend: ${recommendation}`,
  ]);
  await askForMoreInfo(recommendation);
}

async function conductResearch() {
  const researchTopic = await ask(
    chalk.blue.bgBlack.bold("What are you looking to research?"),
  );
  const expertiseLevels = ["Beginner", "Intermediate", "Expert"];

  const expertiseLevel = await multipleChoiceQuestion(
    "Choose your level of expertise",
    expertiseLevels.map((option) => chalk.green.bgBlack(option)),
  );

  const researchInfo = await gptPrompt(
    `Find information on: ${researchTopic}, for a ${expertiseLevel} level of expertise.`,
    { max_tokens: 1024, temperature: 0.9 },
  );

  displayTable("Research Information", [
    `Based on your inquiry, here is the information we found: ${researchInfo}`,
  ]);
}

async function askForMoreInfo(recommendation) {
  const chosenPairing = await ask(
    chalk.blue.bgBlack.bold(
      "Please confirm the pairing you chose. Type your response below:",
    ),
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

async function multipleChoiceQuestion(question, options) {
  say(chalk.blue.bgBlack.bold(question));
  options.forEach((option, index) => {
    say(chalk.green.bgBlack(`${index + 1}. ${option}`));
  });

  const choiceIndex = await ask(
    chalk.blue.bgBlack.bold("Enter the number of your choice:"),
  );
  const choice = options[parseInt(choiceIndex) - 1];
  if (!choice) {
    say(chalk.red("Invalid choice, please try again."));
    return await multipleChoiceQuestion(question, options);
  }
  return choice.replace(chalk.green.bgBlack(""), "");
}

main();
