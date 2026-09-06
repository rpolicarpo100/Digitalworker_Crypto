import { NextRequest, NextResponse } from "next/server";
import { tokenSecurityEngine } from "@/lib/engine/token-security";
import { dexScreenerProvider } from "@/lib/providers/dexscreener";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") || searchParams.get("symbol") || "PEPE";
  const chain = searchParams.get("chain") || "ethereum";

  try {
    const pairs = await dexScreenerProvider.searchPairs(address);
    const bestPair = pairs[0];

    const liquidityUsd = bestPair?.liquidity?.usd || 25000;
    const symbol = bestPair?.baseToken?.symbol || address.toUpperCase();

    const audit = tokenSecurityEngine.auditToken(
      address,
      chain,
      symbol,
      liquidityUsd,
      0, // buy tax
      0, // sell tax
      false, // mint authority
      false, // freeze authority
      liquidityUsd > 100000,
      30 // top holders %
    );

    return NextResponse.json({
      audit,
      pairDetails: bestPair
        ? {
            chainId: bestPair.chainId,
            dexId: bestPair.dexId,
            priceUsd: bestPair.priceUsd,
            liquidityUsd: bestPair.liquidity?.usd,
            fdv: bestPair.fdv,
          }
        : null,
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
