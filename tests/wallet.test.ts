import { describe, it, expect } from "vitest";
import { WalletEngine } from "../lib/engine/wallet";

describe("WalletEngine", () => {
  const engine = new WalletEngine();

  it("should classify wallets with >= $1M balance as WHALE", () => {
    const analysis = engine.classifyWallet("0x123", "ethereum", 1500000, 10, 0.8);
    expect(analysis.isWhale).toBe(true);
    expect(analysis.category).toBe("WHALE");
    expect(analysis.exchangeFlowSignal).toBe("OUTFLOW"); // High buy ratio = accumulation
  });

  it("should classify wallets with high transaction frequency as EXCHANGE", () => {
    const analysis = engine.classifyWallet("0x456", "ethereum", 500000, 250, 0.2);
    expect(analysis.category).toBe("EXCHANGE");
    expect(analysis.exchangeFlowSignal).toBe("INFLOW"); // Low buy ratio = distribution / deposit
  });
});
