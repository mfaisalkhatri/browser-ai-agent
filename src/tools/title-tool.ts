import { tool } from "langchain";

import { browserService } from "../browser/browser-instance.js";

export const titleTool = tool(
  async () => {
    return await browserService.getTitle();
  },
  {
    name: "get_title",
    description: "Get the title of the current webpage.",
  }
);