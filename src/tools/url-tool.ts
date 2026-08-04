import { tool } from "langchain";

import { browserService } from "../browser/browser-instance.js";

export const urlTool = tool(
  async () => {
    return await browserService.getUrl();
  },
  {
    name: "get_url",
    description: "Get the current URL of the browser page.",
  }
);