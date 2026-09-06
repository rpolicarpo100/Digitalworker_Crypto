export interface Tier1NewsItem {
  id: string;
  headline: string;
  sourceTier: "Tier 1 (Primary / Regulatory)" | "Tier 2 (Reputable Financial Media)" | "Tier 3 (Specialist Research)";
  publisher: string;
  assetSymbols: string[];
  catalystCategory: "Earnings" | "Guidance" | "M&A" | "Regulation" | "Tokenomics" | "Macro";
  sentiment: "BULLISH" | "NEUTRAL" | "BEARISH";
  materialityScore: number; // 0 - 100
  summary: string;
  publishedAt: string;
}

export class Tier1NewsEngine {
  getLatestNews(): Tier1NewsItem[] {
    return [
      {
        id: "news_001",
        headline: "SEC Form 4 Filing Confirms $17.7M Spot Insider Share Purchase by NVIDIA CEO",
        sourceTier: "Tier 1 (Primary / Regulatory)",
        publisher: "SEC Edgar Official Database",
        assetSymbols: ["NVDA"],
        catalystCategory: "M&A",
        sentiment: "BULLISH",
        materialityScore: 95,
        summary: "Regulatory filing confirms direct open-market equity accumulation by executive leadership.",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "news_002",
        headline: "BlackRock Spot Bitcoin ETF (IBIT) Records $320M Net Daily Inflow",
        sourceTier: "Tier 2 (Reputable Financial Media)",
        publisher: "Bloomberg Terminal",
        assetSymbols: ["BTC"],
        catalystCategory: "Macro",
        sentiment: "BULLISH",
        materialityScore: 88,
        summary: "Accelerated institutional capital inflows mark 5th consecutive day of net positive creation units.",
        publishedAt: new Date().toISOString(),
      },
      {
        id: "news_003",
        headline: "ASML Reports Q3 Semiconductor EUV Lithography Order Intake Above Consensus",
        sourceTier: "Tier 1 (Primary / Regulatory)",
        publisher: "ASML Investor Relations",
        assetSymbols: ["ASML"],
        catalystCategory: "Earnings",
        sentiment: "BULLISH",
        materialityScore: 91,
        summary: "Net bookings reach €5.6B driven by AI chip foundry capacity expansion.",
        publishedAt: new Date().toISOString(),
      },
    ];
  }
}

export const tier1NewsEngine = new Tier1NewsEngine();
