import { NextRequest, NextResponse } from "next/server";
import { providerManager } from "@/lib/providers/manager";
import { z } from "zod";

const querySchema = z.object({
  symbol: z.string().min(1).max(20).transform((s) => s.toUpperCase().trim()),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawSymbol = searchParams.get("symbol") || "BTC";

  const parsed = querySchema.safeParse({ symbol: rawSymbol });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid symbol parameter", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const symbol = parsed.data.symbol;

  try {
    const priceData = await providerManager.getPrice(symbol);
    return NextResponse.json(
      {
        symbol: priceData.symbol,
        price: priceData.price,
        source: priceData.source,
        providerUsed: priceData.source,
        timestamp: priceData.timestamp,
        dataAgeMs: priceData.dataAgeMs,
        quality: priceData.quality,
        confidence: priceData.confidence,
        requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
          "X-Provider": priceData.source,
        },
      }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : String(err),
        symbol,
        status: "UNAVAILABLE",
      },
      { status: 503 }
    );
  }
}
