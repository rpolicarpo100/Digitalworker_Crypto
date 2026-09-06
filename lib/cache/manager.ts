import { LruCacheStore } from "./lru";

class CacheManager {
  public prices = new LruCacheStore(1000, 10000);     // 10s TTL
  public market = new LruCacheStore(500, 60000);      // 60s TTL
  public candles = new LruCacheStore(500, 30000);     // 30s TTL
  public metadata = new LruCacheStore(500, 1800000);  // 30m TTL

  getStats() {
    return {
      prices: this.prices.getStats(),
      market: this.market.getStats(),
      candles: this.candles.getStats(),
      metadata: this.metadata.getStats(),
    };
  }

  clearAll() {
    this.prices.clear();
    this.market.clear();
    this.candles.clear();
    this.metadata.clear();
  }
}

export const cacheManager = new CacheManager();
