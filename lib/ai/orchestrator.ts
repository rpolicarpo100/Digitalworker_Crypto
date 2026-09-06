import { GroundedAiResponse } from "./agents";
import { providerManager } from "../providers/manager";
import { binanceProvider } from "../providers/binance";
import { technicalEngine } from "../engine/technical";
import { scoringEngine } from "../engine/scoring";
import { riskEngine } from "../engine/risk";
import { tokenSecurityEngine } from "../engine/token-security";
import { invalidationEngine } from "../engine/invalidation";
import { dexScreenerProvider } from "../providers/dexscreener";

export class AiOrchestrator {
  async processQuery(userQuery: string, symbol = "BTC"): Promise<GroundedAiResponse> {
    const uppercaseSymbol = symbol.toUpperCase().trim();

    // 1. Fetch real live data across venues
    const priceData = await providerManager.getPrice(uppercaseSymbol);
    const candles = await binanceProvider.getCandles(uppercaseSymbol, "1h", 100);
    const dexPairs = await dexScreenerProvider.searchPairs(uppercaseSymbol);

    // 2. Run engines
    const tech = technicalEngine.analyze(candles);
    const scoreBreakdown = scoringEngine.calculateScore(tech, 50, 5000000, 0.05, 3);
    const riskAnalysis = riskEngine.evaluateRisk(tech.volatilityRegime, 0.05, 5000000, tech.rsi, false);

    const bestPair = dexPairs[0];
    const security = tokenSecurityEngine.auditToken(
      uppercaseSymbol,
      bestPair?.chainId || "ethereum",
      uppercaseSymbol,
      bestPair?.liquidity?.usd || 100000,
      0,
      0,
      false,
      false,
      true,
      25
    );

    const conditions = invalidationEngine.generateConditions(
      uppercaseSymbol,
      priceData.price,
      tech.trend,
      tech.supportLevels[0] || priceData.price * 0.98,
      tech.resistanceLevels[0] || priceData.price * 1.02
    );

    // 3. Formulate Grounded Answer
    const answer = `Analysis for ${uppercaseSymbol}: Current price observed at $${priceData.price.toLocaleString()} (${priceData.source}). GOD Opportunity Score is ${scoreBreakdown.totalScore}/100 with ${tech.trend.toLowerCase()} technical structure. RSI is ${Math.round(tech.rsi)}. Token Security Risk Score is ${security.riskScore}/100 (${security.riskLevel}).`;

    // 4. Formulate Contrarian Analysis (Section 21)
    const counterarguments: string[] = [];
    if (tech.rsi > 70) {
      counterarguments.push(`RSI (${Math.round(tech.rsi)}) is overbought, increasing risk of sudden pullback`);
    } else if (tech.rsi < 30) {
      counterarguments.push(`RSI (${Math.round(tech.rsi)}) indicates strong downward momentum; bounce is not guaranteed`);
    }

    if (tech.volatilityRegime === "HIGH") {
      counterarguments.push("High volatility regime increases execution slippage and stop-loss trigger risk");
    }

    if (security.riskFlags.length > 0) {
      counterarguments.push(`Token Security flags detected: ${security.riskFlags.join("; ")}`);
    }

    counterarguments.push("Market regime shifts or BTC macro moves could invalidate technical setup");

    // 5. Build Grounded Response
    return {
      answer,
      dataEvidence: {
        symbol: uppercaseSymbol,
        priceUsd: priceData.price,
        godScore: scoreBreakdown.totalScore,
        confidenceScore: scoreBreakdown.confidenceScore,
        riskScore: riskAnalysis.riskScore,
        riskLevel: riskAnalysis.riskLevel,
        rsi: Math.round(tech.rsi),
        trend: tech.trend,
        volatilityRegime: tech.volatilityRegime,
        securityAudit: {
          riskScore: security.riskScore,
          recommendation: security.recommendation,
        },
      },
      sources: [priceData.source, "binance-ohlc", "dexscreener"],
      confidence: scoreBreakdown.confidenceScore >= 70 ? "High" : "Medium",
      confidenceScore: scoreBreakdown.confidenceScore,
      risks: [
        `Composite Risk Score: ${riskAnalysis.riskScore}/100 (${riskAnalysis.riskLevel})`,
        `Volatility Regime: ${tech.volatilityRegime}`,
      ],
      counterarguments,
      invalidation: conditions.invalidationConditions,
      timestamp: new Date().toISOString(),
    };
  }
}

export const aiOrchestrator = new AiOrchestrator();
