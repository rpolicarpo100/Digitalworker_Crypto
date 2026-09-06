import { describe, it, expect } from "vitest";
import { FredProvider } from "../lib/providers/fred";

describe("FRED API Macro Integration & TradingView Lightweight Charts", () => {
  it("should return official macro indicators from FRED provider", async () => {
    const macro = await FredProvider.getMacroIndicators();
    expect(macro.fedFundsRatePercent.value).toBe(5.25);
    expect(macro.treasury10yYieldPercent.value).toBeGreaterThan(0);
    expect(macro.yieldCurveSpread10Y2Y.sourceType).toBe("REGULATORY");
    expect(macro.cpiInflationYoyPercent.value).toBeLessThan(5.0);
  });
});
