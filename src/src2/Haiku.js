import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

main();

async function main() {
  say("Henlo, tell me somehting about you and I'll write you a sweet haiku");

  const color = await ask("lets start simple, whats your favorite color?");
  const daytime = await ask("whats your favorite time of the day? ");

  const prompt =
    `create a haiku as if you were a graduate from mills college mfa poetry program based ${color} and ${daytime}.`;

  const haiku = await gptPrompt(prompt, { temperature: 1.5 });
  say(`"""\n${haiku}\n"""`);
}
