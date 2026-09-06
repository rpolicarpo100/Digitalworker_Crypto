export interface MevSlippageParams {
  tradeSizeUsd: number;
  liquidityDepthUsd: number;
  grossSpreadPercent: number;
  blockchain: "ethereum" | "solana" | "bsc" | "arbitrum" | "cex";
  isDex: boolean;
}

export interface MevSlippageResult {
  tradeSizeUsd: number;
  priceImpactPercent: number;
  estimatedSlippagePercent: number;
  mevRiskScore: number;
  mevThreatLevel: "NONE" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  estimatedGasFeeUsd: number;
  grossProfitUsd: number;
  realisticNetProfitUsd: number;
  realisticNetEdgePercent: number;
  isExecutable: boolean;
  rejectionReason?: string;
}

export class MevSlippageEngine {
  calculateRealisticExecution(params: MevSlippageParams): MevSlippageResult {
    const { tradeSizeUsd, liquidityDepthUsd, grossSpreadPercent, blockchain, isDex } = params;

    const depthRatio = tradeSizeUsd / Math.max(liquidityDepthUsd, 1);
    const priceImpactPercent = Math.min(depthRatio * depthRatio * 100 + depthRatio * 0.8, 25);

    const estimatedSlippagePercent = Math.max(0.05, priceImpactPercent * 0.6);

    let mevRiskScore = 0;
    let estimatedGasFeeUsd = 0.5;

    if (isDex) {
      if (blockchain === "ethereum") {
        estimatedGasFeeUsd = 12.5;
        mevRiskScore = Math.min(95, tradeSizeUsd > 2000 ? 75 + depthRatio * 20 : 35);
      } else if (blockchain === "solana") {
        estimatedGasFeeUsd = 0.05;
        mevRiskScore = Math.min(80, tradeSizeUsd > 5000 ? 55 : 20);
      } else if (blockchain === "bsc" || blockchain === "arbitrum") {
        estimatedGasFeeUsd = 0.4;
        mevRiskScore = Math.min(70, tradeSizeUsd > 3000 ? 45 : 15);
      }
    } else {
      estimatedGasFeeUsd = 0.1;
      mevRiskScore = 5;
    }

    let mevThreatLevel: MevSlippageResult["mevThreatLevel"] = "NONE";
    if (mevRiskScore > 75) mevThreatLevel = "CRITICAL";
    else if (mevRiskScore > 50) mevThreatLevel = "HIGH";
    else if (mevRiskScore > 25) mevThreatLevel = "MODERATE";
    else if (mevRiskScore > 10) mevThreatLevel = "LOW";

    const grossProfitUsd = (tradeSizeUsd * grossSpreadPercent) / 100;
    const totalDeductionsPercent = priceImpactPercent + estimatedSlippagePercent;
    const deductionsUsd = (tradeSizeUsd * totalDeductionsPercent) / 100 + estimatedGasFeeUsd;
    
    const mevPenaltyUsd = mevRiskScore > 50 ? (grossProfitUsd * 0.3) : 0;
    
    const realisticNetProfitUsd = grossProfitUsd - deductionsUsd - mevPenaltyUsd;
    const realisticNetEdgePercent = (realisticNetProfitUsd / tradeSizeUsd) * 100;

    let isExecutable = true;
    let rejectionReason: string | undefined;

    if (realisticNetProfitUsd <= 0) {
      isExecutable = false;
      rejectionReason = "Net Edge is negative after accounting for price impact, fees, and slippage.";
    } else if (mevRiskScore > 80 && tradeSizeUsd > 5000) {
      isExecutable = false;
      rejectionReason = "Extreme MEV sandwich vulnerability detected on Ethereum DEX pool.";
    } else if (depthRatio > 0.15) {
      isExecutable = false;
      rejectionReason = "Trade size exceeds 15% of pool liquidity depth (severe price impact risk).";
    }

    return {
      tradeSizeUsd,
      priceImpactPercent,
      estimatedSlippagePercent,
      mevRiskScore,
      mevThreatLevel,
      estimatedGasFeeUsd,
      grossProfitUsd,
      realisticNetProfitUsd,
      realisticNetEdgePercent,
      isExecutable,
      rejectionReason,
    };
  }
}

export const mevSlippageEngine = new MevSlippageEngine();
