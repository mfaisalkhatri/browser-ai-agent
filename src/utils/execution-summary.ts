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
    console.log("\n=================================================");
    console.log("Execution Summary");
    console.log("=================================================");
    console.log(`Total Steps : ${this.total}`);
    console.log(`Passed      : ${this.passed}`);
    console.log(`Failed      : ${this.failed}`);
    console.log("=================================================\n");
  }
}

export const executionSummary = new ExecutionSummary();