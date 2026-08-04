import { tool } from "langchain";

import { BrowserService } from "../browser/browser-service.js";

const browserService = new BrowserService();

export const closeBrowserTool = tool(
  async () => {
    return await browserService.close();
  },
  {
    name: "close_browser",
    description: "Close the current browser session.",
  }
);