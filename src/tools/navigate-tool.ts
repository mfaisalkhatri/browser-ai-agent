import { tool } from "langchain";
import { z } from "zod";
import { browserService } from "../browser/browser-instance.js";
import { executionLog } from "../utils/execution-log.js";
import { Logger } from "../utils/logger.js";

export const navigateTool = tool(
  async ({ url }) => {
    const start = Date.now();
    Logger.info("TOOL: ", `navigate -> ${url}`);

    const result = await browserService.goto(url);

    executionLog.logStep(
      "navigate",
      { url },
      result,
      Date.now() - start,
      result.success,
    );

    if (result.success) {
      Logger.success("TOOL", `Navigation completed: ${url}`);
    } else {
      Logger.error("TOOL", `Navigation failed: ${url}`);
    }
    return result;
  },
  {
    name: "navigate",
    description: "Navigate the browser to a given URL.",
    schema: z.object({
      url: z.string().describe("The URL to open in the browser."),
    }),
  },
);
