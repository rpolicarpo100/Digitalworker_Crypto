import { NextRequest, NextResponse } from "next/server";
import { dexScreenerProvider } from "@/lib/providers/dexscreener";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "PEPE";

  try {
    const pairs = await dexScreenerProvider.searchPairs(q);
    return NextResponse.json({
      query: q,
      count: pairs.length,
      pairs: pairs.slice(0, 20).map((p) => ({
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
      })),
      source: "dexscreener",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), query: q, status: "UNAVAILABLE" },
      { status: 503 }
    );
  }
}
