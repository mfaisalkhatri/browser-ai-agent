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
      `find_element -> "${description}"`
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
        `Element resolved using '${result.data?.strategy}' strategy`
      );
    } else {
      Logger.error(
        "TOOL",
        result.message
      );
    }

    return result;
  },
  {
    name: "find_element",
    description:
      "Find an element on the current page using a natural language description. The browser service automatically resolves the best locator strategy (role, label, placeholder, alt text, title, test id, text, CSS, or XPath).",
    schema: z.object({
      description: z
        .string()
        .describe("Natural language description of the element to locate."),
    }),
  }
);