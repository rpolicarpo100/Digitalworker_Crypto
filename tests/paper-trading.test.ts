import { describe, it, expect } from "vitest";
import { PaperTradingEngine } from "../lib/engine/paper-trading";

describe("PaperTradingEngine", () => {
  it("should execute paper buy and sell orders correctly with fee deduction", () => {
    const engine = new PaperTradingEngine(10000);

    // Buy $1,000 worth of BTC at $50,000
    const buyResult = engine.executePaperOrder("BTC", "BUY", 1000, 50000, 0.1);
    expect(buyResult.success).toBe(true);

    const portAfterBuy = engine.getPortfolio();
    expect(portAfterBuy.positions).toHaveLength(1);
    expect(portAfterBuy.cashBalanceUsd).toBeLessThan(9000);

    // Sell the position at $55,000 (+10% gain) closing entire position
    const sellResult = engine.executePaperOrder("BTC", "SELL", 1000, 55000, 0.1, true);
    expect(sellResult.success).toBe(true);

    const portAfterSell = engine.getPortfolio();
    expect(portAfterSell.positions).toHaveLength(0);
    expect(portAfterSell.totalPnlUsd).toBeGreaterThan(0);
    expect(portAfterSell.winRatePercent).toBe(100);
  });
});
