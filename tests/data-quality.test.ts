import { describe, it, expect } from "vitest";
import { DataQualityEngine } from "../lib/engine/data-quality";

describe("DataQualityEngine", () => {
  const engine = new DataQualityEngine();

  it("should validate clean price data", () => {
    const report = engine.checkPrice(50000, new Date().toISOString());
    expect(report.valid).toBe(true);
    expect(report.quality).toBe("LIVE");
    expect(report.confidence).toBe("High");
    expect(report.issues).toHaveLength(0);
  });

  it("should flag zero and negative prices as INVALID", () => {
    const reportZero = engine.checkPrice(0);
    expect(reportZero.valid).toBe(false);
    expect(reportZero.issues).toContain("ZERO_PRICE");

    const reportNeg = engine.checkPrice(-100);
    expect(reportNeg.valid).toBe(false);
    expect(reportNeg.issues).toContain("NEGATIVE_PRICE");
  });

  it("should flag provider divergence > threshold", () => {
    const report = engine.checkProviderDisagreement(100, 120, 5);
    expect(report.valid).toBe(false);
    expect(report.issues).toContain("PROVIDER_DISAGREEMENT");
  });

  it("should detect duplicate candle timestamps", () => {
    const candles = [
      { openTime: 1000, closeTime: 2000, open: 10, high: 12, low: 9, close: 11, volume: 100 },
      { openTime: 1000, closeTime: 2000, open: 11, high: 13, low: 10, close: 12, volume: 150 },
    ];
    const report = engine.checkCandles(candles);
    expect(report.valid).toBe(false);
    expect(report.issues).toContain("DUPLICATE_CANDLE");
  });
});
