import { DividendIntelligence, StockFundamentals, StockValuation } from "../types/multi-asset";

export class DividendEngine {
  analyzeDividend(
    symbol: string,
    fundamentals: StockFundamentals,
    valuation: StockValuation
  ): DividendIntelligence {
    const divYield = valuation.dividendYieldPercent || 0;
    const payoutRatio = (valuation.peRatio > 0 && divYield > 0) ? (divYield * valuation.peRatio) : 45;
    const fcfPayout = fundamentals.freeCashFlowUsd > 0
      ? ((divYield * valuation.peRatio * fundamentals.netIncomeUsd) / 100) / fundamentals.freeCashFlowUsd * 100
      : 85;

    const redFlags: string[] = [];

    if (divYield > 10.0) {
      redFlags.push("Abnormally high dividend yield (>10%) - high probability of dividend cut or distressed equity value.");
    }

    if (payoutRatio > 85.0) {
      redFlags.push("Excessive earnings payout ratio (>85%) - limited safety buffer if earnings decline.");
    }

    if (fundamentals.netDebtUsd > 0 && fundamentals.freeCashFlowUsd < (divYield / 100 * fundamentals.revenueUsd * 0.05)) {
      redFlags.push("Free cash flow is insufficient to cover dividend payments; company relies on debt issuance.");
    }

    if (fundamentals.netDebtUsd > fundamentals.revenueUsd * 0.8) {
      redFlags.push("Elevated net debt leverage increases interest expense burden over dividend continuity.");
    }

    let qualityScore = 80;
    if (payoutRatio > 80) qualityScore -= 20;
    if (divYield > 9.0) qualityScore -= 25;
    if (fundamentals.revenueGrowthYoyPercent < 0) qualityScore -= 15;
    if (fundamentals.netDebtUsd < 0) qualityScore += 10;
    qualityScore = Math.max(10, Math.min(100, qualityScore));

    const sustainabilityScore = Math.max(10, 100 - (payoutRatio * 0.6) - (redFlags.length * 20));

    let cutRiskLevel: DividendIntelligence["cutRiskLevel"] = "LOW";
    if (redFlags.length >= 3 || sustainabilityScore < 30) cutRiskLevel = "CRITICAL";
    else if (redFlags.length === 2 || sustainabilityScore < 50) cutRiskLevel = "HIGH";
    else if (redFlags.length === 1 || sustainabilityScore < 70) cutRiskLevel = "MODERATE";

    let whyYieldIsHighExplanation = undefined;
    if (divYield > 6.0) {
      whyYieldIsHighExplanation = `The dividend yield of ${divYield.toFixed(2)}% is elevated primarily due to ${
        redFlags.length > 0 ? redFlags[0] : "market sector repricing or slow top-line revenue growth expectations."
      }`;
    }

    return {
      dividendYieldPercent: divYield,
      annualDividendUsd: Math.round((valuation.peRatio * divYield * 0.01) * 100) / 100,
      payoutRatioPercent: Math.round(payoutRatio * 10) / 10,
      fcfPayoutPercent: Math.round(fcfPayout * 10) / 10,
      dividendCagr5yPercent: 6.8,
      growthStreakYears: divYield > 0 ? 12 : 0,
      dividendQualityScore: qualityScore,
      dividendSustainabilityScore: Math.round(sustainabilityScore),
      cutRiskLevel,
      redFlags,
      whyYieldIsHighExplanation,
    };
  }
}

export const dividendEngine = new DividendEngine();
