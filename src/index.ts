import "dotenv/config";

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { invokeAgent } from "./agent/agent.js";
import { browserService } from "./browser/browser-instance.js";
import { Logger } from "./utils/logger.js";

async function readPrompt(
  rl: readline.Interface
): Promise<string> {
  console.log("\nEnter your prompt (type END on a new line to submit):");

  const lines: string[] = [];

  while (true) {
    const line = await rl.question("");

    if (line.trim().toUpperCase() === "END") {
      break;
    }

    lines.push(line);
  }

  return lines.join("\n").trim();
}

async function shutdown(
  rl: readline.Interface
): Promise<void> {
  Logger.info("APP", "Shutting down Browser AI Agent");

  try {
    Logger.info("APP", "Closing browser session");
    await browserService.close();
    Logger.success("APP", "Browser session closed");
  } catch (error) {
    Logger.error(
      "APP",
      "Failed to close browser session",
      error
    );
  } finally {
    rl.close();
  }
}

async function main(): Promise<void> {
  Logger.divider("Browser AI Agent");
  Logger.info("APP", "Application started");

  const rl = readline.createInterface({
    input,
    output,
  });

  process.on("SIGINT", async () => {
    Logger.warn("APP", "SIGINT received");
    await shutdown(rl);
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    Logger.warn("APP", "SIGTERM received");
    await shutdown(rl);
    process.exit(0);
  });

  try {
    while (true) {
      const prompt = await readPrompt(rl);

      if (!prompt) {
        continue;
      }

      const command = prompt.trim().toLowerCase();

      if (command === "exit" || command === "quit") {
        Logger.info("APP", "Exit requested");
        break;
      }

      Logger.divider("New Request");
      Logger.info("USER", prompt);

      try {
        const response = await invokeAgent(prompt);

        console.log("\nAssistant:\n");
        console.log(response);
        console.log();

        Logger.success("APP", "Request completed");
      } catch (error) {
        Logger.error(
          "APP",
          "Request failed",
          error
        );
      }
    }
  } finally {
    await shutdown(rl);
    Logger.info("APP", "Application stopped");
  }
}

main().catch(async (error) => {
  Logger.error(
    "APP",
    "Unhandled application exception",
    error
  );

  try {
    await browserService.close();
  } catch {
    // Ignore cleanup errors
  }

  process.exit(1);
});