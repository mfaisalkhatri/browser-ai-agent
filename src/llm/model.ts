import "dotenv/config";

import { ChatOllama } from "@langchain/ollama";
import { config } from "../config/config.js";

export const model = new ChatOllama({
  model: config.ollamaModel,
  temperature: config.temperature,
  streaming: false,
});
