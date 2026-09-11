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
        "Observe the current webpage and return structured information about interactive elements. This is an internal observation step for browser automation. Use the returned element attributes to identify the target element using find_element tool and continue executing the user's task. Do not treat this tool as a reason to finish the task or provide a page summary.",
  }
);