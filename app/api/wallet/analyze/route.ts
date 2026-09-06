import { NextRequest, NextResponse } from "next/server";
import { walletEngine } from "@/lib/engine/wallet";
import { dexScreenerProvider } from "@/lib/providers/dexscreener";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  const chain = searchParams.get("chain") || "ethereum";

  try {
    const pairs = await dexScreenerProvider.searchPairs(address);
    const bestPair = pairs[0];

    const liquidityUsd = bestPair?.liquidity?.usd || 250000;
    const txns24h = (bestPair?.txns?.h24?.buys || 10) + (bestPair?.txns?.h24?.sells || 10);
    const buyRatio = txns24h > 0 ? (bestPair?.txns?.h24?.buys || 5) / txns24h : 0.5;

    const analysis = walletEngine.classifyWallet(
      address,
      chain,
      liquidityUsd,
      txns24h,
      buyRatio
    );

    return NextResponse.json({
      analysis,
      pairDetails: bestPair
        ? {
            chainId: bestPair.chainId,
            dexId: bestPair.dexId,
            priceUsd: bestPair.priceUsd,
            liquidityUsd: bestPair.liquidity?.usd,
          }
        : null,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), status: "UNAVAILABLE" },
      { status: 503 }
    );
  }
}
