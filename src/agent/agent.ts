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
  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: input,
      },
    ],
  });

  const lastMessage = result.messages[result.messages.length - 1];

  if (!lastMessage) {
    return "No response received from the agent.";
  }

  if (typeof lastMessage.content === "string") {
    return lastMessage.content;
  }

  if (Array.isArray(lastMessage.content)) {
    return lastMessage.content
      .map((item: any) => {
        if (typeof item === "string") {
          return item;
        }

        if (item.type === "text") {
          return item.text;
        }

        return "";
      })
      .join("\n");
  }

  return JSON.stringify(lastMessage.content, null, 2);
}
