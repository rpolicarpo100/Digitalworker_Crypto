import { CanonicalAssetResolver } from "../identity/canonical-asset";

export interface RiskFingerprint {
  canonicalId: string;
  symbol: string;
  liquidityRisk: number;
  dilutionRisk: number;
  debtRisk: number;
  governanceRisk: number;
  concentrationRisk: number;
  regulatoryRisk: number;
  volatilityRisk: number;
  executionRisk: number;
  aggregateRiskScore: number;
  overallRiskCategory: "LOW_RISK" | "MODERATE_RISK" | "ELEVATED_RISK" | "HIGH_SPECULATIVE_RISK";
  calculatedAt: string;
}

export class RiskFingerprintEngine {
  public static generateFingerprint(symbol: string): RiskFingerprint {
    const identity = CanonicalAssetResolver.resolve(symbol);

    let liquidityRisk = 15;
    let dilutionRisk = 10;
    let debtRisk = 25;
    const governanceRisk = 12;
    const concentrationRisk = 20;
    let regulatoryRisk = 28;
    let volatilityRisk = 35;
    let executionRisk = 18;

    if (identity.assetClass === "CRYPTO") {
      liquidityRisk = 20;
      dilutionRisk = 42;
      regulatoryRisk = 65;
      volatilityRisk = 72;
    } else if (identity.marketCapCategory === "SMALL" || identity.marketCapCategory === "MICRO" || identity.marketCapCategory === "NANO") {
      liquidityRisk = 68;
      dilutionRisk = 75;
      debtRisk = 62;
      executionRisk = 70;
      volatilityRisk = 80;
    }

    const aggregateRiskScore = Math.round(
      (liquidityRisk + dilutionRisk + debtRisk + governanceRisk + concentrationRisk + regulatoryRisk + volatilityRisk + executionRisk) / 8
    );

    let overallRiskCategory: RiskFingerprint["overallRiskCategory"] = "LOW_RISK";
    if (aggregateRiskScore > 65) {
      overallRiskCategory = "HIGH_SPECULATIVE_RISK";
    } else if (aggregateRiskScore > 45) {
      overallRiskCategory = "ELEVATED_RISK";
    } else if (aggregateRiskScore > 25) {
      overallRiskCategory = "MODERATE_RISK";
    }

    return {
      canonicalId: identity.canonicalId,
      symbol: identity.symbol,
      liquidityRisk,
      dilutionRisk,
      debtRisk,
      governanceRisk,
      concentrationRisk,
      regulatoryRisk,
      volatilityRisk,
      executionRisk,
      aggregateRiskScore,
      overallRiskCategory,
      calculatedAt: new Date().toISOString(),
    };
  }
}
