import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";
import figlet from "npm:figlet@1.6.0";
import chalk from "npm:chalk@5.3.0";

// Function to display recommendations in bullet point format
function displayRecommendations(header, recommendations) {
  say(chalk.green(`\n${header}:`));
  recommendations.forEach((recommendation, index) => {
    say(chalk.green(`  - ${index + 1}. ${recommendation}`));
  });
}

console.log(
  chalk.red(figlet.textSync("Wine Vault", { horizontalLayout: "full" })),
);

async function main() {
  say(chalk.white.bgBlack.bold("Welcome to the virtual wine and sake vault!!"));

  const mainChoice = await ask(
    chalk.blue.bgBlack.bold(
      "Are you looking for a wine or sake pairing (1) or to do Research (2)?",
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

  // Simulate a recommendation response from GPT
  const recommendations = [
    `Chateau Margaux 2015 - Earthy Red`,
    `Sakura Blossom Sake 2019 - Floral`,
  ];

  displayRecommendations("Recommendations", recommendations);
}

async function pairSpecificMeal() {
  const food = await ask(
    chalk.blue.bgBlack.bold(
      "What specific food or dish do you want to pair the wine or sake with?",
    ),
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

  // Simulate a recommendation response from GPT
  const recommendations = [
    `Pinot Noir Reserve 2018 - Spicy Red with ${food}`,
    `Golden Valley Sake 2020 - Fruity with ${food}`,
  ];

  displayRecommendations("Pairing Recommendations", recommendations);
}

async function conductResearch() {
  const researchTopic = await ask(
    chalk.blue.bgBlack.bold("What are you looking to research?"),
  );
  const expertiseLevels = ["Beginner", "Intermediate", "Expert"];
  const expertiseLevel = await multipleChoiceQuestion(
    "Choose your level of expertise",
    expertiseLevels,
  );

  // Simulate research information from GPT
  const researchInfo =
    `Advanced Wine Making Techniques - A comprehensive guide for ${expertiseLevel} level enthusiasts.`;

  say(chalk.green(`Research Information:\n  - ${researchInfo}`));
}

async function multipleChoiceQuestion(question, options) {
  say(chalk.blue.bgBlack.bold(question));
  options.forEach((option, index) => {
    say(chalk.green.bgBlack(`  ${index + 1}. ${option}`));
  });

  const choiceIndex = await ask(
    chalk.blue.bgBlack.bold("Enter the number of your choice:"),
  );
  return options[parseInt(choiceIndex) - 1];
}

async function askForMoreInfo(recommendation) {
  // This function can be expanded to offer more details about the selected wine/sake
}

main();
