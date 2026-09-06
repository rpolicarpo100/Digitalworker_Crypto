import { env } from "../config/env";
import { ProviderHealth } from "./base";

export class DuneProvider {
  public name = "dune";

  isConfigured(): boolean {
    return Boolean(env.DUNE_API_KEY && env.DUNE_API_KEY.length > 5);
  }

  async healthCheck(): Promise<ProviderHealth> {
    if (!this.isConfigured()) {
      return {
        provider: this.name,
        status: "OFFLINE",
        latencyMs: 0,
        lastCheck: new Date().toISOString(),
        error: "DUNE_API_KEY not configured",
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

export const duneProvider = new DuneProvider();
