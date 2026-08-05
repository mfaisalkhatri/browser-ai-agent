import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";

import { invokeAgent } from "./agent/agent.js";
import { browserService } from "./browser/browser-instance.js";
import { Logger } from "./utils/logger.js";
import { verifyOllama } from "./utils/ollama.js";

async function readPrompt(): Promise<string> {
  const promptFile =
    process.argv[2] ?? path.resolve(process.cwd(), "prompt.txt");

  Logger.info("APP", `Reading prompt from: ${promptFile}`);

  const prompt = await fs.readFile(promptFile, "utf8");

  return prompt.trim();
}

function parseExecutionSteps(prompt: string): string[] {
  const normalized = prompt.replace(/\r\n/g, "\n").trim();

  // Supports:
  // Step 1:
  // STEP 1:
  const stepRegex = /Step\s+\d+\s*:/gi;

  const matches = [...normalized.matchAll(stepRegex)];

  if (matches.length > 0) {
    const steps: string[] = [];

    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index! + matches[i][0].length;

      const end =
        i + 1 < matches.length ? matches[i + 1].index! : normalized.length;

      const step = normalized.substring(start, end).trim();

      if (step.length > 0) {
        steps.push(step);
      }
    }

    return steps;
  }

  // No "Step 1:" markers.
  // Split by line and treat every non-empty line as a step.

  return normalized
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => {
      const value = line.toLowerCase();

      return !(
        value.includes("close browser") ||
        value.includes("close the browser") ||
        value.includes("close browser session") ||
        value.includes("close the browser session")
      );
    });
}

async function shutdown(): Promise<void> {
  Logger.info("APP", "Shutting down Browser AI Agent");

  try {
    await browserService.close();
    Logger.success("APP", "Browser session closed");
  } catch (error) {
    Logger.error("APP", "Failed to close browser session", error);
  }
}

async function main(): Promise<void> {
  Logger.divider("Browser AI Agent");
  Logger.info("APP", "Application started");

  process.on("SIGINT", async () => {
    Logger.warn("APP", "SIGINT received");
    await shutdown();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    Logger.warn("APP", "SIGTERM received");
    await shutdown();
    process.exit(0);
  });

  try {
    const prompt = await readPrompt();

    Logger.divider("New Request");
    Logger.info("USER", prompt);

    const steps = parseExecutionSteps(prompt);

    Logger.info("APP", `Execution plan contains ${steps.length} step(s)`);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      Logger.divider(`Executing Step ${i + 1}`);

      Logger.info("STEP", step);

      try {
        await verifyOllama();
        const response = await invokeAgent(`
Execution Step ${i + 1} of ${steps.length}

Current Step:
${step}

Instructions:
- Complete ONLY this step.
- Do NOT perform future steps.
- Use the existing browser session.
- If navigation occurs, wait until the page is ready before continuing.
- Return only the result for this step.
`);

        console.log(`\nStep ${i + 1} Response:\n`);
        console.log(response);
        console.log();
      } catch (error) {
        Logger.error("STEP", `Step ${i + 1} failed`, error);
        break;
      }
    }

    Logger.success("APP", "Execution completed");
  } finally {
    await shutdown();
    Logger.info("APP", "Application stopped");
  }
}

main().catch(async (error) => {
  Logger.error("APP", "Unhandled application exception", error);

  try {
    await browserService.close();
  } catch {}

  process.exit(1);
});
