import { NextResponse } from "next/server";
import { quantEngine, AssetCorrelation } from "@/lib/engine/quant";
import { binanceProvider } from "@/lib/providers/binance";

const TARGET_ASSETS = ["BTC", "ETH", "SOL", "BNB", "AVAX"];

export async function GET() {
  try {
    const candleResults = await Promise.allSettled(
      TARGET_ASSETS.map((sym) => binanceProvider.getCandles(sym, "1d", 30))
    );

    const priceMap: Record<string, number[]> = {};
    candleResults.forEach((res, idx) => {
      if (res.status === "fulfilled" && res.value.length > 0) {
        priceMap[TARGET_ASSETS[idx]] = res.value.map((c) => c.close);
      }
    });

    const correlations: AssetCorrelation[] = [];
    const symbols = Object.keys(priceMap);

    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        const symA = symbols[i];
        const symB = symbols[j];
        const corr = quantEngine.calculateCorrelation(priceMap[symA], priceMap[symB]);
        correlations.push({
          assetA: symA,
          assetB: symB,
          correlation: Math.round(corr * 100) / 100,
        });
      }
    }

    return NextResponse.json({
      symbols,
      correlations,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), status: "UNAVAILABLE" },
      { status: 503 }
    );
  }
}
