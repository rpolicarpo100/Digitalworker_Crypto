import { NextRequest, NextResponse } from "next/server";
import { quantEngine } from "@/lib/engine/quant";
import { binanceProvider } from "@/lib/providers/binance";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "BTC";

  try {
    const candles = await binanceProvider.getCandles(symbol, "1d", 60);
    const prices = candles.map((c) => c.close);

    const quant = quantEngine.analyzeQuant(symbol, prices);

    return NextResponse.json(quant);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), symbol, status: "UNAVAILABLE" },
      { status: 503 }
    );
  }
}
