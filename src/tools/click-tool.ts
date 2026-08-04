import { tool } from "langchain";
import { z } from "zod";

import { browserService } from "../browser/browser-instance.js";
import { executionLog } from "../utils/execution-log.js";
import { Logger } from "../utils/logger.js";

export const clickTool = tool(
  async ({ locator }) => {
    const start = Date.now();

    Logger.info("TOOL", `click -> ${locator}`);

    const result = await browserService.click(locator);

    executionLog.logStep(
      "click",
      { locator },
      result,
      Date.now() - start,
      result.success
    );

    if (result.success) {
      Logger.success("TOOL", `Clicked element: ${locator}`);
    } else {
      Logger.error("TOOL", `Failed to click element: ${locator}`);
    }

    return result;
  },
  {
    name: "click",
    description: "Click an element using a semantic locator, CSS selector, or XPath.",
    schema: z.object({
      locator: z
        .string()
        .describe("Semantic locator, CSS selector, or XPath of the element."),
    }),
  }
);