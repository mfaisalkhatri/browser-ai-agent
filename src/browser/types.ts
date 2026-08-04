import { Browser as PlaywrightBrowser, BrowserContext, Page } from "playwright";

export interface BrowserSession {
  id: string;
  browser: PlaywrightBrowser;
  context: BrowserContext;
  page: Page;
}