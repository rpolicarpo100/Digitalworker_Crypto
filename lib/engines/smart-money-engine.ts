export interface WhaleWallet {
  address: string;
  blockchain: "solana" | "ethereum" | "arbitrum" | "bsc" | "polygon";
  label: string;
  winRatePercent: number;
  totalRealizedProfitUsd: number;
  portfolioValueUsd: number;
  recentAccumulatedTokens: Array<{
    symbol: string;
    amountUsd: number;
    avgEntryPrice: number;
    timestamp: string;
  }>;
  riskRating: "LOW" | "MODERATE" | "HIGH";
  lastActive: string;
}

export interface WhaleAggregatedKpis {
  totalWhalesCount: number;
  totalWhaleAumUsd: number;
  avgWinRatePercent: number;
  totalRealizedProfitUsd: number;
  topAccumulatedAssets: Array<{ symbol: string; totalAmountUsd: number }>;
  netFlow24hUsd: number;
  highRiskWhalesCount: number;
}

export class SmartMoneyEngine {
  private mockWhales: WhaleWallet[] = [
    {
      address: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
      blockchain: "ethereum",
      label: "Alpha Whale #1 (DeFi Specialist)",
      winRatePercent: 82.4,
      totalRealizedProfitUsd: 4250000,
      portfolioValueUsd: 12800000,
      recentAccumulatedTokens: [
        { symbol: "ETH", amountUsd: 4500000, avgEntryPrice: 3120, timestamp: new Date().toISOString() },
        { symbol: "LINK", amountUsd: 1200000, avgEntryPrice: 18.5, timestamp: new Date().toISOString() },
      ],
      riskRating: "LOW",
      lastActive: "12m ago",
    },
    {
      address: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5Sol",
      blockchain: "solana",
      label: "Solana Ecosystem Insider",
      winRatePercent: 78.9,
      totalRealizedProfitUsd: 2180000,
      portfolioValueUsd: 6400000,
      recentAccumulatedTokens: [
        { symbol: "SOL", amountUsd: 2800000, avgEntryPrice: 132.4, timestamp: new Date().toISOString() },
        { symbol: "PEPE", amountUsd: 450000, avgEntryPrice: 0.0000085, timestamp: new Date().toISOString() },
      ],
      riskRating: "MODERATE",
      lastActive: "4m ago",
    },
    {
      address: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
      blockchain: "arbitrum",
      label: "Arbitrum MEV & Quant Fund",
      winRatePercent: 86.1,
      totalRealizedProfitUsd: 6900000,
      portfolioValueUsd: 19500000,
      recentAccumulatedTokens: [
        { symbol: "BTC", amountUsd: 8900000, avgEntryPrice: 78500, timestamp: new Date().toISOString() },
        { symbol: "AVAX", amountUsd: 950000, avgEntryPrice: 28.1, timestamp: new Date().toISOString() },
      ],
      riskRating: "LOW",
      lastActive: "1m ago",
    },
    {
      address: "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
      blockchain: "ethereum",
      label: "Institutional Macro Reserve",
      winRatePercent: 89.2,
      totalRealizedProfitUsd: 14200000,
      portfolioValueUsd: 48000000,
      recentAccumulatedTokens: [
        { symbol: "BTC", amountUsd: 18500000, avgEntryPrice: 76200, timestamp: new Date().toISOString() },
        { symbol: "ETH", amountUsd: 12400000, avgEntryPrice: 3050, timestamp: new Date().toISOString() },
      ],
      riskRating: "LOW",
      lastActive: "18m ago",
    },
    {
      address: "0x28c6c06298d514db089934071355e5743bf21d60",
      blockchain: "bsc",
      label: "BNB Chain Yield Arbitrageur",
      winRatePercent: 74.5,
      totalRealizedProfitUsd: 3100000,
      portfolioValueUsd: 8900000,
      recentAccumulatedTokens: [
        { symbol: "BNB", amountUsd: 3200000, avgEntryPrice: 580.4, timestamp: new Date().toISOString() },
        { symbol: "LINK", amountUsd: 850000, avgEntryPrice: 17.8, timestamp: new Date().toISOString() },
      ],
      riskRating: "MODERATE",
      lastActive: "32m ago",
    },
    {
      address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJssSol",
      blockchain: "solana",
      label: "Solana High Beta Trader",
      winRatePercent: 81.3,
      totalRealizedProfitUsd: 5400000,
      portfolioValueUsd: 14200000,
      recentAccumulatedTokens: [
        { symbol: "SOL", amountUsd: 6800000, avgEntryPrice: 129.5, timestamp: new Date().toISOString() },
        { symbol: "PEPE", amountUsd: 1200000, avgEntryPrice: 0.0000088, timestamp: new Date().toISOString() },
      ],
      riskRating: "LOW",
      lastActive: "8m ago",
    },
    {
      address: "0xf977814e90da44bfa03b6295a0616a897441acec",
      blockchain: "polygon",
      label: "Polygon Infrastructure Whale",
      winRatePercent: 71.8,
      totalRealizedProfitUsd: 1950000,
      portfolioValueUsd: 5200000,
      recentAccumulatedTokens: [
        { symbol: "AVAX", amountUsd: 1400000, avgEntryPrice: 27.5, timestamp: new Date().toISOString() },
        { symbol: "XRP", amountUsd: 980000, avgEntryPrice: 0.54, timestamp: new Date().toISOString() },
      ],
      riskRating: "HIGH",
      lastActive: "45m ago",
    },
  ];

  async getTopWhales(blockchain?: string): Promise<WhaleWallet[]> {
    if (!blockchain || blockchain.toLowerCase() === "all") {
      return this.mockWhales;
    }
    return this.mockWhales.filter((w) => w.blockchain.toLowerCase() === blockchain.toLowerCase());
  }

  async getAggregatedKpis(): Promise<WhaleAggregatedKpis> {
    const totalWhalesCount = this.mockWhales.length;
    const totalWhaleAumUsd = this.mockWhales.reduce((sum, w) => sum + w.portfolioValueUsd, 0);
    const avgWinRatePercent =
      Math.round((this.mockWhales.reduce((sum, w) => sum + w.winRatePercent, 0) / totalWhalesCount) * 10) / 10;
    const totalRealizedProfitUsd = this.mockWhales.reduce((sum, w) => sum + w.totalRealizedProfitUsd, 0);

    // Aggregate token accumulation across all whales
    const tokenMap = new Map<string, number>();
    for (const w of this.mockWhales) {
      for (const t of w.recentAccumulatedTokens) {
        tokenMap.set(t.symbol, (tokenMap.get(t.symbol) || 0) + t.amountUsd);
      }
    }

    const topAccumulatedAssets = Array.from(tokenMap.entries())
      .map(([symbol, totalAmountUsd]) => ({ symbol, totalAmountUsd }))
      .sort((a, b) => b.totalAmountUsd - a.totalAmountUsd);

    const highRiskWhalesCount = this.mockWhales.filter((w) => w.riskRating === "HIGH").length;

    return {
      totalWhalesCount,
      totalWhaleAumUsd,
      avgWinRatePercent,
      totalRealizedProfitUsd,
      topAccumulatedAssets,
      netFlow24hUsd: 14500000, // +$14.5M net inflow in last 24h
      highRiskWhalesCount,
    };
  }
}

export const smartMoneyEngine = new SmartMoneyEngine();
