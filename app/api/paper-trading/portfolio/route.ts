import { NextResponse } from "next/server";
import { paperTradingEngine } from "@/lib/engine/paper-trading";

export async function GET() {
  return NextResponse.json({
    portfolio: paperTradingEngine.getPortfolio(),
    isPaper: true,
    timestamp: new Date().toISOString(),
  });
}
