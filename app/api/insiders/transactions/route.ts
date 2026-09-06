import { NextResponse } from "next/server";
import { insiderTradingEngine } from "@/lib/engines/insider-trading-engine";

export async function GET() {
  const transactions = insiderTradingEngine.getRecentTransactions();
  return NextResponse.json({
    status: "SUCCESS",
    count: transactions.length,
    transactions,
    timestamp: new Date().toISOString(),
  });
}
