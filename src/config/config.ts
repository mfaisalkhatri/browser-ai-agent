import "dotenv/config";

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable '${name}' is required.`);
  }

  return value;
}

export const config = {
  ollamaModel: process.env.OLLAMA_MODEL ?? "qwen3:8b",
  temperature: Number(process.env.LLM_TEMPERATURE ?? "0.2"),
  LT_USERNAME: getEnv("LT_USERNAME"),
  LT_ACCESS_KEY: getEnv("LT_ACCESS_KEY"),
  platformName: process.env.BROWSERCLOUD_PLATFORM_NAME ?? "Windows 11",
  browserName: process.env.BROWSERCLOUD_BROWSER_NAME ?? "Chrome",
  browserVersion: Number(process.env.BROWSERCLOUD_BROWSER_VERSION ?? "latest"),
};
