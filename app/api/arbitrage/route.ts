import { NextRequest, NextResponse } from "next/server";
import { binanceProvider } from "@/lib/providers/binance";
import { coinGeckoProvider } from "@/lib/providers/coingecko";
import { dexScreenerProvider } from "@/lib/providers/dexscreener";
import { arbitrageEngine } from "@/lib/engine/arbitrage";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "SOL";

  try {
    const [binancePriceRes, cgPriceRes, dexPairsRes] = await Promise.allSettled([
      binanceProvider.getPrice(symbol),
      coinGeckoProvider.getPrice(symbol),
      dexScreenerProvider.searchPairs(symbol),
    ]);

    const priceBinance = binancePriceRes.status === "fulfilled" ? binancePriceRes.value : null;
    const priceCoinGecko = cgPriceRes.status === "fulfilled" ? cgPriceRes.value : null;
    const dexPair = dexPairsRes.status === "fulfilled" && dexPairsRes.value[0] ? dexPairsRes.value[0] : null;
    const priceDex = dexPair?.priceUsd ? parseFloat(dexPair.priceUsd) : null;

    const sources = [
      { name: "binance", price: priceBinance },
      { name: "coingecko", price: priceCoinGecko },
      { name: "dexscreener", price: priceDex },
    ].filter((s) => s.price !== null && s.price > 0) as Array<{ name: string; price: number }>;

    if (sources.length < 2) {
      return NextResponse.json({
        symbol: symbol.toUpperCase(),
        message: "Insufficient price sources available to perform cross-venue arbitrage scan",
        evaluations: [],
      });
    }

    // Sort by price ascending
    sources.sort((a, b) => a.price - b.price);
    const lowest = sources[0];
    const highest = sources[sources.length - 1];

    const arbOpp = arbitrageEngine.evaluateArbitrage(
      symbol.toUpperCase(),
      lowest.name,
      highest.name,
      lowest.price,
      highest.price,
      dexPair?.liquidity?.usd || 100000,
      lowest.name === "dexscreener" || highest.name === "dexscreener"
    );

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      sources: sources.map((s) => ({ source: s.name, price: s.price })),
      lowestVenue: lowest,
      highestVenue: highest,
      arbitrage: arbOpp,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), symbol, status: "UNAVAILABLE" },
      { status: 503 }
    );
  }
}
