import { describe, it, expect } from "vitest";
import { etfFlowsEngine } from "../lib/engines/etf-flows-engine";

describe("Spot ETF Capital Flows Engine", () => {
  it("should return daily institutional net flows", () => {
    const flows = etfFlowsEngine.getEtfFlows();
    expect(flows.length).toBeGreaterThan(0);
    expect(flows[0].etfTicker).toBeDefined();
  });
});
