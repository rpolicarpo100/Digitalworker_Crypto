import { TechnicalIndicators } from "../engine/technical";
import { RiskAnalysis } from "../engine/risk";
import { TokenSecurityAudit } from "../engine/token-security";
import { ArbitrageOpportunity } from "../engine/arbitrage";

export interface DeepKpis {
  godOpportunityScore: number;
  dataQualityScore: number;
  confidenceIndex: number;
  riskRewardRatio: number; // e.g. 3.4
  expectedValueUsd: number; // e.g. +$142 per $1k
  winProbabilityPercent: number; // e.g. 68%
  sharpeRatioEstimate: number; // e.g. 2.15
  maxDrawdownVaR95Percent: number; // e.g. 4.2%
  liquidityDepthUsd: number;
  securityRiskScore: number;
}

export interface ExecutionPlan {
  entryZoneMinUsd: number;
  entryZoneMaxUsd: number;
  takeProfitTarget1Usd: number;
  takeProfitTarget2Usd: number;
  invalidationStopLossUsd: number;
  suggestedPositionSizePercent: number; // % of portfolio risk
  safetyChecklist: string[];
}

export interface MultidimensionalAnalysis {
  technicalHighlights: string[];
  onChainFlowHighlights: string[];
  macroSocioeconomicFactors: string[];
  valuationHighlights: string[];
}

export interface GroundedAiResponse {
  answer: string;
  userIntent: "BUY_SELL_ADVICE" | "TECHNICAL_ANALYSIS" | "RISK_AUDIT" | "DIVIDEND_FUNDAMENTALS" | "MARKET_GENERAL";
  language: "PT" | "EN" | "FR";
  personalizedProfile: {
    riskProfile: "CONSERVATIVE" | "BALANCED" | "AGGRESSIVE";
    traderPersona: "SWING_TRADER" | "QUANT_ARBITRAGE" | "INSTITUTIONAL_HOLD";
  };
  tacticalRecommendation: {
    bias: "BULLISH_LONG" | "BEARISH_SHORT" | "NEUTRAL_WAIT" | "CAUTION_RISK";
    suggestedAction: string;
    targetPriceUsd?: number;
    invalidationStopUsd?: number;
  };
  deepKpis: DeepKpis;
  executionPlan: ExecutionPlan;
  multidimensionalAnalysis: MultidimensionalAnalysis;
  dataEvidence: Record<string, unknown>;
  sources: string[];
  confidence: "High" | "Medium" | "Low";
  confidenceScore: number;
  risks: string[];
  counterarguments: string[]; // Contrarian analysis per Section 21
  invalidation: string[];
  timestamp: string;
}

export class AiAgents {
  // Agent 01: Market Scanner
  async runMarketScanner(symbol: string, price: number, source: string) {
    return {
      agent: "AGENT_01_MARKET_SCANNER",
      symbol,
      price,
      source,
      status: "VERIFIED",
    };
  }

  // Agent 02: Technical Analyst
  async runTechnicalAnalyst(tech: TechnicalIndicators) {
    return {
      agent: "AGENT_02_TECHNICAL_ANALYST",
      trend: tech.trend,
      rsi: Math.round(tech.rsi),
      volatilityRegime: tech.volatilityRegime,
      isBreakout: tech.breakout.isBreakout,
      supportLevels: tech.supportLevels,
      resistanceLevels: tech.resistanceLevels,
    };
  }

  // Agent 03: Token Security Analyst
  async runTokenSecurityAnalyst(security: TokenSecurityAudit) {
    return {
      agent: "AGENT_03_TOKEN_SECURITY_ANALYST",
      riskScore: security.riskScore,
      riskLevel: security.riskLevel,
      isHoneypot: security.isHoneypot,
      recommendation: security.recommendation,
      riskFlags: security.riskFlags,
    };
  }

  // Agent 04: Arbitrage Analyst
  async runArbitrageAnalyst(arb?: ArbitrageOpportunity) {
    if (!arb) return { agent: "AGENT_04_ARBITRAGE_ANALYST", status: "NO_ARBITRAGE_DATA" };
    return {
      agent: "AGENT_04_ARBITRAGE_ANALYST",
      grossSpreadPercent: arb.grossSpreadPercent,
      actionableEvaluations: arb.evaluations.filter((e) => e.isValidArbitrage),
    };
  }

  // Agent 05: Risk Manager (Veto Power)
  async runRiskManager(risk: RiskAnalysis) {
    return {
      agent: "AGENT_05_RISK_MANAGER",
      riskScore: risk.riskScore,
      riskLevel: risk.riskLevel,
      canReject: risk.canReject,
      rejectionReason: risk.rejectionReason,
    };
  }
}

export const aiAgents = new AiAgents();
