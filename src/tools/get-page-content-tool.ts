import { tool } from "langchain";

import { browserService } from "../browser/browser-instance.js";

export const getPageContentTool = tool(
  async () => {
    return await browserService.getPageContent();
  },
  {
    name: "get_page_content",
    description:
      "Get the visible text content and basic information from the current webpage to help identify elements and perform browser actions.",
  }
);