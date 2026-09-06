export type AssetClass =
  | "CRYPTO"
  | "STOCK"
  | "DIVIDEND_STOCK"
  | "ETF"
  | "REIT"
  | "COMMODITY"
  | "FOREX"
  | "INDEX";

export type MarketCapTier =
  | "NANO_CAP"   // < $50M
  | "MICRO_CAP"  // $50M - $300M
  | "SMALL_CAP"  // $300M - $2B
  | "MID_CAP"    // $2B - $10B
  | "LARGE_CAP"  // $10B - $200B
  | "MEGA_CAP";  // > $200B

export type DataStatus =
  | "FACT"
  | "CALCULATION"
  | "INTERPRETATION"
  | "HYPOTHESIS"
  | "SCENARIO"
  | "RISK"
  | "DATA_UNAVAILABLE"
  | "DELAYED_DATA"
  | "LOW_CONFIDENCE_SOURCE"
  | "DATA_CONFLICT";

export type AnalysisMode =
  | "QUICK"
  | "STANDARD"
  | "PROFESSIONAL"
  | "DEEP_RESEARCH"
  | "THIRD_EYE";

export interface DataProvenance {
  source: string;
  retrievedAt: string;
  period?: string;
  currency: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  status: DataStatus;
}

export interface MultiAssetProfile {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  exchange: string;
  country: string;
  sector: string;
  industry: string;
  marketCapUsd: number;
  marketCapTier: MarketCapTier;
  currency: string;
}

export interface StockFundamentals {
  revenueUsd: number;
  revenueGrowthYoyPercent: number;
  grossMarginPercent: number;
  operatingMarginPercent: number;
  netIncomeUsd: number;
  eps: number;
  epsGrowthYoyPercent: number;
  freeCashFlowUsd: number;
  operatingCashFlowUsd: number;
  totalDebtUsd: number;
  totalCashUsd: number;
  netDebtUsd: number;
  roePercent: number;
  roicPercent: number;
  roaPercent: number;
}

export interface StockValuation {
  peRatio: number;
  forwardPe: number;
  pegRatio: number;
  priceToSales: number;
  priceToBook: number;
  evToEbitda: number;
  fcfYieldPercent: number;
  dividendYieldPercent: number;
  valuationRange: {
    bearUsd: number;
    baseUsd: number;
    bullUsd: number;
  };
}

export interface DividendIntelligence {
  dividendYieldPercent: number;
  annualDividendUsd: number;
  payoutRatioPercent: number;
  fcfPayoutPercent: number;
  dividendCagr5yPercent: number;
  growthStreakYears: number;
  exDividendDate?: string;
  paymentDate?: string;
  dividendQualityScore: number; // 0 - 100
  dividendSustainabilityScore: number; // 0 - 100
  cutRiskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  redFlags: string[];
  whyYieldIsHighExplanation?: string;
}

export interface SmallCapRiskAnalysis {
  liquidityScore: number; // 0 - 100
  bidAskSpreadPercent: number;
  dilutionRiskScore: number; // 0 - 100
  antiPumpDumpRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  pumpDumpFlags: string[];
  cashRunwayMonths: number;
  insiderOwnershipPercent: number;
  institutionalOwnershipPercent: number;
}

export interface EtfReitIntelligence {
  aumUsd?: number;
  expenseRatioPercent?: number;
  holdingsCount?: number;
  ffoPerShareUsd?: number; // REIT
  affoPerShareUsd?: number; // REIT
  netAssetValueUsd?: number; // REIT
  occupancyRatePercent?: number; // REIT
}

export interface DevilsAdvocateAnalysis {
  bearishReview: string;
  strongestCounterArgument: string;
  invalidationConditions: string[];
  contradictingEvidence: string[];
}

export interface ThirdEyeAnalysis {
  hiddenRisks: string[];
  accountingRedFlags: string[];
  narrativeVsFundamentalsDivergence: string;
  dilutionOrLiquidityAlerts: string[];
}

export interface MultiAssetAnalysisReport {
  profile: MultiAssetProfile;
  priceUsd: number;
  change24hPercent: number;
  dataProvenance: DataProvenance;
  fundamentals?: StockFundamentals;
  valuation?: StockValuation;
  dividend?: DividendIntelligence;
  smallCapRisk?: SmallCapRiskAnalysis;
  etfReit?: EtfReitIntelligence;
  technicals: {
    trend: string;
    rsi: number;
    macd: string;
    atr: number;
    supportUsd: number;
    resistanceUsd: number;
  };
  scores: {
    fundamentalScore: number;
    valuationScore: number;
    dividendScore: number;
    technicalScore: number;
    riskScore: number;
    compositeScore: number;
    confidenceScore: number;
  };
  devilsAdvocate: DevilsAdvocateAnalysis;
  thirdEye?: ThirdEyeAnalysis;
  scenarios: {
    bear: { priceUsd: number; assumptions: string };
    base: { priceUsd: number; assumptions: string };
    bull: { priceUsd: number; assumptions: string };
  };
  opportunityClassification:
    | "STRONG OPPORTUNITY"
    | "OPPORTUNITY"
    | "WATCHLIST"
    | "NEUTRAL"
    | "ELEVATED RISK"
    | "HIGH RISK"
    | "AVOID / INSUFFICIENT DATA";
  whyInteresting: {
    whyNow: string;
    whatMarketIsMissing: string;
    biggestRisk: string;
    supportingData: string[];
    contradictingData: string[];
  };
  timestamp: string;
}
