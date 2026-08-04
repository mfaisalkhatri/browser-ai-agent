import fs from "node:fs";
import path from "node:path";

export class Logger {
  private static readonly logDir = path.resolve("logs");

  private static ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private static get logFile(): string {
    this.ensureLogDirectory();

    const now = new Date();

    const fileName = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(
      2,
      "0"
    )}.log`;

    return path.join(this.logDir, fileName);
  }

  private static write(
    level: string,
    scope: string,
    message: string
  ): void {
    const timestamp = new Date().toISOString();

    const log = `[${timestamp}] [${level}] [${scope}] ${message}`;

    console.log(log);

    fs.appendFileSync(this.logFile, `${log}\n`);
  }

  static info(scope: string, message: string): void {
    this.write("INFO", scope, message);
  }

  static success(scope: string, message: string): void {
    this.write("SUCCESS", scope, message);
  }

  static warn(scope: string, message: string): void {
    this.write("WARN", scope, message);
  }

  static error(
    scope: string,
    message: string,
    error?: unknown
  ): void {
    const details =
      error instanceof Error
        ? `${message}\n${error.stack}`
        : message;

    this.write("ERROR", scope, details);
  }

  static divider(title?: string): void {
    const line = "=".repeat(80);

    console.log(line);

    fs.appendFileSync(this.logFile, `${line}\n`);

    if (title) {
      console.log(title);
      fs.appendFileSync(this.logFile, `${title}\n`);
    }

    console.log(line);
    fs.appendFileSync(this.logFile, `${line}\n`);
  }
}