export type AssetClass =
  | "CRYPTO"
  | "EQUITY"
  | "DIVIDEND"
  | "ETF"
  | "REIT"
  | "FOREX"
  | "COMMODITY"
  | "INDEX";

export type MarketCapCategory =
  | "NANO"
  | "MICRO"
  | "SMALL"
  | "MID"
  | "LARGE"
  | "MEGA";

export interface CanonicalAssetIdentity {
  /** Unambiguous global ID e.g., 'crypto:btc:mainnet', 'equity:aapl:nasdaq', 'etf:ibit:nasdaq' */
  canonicalId: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  exchangeOrChain?: string;
  contractAddress?: string;
  isin?: string;
  cusip?: string;
  currency: string;
  marketCapCategory?: MarketCapCategory;
  isCanonical: boolean;
  resolvedAt: string;
}

export class CanonicalAssetResolver {
  private static registry: Map<string, CanonicalAssetIdentity> = new Map([
    [
      "BTC",
      {
        canonicalId: "crypto:btc:mainnet",
        symbol: "BTC",
        name: "Bitcoin",
        assetClass: "CRYPTO",
        exchangeOrChain: "Bitcoin Mainnet",
        currency: "USD",
        marketCapCategory: "MEGA",
        isCanonical: true,
        resolvedAt: new Date().toISOString(),
      },
    ],
    [
      "ETH",
      {
        canonicalId: "crypto:eth:mainnet",
        symbol: "ETH",
        name: "Ethereum",
        assetClass: "CRYPTO",
        exchangeOrChain: "Ethereum Mainnet",
        currency: "USD",
        marketCapCategory: "MEGA",
        isCanonical: true,
        resolvedAt: new Date().toISOString(),
      },
    ],
    [
      "SOL",
      {
        canonicalId: "crypto:sol:solana",
        symbol: "SOL",
        name: "Solana",
        assetClass: "CRYPTO",
        exchangeOrChain: "Solana Mainnet",
        currency: "USD",
        marketCapCategory: "LARGE",
        isCanonical: true,
        resolvedAt: new Date().toISOString(),
      },
    ],
    [
      "AAPL",
      {
        canonicalId: "equity:aapl:nasdaq",
        symbol: "AAPL",
        name: "Apple Inc.",
        assetClass: "EQUITY",
        exchangeOrChain: "NASDAQ",
        currency: "USD",
        isin: "US0378331005",
        cusip: "037833100",
        marketCapCategory: "MEGA",
        isCanonical: true,
        resolvedAt: new Date().toISOString(),
      },
    ],
    [
      "NVDA",
      {
        canonicalId: "equity:nvda:nasdaq",
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        assetClass: "EQUITY",
        exchangeOrChain: "NASDAQ",
        currency: "USD",
        isin: "US67066G1040",
        marketCapCategory: "MEGA",
        isCanonical: true,
        resolvedAt: new Date().toISOString(),
      },
    ],
    [
      "IBIT",
      {
        canonicalId: "etf:ibit:nasdaq",
        symbol: "IBIT",
        name: "iShares Bitcoin Trust",
        assetClass: "ETF",
        exchangeOrChain: "NASDAQ",
        currency: "USD",
        marketCapCategory: "LARGE",
        isCanonical: true,
        resolvedAt: new Date().toISOString(),
      },
    ],
    [
      "O",
      {
        canonicalId: "reit:o:nyse",
        symbol: "O",
        name: "Realty Income Corporation",
        assetClass: "REIT",
        exchangeOrChain: "NYSE",
        currency: "USD",
        marketCapCategory: "LARGE",
        isCanonical: true,
        resolvedAt: new Date().toISOString(),
      },
    ],
  ]);

  public static resolve(symbolOrQuery: string): CanonicalAssetIdentity {
    const uppercaseQuery = symbolOrQuery.trim().toUpperCase();
    if (this.registry.has(uppercaseQuery)) {
      return this.registry.get(uppercaseQuery)!;
    }

    // Dynamic resolution for unknown symbol
    const isCrypto = uppercaseQuery.endsWith("USDT") || uppercaseQuery.endsWith("USD");
    const cleanSymbol = uppercaseQuery.replace(/(USDT|USD)$/, "");

    return {
      canonicalId: `${isCrypto ? "crypto" : "equity"}:${cleanSymbol.toLowerCase()}:default`,
      symbol: cleanSymbol,
      name: cleanSymbol,
      assetClass: isCrypto ? "CRYPTO" : "EQUITY",
      exchangeOrChain: "DEFAULT_EXCHANGE",
      currency: "USD",
      isCanonical: true,
      resolvedAt: new Date().toISOString(),
    };
  }
}
