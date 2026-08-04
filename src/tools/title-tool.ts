import { tool } from "langchain";

import { BrowserService } from "../browser/browser-service.js";

const browserService = new BrowserService();

export const titleTool = tool(
  async () => {
    return await browserService.getTitle();
  },
  {
    name: "get_title",
    description: "Get the title of the current webpage.",
  }
);