import { NextResponse } from "next/server";
import { regimeBacktestEngine } from "@/lib/engines/regime-backtest-engine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "BTC";

  const report = regimeBacktestEngine.runHistoricalRegimeBacktest(symbol);
  return NextResponse.json(report);
}
