import { SessionManager } from "./session.js";
import { BrowserSession } from "./types.js";
import { BrowserResult } from "../models/browser-result.js";
import { LocatorResolver } from "./locator-resolver.js";

export class BrowserService {
  private readonly sessionManager = new SessionManager();
  private session?: BrowserSession;
  private resolver?: LocatorResolver;

  async start(): Promise<void> {
    if (!this.session) {
      this.session = await this.sessionManager.create();
    }
  }

  async close(): Promise<BrowserResult> {
    if (this.session) {
      await this.sessionManager.release(this.session);
      this.session = undefined;
    }

    return {
      success: true,
      message: "Browser session closed.",
    };
  }

  async goto(url: string): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      await this.session!.page.goto(url, {
        waitUntil: "domcontentloaded",
      });

      return {
        success: true,
        message: "Navigation completed.",
        data: {
          url: this.session!.page.url(),
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async click(locator: string): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      const resolver = new LocatorResolver(this.session!.page);

      const result = await resolver.resolve(locator);

      if (!result.success || !result.resolved) {
        return {
          success: false,
          message: result.message,
        };
      }

      await result.resolved.locator.click();

      return {
        success: true,
        message: "Element clicked.",
        data: {
          strategy: result.resolved.strategy,
          confidence: result.resolved.confidence,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
  async fill(locator: string, text: string): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      const resolver = new LocatorResolver(this.session!.page);

      const result = await resolver.resolve(locator);

      if (!result.success || !result.resolved) {
        return {
          success: false,
          message: result.message,
        };
      }

      await result.resolved.locator.fill(text);

      return {
        success: true,
        message: "Text entered.",
        data: {
          strategy: result.resolved.strategy,
          confidence: result.resolved.confidence,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
  async press(key: string): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      await this.session!.page.keyboard.press(key);

      return {
        success: true,
        message: `Pressed ${key}.`,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async extractText(locator: string): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      const resolver = new LocatorResolver(this.session!.page);

      const result = await resolver.resolve(locator);

      if (!result.success || !result.resolved) {
        return {
          success: false,
          message: result.message,
        };
      }

      const text = await result.resolved.locator.innerText();

      return {
        success: true,
        message: "Text extracted.",
        data: text,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
  async getTitle(): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      const page = this.session!.page;
      await page.waitForLoadState("domcontentloaded");
      await page.waitForFunction(() => document.title.length > 0);

      return {
        success: true,
        message: "Title retrieved.",
        data: await page.title(),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
  async getUrl(): Promise<BrowserResult> {
    await this.ensureSession();

    return {
      success: true,
      message: "URL retrieved.",
      data: this.session!.page.url(),
    };
  }

  async screenshot(path: string): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      await this.session!.page.screenshot({
        path,
        fullPage: true,
      });

      return {
        success: true,
        message: "Screenshot captured.",
        data: path,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getPageContent(): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      const content = await this.session!.page.locator("body").innerText();

      return {
        success: true,
        message: "Page content retrieved.",
        data: content,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async findElement(description: string): Promise<
    BrowserResult<{
      strategy: string;
      confidence: number;
      visible: boolean;
      enabled: boolean;
    }>
  > {
    await this.ensureSession();

    try {
      const resolver = new LocatorResolver(this.session!.page);

      const result = await resolver.resolve(description);

      if (!result.success || !result.resolved) {
        return {
          success: false,
          message: result.message,
        };
      }

      return {
        success: true,
        message: "Element found.",
        data: {
          strategy: result.resolved.strategy,
          confidence: result.resolved.confidence,
          visible: result.resolved.visible,
          enabled: result.resolved.enabled,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
  private async ensureSession(): Promise<void> {
    if (!this.session) {
      await this.start();
    }
  }

  private handleError<T>(error: unknown): BrowserResult<T> {
    return {
      success: false,
      message: "Browser operation failed.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
