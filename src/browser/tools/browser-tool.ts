import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { BrowserService } from "../../browser/browser-service.js";

const browser = new BrowserService();

export const browserTool = tool(
  async ({ instruction }) => {
    try {
      await browser.start();

      if (instruction.startsWith("http")) {
        await browser.goto(instruction);
      }

      const title = await browser.title();

      const url = await browser.url();

      await browser.close();

      return JSON.stringify({
        success: true,

        title,

        url,
      });
    } catch (error) {
      await browser.close();

      return JSON.stringify({
        success: false,

        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  {
    name: "browser",

    description: "Use this tool whenever browser automation is required.",

    schema: z.object({
      instruction: z.string().describe("Browser instruction"),
    }),
  },
);
