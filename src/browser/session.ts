import { BrowserClient } from "./browser.js";
import { BrowserSession } from "./types.js";
import { config } from "../config/config.js";

export class SessionManager {
  private readonly client = new BrowserClient();

  async create(): Promise<BrowserSession> {
    const sdk = this.client.instance;

    const session = await sdk.sessions.create({
      adapter: "playwright",
      lambdatestOptions: {
        build: "Browser AI Agent",
        name: "AI Session",
        platformName: config.platformName,
        browserName: config.browserName,
        browserVersion: config.browserVersion,
        "LT:Options": {
          username: config.LT_USERNAME,
          accessKey: config.LT_ACCESS_KEY,
          video: true,
          console: true,
        },
      },
    });

    const connection = await sdk.playwright.connect(session);

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
      await this.client.instance.sessions.release(session.id);
    }
  }
}
