import { BrowserClient } from "./browser.js";
import { BrowserSession } from "./types.js";
import { config } from "../config/config.js";
import { chromium } from "playwright";

export class SessionManager {
  private readonly client =
    config.browser === "cloud" ? new BrowserClient() : undefined;

  async create(): Promise<BrowserSession> {
    if (config.browser === "local") {
      return this.createLocalSession();
    }
    return this.createCloudSession();
  }

  private async createLocalSession(): Promise<BrowserSession> {
    const browser = await chromium.launch({ headless: config.headless });

    const context = await browser.newContext();
    const page = await context.newPage();

    return {
      id: "local",
      browser,
      context,
      page,
    };
  }

  private async createCloudSession(): Promise<BrowserSession> {
    if (!this.client) {
      throw new Error("Browser Cloud client is not initialized!");
    }

    const credentials = config.getBrowserCloudCredentials();

    const session = await this.client.instance.sessions.create({
      adapter: "playwright",

      lambdatestOptions: {
        build: "Browser AI Agent",
        name: "AI Session",

        platformName: config.platformName,
        browserName: config.browserName,
        browserVersion: config.browserVersion,

        "LT:Options": {
          username: credentials.username,
          accessKey: credentials.accessKey,
          video: true,
          console: true,
        },
      },
    });
    const connection = await this.client.instance.playwright.connect(session);

    return {
      id: session.id,
      browser: connection.browser,
      context: connection.page.context(),
      page: connection.page,
    };
  }

  async release(session: BrowserSession): Promise<void> {
    try {
      await session.browser.close();
    } finally {
      if (config.browser === "cloud") {
        await this.client?.instance.sessions.release(session.id);
      }
    }
  }
}
