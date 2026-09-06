import { BaseProvider, ProviderHealth } from "./base";
import { env } from "../config/env";

export interface DexPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: { h24: number; h6: number; h1: number; m5: number };
  priceChange: { m5: number; h1: number; h6: number; h24: number };
  liquidity?: { usd: number; base: number; quote: number };
  fdv?: number;
  pairCreatedAt?: number;
}

export class DexScreenerProvider extends BaseProvider {
  public name = "dexscreener";
  private baseUrl: string;

  constructor() {
    super(env.RATE_LIMIT_DEXSCREENER_RPM);
    this.baseUrl = env.DEXSCREENER_API_URL;
  }

  async searchPairs(query: string): Promise<DexPair[]> {
    const data = await this.fetchWithRetry<{ pairs: DexPair[] }>(
      `${this.baseUrl}/latest/dex/search?q=${encodeURIComponent(query)}`
    );
    return data.pairs || [];
  }

  async getTokenPairs(tokenAddress: string): Promise<DexPair[]> {
    const data = await this.fetchWithRetry<{ pairs: DexPair[] }>(
      `${this.baseUrl}/latest/dex/tokens/${tokenAddress}`
    );
    return data.pairs || [];
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      await this.searchPairs("SOL");
      return {
        provider: this.name,
        status: "ONLINE",
        latencyMs: Date.now() - start,
        lastCheck: new Date().toISOString(),
      };
    } catch (err: unknown) {
      return {
        provider: this.name,
        status: "DEGRADED",
        latencyMs: Date.now() - start,
        lastCheck: new Date().toISOString(),
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

export const dexScreenerProvider = new DexScreenerProvider();
