import { tool } from "langchain";
import { z } from "zod";

import { browserService } from "../browser/browser-instance.js";
import { executionLog } from "../utils/execution-log.js";
import { Logger } from "../utils/logger.js";

export const pressTool = tool(
  async ({ key }) => {
    const start = Date.now();

    Logger.info(
      "TOOL",
      `press -> key="${key}"`
    );

    const result = await browserService.press(key);

    executionLog.logStep(
      "press",
      { key },
      result,
      Date.now() - start,
      result.success
    );

    if (result.success) {
      Logger.success(
        "TOOL",
        `Pressed key: ${key}`
      );
    } else {
      Logger.error(
        "TOOL",
        `Failed to press key: ${key}`
      );
    }

    return result;
  },
  {
    name: "press",
    description: "Press a keyboard key such as Enter, Tab, Escape, ArrowDown, etc.",
    schema: z.object({
      key: z
        .string()
        .describe("The keyboard key to press."),
    }),
  }
);