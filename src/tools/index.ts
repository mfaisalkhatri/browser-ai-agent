import { navigateTool } from "./navigate-tool.js";
import { clickTool } from "./click-tool.js";
import { fillTool } from "./fill-tool.js";
import { pressTool } from "./press-tool.js";
import { extractTextTool } from "./extract-text-tool.js";
import { titleTool } from "./title-tool.js";
import { urlTool } from "./url-tool.js";
import { screenshotTool } from "./screenshot-tool.js";
import { closeBrowserTool } from "./close-browser-tool.js";

export const tools = [
  navigateTool,
  clickTool,
  fillTool,
  pressTool,
  extractTextTool,
  titleTool,
  urlTool,
  screenshotTool,
  closeBrowserTool,
];

export {
  navigateTool,
  clickTool,
  fillTool,
  pressTool,
  extractTextTool,
  titleTool,
  urlTool,
  screenshotTool,
  closeBrowserTool,
};