import { describe, it, expect } from "vitest";
import { binanceProvider } from "../lib/providers/binance";

describe("BinanceProvider Real API", () => {
  it("should fetch real price from data-api.binance.vision", async () => {
    const price = await binanceProvider.getPrice("BTC");
    expect(price).toBeGreaterThan(1000);
  });

  it("should fetch real OHLC candles from data-api.binance.vision", async () => {
    const candles = await binanceProvider.getCandles("BTC", "1h", 10);
    expect(candles.length).toBeGreaterThan(0);
    expect(candles[0].open).toBeGreaterThan(1000);
  });
});
