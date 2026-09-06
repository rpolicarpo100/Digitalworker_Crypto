import { NextRequest, NextResponse } from "next/server";
import { backtestingEngine } from "@/lib/engine/backtesting";
import { binanceProvider } from "@/lib/providers/binance";
import { z } from "zod";

const backtestSchema = z.object({
  symbol: z.string().default("BTC").transform((s) => s.toUpperCase().trim()),
  interval: z.string().default("1h"),
  initialCapitalUsd: z.number().positive().default(10000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = backtestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid backtest payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { symbol, interval, initialCapitalUsd } = parsed.data;
    const candles = await binanceProvider.getCandles(symbol, interval, 500);

    const result = backtestingEngine.runBacktest(symbol, interval, candles, initialCapitalUsd);

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), status: "UNAVAILABLE" },
      { status: 503 }
    );
  }
}
