export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RiskAnalysis {
  riskScore: number; // 0-100 (100 = dangerous)
  riskLevel: RiskLevel;
  canReject: boolean;
  rejectionReason?: string;
  factors: {
    volatility: number;
    liquidity: number;
    spread: number;
    slippage: number;
    smartContract: number;
    concentration: number;
    market: number;
  };
}

export class RiskEngine {
  evaluateRisk(
    volatilityRegime: "HIGH" | "NORMAL" | "LOW",
    spreadPercent: number,
    volumeUsd24h: number,
    rsi: number,
    isNewToken = false
  ): RiskAnalysis {
    let volatility = 20;
    if (volatilityRegime === "HIGH") volatility = 80;
    else if (volatilityRegime === "NORMAL") volatility = 30;

    let liquidity = 20;
    if (volumeUsd24h < 50000) liquidity = 85;
    else if (volumeUsd24h < 500000) liquidity = 50;

    let spread = 10;
    if (spreadPercent > 2.0) spread = 90;
    else if (spreadPercent > 0.5) spread = 50;

    const slippage = Math.round((volatility * 0.4) + (liquidity * 0.4) + (spread * 0.2));
    const smartContract = isNewToken ? 75 : 15;
    const concentration = isNewToken ? 60 : 20;
    const market = volatilityRegime === "HIGH" ? 70 : 30;

    const totalRiskScore = Math.min(
      100,
      Math.round(
        volatility * 0.2 +
        liquidity * 0.2 +
        spread * 0.15 +
        slippage * 0.15 +
        smartContract * 0.15 +
        concentration * 0.05 +
        market * 0.1
      )
    );

    let riskLevel: RiskLevel = "LOW";
    if (totalRiskScore >= 80) riskLevel = "CRITICAL";
    else if (totalRiskScore >= 60) riskLevel = "HIGH";
    else if (totalRiskScore >= 35) riskLevel = "MEDIUM";

    let canReject = false;
    let rejectionReason: string | undefined = undefined;

    if (totalRiskScore >= 85) {
      canReject = true;
      rejectionReason = "Extreme composite risk score exceeds safety threshold (85/100)";
    } else if (spreadPercent > 3.0) {
      canReject = true;
      rejectionReason = "Excessive orderbook spread (>3%) makes realistic execution impossible";
    } else if (volumeUsd24h < 10000) {
      canReject = true;
      rejectionReason = "Severely illiquid market (<$10k 24h volume)";
    }

    return {
      riskScore: totalRiskScore,
      riskLevel,
      canReject,
      rejectionReason,
      factors: {
        volatility,
        liquidity,
        spread,
        slippage,
        smartContract,
        concentration,
        market,
      },
    };
  }
}

export const riskEngine = new RiskEngine();
