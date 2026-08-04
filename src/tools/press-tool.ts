import { tool } from "langchain";
import { z } from "zod";
import { browserService } from "../browser/browser-instance.js";

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
  },
);
