# GOD — API Documentation

## Base URL

- Dev: `http://localhost:3000/api`
- Prod: `https://your-domain/api`

All APIs return JSON with `requestId`, `timestamp`, `source`.

## Health

### GET /api/health

Returns system health, provider status, cache stats, circuits, features.

```bash
curl http://localhost:3000/api/health
```

Response:

```json
{
  "status": "ONLINE" | "DEGRADED" | "OFFLINE",
  "timestamp": "ISO",
  "providers": [
    {
      "provider": "binance",
      "status": "ONLINE" | "DEGRADED" | "OFFLINE",
      "latencyMs": 73,
      "lastCheck": "ISO",
      "error": "optional"
    }
  ],
  "system": {
    "cache": { "hits": 0, "misses": 0, "hitRatio": 0 },
    "governor": { "providers": [...] },
    "circuits": [{ "provider": "binance", "state": "CLOSED" }]
  },
  "features": { "dex": true, "paperTrading": true },
  "env": { "supabaseConfigured": false, "alchemyConfigured": false }
}
```

Headers: `X-Request-Id`, `Cache-Control: no-cache`

## Market Data

### GET /api/market/price?symbol=BTC

Real price with fallback: Binance → CoinGecko.

- Query: `symbol` (2-20 chars, e.g. BTC, ETH, SOL, BTCUSDT)
- Validation: symbolSchema (uppercase, alphanumeric)
- Cache: 10s TTL (prices)
- Rate limit: via ApiGovernor (Binance 1200 RPM, CoinGecko 10 RPM)

```bash
curl "http://localhost:3000/api/market/price?symbol=BTC"
curl "http://localhost:3000/api/market/price?symbol=ETH"
curl "http://localhost:3000/api/market/price?symbol=SOL"
```

Response:

```json
{
  "symbol": "BTCUSDT",
  "price": 79788,
  "source": "coingecko",
  "providerUsed": "coingecko",
  "timestamp": "2026-09-06T07:05:30.000Z",
  "confidence": "High",
  "quality": "LIVE",
  "isStale": false,
  "requestId": "req_...",
  "latencyMs": 1772
}
```

Headers: `X-Provider`, `X-Data-Source`, `Cache-Control: public, s-maxage=5`

Error handling:

- 400: Invalid symbol
- 503: All providers failed → try stale cache, else UNAVAILABLE
- Never returns fake price

### GET /api/market/global

Global market data: total mcap, volume, dominance, Fear & Greed, top coins.

```bash
curl http://localhost:3000/api/market/global
```

Response:

```json
{
  "global": {
    "totalMarketCap": 2702651543144,
    "totalVolume": 65319930146,
    "btcDominance": 59.14,
    "ethDominance": 11.29,
    "activeCryptocurrencies": 19621,
    "markets": 1498,
    "source": "coingecko",
    "timestamp": "ISO"
  },
  "fearGreed": {
    "value": 73,
    "classification": "Greed",
    "timestamp": "ISO",
    "source": "feargreed"
  },
  "topCoins": [
    {
      "id": "bitcoin",
      "symbol": "BTC",
      "name": "Bitcoin",
      "price": 79788,
      "marketCap": 1580000000000,
      "priceChange24h": 2.5,
      "rank": 1
    }
  ],
  "sources": {
    "global": "coingecko",
    "fearGreed": "feargreed",
    "topCoins": "coingecko"
  }
}
```

Cache: 60s TTL.

### GET /api/market/candles?symbol=BTC&interval=1h&limit=100

OHLC candles.

- Query:
  - `symbol`: BTC, ETH, etc
  - `interval`: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
  - `limit`: 1-1000, default 100
- Provider: Binance primary, CoinGecko fallback
- Cache: 30s TTL

```bash
curl "http://localhost:3000/api/market/candles?symbol=BTC&interval=1h&limit=50"
```

Response:

```json
{
  "symbol": "BTC",
  "interval": "1h",
  "count": 50,
  "candles": [
    {
      "openTime": 1725600000000,
      "closeTime": 1725603600000,
      "open": 79000,
      "high": 79500,
      "low": 78900,
      "close": 79200,
      "volume": 123.45,
      "source": "binance",
      "interval": "1h"
    }
  ],
  "source": "binance"
}
```

Validation: checks OHLC logic, timestamp inversion, duplicates (via validateCandleData).

## Future APIs (Phase 2+)

- GET /api/market/ticker/24h?symbol=BTC
- GET /api/market/orderbook?symbol=BTC&limit=100
- GET /api/market/dex/trending
- GET /api/market/dex/search?q=SOL
- GET /api/market/feargreed/history?limit=30
- GET /api/opportunities — GOD RANK
- GET /api/opportunities/:id
- POST /api/ai/chat — AI Copilot
- GET /api/portfolio
- POST /api/alerts

## Error Format

All errors return:

```json
{
  "error": "Human readable",
  "reason": "Technical reason, e.g. STATUS = UNAVAILABLE, REASON = ..., ALTERNATIVE = ...",
  "requestId": "req_...",
  "timestamp": "ISO",
  "status": "UNAVAILABLE" | "ERROR"
}
```

Never fake data on error.

## Rate Limits

Controlled by ApiGovernor:

- CoinGecko: 10 RPM, 10000/day
- Binance: 1200 RPM, 100000/day
- DEX Screener: 60 RPM, 50000/day
- Fear&Greed: 10 RPM, 1000/day

429 handling: exponential backoff + jitter, fallback to stale cache, then UNAVAILABLE.

## Data Quality

Every response includes:

- `source`: provider name
- `timestamp`: ISO when data fetched
- `quality`: LIVE | FRESH | STALE | UNKNOWN | INVALID
- `confidence`: High | Medium | Low
- `dataAgeMs`: age in ms (for cached)

## Attribution

- CoinGecko data: attribution required per terms
- Binance: public market data
- DEX Screener: public
- Alternative.me Fear & Greed: attribution required for commercial use
