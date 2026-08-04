import { ChatOllama } from "@langchain/ollama";
import { createToolCallingAgent, AgentExecutor } from "langchain/agents/";

import { browserAgentPrompt } from "./prompt.js";
import { browserTool } from "../tools/browser-tool.js";

export class BrowserAgent {

    private readonly executor: AgentExecutor;

    constructor() {

        const llm = new ChatOllama({

            model: process.env.OLLAMA_MODEL ?? "qwen3:8b",

            temperature: 0

        });

        const agent = createToolCallingAgent({

            llm,

            tools: [browserTool],

            prompt: browserAgentPrompt

        });

        this.executor = new AgentExecutor({

            agent,

            tools: [browserTool],

            verbose: true

        });

    }

    async run(input: string): Promise<string> {

        const response = await this.executor.invoke({

            input,

            chat_history: []

        });

        return response.output;

    }

}