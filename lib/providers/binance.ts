import { BaseProvider, ProviderHealth } from "./base";

export interface BinancePrice {
  symbol: string;
  price: string;
}

export interface BinanceTicker24h {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  askPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
}

export interface BinanceOrderBook {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export class BinanceProvider extends BaseProvider {
  public name = "binance";
  private endpoints = [
    "https://data-api.binance.vision",
    "https://api.binance.com",
    "https://api1.binance.com",
    "https://api2.binance.com",
    "https://api3.binance.com",
  ];

  constructor() {
    super(1200); // 1200 RPM
  }

  public normalizeSymbol(symbol: string): string {
    const s = symbol.toUpperCase().trim();
    if (s === "USDT" || s === "USD") return "BTCUSDT";
    if (s.length > 4 && (s.endsWith("USDT") || s.endsWith("BUSD"))) {
      return s;
    }
    if (s !== "BTC" && s.endsWith("BTC")) return s;
    if (s !== "ETH" && s.endsWith("ETH")) return s;
    return `${s}USDT`;
  }

  private async fetchMultiEndpoint<T>(path: string): Promise<T> {
    let lastErr: Error | null = null;
    for (const base of this.endpoints) {
      try {
        return await this.fetchWithRetry<T>(`${base}${path}`, {}, 1, 5000);
      } catch (err: unknown) {
        lastErr = err instanceof Error ? err : new Error(String(err));
        if (lastErr.message.includes("451") || lastErr.message.includes("restricted location")) {
          // Skip geo-blocked endpoint
          continue;
        }
      }
    }
    throw lastErr || new Error(`All Binance endpoints failed for ${path}`);
  }

  async getPrice(symbol: string): Promise<number> {
    const norm = this.normalizeSymbol(symbol);
    const data = await this.fetchMultiEndpoint<BinancePrice>(`/api/v3/ticker/price?symbol=${norm}`);
    const val = parseFloat(data.price);
    if (isNaN(val) || val <= 0) {
      throw new Error(`Invalid price returned from Binance for ${symbol}: ${data.price}`);
    }
    return val;
  }

  async getTicker24h(symbol: string): Promise<BinanceTicker24h> {
    const norm = this.normalizeSymbol(symbol);
    return await this.fetchMultiEndpoint<BinanceTicker24h>(`/api/v3/ticker/24hr?symbol=${norm}`);
  }

  async getOrderBook(symbol: string, limit = 20): Promise<BinanceOrderBook> {
    const norm = this.normalizeSymbol(symbol);
    return await this.fetchMultiEndpoint<BinanceOrderBook>(`/api/v3/depth?symbol=${norm}&limit=${limit}`);
  }

  async getCandles(symbol: string, interval = "1h", limit = 100): Promise<Array<{
    openTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    closeTime: number;
  }>> {
    const norm = this.normalizeSymbol(symbol);
    type BinanceKline = [number, string, string, string, string, string, number, string, number, string, string, string];
    const data = await this.fetchMultiEndpoint<BinanceKline[]>(
      `/api/v3/klines?symbol=${norm}&interval=${interval}&limit=${limit}`
    );

    return data.map((k) => ({
      openTime: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
      closeTime: k[6],
    }));
  }

  async healthCheck(): Promise<ProviderHealth> {
    const start = Date.now();
    try {
      await this.getPrice("BTCUSDT");
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

export const binanceProvider = new BinanceProvider();
