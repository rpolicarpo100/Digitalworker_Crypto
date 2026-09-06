import { describe, it, expect } from "vitest";
import { ProfessionalScoreEngine } from "../lib/scoring/professional-score-engine";
import { ScoreCalibrationEngine } from "../lib/scoring/score-calibration-engine";

describe("Professional Scoring Architecture & Score Calibration", () => {
  it("should calculate multi-dimensional scores for BTC without single score reliance", () => {
    const scoreBreakdown = ProfessionalScoreEngine.calculateScores("BTC");
    expect(scoreBreakdown.canonicalId).toBe("crypto:btc:mainnet");
    expect(scoreBreakdown.opportunityScore).toBeGreaterThan(0);
    expect(scoreBreakdown.qualityScore).toBeGreaterThan(0);
    expect(scoreBreakdown.riskScore).toBeGreaterThan(0);
    expect(scoreBreakdown.dataQualityScore).toBeGreaterThanOrEqual(90);
    expect(scoreBreakdown.positiveFactors.length).toBeGreaterThan(0);
    expect(scoreBreakdown.explainabilityText).toContain("BTC");
  });

  it("should calculate multi-dimensional scores for AAPL with stock factors", () => {
    const scoreBreakdown = ProfessionalScoreEngine.calculateScores("AAPL");
    expect(scoreBreakdown.canonicalId).toBe("equity:aapl:nasdaq");
    expect(scoreBreakdown.positiveFactors[0].factor).toContain("Free Cash Flow");
  });

  it("should return historical calibration logs and reliability stats", () => {
    const calibration = ScoreCalibrationEngine.getCalibrationHistory("NVDA");
    expect(calibration.length).toBeGreaterThan(0);
    expect(calibration[0].actualReturnPercent).toBeGreaterThan(0);

    const stats = ScoreCalibrationEngine.getReliabilityStats();
    expect(stats.totalEvaluated).toBeGreaterThan(0);
    expect(stats.successRatePercent).toBe(100);
  });
});
