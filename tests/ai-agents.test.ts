import { describe, it, expect } from "vitest";
import { aiOrchestrator } from "../lib/ai/orchestrator";

describe("AI Multi-Agent & Grounded Reasoning Engine", () => {
  it("should process user query and return grounded response with counterarguments and invalidation", async () => {
    const res = await aiOrchestrator.processQuery("Why is BTC bullish?", "BTC");

    expect(res.answer).toContain("BTC");
    expect(res.sources.length).toBeGreaterThan(0);
    expect(res.confidenceScore).toBeGreaterThan(0);
    expect(res.counterarguments.length).toBeGreaterThan(0);
    expect(res.invalidation.length).toBeGreaterThan(0);
    expect(res.timestamp).toBeTruthy();
  });
});
