import "dotenv/config";

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { invokeAgent } from "./agent/agent.js";

async function main(): Promise<void> {
  console.log("========================================");
  console.log("   Browser AI Agent");
  console.log("   Type 'exit' to quit");
  console.log("========================================\n");

  const rl = readline.createInterface({
    input,
    output,
  });

  try {
    while (true) {
      const userInput = await rl.question("> ");

      if (!userInput.trim()) {
        continue;
      }

      if (["exit", "quit"].includes(userInput.trim().toLowerCase())) {
        break;
      }

      try {
        const response = await invokeAgent(userInput);

        console.log("\nAssistant:");
        console.log(response);
        console.log();
      } catch (error) {
        console.error(
          "\nError:",
          error instanceof Error ? error.message : error
        );
        console.log();
      }
    }
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});