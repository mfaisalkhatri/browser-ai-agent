import "dotenv/config";
import { BrowserService } from "./browser/browser-service.js";

async function main() {

  const browser = new BrowserService();

  try {

    await browser.start();

    await browser.goto("https://github.com");

    console.log("Title:", await browser.title());

    console.log("URL:", await browser.url());

  } finally {

    await browser.close();

  }

}

main().catch(console.error);