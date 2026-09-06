import { NextResponse } from "next/server";
import { coinGeckoProvider } from "@/lib/providers/coingecko";
import { fearGreedProvider } from "@/lib/providers/feargreed";

export async function GET() {
  try {
    const [globalData, fearGreedData, topCoins] = await Promise.allSettled([
      coinGeckoProvider.getGlobal(),
      fearGreedProvider.getLatest(),
      coinGeckoProvider.getTopCoins(10),
    ]);

    const global = globalData.status === "fulfilled" ? globalData.value : null;
    const fearGreed = fearGreedData.status === "fulfilled" ? fearGreedData.value : null;
    const coins = topCoins.status === "fulfilled" ? topCoins.value : [];

    return NextResponse.json(
      {
        global: global
          ? {
              totalMarketCap: global.total_market_cap.usd || 0,
              totalVolume: global.total_volume.usd || 0,
              btcDominance: global.market_cap_percentage.btc || 0,
              ethDominance: global.market_cap_percentage.eth || 0,
              activeCryptocurrencies: global.active_cryptocurrencies || 0,
              markets: global.markets || 0,
              source: "coingecko",
              timestamp: new Date().toISOString(),
            }
          : null,
        fearGreed: fearGreed
          ? {
              value: fearGreed.value,
              classification: fearGreed.value_classification,
              timestamp: fearGreed.timestamp,
              source: "feargreed",
            }
          : null,
        topCoins: coins.map((c) => ({
          id: c.id,
          symbol: c.symbol.toUpperCase(),
          name: c.name,
          price: c.current_price,
          marketCap: c.market_cap,
          priceChange24h: c.price_change_percentage_24h,
          rank: c.market_cap_rank,
        })),
        sources: {
          global: "coingecko",
          fearGreed: "feargreed",
          topCoins: "coingecko",
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), status: "UNAVAILABLE" },
      { status: 503 }
    );
  }
}
