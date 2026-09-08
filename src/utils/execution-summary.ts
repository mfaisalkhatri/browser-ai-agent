import {Logger} from '../utils/logger.js'
export class ExecutionSummary {
  private total = 0;
  private passed = 0;
  private failed = 0;

  record(success: boolean): void {
    this.total++;

    if (success) {
      this.passed++;
    } else {
      this.failed++;
    }
  }

  reset(): void {
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
  }

  print(): void {
    Logger.divider();
    Logger.info("APP","Execution Summary");
    Logger.divider();
    Logger.info("APP",`Total Steps : ${this.total}`);
    Logger.info("APP",`Passed      : ${this.passed}`);
    Logger.info("APP",`Failed      : ${this.failed}`);
    Logger.divider();
  }
}

export const executionSummary = new ExecutionSummary();