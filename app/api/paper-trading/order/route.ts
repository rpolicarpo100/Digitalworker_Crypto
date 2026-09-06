import { NextRequest, NextResponse } from "next/server";
import { paperTradingEngine } from "@/lib/engine/paper-trading";
import { providerManager } from "@/lib/providers/manager";
import { z } from "zod";

const orderSchema = z.object({
  symbol: z.string().min(1).max(20).transform((s) => s.toUpperCase().trim()),
  side: z.enum(["BUY", "SELL"]),
  usdAmount: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid paper order payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { symbol, side, usdAmount } = parsed.data;
    const priceData = await providerManager.getPrice(symbol);

    const result = paperTradingEngine.executePaperOrder(
      symbol,
      side,
      usdAmount,
      priceData.price,
      0.1
    );

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      message: result.message,
      trade: result.trade,
      portfolio: paperTradingEngine.getPortfolio(),
      isPaper: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), status: "UNAVAILABLE" },
      { status: 503 }
    );
  }
}
