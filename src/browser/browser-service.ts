import { BrowserAction, BrowserActionType } from "../models/browser-action.js";
import { BrowserResult } from "../models/browser-result.js";
import { BrowserSession } from "./types.js";
import { SessionManager } from "./session.js";

export class BrowserService {
  private readonly sessionManager = new SessionManager();
  private session?: BrowserSession;

  async start(): Promise<void> {
    if (!this.session) {
      this.session = await this.sessionManager.create();
    }
  }

  async close(): Promise<void> {
    if (this.session) {
      await this.sessionManager.release(this.session);
      this.session = undefined;
    }
  }

  async execute(action: BrowserAction): Promise<BrowserResult> {
    await this.start();

    const page = this.session!.page;

    try {
      switch (action.action) {
        case BrowserActionType.GOTO:
          await page.goto(action.url!, {
            waitUntil: "domcontentloaded",
            timeout: action.timeout,
          });

          return this.success("Navigation completed.");

        case BrowserActionType.CLICK:
          await page.locator(action.locator!).click();

          return this.success("Element clicked.");

        case BrowserActionType.TYPE:
          await page.locator(action.locator!).fill(action.text ?? "");

          return this.success("Text entered.");

        case BrowserActionType.PRESS:
          await page.keyboard.press(action.key!);

          return this.success(`Key '${action.key}' pressed.`);

        case BrowserActionType.WAIT:
          await page.waitForTimeout(action.timeout ?? 1000);

          return this.success("Wait completed.");

        case BrowserActionType.GET_TITLE: {
          const title = await page.title();

          return this.success("Page title retrieved.", {
            title,
          });
        }

        case BrowserActionType.GET_URL: {
          const url = page.url();

          return this.success("Page URL retrieved.", {
            url,
          });
        }

        case BrowserActionType.EXTRACT_TEXT: {
          const text = await page.locator(action.locator!).innerText();

          return this.success("Text extracted.", {
            data: text,
          });
        }

        case BrowserActionType.SCREENSHOT: {
          const path = action.path ?? "screenshot.png";

          await page.screenshot({
            path,
            fullPage: true,
          });

          return this.success("Screenshot captured.", {
            screenshotPath: path,
          });
        }

        case BrowserActionType.CLOSE:
          await this.close();

          return {
            success: true,
            message: "Browser session closed.",
          };

        default:
          return {
            success: false,
            message: "Unsupported browser action.",
            error: `Unknown action: ${action.action}`,
          };
      }
    } catch (error) {
      return {
        success: false,
        message: "Browser action failed.",
        error: error instanceof Error ? error.message : "Unknown browser error",
      };
    }
  }

  private success(
    message: string,
    result: Partial<BrowserResult> = {},
  ): BrowserResult {
    return {
      success: true,
      message,
      url: result.url ?? this.session?.page.url(),
      title: result.title,
      data: result.data,
      screenshotPath: result.screenshotPath,
    };
  }
}
