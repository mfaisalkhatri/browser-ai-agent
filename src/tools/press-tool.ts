import { tool } from "langchain";
import { z } from "zod";

import { BrowserService } from "../browser/browser-service.js";

const browserService = new BrowserService();

export const pressTool = tool(
  async ({ key }) => {
    return await browserService.press(key);
  },
  {
    name: "press",
    description: "Press a keyboard key on the current webpage.",
    schema: z.object({
      key: z
        .string()
        .describe("Keyboard key to press. Example: Enter, Escape, Tab."),
    }),
  }
);