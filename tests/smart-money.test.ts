import { describe, it, expect } from "vitest";
import { smartMoneyEngine } from "../lib/engines/smart-money-engine";

describe("Smart Money & Whale Tracker Engine", () => {
  it("should return top whale wallets", async () => {
    const whales = await smartMoneyEngine.getTopWhales();
    expect(whales.length).toBeGreaterThan(0);
    expect(whales[0].winRatePercent).toBeGreaterThan(50);
  });
});
