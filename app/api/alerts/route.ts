import { NextRequest, NextResponse } from "next/server";
import { alertEngine } from "@/lib/engine/alerts";
import { binanceProvider } from "@/lib/providers/binance";
import { technicalEngine } from "@/lib/engine/technical";
import { scoringEngine } from "@/lib/engine/scoring";
import { riskEngine } from "@/lib/engine/risk";

export async function GET() {
  return NextResponse.json({
    count: alertEngine.getActiveAlerts().length,
    alerts: alertEngine.getActiveAlerts(),
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const symbol = (body.symbol || "BTC").toUpperCase().trim();

    const candles = await binanceProvider.getCandles(symbol, "1h", 100);

    const tech = technicalEngine.analyze(candles);
    const scoreBreakdown = scoringEngine.calculateScore(tech, 50, 5000000, 0.05, 3);
    const riskAnalysis = riskEngine.evaluateRisk(tech.volatilityRegime, 0.05, 5000000, tech.rsi, false);

    const alert = alertEngine.evaluateOpportunityAlert(
      symbol,
      scoreBreakdown.totalScore,
      riskAnalysis.riskLevel,
      tech.breakout.isBreakout
    );

    return NextResponse.json({
      evaluatedSymbol: symbol,
      alertGenerated: alert !== null,
      alert,
      activeAlertsCount: alertEngine.getActiveAlerts().length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), status: "UNAVAILABLE" },
      { status: 503 }
    );
  }
}
