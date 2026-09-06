import { describe, it, expect } from "vitest";
import { multiAssetResearchEngine } from "../lib/engines/multi-asset-research-engine";

describe("Multi-Asset Financial Intelligence Research Engine", () => {
  it("should generate research report for Crypto asset (BTC)", async () => {
    const report = await multiAssetResearchEngine.generateAnalysisReport("BTC");
    expect(report.profile.symbol).toBe("BTC");
    expect(report.profile.assetClass).toBe("CRYPTO");
    expect(report.scores.confidenceScore).toBeGreaterThan(50);
  });

  it("should generate research report for Stock asset (NVDA)", async () => {
    const report = await multiAssetResearchEngine.generateAnalysisReport("NVDA");
    expect(report.profile.symbol).toBe("NVDA");
    expect(report.profile.assetClass).toBe("STOCK");
    expect(report.fundamentals).toBeDefined();
    expect(report.valuation).toBeDefined();
    expect(report.devilsAdvocate.bearishReview).toContain("NVDA");
  });
});
