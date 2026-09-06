import { describe, it, expect } from "vitest";
import { ScoringEngine } from "../lib/engine/scoring";
import { TechnicalIndicators } from "../lib/engine/technical";

describe("ScoringEngine", () => {
  const engine = new ScoringEngine();

  const mockTech: TechnicalIndicators = {
    rsi: 60,
    ema9: 105,
    ema21: 102,
    ema50: 100,
    ema200: 90,
    sma20: 103,
    sma50: 100,
    sma200: 90,
    macd: { macd: 2, signal: 1, histogram: 1 },
    bollinger: { upper: 110, middle: 100, lower: 90 },
    atr: 2,
    adx: { adx: 30, plusDI: 25, minusDI: 15 },
    stochastic: { k: 60, d: 55 },
    vwap: 102,
    supportLevels: [95],
    resistanceLevels: [110],
    trend: "BULLISH",
    volatilityRegime: "NORMAL",
    breakout: { isBreakout: true, type: "RESISTANCE_BREAKOUT", strength: 80 },
  };

  it("should calculate a positive score for a strong bullish setup", () => {
    const breakdown = engine.calculateScore(mockTech, 65, 5000000, 0.05, 4);
    expect(breakdown.totalScore).toBeGreaterThan(60);
    expect(breakdown.confidenceScore).toBeGreaterThan(70);
  });
});
