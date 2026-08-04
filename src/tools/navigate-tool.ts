import { tool } from "langchain";
import { z } from "zod";
import { browserService } from "../browser/browser-instance.js";

export const navigateTool = tool(
  async ({ url }) => {
    return await browserService.goto(url);
  },
  {
    name: "navigate",
    description: "Navigate the browser to a given URL.",
    schema: z.object({
      url: z.string().describe("The URL to open in the browser."),
    }),
  },
);
