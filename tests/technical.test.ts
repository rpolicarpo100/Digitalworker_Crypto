import { describe, it, expect } from "vitest";
import { TechnicalEngine } from "../lib/engine/technical";

describe("TechnicalEngine", () => {
  const engine = new TechnicalEngine();

  it("should calculate RSI correctly", () => {
    const closes = [10, 11, 12, 11, 13, 14, 15, 14, 16, 17, 18, 19, 18, 20, 21, 22];
    const rsi = engine.calculateRSI(closes, 14);
    expect(rsi).toBeGreaterThan(50);
    expect(rsi).toBeLessThanOrEqual(100);
  });

  it("should calculate EMA correctly", () => {
    const closes = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const ema = engine.calculateEMA(closes, 5);
    expect(ema).toBeGreaterThan(14);
  });

  it("should identify bullish trend when price and short EMAs align", () => {
    const candles = Array.from({ length: 50 }, (_, i) => ({
      openTime: i * 3600000,
      closeTime: (i + 1) * 3600000,
      open: 100 + i,
      high: 102 + i,
      low: 99 + i,
      close: 101 + i,
      volume: 1000 + i * 10,
    }));

    const analysis = engine.analyze(candles);
    expect(analysis.trend).toBe("BULLISH");
  });
});
