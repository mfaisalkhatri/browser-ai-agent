import { tool } from "langchain";

import { browserService } from "../browser/browser-instance.js";
import { executionLog } from "../utils/execution-log.js";
import { Logger } from "../utils/logger.js";

export const titleTool = tool(
  async () => {
    const start = Date.now();

    Logger.info(
      "TOOL",
      "get_title"
    );

    const result = await browserService.getTitle();

    executionLog.logStep(
      "get_title",
      {},
      result,
      Date.now() - start,
      result.success
    );

    if (result.success) {
      Logger.success(
        "TOOL",
        `Title retrieved: ${result.data}`
      );
    } else {
      Logger.error(
        "TOOL",
        "Failed to retrieve page title"
      );
    }

    return result;
  },
  {
    name: "get_title",
    description: "Get the title of the current webpage.",
  }
);