import { BaseProvider, ProviderHealth } from "./base";
import { DexPair } from "./dexscreener";

export interface GeckoPool {
  id: string;
  type: string;
  attributes: {
    name: string;
    address: string;
    base_token_price_usd: string;
    quote_token_price_usd: string;
    price_change_percentage: { h24: string };
    volume_usd: { h24: string };
    reserve_in_usd: string;
  };
}

export class GeckoTerminalProvider extends BaseProvider {
  public name = "geckoterminal";
  private baseUrl = "https://api.geckoterminal.com/api/v2";

  constructor() {
    super(30); // 30 RPM
  }

  async getTrendingPools(network = "eth"): Promise<DexPair[]> {
    try {
      const data = await this.fetchWithRetry<{ data: GeckoPool[] }>(
        `${this.baseUrl}/networks/${network}/trending_pools`
      );

      if (!data.data) return [];

      return data.data.map((p) => ({
        chainId: network,
        dexId: "geckoterminal",
        url: `https://www.geckoterminal.com/${network}/pools/${p.attributes.address}`,
        pairAddress: p.attributes.address,
        baseToken: { address: "", name: p.attributes.name.split("/")[0]?.trim() || "", symbol: p.attributes.name.split("/")[0]?.trim() || "" },
        quoteToken: { address: "", name: p.attributes.name.split("/")[1]?.trim() || "", symbol: p.attributes.name.split("/")[1]?.trim() || "" },
        priceNative: "0",
        priceUsd: p.attributes.base_token_price_usd || "0",
        txns: { m5: { buys: 0, sells: 0 }, h1: { buys: 0, sells: 0 }, h6: { buys: 0, sells: 0 }, h24: { buys: 100, sells: 100 } },
        volume: { h24: parseFloat(p.attributes.volume_usd?.h24 || "0"), h6: 0, h1: 0, m5: 0 },
        priceChange: { m5: 0, h1: 0, h6: 0, h24: parseFloat(p.attributes.price_change_percentage?.h24 || "0") },
        liquidity: { usd: parseFloat(p.attributes.reserve_in_usd || "0"), base: 0, quote: 0 },
      }));
    } catch {
      return [];
    }
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      await this.getTrendingPools("eth");
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

export const geckoTerminalProvider = new GeckoTerminalProvider();
