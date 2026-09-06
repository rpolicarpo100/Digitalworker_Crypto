# GOD — Database

## Provider

- **Primary:** Supabase (PostgreSQL) — Free tier 500MB per project, projects may be paused after inactivity
- **Fallback:** In-memory LRU Cache + local storage when Supabase not configured

## Connection

```ts
import { getSupabaseClient, getSupabaseAdmin, isSupabaseConfigured, safeQuery } from "@/lib/db/supabase";

const client = getSupabaseClient(); // null if not configured
if (!client) { /* use fallback */ }

const { data, source, error } = await safeQuery(
  (c) => c.from("assets").select("*").limit(10),
  [] // fallback
);
```

Env:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

If not configured, health endpoint shows `supabaseConfigured: false` and uses fallback.

## Schema

Full SQL in `lib/db/schema.sql`.

### Core Tables

#### Users & Profiles

- `profiles` — extends `auth.users`, fields: id (UUID FK), email, username, avatar_url, trading_level (READ, ANALYZE, PAPER_TRADE, TESTNET, LIVE_TRADE)

#### Assets & Markets

- `assets` — id (coingecko id), symbol, name, image, chain, contract_address, market_cap
- `exchanges` — id, name, type (CEX/DEX), url
- `pairs` — id UUID, base_asset FK, quote_asset FK, exchange_id FK, symbol (e.g. BTCUSDT)

#### Market Data

- `prices` — id UUID, asset_id FK, pair_id FK, price DECIMAL, source, timestamp, quality
  - Index: asset_id + timestamp DESC
- `candles` — id UUID, pair_id FK, asset_id, interval, open_time, close_time, open, high, low, close, volume, source
  - Unique: pair_id + interval + open_time
  - Index: pair_id + interval + open_time DESC
- `volume_metrics` — asset_id, volume_24h, volume_change_24h, volume_spike BOOL
- `technical_indicators` — asset_id, interval, indicator (RSI, MACD...), value JSONB

#### On-Chain

- `wallets` — id UUID, address UNIQUE, chain, label, type (EOA, CONTRACT, EXCHANGE, WHALE, SMART_MONEY, UNKNOWN)
- `whale_events` — wallet_id FK, asset_id FK, type (ACCUMULATION, DISTRIBUTION, EXCHANGE_DEPOSIT...), amount, usd_value, tx_hash
- `onchain_metrics` — asset_id, active_addresses, transaction_count, exchange_inflow/outflow, holder_count, whale_concentration

#### DEX

- `liquidity_pools` — chain_id, dex_id, pair_address, base_token, quote_token, liquidity_usd, volume_24h, price_usd, fdv
  - Unique: chain_id + pair_address

#### Token Risk

- `token_risk` — asset_id, contract_address, chain, risk_score 0-100, risk_level (LOW, MEDIUM, HIGH, CRITICAL, UNKNOWN), is_honeypot, has_mint_authority, has_freeze_authority, is_proxy, is_verified, holder_concentration, liquidity_locked, buy_tax, sell_tax, details JSONB

#### Sentiment & News

- `sentiment` — asset_id, fear_greed_value, fear_greed_classification, social_score, news_sentiment (positive/negative/neutral/uncertain), trending_score
- `news` — title, content, source, url, asset_ids TEXT[], sentiment, relevance_score, credibility_score, published_at
- `narratives` — name (AI, DePIN, RWA...), status (emerging, accelerating, peak, declining, dead), volume_growth, market_cap_growth, social_growth, liquidity_growth, assets TEXT[]

#### Opportunities (Core)

- `opportunities` — id UUID, asset_id FK, type (TREND, MOMENTUM, BREAKOUT, MEAN_REVERSION, ARBITRAGE, NEW_TOKEN, WHALE, NARRATIVE), subtype, score 0-100, confidence 0-100, risk_score 0-100, risk_level, timeframe, current_price, entry_zone JSONB, target_zone JSONB, invalidation JSONB, why TEXT, data_evidence JSONB, catalysts JSONB, risks JSONB, sources JSONB, status (ACTIVE, INVALIDATED, EXPIRED, COMPLETED), expires_at
  - Indexes: score DESC, asset_id, type, created_at DESC
- `opportunity_scores` — opportunity_id FK, breakdown: market_structure, momentum, volume, liquidity, technical_setup, onchain, fundamentals, sentiment, narrative, risk_penalty, total
- `risk_scores` — opportunity_id FK, volatility, liquidity, spread, slippage, smart_contract, concentration, exchange, market, total
- `signals` — opportunity_id FK, asset_id FK, type, direction (LONG, SHORT, NEUTRAL, WATCH), price, source, metadata JSONB

#### User Data

- `watchlists` — user_id FK, name, asset_ids TEXT[]
- `alerts` — user_id FK, asset_id FK, type (PRICE, VOLUME, LIQUIDITY, WHALE, BREAKOUT, RISK, NEW_TOKEN, ARBITRAGE, OPPORTUNITY_SCORE), condition JSONB, channel TEXT[], is_active BOOL
- `portfolios` — user_id FK, name, type (MANUAL, WALLET, EXCHANGE, PAPER), wallet_address, chain
- `positions` — portfolio_id FK, asset_id FK, quantity, avg_entry_price, current_price, pnl, pnl_percent
- `trades` — portfolio_id FK, asset_id FK, type (BUY, SELL), quantity, price, fee, slippage, tx_hash, exchange, is_paper BOOL, metadata JSONB
- `strategies` — user_id FK, name, description, config JSONB
- `backtests` — strategy_id FK, asset_id FK, timeframe, initial_capital, final_capital, total_return, annualized_return, max_drawdown, sharpe_ratio, profit_factor, win_rate, total_trades, config JSONB, results JSONB

#### System

- `api_providers` — id, name, status (ONLINE, DEGRADED, OFFLINE, UNKNOWN), latency_ms, last_check, error, config JSONB
- `api_usage` — provider_id FK, endpoint, requests, latency_ms, status_code, timestamp
  - Index: provider_id + timestamp DESC
- `system_events` — service, level (debug, info, warn, error), message, metadata JSONB
- `audit_logs` — user_id FK, action, resource, resource_id, details JSONB, ip_address, timestamp
  - Index: user_id + timestamp DESC

## Migrations

Run `lib/db/schema.sql` in Supabase SQL editor.

Initial data:

- Exchanges: binance, coingecko, dexscreener, uniswap, raydium
- Assets: BTC, ETH, SOL, BNB, XRP, ADA, DOGE, AVAX, DOT, LINK
- API Providers: binance, coingecko, dexscreener, feargreed, alchemy, dune

## RLS (Row Level Security) — Planned

- Enable RLS on all user tables
- Policies: users can only read/write own data
- Example:

```sql
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own watchlists"
  ON watchlists FOR ALL
  USING (auth.uid() = user_id);
```

## Caching Strategy

- Prices: 10s TTL, persistent in DB for historical
- Candles: 30s TTL for recent, persistent for historical
- Metadata: 30m TTL
- Fundamentals: 1-24h TTL

Cache hit ratio tracked in health endpoint.

## Backup & Free Tier

- Supabase free: 500MB, project may pause after inactivity → fallback to in-memory
- For production: enable daily backups, Point-in-Time Recovery (paid tier)

## Audit

- All writes to `audit_logs`
- Never log secrets
