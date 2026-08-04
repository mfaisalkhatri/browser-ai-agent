import { BrowserSession } from "./types.js";
import { SessionManager } from "./session.js";

export class BrowserService {

  private readonly manager = new SessionManager();

  private session?: BrowserSession;

  async start(): Promise<void> {
    this.session = await this.manager.create();
  }

  async goto(url: string): Promise<void> {
    await this.session!.page.goto(url);
  }

  async title(): Promise<string> {
    return await this.session!.page.title();
  }

  async url(): Promise<string> {
    return this.session!.page.url();
  }

  async close(): Promise<void> {

    if (!this.session) {
      return;
    }

    await this.manager.release(this.session);

    this.session = undefined;
  }
}