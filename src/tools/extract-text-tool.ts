import { tool } from "langchain";
import { z } from "zod";
import { browserService } from "../browser/browser-instance.js";

export const extractTextTool = tool(
  async ({ locator }) => {
    return await browserService.extractText(locator);
  },
  {
    name: "extract_text",
    description:
      "Extract visible text from an element using a Playwright locator.",
    schema: z.object({
      locator: z
        .string()
        .describe(
          "The Playwright locator of the element to extract text from.",
        ),
    }),
  },
);
