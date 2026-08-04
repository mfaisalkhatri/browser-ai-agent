import { Locator, Page } from "playwright";
import {LocatorResolutionResult,LocatorStrategy,} from "../browser/browser-types.js"

export class LocatorResolver {
  constructor(private readonly page: Page) {}

  async resolve(
    description: string
  ): Promise<LocatorResolutionResult> {
    const query = description.trim();

    const strategies = [
      () => this.byRole(query),
      () => this.byLabel(query),
      () => this.byPlaceholder(query),
      () => this.byAltText(query),
      () => this.byTitle(query),
      () => this.byTestId(query),
      () => this.byText(query),
      () => this.byCss(query),
      () => this.byXpath(query),
    ];

    for (const strategy of strategies) {
      const result = await strategy();

      if (result.success) {
        return result;
      }
    }

    return {
      success: false,
      message: `Unable to locate "${description}"`,
    };
  }

  // ------------------------------------------------------------------
  // Role
  // ------------------------------------------------------------------

  private async byRole(
    query: string
  ): Promise<LocatorResolutionResult> {
    const roles = [
      "button",
      "link",
      "textbox",
      "checkbox",
      "radio",
      "combobox",
      "option",
      "menuitem",
      "tab",
      "heading",
    ] as const;

    for (const role of roles) {
      const locator = this.page.getByRole(role, {
        name: query,
        exact: false,
      });

      if (await this.isValid(locator)) {
        return this.success(
          LocatorStrategy.ROLE,
          query,
          locator,
          100
        );
      }
    }

    return this.failure();
  }

  // ------------------------------------------------------------------
  // Label
  // ------------------------------------------------------------------

  private async byLabel(
    query: string
  ): Promise<LocatorResolutionResult> {
    const locator = this.page.getByLabel(query, {
      exact: false,
    });

    if (await this.isValid(locator)) {
      return this.success(
        LocatorStrategy.LABEL,
        query,
        locator,
        95
      );
    }

    return this.failure();
  }

  // ------------------------------------------------------------------

  private async byPlaceholder(
    query: string
  ): Promise<LocatorResolutionResult> {
    const locator = this.page.getByPlaceholder(query, {
      exact: false,
    });

    if (await this.isValid(locator)) {
      return this.success(
        LocatorStrategy.PLACEHOLDER,
        query,
        locator,
        94
      );
    }

    return this.failure();
  }

  // ------------------------------------------------------------------

  private async byAltText(
    query: string
  ): Promise<LocatorResolutionResult> {
    const locator = this.page.getByAltText(query, {
      exact: false,
    });

    if (await this.isValid(locator)) {
      return this.success(
        LocatorStrategy.ALT_TEXT,
        query,
        locator,
        93
      );
    }

    return this.failure();
  }

  // ------------------------------------------------------------------

  private async byTitle(
    query: string
  ): Promise<LocatorResolutionResult> {
    const locator = this.page.getByTitle(query, {
      exact: false,
    });

    if (await this.isValid(locator)) {
      return this.success(
        LocatorStrategy.TITLE,
        query,
        locator,
        92
      );
    }

    return this.failure();
  }

  // ------------------------------------------------------------------

  private async byTestId(
    query: string
  ): Promise<LocatorResolutionResult> {
    const locator = this.page.getByTestId(query);

    if (await this.isValid(locator)) {
      return this.success(
        LocatorStrategy.TEST_ID,
        query,
        locator,
        90
      );
    }

    return this.failure();
  }

  // ------------------------------------------------------------------

  private async byText(
    query: string
  ): Promise<LocatorResolutionResult> {
    const locator = this.page.getByText(query, {
      exact: false,
    });

    if (await this.isValid(locator)) {
      return this.success(
        LocatorStrategy.TEXT,
        query,
        locator,
        80
      );
    }

    return this.failure();
  }

  // ------------------------------------------------------------------

  private async byCss(
    query: string
  ): Promise<LocatorResolutionResult> {
    if (
      !query.startsWith("#") &&
      !query.startsWith(".") &&
      !query.startsWith("[")
    ) {
      return this.failure();
    }

    const locator = this.page.locator(query);

    if (await this.isValid(locator)) {
      return this.success(
        LocatorStrategy.CSS,
        query,
        locator,
        30
      );
    }

    return this.failure();
  }

  // ------------------------------------------------------------------

  private async byXpath(
    query: string
  ): Promise<LocatorResolutionResult> {
    if (
      !query.startsWith("//") &&
      !query.startsWith("(//")
    ) {
      return this.failure();
    }

    const locator = this.page.locator(`xpath=${query}`);

    if (await this.isValid(locator)) {
      return this.success(
        LocatorStrategy.XPATH,
        query,
        locator,
        20
      );
    }

    return this.failure();
  }

  // ------------------------------------------------------------------

  private async isValid(locator: Locator): Promise<boolean> {
    try {
      if ((await locator.count()) !== 1) {
        return false;
      }

      if (!(await locator.isVisible())) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  // ------------------------------------------------------------------

  private success(
    strategy: LocatorStrategy,
    value: string,
    locator: Locator,
    confidence: number
  ): LocatorResolutionResult {
    return {
      success: true,
      message: "Element resolved.",
      resolved: {
        strategy,
        value,
        locator,
        confidence,
        matches: 1,
        visible: true,
        enabled: true,
      },
    };
  }

  private failure(): LocatorResolutionResult {
    return {
      success: false,
      message: "",
    };
  }
}