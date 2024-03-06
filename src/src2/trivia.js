/**
 * triva.js
 * Uses GPT to generate trivia questions based on a user-provided topic.
 * Uses GPT to evaluate the answers.
 */
import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

main();

async function main() {
  say("Hello, Player!");

  const topic = await ask("What do you want to be quized on?");

  const questionsString = await gptPrompt(
    `
        Generate 4 questions for a triva game.do not provide answers.
    The topic is ${topic}.
    provide the questions as a javascript array of strings like this:
    ["question 1", "question 2", "question 3", "question 4"]

    Include only the array, start with [ and end with ].
    `,
    { max_tokens: 1024, temperature: 1.5 },
  );

  let questions = [];
  try {
    questions = JSON.parse(questionsString);
  } catch (_e) {
    say(`Error parsing questions string: "${questionsString}"`);
    end();
    return;
  }

  say("");

  let correctAnswers = 0;

  for (const q of questions) {
    const a = await ask(q);
    const response = await gptPrompt(
      `
    The question was '${q}'.
    The provided answer was '${a}'.
    Was the answer correct?
    Be an easy grader. Accept answers that are close enough. Allow misspellings.
    Answer yes or no. If no, provide the correct answer.
    `,
      { max_tokens: 64, temperature: .5 },
    );
    if (response.toLowerCase() === "yes") {
      correctAnswers++; // Increment correct answer counter
    }
    say(response);
    say("");
  }
  say("");
  // Display the score
  say(
    `You answered ${correctAnswers} out of ${questions.length} questions correctly.`,
  );
}
