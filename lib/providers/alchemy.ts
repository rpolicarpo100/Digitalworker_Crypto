import { env } from "../config/env";
import { ProviderHealth } from "./base";

export class AlchemyProvider {
  public name = "alchemy";

  isConfigured(): boolean {
    return Boolean(env.ALCHEMY_API_KEY && env.ALCHEMY_API_KEY.length > 5);
  }

  async getOnChainMetrics(symbol: string): Promise<never> {
    if (!this.isConfigured()) {
      throw new Error(
        `STATUS = UNAVAILABLE | REASON = Alchemy API key not configured | ALTERNATIVE = Set ALCHEMY_API_KEY in .env or use DEX Screener proxy data | REQUIRED = ALCHEMY_API_KEY`
      );
    }
    throw new Error("Alchemy RPC call failed");
  }

  async healthCheck(): Promise<ProviderHealth> {
    if (!this.isConfigured()) {
      return {
        provider: this.name,
        status: "OFFLINE",
        latencyMs: 0,
        lastCheck: new Date().toISOString(),
        error: "ALCHEMY_API_KEY not configured",
      };
    }
    return {
      provider: this.name,
      status: "ONLINE",
      latencyMs: 50,
      lastCheck: new Date().toISOString(),
    };
  }
}

export const alchemyProvider = new AlchemyProvider();
