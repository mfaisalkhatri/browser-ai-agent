import { createAgent } from "langchain";

import { model } from "../llm/model.js";
import { tools } from "../tools/index.js";
import { SYSTEM_PROMPT } from "./prompt.js";
import { Logger } from "../utils/logger.js";
import { executionLog } from "../utils/execution-log.js";

export const agent = createAgent({
  model,
  tools,
  systemPrompt: SYSTEM_PROMPT,
});

export async function invokeAgent(
  input: string
): Promise<string> {
  executionLog.reset();
  executionLog.startRun(input);

  Logger.info("AGENT", "Invoking AI agent");

  const start = Date.now();

  try {
    const response = await agent.invoke({
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    });

    const duration = Date.now() - start;

    Logger.success(
      "AGENT",
      `Execution completed in ${duration} ms`
    );

    const lastMessage =
      response.messages[response.messages.length - 1];

    let output: string;

    if (typeof lastMessage.content === "string") {
      output = lastMessage.content;
    } else {
      output = JSON.stringify(lastMessage.content, null, 2);
    }

    Logger.info("AGENT", "Final Response:");
    Logger.info("ASSISTANT", output);

    executionLog.endRun();

    return output;
  } catch (error) {
    Logger.error(
      "AGENT",
      "Agent execution failed.",
      error
    );

    executionLog.endRun();

    throw error;
  }
}