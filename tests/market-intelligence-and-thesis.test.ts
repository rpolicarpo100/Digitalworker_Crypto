import { describe, it, expect } from "vitest";
import { MarketIntelligenceEngine } from "../lib/engines/market-intelligence-engine";
import { ThesisEngine } from "../lib/engines/thesis-engine";

describe("Market Intelligence, What Changed, Third Eye & Thesis Engine", () => {
  it("should inspect market regime and What Changed report for BTC", () => {
    const regime = MarketIntelligenceEngine.getMarketRegime();
    expect(regime.regime).toBe("RISK_ON");
    expect(regime.liquidityScore).toBeGreaterThan(0);

    const report = MarketIntelligenceEngine.inspectWhatChanged("BTC");
    expect(report.canonicalId).toBe("crypto:btc:mainnet");
    expect(report.whatChanged.length).toBeGreaterThan(0);
    expect(report.confidence).toBeGreaterThan(80);
  });

  it("should generate Third Eye findings with hidden risks and liquidity traps", () => {
    const findings = MarketIntelligenceEngine.inspectThirdEye("BTC");
    expect(findings.canonicalId).toBe("crypto:btc:mainnet");
    expect(findings.hiddenRisks.length).toBeGreaterThan(0);
    expect(findings.thirdEyeSummary).toContain("Fundamentals");
  });

  it("should retrieve investment thesis with invalidation conditions for BTC", () => {
    const thesis = ThesisEngine.getThesis("BTC");
    expect(thesis.canonicalId).toBe("crypto:btc:mainnet");
    expect(thesis.status).toBe("ACTIVE");
    expect(thesis.invalidationConditions.length).toBeGreaterThan(0);
  });
});
