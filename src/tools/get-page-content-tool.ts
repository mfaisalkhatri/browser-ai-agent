import { tool } from "langchain";

import { browserService } from "../browser/browser-instance.js";
import { executionLog } from "../utils/execution-log.js";
import { Logger } from "../utils/logger.js";

export const getPageContentTool = tool(
  async () => {
    const start = Date.now();

    Logger.info(
      "TOOL",
      "get_page_content"
    );

    const result = await browserService.getPageContent();

    executionLog.logStep(
      "get_page_content",
      {},
      result,
      Date.now() - start,
      result.success
    );

    if (result.success) {
      Logger.success(
        "TOOL",
        "Page content retrieved successfully"
      );
    } else {
      Logger.error(
        "TOOL",
        "Failed to retrieve page content"
      );
    }

    return result;
  },
  {
    name: "get_page_content",
    description:
      "Retrieve the visible text content and basic information from the current webpage to help identify elements and understand the page.",
  }
);