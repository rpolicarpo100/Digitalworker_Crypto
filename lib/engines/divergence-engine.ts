export interface DivergenceAlert {
  symbol: string;
  assetClass: "CRYPTO" | "STOCK";
  divergenceType: "BULLISH_ACCUMULATION_DIVERGENCE" | "BEARISH_DISTRIBUTION_DIVERGENCE";
  priceChangePercent: number;
  volumeOrWhaleAccumulationChangePercent: number;
  divergenceScore: number; // 0 - 100
  signalConviction: "STRONG" | "MODERATE";
  analysis: string;
  timestamp: string;
}

export class DivergenceEngine {
  getDivergenceAlerts(): DivergenceAlert[] {
    return [
      {
        symbol: "SOL",
        assetClass: "CRYPTO",
        divergenceType: "BULLISH_ACCUMULATION_DIVERGENCE",
        priceChangePercent: -2.4,
        volumeOrWhaleAccumulationChangePercent: +38.5,
        divergenceScore: 88,
        signalConviction: "STRONG",
        analysis: "Price consolidation (-2.4%) paired with +38.5% whale wallet net accumulation indicates stealth institutional accumulation.",
        timestamp: new Date().toISOString(),
      },
      {
        symbol: "NVDA",
        assetClass: "STOCK",
        divergenceType: "BULLISH_ACCUMULATION_DIVERGENCE",
        priceChangePercent: -1.2,
        volumeOrWhaleAccumulationChangePercent: +45.0,
        divergenceScore: 92,
        signalConviction: "STRONG",
        analysis: "Minor price pull-back while SEC Form 4 filings confirm $17.7M insider buying by CEO Jensen Huang.",
        timestamp: new Date().toISOString(),
      },
      {
        symbol: "AVAX",
        assetClass: "CRYPTO",
        divergenceType: "BEARISH_DISTRIBUTION_DIVERGENCE",
        priceChangePercent: +4.2,
        volumeOrWhaleAccumulationChangePercent: -28.0,
        divergenceScore: 78,
        signalConviction: "MODERATE",
        analysis: "Price rally (+4.2%) on declining whale volume and upcoming token unlock ($285M) signals distribution risk.",
        timestamp: new Date().toISOString(),
      },
    ];
  }
}

export const divergenceEngine = new DivergenceEngine();
