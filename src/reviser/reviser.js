import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "../shared/openai.ts";
import { createExitSignal, staticServer } from "../shared/server.ts";
import { Chalk } from "npm:chalk@5";
import * as log from "../shared/logger.ts";

// Set the logging level to DEBUG to capture detailed logs
log.setLogLevel(log.LogLevel.DEBUG);

// Correctly change the current working directory to the directory of this script
// This adjustment is necessary to serve static files correctly
const path = new URL(".", import.meta.url).pathname;
const correctedPath = Deno.build.os === "windows" ? path.substring(1) : path;
Deno.chdir(correctedPath);

// Log the current working directory with a friendly message
console.log(`Current working directory: ${Deno.cwd()}`);

const chalk = new Chalk({ level: 1 });
const app = new Application();
const router = new Router();

// API routes
router.get("/api/gpt", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");
  if (!prompt) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Prompt parameter is required." };
    return;
  }
  const shortPrompt = prompt.slice(0, 1024);
  try {
    const result = await gptPrompt(shortPrompt, { max_tokens: 1024 });
    ctx.response.body = result;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to process the prompt." };
    console.error(error.message);
  }
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

console.log(chalk.green("\nListening on http://localhost:8000"));

await app.listen({ port: 8000, signal: createExitSignal() });
