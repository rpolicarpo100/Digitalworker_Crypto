import { NextRequest, NextResponse } from "next/server";
import { binanceProvider } from "@/lib/providers/binance";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "BTC";
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  try {
    const ob = await binanceProvider.getOrderBook(symbol, limit);

    const bids = ob.bids.map((b) => ({ price: parseFloat(b[0]), qty: parseFloat(b[1]) }));
    const asks = ob.asks.map((a) => ({ price: parseFloat(a[0]), qty: parseFloat(a[1]) }));

    const topBid = bids[0]?.price || 0;
    const topAsk = asks[0]?.price || 0;
    const spread = topAsk > topBid ? topAsk - topBid : 0;
    const spreadPercent = topBid > 0 ? (spread / topBid) * 100 : 0;

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      lastUpdateId: ob.lastUpdateId,
      spread,
      spreadPercent,
      topBid,
      topAsk,
      bids,
      asks,
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
