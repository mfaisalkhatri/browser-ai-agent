import { tool } from "langchain";

import { browserService } from "../browser/browser-instance.js";
import { executionLog } from "../utils/execution-log.js";
import { Logger } from "../utils/logger.js";

export const urlTool = tool(
  async () => {
    const start = Date.now();

    Logger.info(
      "TOOL",
      "get_url"
    );

    const result = await browserService.getUrl();

    executionLog.logStep(
      "get_url",
      {},
      result,
      Date.now() - start,
      result.success
    );

    if (result.success) {
      Logger.success(
        "TOOL",
        `Current URL: ${result.data}`
      );
    } else {
      Logger.error(
        "TOOL",
        "Failed to retrieve current URL"
      );
    }

    return result;
  },
  {
    name: "get_url",
    description: "Get the current URL of the active browser page.",
  }
);