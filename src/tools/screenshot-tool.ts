import { tool } from "langchain";
import { z } from "zod";

import { browserService } from "../browser/browser-instance.js";
import { executionLog } from "../utils/execution-log.js";
import { Logger } from "../utils/logger.js";

export const screenshotTool = tool(
  async ({ path }) => {
    const start = Date.now();

    Logger.info(
      "TOOL",
      `screenshot -> path="${path}"`
    );

    const result = await browserService.screenshot(path);

    executionLog.logStep(
      "screenshot",
      { path },
      result,
      Date.now() - start,
      result.success
    );

    if (result.success) {
      Logger.success(
        "TOOL",
        `Screenshot saved to: ${path}`
      );
    } else {
      Logger.error(
        "TOOL",
        `Failed to capture screenshot: ${path}`
      );
    }

    return result;
  },
  {
    name: "screenshot",
    description: "Capture a screenshot of the current webpage and save it to the specified file path.",
    schema: z.object({
      path: z
        .string()
        .describe("Destination file path where the screenshot should be saved."),
    }),
  }
);