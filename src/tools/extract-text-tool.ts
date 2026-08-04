import { tool } from "langchain";
import { z } from "zod";

import { BrowserService } from "../browser/browser-service.js";

const browserService = new BrowserService();

export const extractTextTool = tool(
  async ({ locator }) => {
    return await browserService.extractText(locator);
  },
  {
    name: "extract_text",
    description: "Extract visible text from an element using a Playwright locator.",
    schema: z.object({
      locator: z
        .string()
        .describe("The Playwright locator of the element to extract text from."),
    }),
  }
);