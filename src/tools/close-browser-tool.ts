import { tool } from "langchain";

import { browserService } from "../browser/browser-instance.js";
import { executionLog } from "../utils/execution-log.js";
import { Logger } from "../utils/logger.js";

export const closeBrowserTool = tool(
  async () => {
    const start = Date.now();

    Logger.info(
      "TOOL",
      "close_browser"
    );

    const result = await browserService.close();

    executionLog.logStep(
      "close_browser",
      {},
      result,
      Date.now() - start,
      result.success
    );

    if (result.success) {
      Logger.success(
        "TOOL",
        "Browser session closed."
      );
    } else {
      Logger.error(
        "TOOL",
        "Failed to close browser session."
      );
    }

    return result;
  },
  {
    name: "close_browser",
    description: "Close the active browser session and release Browser Cloud resources.",
  }
);