import { SessionManager } from "./session.js";
import { BrowserSession } from "./types.js";
import { BrowserResult } from "../models/browser-result.js";

export class BrowserService {
  private readonly sessionManager = new SessionManager();
  private session?: BrowserSession;

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
      return this.error(error);
    }
  }

  async click(locator: string): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      await this.session!.page.locator(locator).click();

      return {
        success: true,
        message: "Element clicked.",
      };
    } catch (error) {
      return this.error(error);
    }
  }

  async fill(locator: string, text: string): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      await this.session!.page.locator(locator).fill(text);

      return {
        success: true,
        message: "Text entered.",
      };
    } catch (error) {
      return this.error(error);
    }
  }

  async press(key: string): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      await this.session!.page.keyboard.press(key);

      return {
        success: true,
        message: `Key ${key} pressed.`,
      };
    } catch (error) {
      return this.error(error);
    }
  }

  async wait(timeout: number): Promise<BrowserResult> {
    await this.ensureSession();

    await this.session!.page.waitForTimeout(timeout);

    return {
      success: true,
      message: `Waited ${timeout}ms.`,
    };
  }

  async extractText(locator: string): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      const text = await this.session!.page
        .locator(locator)
        .innerText();

      return {
        success: true,
        message: "Text extracted.",
        data: text,
      };
    } catch (error) {
      return this.error(error);
    }
  }

  async getTitle(): Promise<BrowserResult> {
    await this.ensureSession();

    const title = await this.session!.page.title();

    return {
      success: true,
      message: "Title retrieved.",
      data: title,
    };
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
    await ensurePath(path);

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
      return this.error(error);
    }
  }

  private async ensureSession(): Promise<void> {
    if (!this.session) {
      await this.start();
    }
  }

  private error(error: unknown): BrowserResult {
    return {
      success: false,
      message: "Browser operation failed.",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    };
  }
}

async function ensurePath(path: string): Promise<void> {
  return Promise.resolve();
}