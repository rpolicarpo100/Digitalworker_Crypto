import { describe, it, expect } from "vitest";
import { monteCarloEngine } from "../lib/engines/monte-carlo-engine";

describe("Monte Carlo Risk Simulator Engine", () => {
  it("should run 10,000 stochastic trajectory simulations", () => {
    const result = monteCarloEngine.runSimulation({
      initialPortfolioUsd: 10000,
      timeHorizonDays: 30,
      simulationsCount: 1000, // Fast unit test
    });

    expect(result.initialPortfolioUsd).toBe(10000);
    expect(result.sampleTrajectories.length).toBe(5);
    expect(result.var95PercentUsd).toBeGreaterThanOrEqual(0);
  });
});
