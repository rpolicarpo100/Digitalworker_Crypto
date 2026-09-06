import { describe, it, expect } from "vitest";
import { QuantEngine } from "../lib/engine/quant";

describe("QuantEngine", () => {
  const engine = new QuantEngine();

  it("should calculate annualized volatility correctly", () => {
    const prices = [100, 102, 101, 105, 104, 108, 107, 110];
    const annVol = engine.calculateAnnualizedVolatility(prices);
    expect(annVol).toBeGreaterThan(0);
  });

  it("should calculate correlation between two price series", () => {
    const pricesA = [100, 102, 104, 106, 108];
    const pricesB = [200, 204, 208, 212, 216]; // Perfectly correlated
    const corr = engine.calculateCorrelation(pricesA, pricesB);
    expect(corr).toBeCloseTo(1.0, 1);
  });

  it("should calculate expected value and edge correctly", () => {
    const ev = engine.calculateExpectedValue(60, 200, 100); // 60% win rate, $200 win, $100 loss
    // EV = 0.6 * 200 - 0.4 * 100 = 120 - 40 = $80
    expect(ev.expectedValueUsd).toBe(80);
    expect(ev.expectedValuePercent).toBe(80);
  });
});
