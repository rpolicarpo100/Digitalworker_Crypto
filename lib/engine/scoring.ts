import { TechnicalIndicators } from "./technical";

export interface OpportunityScoreBreakdown {
  marketStructure: number; // 15%
  momentum: number;       // 10%
  volume: number;         // 10%
  liquidity: number;      // 10%
  technicalSetup: number; // 10%
  onchain: number;        // 15%
  fundamentals: number;   // 10%
  sentiment: number;      // 5%
  narrative: number;      // 5%
  riskPenalty: number;    // -20%
  totalScore: number;     // 0-100
  confidenceScore: number;// 0-100
}

export class ScoringEngine {
  calculateScore(
    tech: TechnicalIndicators,
    fearGreedValue = 50,
    volumeUsd24h = 1000000,
    spreadPercent = 0.1,
    sourcesCount = 3
  ): OpportunityScoreBreakdown {
    // 1. Market Structure (15%)
    let marketStructure = 50;
    if (tech.trend === "BULLISH") marketStructure += 30;
    else if (tech.trend === "BEARISH") marketStructure -= 20;
    if (tech.breakout.isBreakout) marketStructure += 20;

    // 2. Momentum (10%)
    let momentum = 50;
    if (tech.rsi >= 50 && tech.rsi <= 70) momentum += 30;
    else if (tech.rsi < 30) momentum += 20; // oversold bounce potential
    else if (tech.rsi > 80) momentum -= 20; // overbought
    if (tech.macd.histogram > 0) momentum += 20;

    // 3. Volume (10%)
    let volume = 50;
    if (volumeUsd24h > 10000000) volume = 90;
    else if (volumeUsd24h > 1000000) volume = 70;
    else if (volumeUsd24h < 100000) volume = 30;

    // 4. Liquidity (10%)
    let liquidity = 50;
    if (spreadPercent < 0.1) liquidity = 90;
    else if (spreadPercent < 0.5) liquidity = 70;
    else if (spreadPercent > 1.5) liquidity = 20;

    // 5. Technical Setup (10%)
    let technicalSetup = 50;
    if (tech.ema9 > tech.ema21 && tech.ema21 > tech.ema50) technicalSetup += 30;
    if (tech.breakout.isBreakout) technicalSetup += 20;

    // 6. On-Chain (15%) - proxy
    const onchain = 60;

    // 7. Fundamentals (10%)
    const fundamentals = 65;

    // 8. Sentiment (5%)
    let sentiment = 50;
    if (fearGreedValue > 60) sentiment = 75;
    else if (fearGreedValue < 30) sentiment = 40;

    // 9. Narrative (5%)
    const narrative = 60;

    // 10. Risk Penalty (-20%)
    let riskPenalty = 0;
    if (tech.volatilityRegime === "HIGH") riskPenalty += 20;
    if (spreadPercent > 1.0) riskPenalty += 30;
    if (tech.rsi > 80 || tech.rsi < 20) riskPenalty += 15;

    // Calculate total weighted score
    const positiveScore =
      marketStructure * 0.15 +
      momentum * 0.10 +
      volume * 0.10 +
      liquidity * 0.10 +
      technicalSetup * 0.10 +
      onchain * 0.15 +
      fundamentals * 0.10 +
      sentiment * 0.05 +
      narrative * 0.05;

    const netScore = Math.max(0, Math.min(100, Math.round(positiveScore - riskPenalty * 0.2)));

    // Calculate Confidence Score
    const confidenceScore = Math.min(100, sourcesCount * 30 + 10);

    return {
      marketStructure,
      momentum,
      volume,
      liquidity,
      technicalSetup,
      onchain,
      fundamentals,
      sentiment,
      narrative,
      riskPenalty,
      totalScore: netScore,
      confidenceScore,
    };
  }
}

export const scoringEngine = new ScoringEngine();
