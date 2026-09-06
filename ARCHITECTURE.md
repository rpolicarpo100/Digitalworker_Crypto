# GOD — Architecture

## Overview

GOD — Global Opportunity Detector is a Web3 AI Trading & Opportunity Intelligence Platform built with free-first, real-data principles.

```
User
  ↓
Next.js Frontend (App Router, Tailwind, shadcn)
  ↓
API Layer (Route Handlers)
  ↓
ProviderManager
  ├─→ RateLimiter
  ├─→ CircuitBreaker
  ├─→ LRU Cache
  └─→ DataProviders (Binance, CoinGecko, DEX Screener, Fear&Greed, Alchemy, Dune)
  ↓
Supabase (PostgreSQL) + Fallback (in-memory)
  ↓
Blockchain / Exchange APIs (real)
```

## Core Principles

### 100% REAL, 0% MOCK

- Never invent APIs, endpoints, prices, volumes, trades
- If integration unavailable: `STATUS = UNAVAILABLE, REASON = ..., ALTERNATIVE = ...`
- Never `API failure → fake data`, always `retry → fallback → cached → stale → unavailable`

### Anti Vendor Lock-in

Every integration via interface:

```ts
interface DataProvider {
  getPrice(symbol: string): Promise<PriceData>
  getCandles(...): Promise<Candle[]>
  healthCheck(): Promise<ProviderHealth>
}
```

Allows swapping providers without touching business logic.

### Data Quality

Every data point:

```ts
{
  source: string,
  timestamp: ISO,
  dataAgeMs: number,
  quality: "LIVE" | "FRESH" | "STALE" | "UNKNOWN" | "INVALID",
  confidence: "High" | "Medium" | "Low"
}
```

Cross-source validation:

- If Source A + B + C agree → confidence ↑
- If diverge → confidence ↓

## Provider Layer

### ProviderManager

- Manages multiple providers per data type
- Fallback priority:
  - PRICE: Binance → CoinGecko → DEX Screener
  - DEX: DEX Screener
  - FEAR/GREED: Alternative.me
  - ONCHAIN: Alchemy → public RPC
- Handles retry with exponential backoff + jitter
- Handles 429, timeouts, connection errors

### RateLimiter

Token bucket per provider:

```ts
class RateLimiter {
  tokens: number
  refillRatePerMs: number
  canConsume(): boolean
  consume(): boolean
  waitForToken(): Promise<void>
}
```

Governor also tracks daily limits to prevent exhausting free tier.

### CircuitBreaker

States: CLOSED → OPEN → HALF_OPEN

- CLOSED: normal, track failures
- OPEN: failing, skip provider for timeoutMs
- HALF_OPEN: test if recovered

Prevents cascading failures.

### Cache

LRU per namespace:

- prices: 10s TTL, 1000 max
- market: 60s TTL, 500 max
- metadata: 30m TTL, 500 max
- fundamentals: 1h TTL, 200 max
- historical: 24h TTL, 200 max

Hit ratio tracked in health endpoint.

## Database — Supabase

PostgreSQL with 18+ tables (see `lib/db/schema.sql`):

- users, profiles, watchlists
- assets, markets, exchanges, pairs
- prices, candles, volume_metrics, technical_indicators
- onchain_metrics, wallets, whale_events
- liquidity_pools, token_risk
- sentiment, news, narratives
- opportunities, opportunity_scores, risk_scores, signals
- alerts, portfolios, positions, trades, strategies, backtests
- api_providers, api_usage, system_events, audit_logs

Fallback: if Supabase not configured, use in-memory cache + local storage, mark as `FALLBACK`.

## Security

- Env validation with zod, no secrets in frontend
- `.env.example` without real secrets
- Input validation: symbol, interval, limit, price, volume, timestamps
- Sanitization: strip `<>` to prevent XSS
- Rate limiting per provider
- Audit logs
- CSP, CSRF, XSS headers (Next.js config)
- No private keys in plaintext

## Opportunity Discovery Pipeline (Phase 5)

```
COLLECT
  ↓
NORMALIZE
  ↓
VALIDATE (negative price? duplicate candle? future timestamp?)
  ↓
ENRICH (add indicators, on-chain, sentiment)
  ↓
ANALYZE (10 AI agents)
  ↓
SCORE (0-100 weighted)
  ↓
RISK CHECK (Risk Engine can REJECT)
  ↓
CROSS-VALIDATE (multiple sources)
  ↓
RANK (GOD RANK)
  ↓
PRESENT (Opportunity Card with Entry/Invalidation/Exit)
```

## AI Multi-Agent (Phase 9)

- MARKET SCANNER: price, volume, volatility, momentum
- TECHNICAL ANALYST: indicators, patterns, support/resistance
- ON-CHAIN ANALYST: wallets, whales, flows
- DEX ANALYST: pools, liquidity, swaps
- TOKEN RISK ANALYST: contract risk, ownership, honeypot
- SENTIMENT ANALYST: news, social, narratives
- ARBITRAGE ENGINE: gross - fees - gas - slippage - bridge = net edge
- QUANT ENGINE: volatility, correlation, Sharpe, drawdown
- RISK MANAGER: can REJECT if risk > threshold
- ORCHESTRATOR: collects all, resolves conflicts, final report

All AI responses grounded in retrieved data, with source citations.

## Frontend

- Dark, professional, high-density, responsive
- Desktop-first, mobile-compatible
- Bloomberg Terminal + Arkham + DeFi dashboard inspiration, but not copying proprietary UI
- Priority: DATA, CLARITY, SPEED, READABILITY, ACTIONABILITY

Components:

- Global Market (BTC, ETH, SOL, total mcap, dominance, Fear&Greed, regime)
- Price Ticker (real-time, 10s refresh)
- Opportunities Terminal (table with Score, Confidence, Risk, Liquidity, Signal)
- Asset Terminal (Overview, Chart, Technical, On-chain, Liquidity, Tokenomics, Whales, Social, News, Risk)
- AI Copilot (chat with ANSWER + DATA + SOURCES + CONFIDENCE + RISKS + TIMESTAMP)
- System Health (provider status, cache, governor, circuits)

## Observability

- Health endpoint: `/api/health` returns provider status, cache stats, circuits, features
- Structured JSON logs: timestamp, service, level, request_id, user_id, provider, endpoint, latency, status, error
- No secrets in logs
- Metrics: API latency, 429 errors, provider availability, DB latency, AI cost, data freshness

## Deployment

- Frontend: Vercel / Cloudflare (free tier 100k req/day)
- API: Next.js Route Handlers
- DB: Supabase free 500MB
- Async: Queue + Workers + Cron (future)
- PWA: installable, offline shell (future)

## Cost Control

- Free-first: choose free/open-source/low-cost
- Prompt caching, response caching, model routing (small model → simple task, large → complex)
- Never sacrifice security/reliability just to stay free

## Phases

- Phase 0: Audit (DONE)
- Phase 1: Foundation (DONE — this doc)
- Phase 2: Market Data (NEXT)
- Phase 3: Market Dashboard
- Phase 4: Technical Engine
- Phase 5: Opportunity Engine
- Phase 6: On-chain
- Phase 7: DEX Intelligence
- Phase 8: Token Security
- Phase 9: AI
- Phase 10: Paper Trading
- Phase 11: Backtesting
- Phase 12: Alerts
- Phase 13: Wallet
- Phase 14: Live Execution (locked, requires explicit consent)

## Decision Rule

When multiple solutions:

- Score 0-100 on cost, reliability, latency, security, maintainability, scalability, free-tier viability, DX, community, docs
- Choose best Quality / Cost / Complexity ratio
