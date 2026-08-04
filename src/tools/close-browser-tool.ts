import { tool } from "langchain";
import { browserService } from "../browser/browser-instance.js";

export const closeBrowserTool = tool(
  async () => {
    return await browserService.close();
  },
  {
    name: "close_browser",
    description: "Close the current browser session.",
  },
);
