import { describe, it, expect } from "vitest";
import { divergenceEngine } from "../lib/engines/divergence-engine";

describe("Price vs. Volume Divergence Engine", () => {
  it("should return divergence accumulation alerts", () => {
    const alerts = divergenceEngine.getDivergenceAlerts();
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0].divergenceScore).toBeGreaterThan(50);
  });
});
