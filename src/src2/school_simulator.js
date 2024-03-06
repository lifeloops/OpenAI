/**
 * school_simulator.js
 * A text adventure game in which a user plays as a college student
 * trying to make it to school within 10 turns.
 */

import { gptPrompt } from "./shared/openai.js";
import { ask, say } from "./shared/cli.js";

main();

async function main() {
  say("Hello, Player!");

  const context = [];
  let playing = true;
  const location = "a college student's apt in Brooklyn";
  const player = {};
  player.name = await ask("What is your name?");
  player.class = await ask(
    "What grade are you (Freshman, Sophomore, Junior, Senior)?",
  );

  say("");

  findPlayerStats(player);
  say(`As a ${player.class}...`);
  say(`Your speed is: ${player.speed}`);
  say(`Your knowledge is: ${player.knowledge}\n`);

  say(`Time to WAKE UP!`);

  let turns = 0;
  while (playing && turns++ < 10) {
    const command = await ask("What do you want to do?");
    if (command == "quit") {
      playing = false;
    }
    let event = "";

    const prompt = `
  This is a text adventure game of a college student facing obstacles in the morning on their way to school. 

  The end goal is to try and make it to class on time.

    The player is named ${player.name}.
    The player's speed is ${player.speed}.
    The player's knowledge is ${player.knowledge}.

  The current setting is ${location}.

  The game starts with the student waking up. If their speed is less than 6 than they wake up late, if their speed is greater than or equal to 6, they wake up to their alarm.

  The speed affects how quickly the player makes their actions, the quicker they are, the better they are. They are more likely not miss trains or other time-based obstacles.

  The knowledge affects how prepared the player is, they are less likely to forget things like their homework and can make up obstacles that were affected by their slow speed.
 
  Recently: ${context.slice(-3).join(" ")}

  Respond in second person.
  Be brief, and avoid narating actions not taken by the player via commands. Keep it within 3 sentences. Start each response with 'Turn #${turns}'. 
  When describing locations mention places the player might go.

  Provide the player 3 different command options as A. B. C. in which they can choose from and then an additional fourth option D. which is 'quit'.

  ${event}

  The player command is '${command}'. 
  `;

    const response = await gptPrompt(prompt, {
      max_tokens: 128,
      temperature: 0.5,
    });
    context.push(response);
    say(`${response}\n`);
    if (turns === 5) event = "add an obstacle setback to the scene";
    if (turns === 11) {
      event = "provide an exit game description on how the player did";
    }
  }
}

function findPlayerStats(player) {
  if (player.class.toLowerCase().includes("freshman")) {
    player.speed = 8;
    player.knowledge = 2;
  } else if (player.class.toLowerCase().includes("sophomore")) {
    player.speed = 6;
    player.knowledge = 6;
  } else if (player.class.toLowerCase().includes("junior")) {
    player.speed = 8;
    player.knowledge = 8;
  } else if (player.class.toLowerCase().includes("senior")) {
    player.speed = 2;
    player.knowledge = 8;
  } else {
    player.speed = 5;
    player.knowledge = 5;
  }
}
