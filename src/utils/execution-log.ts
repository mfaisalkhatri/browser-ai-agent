import { Logger } from "./logger.js";

export interface ExecutionStep {
  step: number;
  tool: string;
  input?: unknown;
  output?: unknown;
  success: boolean;
  durationMs: number;
  timestamp: string;
}

export class ExecutionLog {
  private readonly steps: ExecutionStep[] = [];
  private counter = 1;

  startRun(prompt: string): void {
    Logger.divider("Browser AI Agent");

    Logger.info("USER", prompt);
  }

  logStep(
    tool: string,
    input: unknown,
    output: unknown,
    durationMs: number,
    success: boolean
  ): void {
    const step: ExecutionStep = {
      step: this.counter++,
      tool,
      input,
      output,
      success,
      durationMs,
      timestamp: new Date().toISOString(),
    };

    this.steps.push(step);

    Logger.info(
      "STEP",
      `#${step.step} ${tool} (${durationMs} ms)`
    );

    Logger.info(
      "INPUT",
      JSON.stringify(input, null, 2)
    );

    Logger.info(
      "OUTPUT",
      JSON.stringify(output, null, 2)
    );

    if (success) {
      Logger.success(
        "STEP",
        `${tool} completed successfully`
      );
    } else {
      Logger.error(
        "STEP",
        `${tool} failed`
      );
    }
  }

  endRun(): void {
    Logger.divider("Execution Summary");

    for (const step of this.steps) {
      Logger.info(
        "SUMMARY",
        `Step ${step.step}: ${step.tool} | ${step.success ? "SUCCESS" : "FAILED"} | ${step.durationMs} ms`
      );
    }

    Logger.info(
      "SUMMARY",
      `Total Steps: ${this.steps.length}`
    );
  }

  reset(): void {
    this.steps.length = 0;
    this.counter = 1;
  }

  getSteps(): ExecutionStep[] {
    return [...this.steps];
  }
}

export const executionLog = new ExecutionLog();