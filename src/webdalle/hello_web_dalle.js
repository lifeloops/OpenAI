import * as fal from "npm:@fal-ai/serverless-client";
import { loadEnv } from "../shared/util.ts";
import * as log from "../shared/logger.ts";

const env = loadEnv();
if (!env.FAL_API_KEY) log.warn("No FAL_API_KEY in .env file");

fal.config({
  credentials: env.FAL_API_KEY,
});

import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { makeImage } from "../shared/openai.ts";
import { createExitSignal, staticServer } from "../shared/server.ts";

const app = new Application();
const router = new Router();

// Function to transform prompt to sketch-style based on iteration
function transformToSketchPrompt(prompt, iteration) {
  if (iteration === 1) {
    return `A simple, low-fidelity sketch of ${prompt} drawn as if by a designer 
    or artist during the initial iteration stage. The sketch should be executed 
    with a light gray pencil imitating a sketch book aeshtic. The sketch should 
    feature the basics, reflecting the simplicity and roughness typical of a first
     draft sketch.`;

  } else if (iteration === 2) {
    return `make a second skecth based on the first iteration of the sketch ${prompt}`; // More detailed or refined sketch for the second iteration
  }
  return prompt;
}

// Modified DALL•E route to handle iterations
router.get("/api/dalle", async (ctx) => {
  const originalPrompt = ctx.request.url.searchParams.get("prompt");
  const iteration = parseInt(ctx.request.url.searchParams.get("iteration") || "1");
  const sketchPrompt = transformToSketchPrompt(originalPrompt, iteration);
  console.log("Sketch Prompt for iteration", iteration, ":", sketchPrompt);
  const result = await makeImage(sketchPrompt);
  ctx.response.body = result;
});

// Install routes
app.use(router.routes());
app.use(router.allowedMethods());

// Set up to serve static files from public
app.use(staticServer);

// Tell the user we are about to start
console.log("\nListening on http://localhost:8000");

// Start the web server
await app.listen({ port: 8000, signal: createExitSignal() });
