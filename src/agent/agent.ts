import { createAgent } from "langchain";

import { model } from "../llm/model.js";
import { tools } from "../tools/index.js";
import { SYSTEM_PROMPT } from "./prompt.js";

export const agent = createAgent({
  model,
  tools,
  systemPrompt: SYSTEM_PROMPT,
});

export async function invokeAgent(input: string): Promise<string> {
  const response = await agent.invoke({
    messages: [
      {
        role: "user",
        content: input,
      },
    ],
  });

  const lastMessage =
    response.messages[response.messages.length - 1];

  if (typeof lastMessage.content === "string") {
    return lastMessage.content;
  }

  return JSON.stringify(lastMessage.content);
}