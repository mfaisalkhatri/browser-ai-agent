import { tool } from "langchain";
import { z } from "zod";

import { BrowserService } from "../browser/browser-service.js";
import { BrowserActionType } from "../models/browser-action.js";

const browserService = new BrowserService();

export const browserTool = tool(
  async (input) => {
    switch (input.action) {
      case BrowserActionType.GOTO:
        return await browserService.execute({
          action: BrowserActionType.GOTO,
          url: input.url,
          timeout: input.timeout,
        });

      case BrowserActionType.CLICK:
        return await browserService.execute({
          action: BrowserActionType.CLICK,
          locator: input.locator,
        });

      case BrowserActionType.TYPE:
        return await browserService.execute({
          action: BrowserActionType.TYPE,
          locator: input.locator,
          text: input.text,
        });

      case BrowserActionType.PRESS:
        return await browserService.execute({
          action: BrowserActionType.PRESS,
          key: input.key,
        });

      case BrowserActionType.WAIT:
        return await browserService.execute({
          action: BrowserActionType.WAIT,
          timeout: input.timeout,
        });

      case BrowserActionType.GET_TITLE:
        return await browserService.execute({
          action: BrowserActionType.GET_TITLE,
        });

      case BrowserActionType.GET_URL:
        return await browserService.execute({
          action: BrowserActionType.GET_URL,
        });

      case BrowserActionType.EXTRACT_TEXT:
        return await browserService.execute({
          action: BrowserActionType.EXTRACT_TEXT,
          locator: input.locator,
        });

      case BrowserActionType.SCREENSHOT:
        return await browserService.execute({
          action: BrowserActionType.SCREENSHOT,
          path: input.path,
        });

      case BrowserActionType.CLOSE:
        return await browserService.execute({
          action: BrowserActionType.CLOSE,
        });

      default:
        throw new Error(`Unsupported browser action: ${input.action}`);
    }
  },
  {
    name: "browser",
    description:
      "Execute browser automation actions using Browser Cloud and Playwright.",
    schema: z.object({
      action: z.enum(BrowserActionType),

      url: z.string().optional(),

      locator: z.string().optional(),

      text: z.string().optional(),

      key: z.string().optional(),

      timeout: z.number().optional(),

      path: z.string().optional(),
    }),
  },
);
