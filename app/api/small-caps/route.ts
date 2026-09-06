import { NextResponse } from "next/server";
import { stockEngine } from "../../../lib/engines/stock-engine";
import { smallCapEngine } from "../../../lib/engines/small-cap-engine";
import { RiskFingerprintEngine } from "../../../lib/engines/risk-fingerprint-engine";
import { DilutionEngine } from "../../../lib/engines/dilution-engine";

export async function GET() {
  const smallCapTickers = ["JOBY", "IONQ", "PLTR", "RKLB", "SOFI", "ASTS", "COMP"];

  const smallCapReports = await Promise.all(
    smallCapTickers.map(async (sym) => {
      const stockData = await stockEngine.getStockData(sym);
      const smallCapRisk = smallCapEngine.analyzeSmallCap(
        stockData.profile,
        stockData.fundamentals,
        stockData.fundamentals.revenueUsd * 0.05
      );
      const riskFingerprint = RiskFingerprintEngine.generateFingerprint(sym);
      const dilutionAnalysis = DilutionEngine.analyzeDilution(sym);

      return {
        profile: stockData.profile,
        priceUsd: stockData.priceUsd,
        change24hPercent: stockData.change24hPercent,
        valuation: stockData.valuation,
        fundamentals: stockData.fundamentals,
        smallCapRisk,
        riskFingerprint,
        dilutionAnalysis,
      };
    })
  );

  return NextResponse.json({
    status: "SUCCESS",
    count: smallCapReports.length,
    assets: smallCapReports,
    timestamp: new Date().toISOString(),
  });
}
