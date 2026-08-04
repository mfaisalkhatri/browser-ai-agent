import "dotenv/config";

import { ChatOllama } from "@langchain/ollama";

export const model = new ChatOllama({
  model: process.env.OLLAMA_MODEL ?? "qwen3:8b",
  temperature: 0,
  streaming: false,
});