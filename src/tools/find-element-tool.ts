import { tool } from "langchain";
import { z } from "zod";

import { browserService } from "../browser/browser-instance.js";
import { executionLog } from "../utils/execution-log.js";
import { Logger } from "../utils/logger.js";

export const findElementTool = tool(
  async ({ description }) => {
    const start = Date.now();

    Logger.info(
      "TOOL",
      `find_element -> description="${description}"`
    );

    const result = await browserService.findElement(description);

    executionLog.logStep(
      "find_element",
      { description },
      result,
      Date.now() - start,
      result.success
    );

    if (result.success) {
      Logger.success(
        "TOOL",
        `Element found: ${description}`
      );
    } else {
      Logger.error(
        "TOOL",
        `Element not found: ${description}`
      );
    }

    return result;
  },
  {
    name: "find_element",
    description:
      "Locate an element on the current webpage using semantic locators such as role, label, placeholder, text, or test id. If no semantic locator matches, fall back to CSS selector or XPath.",
    schema: z.object({
      description: z
        .string()
        .describe(
          "Natural language description, semantic locator, CSS selector, or XPath of the element."
        ),
    }),
  }
);