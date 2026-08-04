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
      return this.handleError(error);
    }
  }

  async click(locator: string): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      await this.resolveLocator(locator).click();

      return {
        success: true,
        message: "Element clicked.",
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async fill(
    locator: string,
    text: string
  ): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      await this.resolveLocator(locator).fill(text);

      return {
        success: true,
        message: "Text entered.",
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

  async extractText(
    locator: string
  ): Promise<BrowserResult> {
    await this.ensureSession();

    try {
      const text = await this.resolveLocator(locator).innerText();

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

    return {
      success: true,
      message: "Title retrieved.",
      data: await this.session!.page.title(),
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


  async findElement(
    description: string
  ): Promise<BrowserResult> {
    await this.ensureSession();

    const page = this.session!.page;

    const strategies = [
      {
        name: "role-button",
        locator: page.getByRole("button", {
          name: description,
        }),
      },
      {
        name: "role-link",
        locator: page.getByRole("link", {
          name: description,
        }),
      },
      {
        name: "label",
        locator: page.getByLabel(description),
      },
      {
        name: "placeholder",
        locator: page.getByPlaceholder(description),
      },
      {
        name: "text",
        locator: page.getByText(description, {
          exact: false,
        }),
      },
      {
        name: "css-xpath",
        locator: page.locator(description),
      },
    ];


    for (const strategy of strategies) {

      try {

        if (await strategy.locator.count() > 0) {

          return {
            success: true,
            message: "Element found.",
            data: {
              strategy: strategy.name,
              locator: description,
            },
          };

        }

      } catch {
        continue;
      }

    }


    return {
      success: false,
      message: "Element not found.",
      data: {
        searchedFor: description,
      },
    };
  }


  private async ensureSession(): Promise<void> {
    if (!this.session) {
      await this.start();
    }
  }


  private resolveLocator(locator: string) {

    const page = this.session!.page;

    return page.locator(locator);

  }


  private handleError(error: unknown): BrowserResult {

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