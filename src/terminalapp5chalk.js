import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

async function searchDuckDuckGo(query) {
  const url = `https://api.duckduckgo.com/?q='${
    encodeURIComponent(query)
  }'&format=json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch from DuckDuckGo API");
  }
  const data = await response.json();
  return data.AbstractText || false;
}

async function getWineInfo(wineName, infoType) {
  if (!wineName || !infoType) return null;

  let wineInfo = "";

  switch (infoType) {
    case "Vintage characteristics":
      wineInfo = await fetchVintageCharacteristics(wineName);
      break;
    case "Grape varieties":
      wineInfo = await fetchGrapeVarieties(wineName);
      break;
    case "Region":
      wineInfo = await fetchRegionInfo(wineName);
      break;
    default:
      return null;
  }

  return wineInfo;
}

async function main() {
  const colors = {
    reset: "\x1b[0m",
    fgYellow: "\x1b[33m",
    fgRed: "\x1b[31m",
    fgCyan: "\x1b[36m",
    fgGreen: "\x1b[32m",
    fgMagenta: "\x1b[35m",
    fgBlue: "\x1b[34m",
    bgBlack: "\x1b[40m",
    fgBlack: "\x1b[30m",
    bgGreen: "\x1b[42m",
    bgCyan: "\x1b[46m",
    fgWhite: "\x1b[37m",
    bgBlue: "\x1b[44m",
  };

  say(
    `${colors.bgBlack}${colors.fgGreen}Welcome to your virtual wine and sake vault${colors.reset}`,
  );

  let continuePrompt = true;

  while (continuePrompt) {
    const binaryOption = await ask(
      `${colors.fgCyan}Would you like to explore a random wine or sake (${colors.fgMagenta}1${colors.fgCyan}) or get a pairing recommendation (${colors.fgMagenta}2${colors.fgCyan})?${colors.reset}`,
    );

    if (binaryOption === "1") {
      const response = await gptPrompt("Recommend a random wine or sake.");

      const infoType = await ask(
        `${colors.fgCyan}What type of information would you like to know about the wine or sake? (${colors.fgMagenta}1${colors.fgCyan}) Vintage characteristics (${colors.fgMagenta}2${colors.fgCyan}) Grape varieties (${colors.fgMagenta}3${colors.fgCyan}) Region${colors.reset}`,
      );

      let wineInfo;
      switch (infoType) {
        case "1":
          wineInfo = await getWineInfo(response, "Vintage characteristics");
          break;
        case "2":
          wineInfo = await getWineInfo(response, "Grape varieties");
          break;
        case "3":
          wineInfo = await getWineInfo(response, "Region");
          break;
        default:
          say("Invalid option. Please choose 1, 2, or 3.");
      }

      if (wineInfo) {
        say(
          `${colors.bgCyan}${colors.fgBlack}Here's more about your recommended wine: ${wineInfo}${colors.bgGreen}`,
        );
      } else {
        say("No information found for the recommended wine.");
      }
    } else if (binaryOption === "2") {
      const food = await ask(
        `${colors.fgRed}What specific food or dish do you want to pair the wine or sake with?${colors.reset}`,
      );

      const flavorOptions = ["Fruity", "Earthy", "Spicy", "Floral"];
      const flavorIndex = await ask(
        `${colors.fgRed}Your flavor preferences - do you like fruity, earthy, spicy, floral, etc.?${colors.reset}\n${
          flavorOptions.map((option, index) =>
            `${colors.fgMagenta}${index + 1}${colors.fgCyan}. ${option}`
          ).join("\n")
        }`,
      );
      const flavorPreference = flavorOptions[parseInt(flavorIndex) - 1];

      const wineTypeOptions = [
        "Red",
        "White",
        "Rosé",
        "Sparkling",
        "Dessert wine",
      ];
      const wineTypeIndex = await ask(
        `${colors.fgRed}The type of wine or sake you prefer - red, white, rosé, sparkling, dessert wine, etc.?${colors.reset}\n${
          wineTypeOptions.map((option, index) =>
            `${colors.fgMagenta}${index + 1}${colors.fgCyan}. ${option}`
          ).join("\n")
        }`,
      );
      const wineType = wineTypeOptions[parseInt(wineTypeIndex) - 1];

      const infoType = "All";

      const pairingPrompt = `
                Please recommend a wine or sake that pairs well with  ${food}. We require the full name, year, approximate price, and any pertinent details such as flavor preferences (${flavorPreference}) and preferred type of wine or sake (${wineType}). Do not suggest any pairings if either ${food} or ${flavorPreference} is missing. Also, avoid recommending the same wine or sake multiple times. Present the information in a user-friendly format for easy readability.no matter the answers form the user, recomend a wine and sake
            `;
      const pairingRecommendation = await gptPrompt(pairingPrompt, {
        max_tokens: 1024,
        temperature: 0.9,
      });

      say(
        `${colors.bgGreen}${colors.fgBlack}Based on your preferences, we recommend the following pairing:${colors.reset}`,
      );

      say(pairingRecommendation);

      const wineNameRegex =
        /Recommend a wine or sake that pairs well with (\w+)/;
      const wineName = pairingRecommendation?.match(wineNameRegex)?.[1];

      const wineInfo = wineName ? await getWineInfo(wineName, infoType) : null;
      if (wineInfo) {
        say(
          `${colors.bgCyan}${colors.fgBlack}Here's more about your recommended wine: ${wineInfo}${colors.bgGreen}`,
        );
      } else {
        say("No information found for the recommended wine.");
      }
    } else {
      say("Invalid option. Please choose 1 or 2.");
    }

    const continueResponse = await ask(
      `${colors.fgCyan}Would you like to continue with one of the options (${colors.fgMagenta}1${colors.fgCyan}) or get new recommendations (${colors.fgMagenta}2${colors.fgCyan})?${colors.reset}`,
    );

    if (continueResponse === "1") {
      const chosenWine = await ask(
        `${colors.fgCyan}Which wine did you choose?${colors.reset}`,
      );

      const infoType = await ask(
        `${colors.fgCyan}What type of information would you like to know about the wine? (${colors.fgMagenta}1${colors.fgCyan}) Vintage characteristics (${colors.fgMagenta}2${colors.fgCyan}) Grape varieties (${colors.fgMagenta}3${colors.fgCyan}) Region (${colors.fgMagenta}4${colors.fgCyan}) All${colors.reset}`,
      );

      let wineInfo;
      switch (infoType) {
        case "1":
          wineInfo = await getWineInfo(chosenWine, "Vintage characteristics");
          break;
        case "2":
          wineInfo = await getWineInfo(chosenWine, "Grape varieties");
          break;
        case "3":
          wineInfo = await getWineInfo(chosenWine, "Region");
          break;
        case "4":
          wineInfo = await getWineInfo(chosenWine, "All");
          break;
        default:
          say("Invalid option. Please choose 1, 2, 3, or 4.");
      }

      if (wineInfo) {
        say(
          `${colors.bgCyan}${colors.fgBlack}Here's more about your selected wine: ${wineInfo}${colors.bgGreen}`,
        );
      } else {
        say("No information found for the selected wine.");
      }
    } else if (continueResponse === "2") {
      continuePrompt = true;
    } else {
      continuePrompt = false;
      say("Invalid option. Please choose 1 or 2.");
    }
  }

  say(
    `${colors.bgBlue}${colors.fgWhite}We hope you enjoy your Michelin star dining experience!${colors.reset}`,
  );
}

main();
