import { describe, it, expect } from "vitest";
import { insiderTradingEngine } from "../lib/engines/insider-trading-engine";

describe("Corporate Insider Trading Engine", () => {
  it("should return SEC Form 4 insider transactions", () => {
    const transactions = insiderTradingEngine.getRecentTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0].companySymbol).toBeDefined();
  });
});
