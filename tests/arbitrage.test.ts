import { describe, it, expect } from "vitest";
import { ArbitrageEngine } from "../lib/engine/arbitrage";

describe("ArbitrageEngine", () => {
  const engine = new ArbitrageEngine();

  it("should calculate net edge after fees, gas, and slippage", () => {
    // 3% gross spread ($100 vs $103) with $500,000 pool liquidity
    const arb = engine.evaluateArbitrage("SOL", "binance", "dexscreener", 100, 103, 500000);
    expect(arb.grossSpreadPercent).toBeCloseTo(3.0, 1);

    // For a $10 trade, gas ($2.50) exceeds $0.30 gross profit => net profit < 0
    const trade10 = arb.evaluations.find((e) => e.tradeSizeUsd === 10);
    expect(trade10?.isValidArbitrage).toBe(false);
    expect(trade10?.netProfitUsd).toBeLessThan(0);

    // For a $1,000 trade on $500k pool with 3% spread ($30 gross), total costs ~$8 => +$22 net profit!
    const trade1k = arb.evaluations.find((e) => e.tradeSizeUsd === 1000);
    expect(trade1k?.netProfitUsd).toBeGreaterThan(0);
    expect(trade1k?.isValidArbitrage).toBe(true);
  });
});
