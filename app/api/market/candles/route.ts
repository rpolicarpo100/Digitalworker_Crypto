import { NextRequest, NextResponse } from "next/server";
import { binanceProvider } from "@/lib/providers/binance";
import { dataQualityEngine } from "@/lib/engine/data-quality";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "BTC";
  const interval = searchParams.get("interval") || "1h";
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  try {
    const candles = await binanceProvider.getCandles(symbol, interval, limit);
    const qualityReport = dataQualityEngine.checkCandles(candles);

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      interval,
      count: candles.length,
      candles,
      quality: qualityReport.quality,
      confidence: qualityReport.confidence,
      issues: qualityReport.issues,
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
