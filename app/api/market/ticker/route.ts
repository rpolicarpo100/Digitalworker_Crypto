import { NextRequest, NextResponse } from "next/server";
import { binanceProvider } from "@/lib/providers/binance";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "BTC";

  try {
    const ticker = await binanceProvider.getTicker24h(symbol);

    return NextResponse.json({
      symbol: ticker.symbol,
      price: parseFloat(ticker.lastPrice),
      priceChange: parseFloat(ticker.priceChange),
      priceChangePercent: parseFloat(ticker.priceChangePercent),
      high24h: parseFloat(ticker.highPrice),
      low24h: parseFloat(ticker.lowPrice),
      volume24h: parseFloat(ticker.volume),
      quoteVolume24h: parseFloat(ticker.quoteVolume),
      openPrice: parseFloat(ticker.openPrice),
      source: "binance",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), symbol, status: "UNAVAILABLE" },
      { status: 503 }
    );
  }
}
