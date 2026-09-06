import { LRUCache } from "lru-cache";

export type DataQualityStatus = "LIVE" | "FRESH" | "STALE" | "UNKNOWN" | "INVALID";
export type ConfidenceLevel = "High" | "Medium" | "Low";

export interface CachedItem<T> {
  value: T;
  timestamp: string;
  dataAgeMs: number;
  quality: DataQualityStatus;
  confidence: ConfidenceLevel;
  source: string;
}

export class LruCacheStore<T = unknown> {
  private cache: LRUCache<string, CachedItem<T>>;
  private hits = 0;
  private misses = 0;

  constructor(maxSize = 500, ttlMs = 60000) {
    this.cache = new LRUCache<string, CachedItem<T>>({
      max: maxSize,
      ttl: ttlMs,
    });
  }

  get(key: string): CachedItem<T> | undefined {
    const item = this.cache.get(key);
    if (item) {
      this.hits++;
      const dataAgeMs = Date.now() - new Date(item.timestamp).getTime();
      return {
        ...item,
        dataAgeMs,
        quality: dataAgeMs < 15000 ? "LIVE" : dataAgeMs < 60000 ? "FRESH" : "STALE",
      };
    }
    this.misses++;
    return undefined;
  }

  // Get item even if expired in LRUCache (if allowed)
  getPeek(key: string): CachedItem<T> | undefined {
    const item = this.cache.peek(key);
    if (item) {
      const dataAgeMs = Date.now() - new Date(item.timestamp).getTime();
      return {
        ...item,
        dataAgeMs,
        quality: "STALE",
      };
    }
    return undefined;
  }

  set(key: string, value: T, source: string, confidence: ConfidenceLevel = "High", customTtlMs?: number): void {
    const now = new Date().toISOString();
    const item: CachedItem<T> = {
      value,
      timestamp: now,
      dataAgeMs: 0,
      quality: "LIVE",
      confidence,
      source,
    };
    this.cache.set(key, item, { ttl: customTtlMs });
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRatio: total > 0 ? this.hits / total : 0,
      size: this.cache.size,
    };
  }
}
