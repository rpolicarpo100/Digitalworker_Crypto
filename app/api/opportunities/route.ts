import { NextRequest, NextResponse } from "next/server";
import { providerManager } from "@/lib/providers/manager";
import { binanceProvider } from "@/lib/providers/binance";
import { technicalEngine } from "@/lib/engine/technical";
import { scoringEngine } from "@/lib/engine/scoring";
import { riskEngine } from "@/lib/engine/risk";
import { invalidationEngine } from "@/lib/engine/invalidation";
import { fearGreedProvider } from "@/lib/providers/feargreed";

const DEFAULT_SYMBOLS = ["BTC", "ETH", "SOL", "BNB", "AVAX", "PEPE", "LINK", "XRP"];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestedSymbol = searchParams.get("symbol");
  const symbols = requestedSymbol ? [requestedSymbol.toUpperCase()] : DEFAULT_SYMBOLS;

  let fgValue = 50;
  try {
    const fg = await fearGreedProvider.getLatest();
    fgValue = fg.value;
  } catch {
    // default
  }

  const opportunities = [];

  for (const symbol of symbols) {
    try {
      const priceData = await providerManager.getPrice(symbol);
      const candles = await binanceProvider.getCandles(symbol, "1h", 100);

      if (!candles || candles.length < 20) continue;

      const tech = technicalEngine.analyze(candles);
      const ticker = await binanceProvider.getTicker24h(symbol);
      const volUsd = parseFloat(ticker.quoteVolume);

      const scoreBreakdown = scoringEngine.calculateScore(tech, fgValue, volUsd, 0.05, 3);
      const riskAnalysis = riskEngine.evaluateRisk(tech.volatilityRegime, 0.05, volUsd, tech.rsi, false);

      if (riskAnalysis.canReject) {
        continue; // Risk Engine Veto
      }

      const lastClose = priceData.price;
      const sr = tech.supportLevels[0] || lastClose * 0.98;
      const res = tech.resistanceLevels[0] || lastClose * 1.02;

      const conditions = invalidationEngine.generateConditions(
        symbol,
        lastClose,
        tech.trend,
        sr,
        res
      );

      opportunities.push({
        opportunityId: `opp_${symbol.toLowerCase()}_${Date.now()}`,
        asset: symbol,
        chain: "multi-chain",
        market: `${symbol}USDT`,
        source: priceData.source,
        opportunityType: tech.breakout.isBreakout ? "BREAKOUT" : tech.trend === "BULLISH" ? "TREND_FOLLOWING" : "MOMENTUM",
        score: scoreBreakdown.totalScore,
        confidence: scoreBreakdown.confidenceScore,
        riskScore: riskAnalysis.riskScore,
        riskLevel: riskAnalysis.riskLevel,
        currentPrice: lastClose,
        technicalSummary: {
          trend: tech.trend,
          rsi: Math.round(tech.rsi),
          volatilityRegime: tech.volatilityRegime,
          isBreakout: tech.breakout.isBreakout,
        },
        conditions,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn(`Failed opportunity check for ${symbol}:`, err);
    }
  }

  opportunities.sort((a, b) => b.score - a.score);

  return NextResponse.json({
    count: opportunities.length,
    opportunities,
    timestamp: new Date().toISOString(),
  });
}
