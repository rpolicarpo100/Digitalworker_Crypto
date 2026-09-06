import { describe, it, expect } from "vitest";
import { BacktestingEngine } from "../lib/engine/backtesting";
import { Candle } from "../lib/engine/data-quality";

describe("BacktestingEngine", () => {
  const engine = new BacktestingEngine();

  it("should run backtest on historical candles and compare against Buy & Hold", () => {
    const candles: Candle[] = Array.from({ length: 100 }, (_, i) => ({
      openTime: i * 3600000,
      closeTime: (i + 1) * 3600000,
      open: 100 + i * 0.5,
      high: 102 + i * 0.5,
      low: 99 + i * 0.5,
      close: 101 + i * 0.5,
      volume: 1000,
    }));

    const result = engine.runBacktest("BTC", "1h", candles, 10000);
    expect(result.symbol).toBe("BTC");
    expect(result.buyAndHoldReturnPercent).toBeGreaterThan(0);
    expect(result.isPaper).toBe(true);
  });
});
