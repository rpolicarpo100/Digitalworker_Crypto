import { NextResponse } from "next/server";
import { smartMoneyEngine } from "@/lib/engines/smart-money-engine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blockchain = searchParams.get("chain") || "all";

  const whales = await smartMoneyEngine.getTopWhales(blockchain);

  return NextResponse.json({
    status: "SUCCESS",
    count: whales.length,
    blockchain,
    whales,
    timestamp: new Date().toISOString(),
  });
}
