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
      "Inspect the current webpage and return structured information about visible interactive elements. Use this information to identify elements required by the user's task and then call the appropriate browser action tool such as click, fill, press, or navigate. Do not summarize or explain the page content to the user unless the user's task explicitly asks for page information.",
  }
);