import {
  MultiAssetProfile,
  StockFundamentals,
  StockValuation,
  MarketCapTier,
  DataProvenance,
} from "../types/multi-asset";

export class StockEngine {
  private stockDatabase: Record<
    string,
    {
      profile: MultiAssetProfile;
      fundamentals: StockFundamentals;
      valuation: StockValuation;
      priceUsd: number;
      change24hPercent: number;
    }
  > = {
    NVDA: {
      profile: {
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        assetClass: "STOCK",
        exchange: "NASDAQ",
        country: "USA",
        sector: "Technology",
        industry: "Semiconductors",
        marketCapUsd: 3120000000000,
        marketCapTier: "MEGA_CAP",
        currency: "USD",
      },
      fundamentals: {
        revenueUsd: 126000000000,
        revenueGrowthYoyPercent: 122.5,
        grossMarginPercent: 75.8,
        operatingMarginPercent: 62.1,
        netIncomeUsd: 68000000000,
        eps: 2.75,
        epsGrowthYoyPercent: 135.2,
        freeCashFlowUsd: 58000000000,
        operatingCashFlowUsd: 65000000000,
        totalDebtUsd: 11000000000,
        totalCashUsd: 34000000000,
        netDebtUsd: -23000000000,
        roePercent: 115.4,
        roicPercent: 82.3,
        roaPercent: 54.2,
      },
      valuation: {
        peRatio: 42.5,
        forwardPe: 32.1,
        pegRatio: 1.15,
        priceToSales: 24.8,
        priceToBook: 48.2,
        evToEbitda: 35.6,
        fcfYieldPercent: 1.86,
        dividendYieldPercent: 0.03,
        valuationRange: { bearUsd: 95, baseUsd: 135, bullUsd: 180 },
      },
      priceUsd: 128.5,
      change24hPercent: 2.45,
    },
    ASML: {
      profile: {
        symbol: "ASML",
        name: "ASML Holding N.V.",
        assetClass: "STOCK",
        exchange: "Euronext Amsterdam / NASDAQ",
        country: "Netherlands",
        sector: "Technology",
        industry: "Semiconductor Equipment",
        marketCapUsd: 325000000000,
        marketCapTier: "MEGA_CAP",
        currency: "EUR",
      },
      fundamentals: {
        revenueUsd: 28500000000,
        revenueGrowthYoyPercent: 18.2,
        grossMarginPercent: 51.3,
        operatingMarginPercent: 32.8,
        netIncomeUsd: 7800000000,
        eps: 19.8,
        epsGrowthYoyPercent: 15.4,
        freeCashFlowUsd: 6500000000,
        operatingCashFlowUsd: 8200000000,
        totalDebtUsd: 4800000000,
        totalCashUsd: 7200000000,
        netDebtUsd: -2400000000,
        roePercent: 52.1,
        roicPercent: 34.2,
        roaPercent: 21.8,
      },
      valuation: {
        peRatio: 38.2,
        forwardPe: 29.4,
        pegRatio: 1.82,
        priceToSales: 11.4,
        priceToBook: 22.1,
        evToEbitda: 28.5,
        fcfYieldPercent: 2.0,
        dividendYieldPercent: 0.85,
        valuationRange: { bearUsd: 680, baseUsd: 850, bullUsd: 1050 },
      },
      priceUsd: 825.0,
      change24hPercent: 1.15,
    },
    MC: {
      profile: {
        symbol: "MC",
        name: "LVMH Moët Hennessy Louis Vuitton",
        assetClass: "DIVIDEND_STOCK",
        exchange: "Euronext Paris",
        country: "France",
        sector: "Consumer Discretionary",
        industry: "Luxury Goods",
        marketCapUsd: 340000000000,
        marketCapTier: "MEGA_CAP",
        currency: "EUR",
      },
      fundamentals: {
        revenueUsd: 91000000000,
        revenueGrowthYoyPercent: 8.5,
        grossMarginPercent: 68.8,
        operatingMarginPercent: 25.6,
        netIncomeUsd: 16200000000,
        eps: 32.4,
        epsGrowthYoyPercent: 7.2,
        freeCashFlowUsd: 11500000000,
        operatingCashFlowUsd: 18400000000,
        totalDebtUsd: 18200000000,
        totalCashUsd: 9800000000,
        netDebtUsd: 8400000000,
        roePercent: 26.8,
        roicPercent: 18.5,
        roaPercent: 12.1,
      },
      valuation: {
        peRatio: 21.4,
        forwardPe: 18.8,
        pegRatio: 2.1,
        priceToSales: 3.74,
        priceToBook: 5.6,
        evToEbitda: 13.8,
        fcfYieldPercent: 3.38,
        dividendYieldPercent: 1.92,
        valuationRange: { bearUsd: 580, baseUsd: 710, bullUsd: 880 },
      },
      priceUsd: 682.0,
      change24hPercent: -0.85,
    },
  };

  async getStockData(symbol: string) {
    const s = symbol.toUpperCase();
    if (this.stockDatabase[s]) {
      return this.stockDatabase[s];
    }

    // Default structured response for non-cached symbol
    return {
      profile: {
        symbol: s,
        name: `${s} Corp`,
        assetClass: "STOCK" as const,
        exchange: "NYSE / NASDAQ",
        country: "USA",
        sector: "Technology",
        industry: "Software & Services",
        marketCapUsd: 1250000000,
        marketCapTier: "SMALL_CAP" as MarketCapTier,
        currency: "USD",
      },
      fundamentals: {
        revenueUsd: 180000000,
        revenueGrowthYoyPercent: 24.5,
        grossMarginPercent: 62.4,
        operatingMarginPercent: 18.2,
        netIncomeUsd: 22000000,
        eps: 1.15,
        epsGrowthYoyPercent: 28.1,
        freeCashFlowUsd: 19500000,
        operatingCashFlowUsd: 24000000,
        totalDebtUsd: 15000000,
        totalCashUsd: 48000000,
        netDebtUsd: -33000000,
        roePercent: 18.4,
        roicPercent: 14.8,
        roaPercent: 11.2,
      },
      valuation: {
        peRatio: 18.5,
        forwardPe: 14.2,
        pegRatio: 0.88,
        priceToSales: 2.8,
        priceToBook: 3.1,
        evToEbitda: 11.2,
        fcfYieldPercent: 5.4,
        dividendYieldPercent: 2.1,
        valuationRange: { bearUsd: 18, baseUsd: 25, bullUsd: 34 },
      },
      priceUsd: 21.5,
      change24hPercent: 1.82,
    };
  }
}

export const stockEngine = new StockEngine();
