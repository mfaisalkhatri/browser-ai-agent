import { tool } from "langchain";
import { z } from "zod";

import { BrowserService } from "../browser/browser-service.js";

const browserService = new BrowserService();

export const screenshotTool = tool(
  async ({ path }) => {
    return await browserService.screenshot(path);
  },
  {
    name: "screenshot",
    description: "Capture a screenshot of the current webpage.",
    schema: z.object({
      path: z
        .string()
        .describe("File path where the screenshot should be saved."),
    }),
  }
);