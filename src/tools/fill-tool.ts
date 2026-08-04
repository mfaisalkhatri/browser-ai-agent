import { tool } from "langchain";
import { z } from "zod";

import { BrowserService } from "../browser/browser-service.js";

const browserService = new BrowserService();

export const fillTool = tool(
  async ({ locator, text }) => {
    return await browserService.fill(locator, text);
  },
  {
    name: "fill",
    description: "Fill text into an input field using a Playwright locator.",
    schema: z.object({
      locator: z
        .string()
        .describe("The Playwright locator of the input element."),
      text: z
        .string()
        .describe("The text value to enter."),
    }),
  }
);