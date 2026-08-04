import { tool } from "langchain";
import { z } from "zod";

import { browserService } from "../browser/browser-instance.js";

export const findElementTool = tool(
  async ({ description }) => {
    return await browserService.findElement(description);
  },
  {
    name: "find_element",
    description:
      "Find a webpage element using semantic locators first (role, label, placeholder, text). Falls back to CSS or XPath selectors when required.",
    schema: z.object({
      description: z
        .string()
        .describe(
          "Description of the element to locate, such as button text, field label, placeholder, or selector."
        ),
    }),
  }
);