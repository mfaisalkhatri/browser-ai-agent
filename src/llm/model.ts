import "dotenv/config";

import { ChatOllama } from "@langchain/ollama";

const temperature = Number(process.env.LLM_TEMPERATURE);
export const model = new ChatOllama({
  model: process.env.OLLAMA_MODEL ?? "qwen3:8b",
  temperature: Number.isFinite(temperature) ? temperature : 0.2,
  streaming: false,
});
