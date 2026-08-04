import { tool } from "langchain";
import { z } from "zod";

import { browserService } from "../browser/browser-instance.js";
import { executionLog } from "../utils/execution-log.js";
import { Logger } from "../utils/logger.js";

export const extractTextTool = tool(
  async ({ locator }) => {
    const start = Date.now();

    Logger.info(
      "TOOL",
      `extract_text -> locator="${locator}"`
    );

    const result = await browserService.extractText(locator);

    executionLog.logStep(
      "extract_text",
      { locator },
      result,
      Date.now() - start,
      result.success
    );

    if (result.success) {
      Logger.success(
        "TOOL",
        `Text extracted from: ${locator}`
      );
    } else {
      Logger.error(
        "TOOL",
        `Failed to extract text from: ${locator}`
      );
    }

    return result;
  },
  {
    name: "extract_text",
    description:
      "Extract the visible text from an element using a semantic locator, CSS selector, or XPath.",
    schema: z.object({
      locator: z
        .string()
        .describe(
          "Semantic locator, CSS selector, or XPath of the element."
        ),
    }),
  }
);