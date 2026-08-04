import { tool } from "langchain";
import { z } from "zod";
import { browserService } from "../browser/browser-instance.js";

export const clickTool = tool(
  async ({ locator }) => {
    return await browserService.click(locator);
  },
  {
    name: "click",
    description:
      "Click an element on the current webpage using a Playwright locator.",
    schema: z.object({
      locator: z
        .string()
        .describe("The Playwright locator of the element to click."),
    }),
  },
);
