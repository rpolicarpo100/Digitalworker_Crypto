import { BaseProvider, ProviderHealth } from "./base";
import { env } from "../config/env";

export interface FearGreedData {
  value: number;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

export class FearGreedProvider extends BaseProvider {
  public name = "feargreed";
  private baseUrl: string;

  constructor() {
    super(30);
    this.baseUrl = env.FEAR_GREED_API_URL;
  }

  async getLatest(): Promise<FearGreedData> {
    const data = await this.fetchWithRetry<{
      data: Array<{
        value: string;
        value_classification: string;
        timestamp: string;
        time_until_update?: string;
      }>;
    }>(`${this.baseUrl}/fng/?limit=1`);

    if (!data.data || data.data.length === 0) {
      throw new Error("Fear & Greed data unavailable");
    }

    const item = data.data[0];
    return {
      value: parseInt(item.value, 10),
      value_classification: item.value_classification,
      timestamp: new Date(parseInt(item.timestamp, 10) * 1000).toISOString(),
      time_until_update: item.time_until_update,
    };
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      await this.getLatest();
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

export const fearGreedProvider = new FearGreedProvider();
