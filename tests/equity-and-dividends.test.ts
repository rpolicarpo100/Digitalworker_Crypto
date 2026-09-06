import { describe, it, expect } from "vitest";
import { EquityValuationEngine } from "../lib/engines/equity-valuation-engine";
import { DividendTrapEngine } from "../lib/engines/dividend-trap-engine";

describe("Equity Research Engine & Dividend Trap Radar", () => {
  it("should return comprehensive equity valuation metrics for NVDA", () => {
    const fin = EquityValuationEngine.getFinancials("NVDA");
    expect(fin.canonicalId).toBe("equity:nvda:nasdaq");
    expect(fin.revenue.value).toBeGreaterThan(0);
    expect(fin.revenue.sourceType).toBe("OFFICIAL_FILING");
    expect(fin.peRatio.value).toBeGreaterThan(0);
    expect(fin.dataQualityScore).toBeGreaterThanOrEqual(95);
  });

  it("should evaluate dividend sustainability for Realty Income (O)", () => {
    const div = DividendTrapEngine.analyzeDividend("O");
    expect(div.canonicalId).toBe("reit:o:nyse");
    expect(div.riskLevel).toBe("LOW_RISK");
    expect(div.consecutiveYearsGrowth.value).toBeGreaterThanOrEqual(25);
    expect(div.evidenceNotes.length).toBeGreaterThan(0);
  });
});
