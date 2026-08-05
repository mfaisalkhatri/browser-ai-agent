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
      const page = this.session!.page;

      const elements = await page.evaluate(() => {
        function getLabel(element: Element): string | null {
          const htmlElement = element as HTMLElement;

          // <label for="id">
          if (htmlElement.id) {
            const label = document.querySelector(
              `label[for="${CSS.escape(htmlElement.id)}"]`,
            );
            if (label?.textContent?.trim()) {
              return label.textContent.trim();
            }
          }

          // Wrapped by <label>
          const parentLabel = htmlElement.closest("label");
          if (parentLabel?.textContent?.trim()) {
            return parentLabel.textContent.trim();
          }

          return null;
        }

        function isVisible(element: HTMLElement): boolean {
          const style = window.getComputedStyle(element);

          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            style.opacity !== "0" &&
            element.getClientRects().length > 0
          );
        }

        const selectors = [
          "input",
          "button",
          "textarea",
          "select",
          "a",
          "[role]",
          "[contenteditable]",
        ];

        const seen = new Set<Element>();

        const nodes = selectors.flatMap((selector) =>
          Array.from(document.querySelectorAll(selector)),
        );

        const elements = nodes
          .filter((el) => {
            if (seen.has(el)) {
              return false;
            }

            seen.add(el);
            return true;
          })
          .map((el) => {
            const element = el as HTMLElement;

            return {
              tag: element.tagName.toLowerCase(),

              role: element.getAttribute("role"),

              type: element.getAttribute("type"),

              id: element.id || null,

              name: element.getAttribute("name"),

              label: getLabel(element),

              text:
                element.innerText?.trim() || element.textContent?.trim() || "",

              placeholder: element.getAttribute("placeholder"),

              ariaLabel: element.getAttribute("aria-label"),

              title: element.getAttribute("title"),

              alt: element.getAttribute("alt"),

              value:
                element instanceof HTMLInputElement ||
                element instanceof HTMLTextAreaElement
                  ? element.value
                  : null,

              href: element.getAttribute("href"),

              testId:
                element.getAttribute("data-testid") ??
                element.getAttribute("data-test") ??
                element.getAttribute("data-cy"),

              visible: isVisible(element),

              disabled:
                element instanceof HTMLButtonElement ||
                element instanceof HTMLInputElement ||
                element instanceof HTMLSelectElement ||
                element instanceof HTMLTextAreaElement
                  ? element.disabled
                  : false,
            };
          });

        return {
          url: window.location.href,
          title: document.title,
          totalElements: elements.length,
          elements,
        };
      });

      return {
        success: true,
        message: "Interactive page snapshot retrieved.",
        data: elements,
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
