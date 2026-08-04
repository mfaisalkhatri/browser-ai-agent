import "dotenv/config";
import { Browser } from "@testmuai/browser-cloud";

export class BrowserClient {
  private readonly client: Browser;

  constructor() {
    this.client = new Browser();
  }

  get instance(): Browser {
    return this.client;
  }
}