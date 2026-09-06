import { BaseProvider, ProviderHealth } from "./base";
import { env } from "../config/env";

export interface CoinGeckoGlobal {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
  };
}

export interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
}

const SYMBOL_TO_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  AVAX: "avalanche-2",
  DOT: "polkadot",
  LINK: "chainlink",
};

export class CoinGeckoProvider extends BaseProvider {
  public name = "coingecko";
  private baseUrl: string;

  constructor() {
    super(env.RATE_LIMIT_COINGECKO_RPM);
    this.baseUrl = env.COINGECKO_API_URL;
  }

  private mapSymbolToId(symbol: string): string {
    const clean = symbol.replace(/USDT$/i, "").replace(/USD$/i, "").toUpperCase();
    return SYMBOL_TO_ID[clean] || clean.toLowerCase();
  }

  async getPrice(symbol: string): Promise<number> {
    const id = this.mapSymbolToId(symbol);
    const data = await this.fetchWithRetry<Record<string, { usd: number }>>(
      `${this.baseUrl}/simple/price?ids=${id}&vs_currencies=usd`
    );
    if (!data[id] || typeof data[id].usd !== "number") {
      throw new Error(`Price not found for CoinGecko ID: ${id}`);
    }
    return data[id].usd;
  }

  async getGlobal(): Promise<CoinGeckoGlobal["data"]> {
    const res = await this.fetchWithRetry<CoinGeckoGlobal>(`${this.baseUrl}/global`);
    return res.data;
  }

  async getTopCoins(limit = 20): Promise<CoinGeckoCoin[]> {
    return await this.fetchWithRetry<CoinGeckoCoin[]>(
      `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      await this.getPrice("BTC");
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

export const coinGeckoProvider = new CoinGeckoProvider();
