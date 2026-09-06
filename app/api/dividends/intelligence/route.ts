import { NextResponse } from "next/server";
import { stockEngine } from "@/lib/engines/stock-engine";
import { dividendEngine } from "@/lib/engines/dividend-engine";

export async function GET() {
  const dividendTickers = ["O", "JNJ", "SCHD", "MO", "VICI", "MAIN", "JPM", "PG", "SHEL", "MC"];

  const dividendReports = await Promise.all(
    dividendTickers.map(async (sym) => {
      const stockData = await stockEngine.getStockData(sym);
      const dividend = dividendEngine.analyzeDividend(sym, stockData.fundamentals, stockData.valuation);
      return {
        profile: stockData.profile,
        priceUsd: stockData.priceUsd,
        change24hPercent: stockData.change24hPercent,
        valuation: stockData.valuation,
        dividend,
      };
    })
  );

  return NextResponse.json({
    status: "SUCCESS",
    count: dividendReports.length,
    opportunities: dividendReports,
    timestamp: new Date().toISOString(),
  });
}
