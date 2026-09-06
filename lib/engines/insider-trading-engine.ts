export interface InsiderTransaction {
  id: string;
  companySymbol: string;
  companyName: string;
  insiderName: string;
  insiderTitle: string;
  transactionType: "BUY" | "SELL";
  sharesCount: number;
  sharePriceUsd: number;
  totalValueUsd: number;
  filingDate: string;
  convictionSignal: "STRONG_BULLISH" | "BULLISH" | "NEUTRAL" | "BEARISH";
  secForm4Url?: string;
}

export class InsiderTradingEngine {
  private mockTransactions: InsiderTransaction[] = [
    {
      id: "sec_001",
      companySymbol: "NVDA",
      companyName: "NVIDIA Corporation",
      insiderName: "Jensen Huang",
      insiderTitle: "Chief Executive Officer & Director",
      transactionType: "BUY",
      sharesCount: 150000,
      sharePriceUsd: 118.5,
      totalValueUsd: 17775000,
      filingDate: new Date().toISOString(),
      convictionSignal: "STRONG_BULLISH",
    },
    {
      id: "sec_002",
      companySymbol: "ASML",
      companyName: "ASML Holding N.V.",
      insiderName: "Peter Wennink",
      insiderTitle: "Executive Director",
      transactionType: "BUY",
      sharesCount: 12500,
      sharePriceUsd: 815.0,
      totalValueUsd: 10187500,
      filingDate: new Date().toISOString(),
      convictionSignal: "STRONG_BULLISH",
    },
    {
      id: "sec_003",
      companySymbol: "MC",
      companyName: "LVMH Moët Hennessy Louis Vuitton",
      insiderName: "Bernard Arnault",
      insiderTitle: "Chairman & CEO",
      transactionType: "BUY",
      sharesCount: 25000,
      sharePriceUsd: 680.0,
      totalValueUsd: 17000000,
      filingDate: new Date().toISOString(),
      convictionSignal: "STRONG_BULLISH",
    },
    {
      id: "sec_004",
      companySymbol: "TSLA",
      companyName: "Tesla, Inc.",
      insiderName: "Vaibhav Taneja",
      insiderTitle: "Chief Financial Officer",
      transactionType: "SELL",
      sharesCount: 18000,
      sharePriceUsd: 212.0,
      totalValueUsd: 3816000,
      filingDate: new Date().toISOString(),
      convictionSignal: "NEUTRAL",
    },
  ];

  getRecentTransactions(): InsiderTransaction[] {
    return this.mockTransactions;
  }
}

export const insiderTradingEngine = new InsiderTradingEngine();
