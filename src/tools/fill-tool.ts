import { tool } from "langchain";
import { z } from "zod";

import { browserService } from "../browser/browser-instance.js";
import { executionLog } from "../utils/execution-log.js";
import { Logger } from "../utils/logger.js";

export const fillTool = tool(
  async ({ locator, text }) => {
    const start = Date.now();

    Logger.info(
      "TOOL",
      `fill -> locator="${locator}", text="${text}"`
    );

    const result = await browserService.fill(locator, text);

    executionLog.logStep(
      "fill",
      {
        locator,
        text,
      },
      result,
      Date.now() - start,
      result.success
    );

    if (result.success) {
      Logger.success(
        "TOOL",
        `Filled element: ${locator}`
      );
    } else {
      Logger.error(
        "TOOL",
        `Failed to fill element: ${locator}`
      );
    }

    return result;
  },
  {
    name: "fill",
    description:
      "Enter text into an input, textarea, or editable element using a semantic locator, CSS selector, or XPath.",
    schema: z.object({
      locator: z
        .string()
        .describe(
          "Semantic locator, CSS selector, or XPath of the element."
        ),
      text: z
        .string()
        .describe("Text to enter into the element."),
    }),
  }
);