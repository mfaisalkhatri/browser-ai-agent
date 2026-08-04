import "dotenv/config";

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { invokeAgent } from "./agent/agent.js";
import { browserService } from "./browser/browser-instance.js";

async function main(): Promise<void> {
  console.log("========================================");
  console.log("       Browser AI Agent");
  console.log("       Type 'exit' to quit");
  console.log("========================================\n");

  const rl = readline.createInterface({
    input,
    output,
  });

  const shutdown = async () => {
    console.log("\nShutting down browser session...");

    try {
      await browserService.close();
    } catch (error) {
      console.error(
        "Error closing browser:",
        error instanceof Error
          ? error.message
          : error
      );
    } finally {
      rl.close();
      process.exit(0);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

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

  try {
    while (true) {
      const userInput = await readPrompt(rl);

      if (!userInput.trim()) {
        continue;
      }

      if (
        ["exit", "quit"].includes(
          userInput.trim().toLowerCase()
        )
      ) {
        await shutdown();
        break;
      }

      try {
        const response = await invokeAgent(userInput);

        console.log("\nAssistant:");
        console.log(response);
        console.log();

      } catch (error) {
        console.error(
          "\nAgent Error:",
          error instanceof Error
            ? error.message
            : error
        );
        console.log();
      }
    }
  } finally {
    rl.close();
  }
}

main().catch(async (error) => {
  console.error(error);

  try {
    await browserService.close();
  } finally {
    process.exit(1);
  }
});