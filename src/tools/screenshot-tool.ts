import { tool } from "langchain";
import { z } from "zod";
import { browserService } from "../browser/browser-instance.js";

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
  },
);
