import { describe, it, expect } from "vitest";
import { stressTestEngine } from "../lib/engines/stress-test-engine";

describe("Portfolio Stress Testing Engine", () => {
  it("should run stress test against historical crises", () => {
    const report = stressTestEngine.runStressTest(100000);
    expect(report.scenarios.length).toBeGreaterThan(0);
    expect(report.scenarios[0].benchmarkDropPercent).toBeLessThan(0);
  });
});
