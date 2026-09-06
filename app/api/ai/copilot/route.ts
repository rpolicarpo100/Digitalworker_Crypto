import { NextRequest, NextResponse } from "next/server";
import { aiOrchestrator } from "@/lib/ai/orchestrator";
import { z } from "zod";

const copilotSchema = z.object({
  query: z.string().min(1).max(500),
  symbol: z.string().optional().default("BTC"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = copilotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { query, symbol } = parsed.data;
    const response = await aiOrchestrator.processQuery(query, symbol);

    return NextResponse.json(response);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), status: "UNAVAILABLE" },
      { status: 503 }
    );
  }
}
