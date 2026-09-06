import { NextResponse } from "next/server";
import { dexScreenerProvider } from "@/lib/providers/dexscreener";

export async function GET() {
  try {
    const pairs = await dexScreenerProvider.searchPairs("SOL");
    return NextResponse.json({
      pairs: pairs.slice(0, 15).map((p) => ({
        chainId: p.chainId,
        dexId: p.dexId,
        url: p.url,
        pairAddress: p.pairAddress,
        baseToken: p.baseToken,
        quoteToken: p.quoteToken,
        priceUsd: p.priceUsd,
        volume24h: p.volume?.h24 || 0,
        priceChange24h: p.priceChange?.h24 || 0,
        liquidityUsd: p.liquidity?.usd || 0,
        fdv: p.fdv || 0,
        txns24h: (p.txns?.h24?.buys || 0) + (p.txns?.h24?.sells || 0),
      })),
      source: "dexscreener",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), status: "UNAVAILABLE" },
      { status: 503 }
    );
  }
}
