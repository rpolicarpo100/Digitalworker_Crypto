export class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRatePerMs: number;
  private lastRefill: number;

  constructor(requestsPerMinute: number, burstLimit?: number) {
    this.maxTokens = burstLimit || Math.max(5, Math.floor(requestsPerMinute / 4));
    this.tokens = this.maxTokens;
    this.refillRatePerMs = requestsPerMinute / 60000;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRatePerMs);
    this.lastRefill = now;
  }

  canConsume(count = 1): boolean {
    this.refill();
    return this.tokens >= count;
  }

  consume(count = 1): boolean {
    this.refill();
    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }
    return false;
  }

  async waitForToken(count = 1, timeoutMs = 10000): Promise<boolean> {
    const startTime = Date.now();
    while (!this.consume(count)) {
      if (Date.now() - startTime > timeoutMs) {
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return true;
  }

  getTokens(): number {
    this.refill();
    return this.tokens;
  }
}
