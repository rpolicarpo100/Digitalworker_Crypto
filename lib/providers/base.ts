import { RateLimiter } from "./rate-limiter";
import { CircuitBreaker } from "./circuit-breaker";
import { apiGovernor } from "./governor";
import { logger } from "../logger";

export interface ProviderHealth {
  provider: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  latencyMs: number;
  lastCheck: string;
  error?: string;
}

export abstract class BaseProvider {
  public abstract name: string;
  protected rateLimiter: RateLimiter;
  protected circuitBreaker: CircuitBreaker;

  constructor(requestsPerMinute: number) {
    this.rateLimiter = new RateLimiter(requestsPerMinute);
    this.circuitBreaker = new CircuitBreaker(this.constructor.name);
  }

  protected async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    retries = 2,
    timeoutMs = 8000
  ): Promise<T> {
    if (!this.circuitBreaker.canExecute()) {
      throw new Error(`Circuit breaker OPEN for provider ${this.name}`);
    }

    const hasToken = await this.rateLimiter.waitForToken(1, 5000);
    if (!hasToken) {
      apiGovernor.recordCall(this.name, false);
      throw new Error(`Rate limit exceeded for provider ${this.name}`);
    }

    let lastError: Error | null = null;
    const startTime = Date.now();

    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
            "User-Agent": "GOD-GlobalOpportunityDetector/1.0",
            ...options.headers,
          },
        });

        clearTimeout(timer);

        if (!response.ok) {
          const bodyText = await response.text().catch(() => "");
          if (response.status === 429) {
            throw new Error(`HTTP 429 Rate Limited: ${bodyText.slice(0, 100)}`);
          }
          if (response.status === 451 || response.status === 403 || bodyText.includes("restricted location")) {
            throw new Error(`HTTP ${response.status} Geo-Blocked or Forbidden: ${bodyText.slice(0, 100)}`);
          }
          throw new Error(`HTTP ${response.status}: ${bodyText.slice(0, 100)}`);
        }

        const data = await response.json();
        this.circuitBreaker.recordSuccess();
        apiGovernor.recordCall(this.name, true);
        return data as T;
      } catch (err: unknown) {
        clearTimeout(timer);
        lastError = err instanceof Error ? err : new Error(String(err));
        
        // Don't count geo-blocks as circuit breaker failures
        if (lastError.message.includes("451") || lastError.message.includes("restricted location")) {
          break;
        }

        if (attempt < retries) {
          const backoffMs = Math.min(500 * Math.pow(2, attempt), 3000);
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        }
      }
    }

    // Only record circuit breaker failure if not geo-blocked
    if (!lastError?.message.includes("restricted location") && !lastError?.message.includes("451")) {
      this.circuitBreaker.recordFailure();
    }
    
    apiGovernor.recordCall(this.name, false);
    logger.warn(`Provider request failed: ${this.name}`, {
      provider: this.name,
      latencyMs: Date.now() - startTime,
      error: lastError?.message,
    });
    throw lastError || new Error(`Failed to fetch from ${this.name}`);
  }

  public abstract healthCheck(): Promise<ProviderHealth>;
}
