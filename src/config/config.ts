import "dotenv/config";

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable '${name}' is required.`);
  }

  return value;
}

function getOptionalEnv(name: string): string | undefined {
  return process.env[name];
}

function getBrowserMode(): "local" | "cloud" {
  const browser = process.env.BROWSER_MODE ?? "local";

  if (browser !== "local" && browser != "cloud") {
    throw new Error(
      "Invalid BROWSER value `${browser}`. Expected  'local' or 'cloud'.",
    );
  }
  return browser;
}

function getBrowserCloudCredentials() {
  return {
    username: getEnv("LT_USERNAME"),
    accessKey: getEnv("LT_ACCESS_KEY"),
  };
}

export const config = {
  ollamaModel: process.env.OLLAMA_MODEL ?? "qwen3:8b",
  temperature: Number(process.env.LLM_TEMPERATURE ?? "0.2"),
  browser: getBrowserMode(),
  headless: process.env.HEADLESS === "true",
  getBrowserCloudCredentials,
  platformName: process.env.BROWSERCLOUD_PLATFORM_NAME ?? "Windows 11",
  browserName: process.env.BROWSERCLOUD_BROWSER_NAME ?? "Chrome",
  browserVersion: process.env.BROWSERCLOUD_BROWSER_VERSION ?? "latest",
};
