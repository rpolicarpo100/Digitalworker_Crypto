import { binanceProvider } from "./binance";
import { coinGeckoProvider } from "./coingecko";
import { dexScreenerProvider } from "./dexscreener";
import { fearGreedProvider } from "./feargreed";
import { alchemyProvider } from "./alchemy";
import { duneProvider } from "./dune";
import { cacheManager } from "../cache/manager";
import { ConfidenceLevel, DataQualityStatus } from "../cache/lru";
import { logger } from "../logger";

export interface UnifiedPrice {
  symbol: string;
  price: number;
  source: string;
  timestamp: string;
  dataAgeMs: number;
  quality: DataQualityStatus;
  confidence: ConfidenceLevel;
}

export class ProviderManager {
  async getPrice(symbol: string): Promise<UnifiedPrice> {
    const uppercaseSymbol = symbol.toUpperCase().trim();
    const cacheKey = `price:${uppercaseSymbol}`;

    // 1. Check live/fresh cache
    const cached = cacheManager.prices.get(cacheKey);
    if (cached && (cached.quality === "LIVE" || cached.quality === "FRESH")) {
      return {
        symbol: uppercaseSymbol,
        price: cached.value as number,
        source: cached.source,
        timestamp: cached.timestamp,
        dataAgeMs: cached.dataAgeMs,
        quality: cached.quality,
        confidence: cached.confidence,
      };
    }

    // 2. Fallback Chain: Binance -> CoinGecko -> DEX Screener
    let price: number | null = null;
    let providerUsed = "";

    try {
      price = await binanceProvider.getPrice(uppercaseSymbol);
      providerUsed = "binance";
    } catch (binanceErr) {
      logger.warn(`Binance price fetch failed for ${uppercaseSymbol}, trying CoinGecko`, {
        error: binanceErr instanceof Error ? binanceErr.message : String(binanceErr),
      });

      try {
        price = await coinGeckoProvider.getPrice(uppercaseSymbol);
        providerUsed = "coingecko";
      } catch (cgErr) {
        logger.warn(`CoinGecko price fetch failed for ${uppercaseSymbol}, trying DEX Screener`, {
          error: cgErr instanceof Error ? cgErr.message : String(cgErr),
        });

        try {
          const pairs = await dexScreenerProvider.searchPairs(uppercaseSymbol);
          if (pairs && pairs.length > 0 && pairs[0].priceUsd) {
            price = parseFloat(pairs[0].priceUsd);
            providerUsed = "dexscreener";
          }
        } catch (dexErr) {
          logger.warn(`DEX Screener price fetch failed for ${uppercaseSymbol}`, {
            error: dexErr instanceof Error ? dexErr.message : String(dexErr),
          });
        }
      }
    }

    // 3. If real fetch succeeded, store in cache and return
    if (price !== null && !isNaN(price) && price > 0) {
      cacheManager.prices.set(cacheKey, price, providerUsed, "High");
      return {
        symbol: uppercaseSymbol,
        price,
        source: providerUsed,
        timestamp: new Date().toISOString(),
        dataAgeMs: 0,
        quality: "LIVE",
        confidence: "High",
      };
    }

    // 4. Try stale cache if all providers failed
    const staleCached = cacheManager.prices.getPeek(cacheKey);
    if (staleCached) {
      return {
        symbol: uppercaseSymbol,
        price: staleCached.value as number,
        source: `${staleCached.source}-stale`,
        timestamp: staleCached.timestamp,
        dataAgeMs: Date.now() - new Date(staleCached.timestamp).getTime(),
        quality: "STALE",
        confidence: "Low",
      };
    }

    throw new Error(
      `STATUS = UNAVAILABLE | REASON = All price providers (Binance, CoinGecko, DEX Screener) failed for ${uppercaseSymbol} and no cached data exists | REQUIRED = Real provider connection`
    );
  }

  async healthCheckAll() {
    const results = await Promise.all([
      binanceProvider.healthCheck(),
      coinGeckoProvider.healthCheck(),
      dexScreenerProvider.healthCheck(),
      fearGreedProvider.healthCheck(),
      alchemyProvider.healthCheck(),
      duneProvider.healthCheck(),
    ]);
    return results;
  }
}

export const providerManager = new ProviderManager();
