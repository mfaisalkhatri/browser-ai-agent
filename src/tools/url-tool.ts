import { tool } from "langchain";

import { BrowserService } from "../browser/browser-service.js";

const browserService = new BrowserService();

export const urlTool = tool(
  async () => {
    return await browserService.getUrl();
  },
  {
    name: "get_url",
    description: "Get the current URL of the browser page.",
  }
);