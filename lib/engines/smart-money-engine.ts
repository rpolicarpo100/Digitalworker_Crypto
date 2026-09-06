export interface WhaleWallet {
  address: string;
  blockchain: "solana" | "ethereum" | "arbitrum" | "bsc";
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
  ];

  async getTopWhales(blockchain?: string): Promise<WhaleWallet[]> {
    if (!blockchain || blockchain.toLowerCase() === "all") {
      return this.mockWhales;
    }
    return this.mockWhales.filter((w) => w.blockchain.toLowerCase() === blockchain.toLowerCase());
  }
}

export const smartMoneyEngine = new SmartMoneyEngine();
