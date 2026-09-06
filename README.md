# GOD — Global Opportunity Detector

> **Web3 AI Trading & Opportunity Intelligence Platform**
> 100% REAL • 100% FUNCIONAL • 0% MOCK • 0% FAKE DATA

![GOD Terminal](https://img.shields.io/badge/Status-Foundation%20Phase-blue)
![Real Data](https://img.shields.io/badge/Data-Real%20APIs-green)
![No Mock](https://img.shields.io/badge/Mock-0%25-red)

## 🎯 Objetivo

Construir uma plataforma Web3 AI chamada **GOD — Global Opportunity Detector** capaz de:

- Detectar, analisar, classificar e monitorizar oportunidades no mercado crypto
- Responder: *Que oportunidades existem agora? Porquê? Qual a qualidade? Qual o risco? Que dados suportam? O que invalidaria?*
- Não se limitar a "BTC vai subir"

## 📊 Stack (Free-First)

- **Frontend:** Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui
- **Database:** Supabase (PostgreSQL) — 500MB free, com fallback in-memory
- **Market Data:**
  - Binance (price, candles, orderbook) — public, no key
  - CoinGecko (prices, market cap, rankings, global) — public, 10 RPM free
  - DEX Screener (DEX pairs, liquidity, trending) — public, 60 RPM
  - Alternative.me (Fear & Greed) — public, no key
- **Blockchain:**
  - Alchemy (RPC, wallet, transfers) — 30M CU/month free, requires key
  - Dune (on-chain analytics) — requires key
- **Cache:** LRU Cache + intelligent TTLs
- **Resilience:** RateLimiter + CircuitBreaker + ProviderManager + Fallback

## 🏗️ Arquitetura

```
/app
  /(dashboard) — Terminal, Opportunities, Assets
  /api
    /health — System health + provider status
    /market — price, candles, global
/lib
  /providers — BaseProvider, Binance, CoinGecko, DexScreener, FearGreed, Manager
  /cache — LRU + Manager + Data Quality
  /config — env validation with zod
  /db — Supabase + schema.sql
  /security — validation, sanitization
  /engine — (next phases) technical, opportunity, risk, arbitrage
/components
  /ui — shadcn-style components
  /dashboard — GlobalMarket, PriceTicker, SystemHealth
```

Ver `ARCHITECTURE.md` para detalhes.

## 🚀 Quick Start

```bash
# Clone
git clone <repo>
cd god

# Env
cp .env.example .env.local
# Edit .env.local with your keys (Supabase, Alchemy optional for Phase 1)

# Install
npm install

# Dev
npm run dev

# Build
npm run build

# Health check
curl http://localhost:3000/api/health
```

## 🔌 APIs Reais Conectadas — Phase 1

| Provider | Endpoint | Status | Key Required | Rate Limit |
|----------|----------|--------|--------------|------------|
| Binance | `api.binance.com` | DEGRADED (geo-block) → fallback works | No | 1200 RPM |
| CoinGecko | `api.coingecko.com` | ONLINE | No (optional) | 10 RPM free |
| DEX Screener | `api.dexscreener.com` | ONLINE | No | 60 RPM |
| Fear & Greed | `api.alternative.me` | ONLINE | No | 10 RPM |
| Alchemy | `g.alchemy.com` | OFFLINE (no key) — marked UNAVAILABLE | Yes | 25 RPS free |
| Dune | `api.dune.com` | OFFLINE (no key) — marked UNAVAILABLE | Yes | 10 RPM |

**Princípio:** Nunca `API failure → fake data`. Sempre `retry → fallback → cached → stale → unavailable`.

## 📈 Data Quality Engine

Cada dado recebe:

```
freshness: LIVE | FRESH | STALE | UNKNOWN | INVALID
source: binance | coingecko | dexscreener | feargreed
confidence: High | Medium | Low
timestamp: ISO
dataAgeMs: number
```

Cache TTLs:

```
prices: 5-15s
market data: 30-60s
metadata: 5-30m
fundamentals: 1-24h
historical: persistent
```

## 🛡️ Security

- OWASP baseline: CSP, XSS protection, input validation (zod), sanitization
- No secrets in frontend, `.env.example` without real secrets
- Rate limiting per provider + daily governor
- Audit logs structure
- Ver `SECURITY.md`

## 📊 Opportunity Score (Phase 5)

```
Market Structure  15%
Momentum          10%
Volume            10%
Liquidity         10%
Technical Setup   10%
On-chain          15%
Fundamentals      10%
Sentiment          5%
Narrative          5%
Risk             -20%
----------------------
TOTAL            0-100

Confidence Score separado de Opportunity Score
Risk Score: 0-100 (100 = extremamente perigoso)
```

Cada oportunidade deve ter:

```
ENTRY CONDITIONS
CONFIRMATION CONDITIONS
INVALIDATION CONDITIONS
EXIT CONDITIONS
RISK CONDITIONS
```

## 🤖 AI Multi-Agent (Phase 9)

- AGENT 01 — MARKET SCANNER
- AGENT 02 — TECHNICAL ANALYST
- AGENT 03 — ON-CHAIN ANALYST
- AGENT 04 — DEX ANALYST
- AGENT 05 — TOKEN RISK ANALYST
- AGENT 06 — SENTIMENT ANALYST
- AGENT 07 — ARBITRAGE ENGINE
- AGENT 08 — QUANT ENGINE
- AGENT 09 — RISK MANAGER (can REJECT)
- AGENT 10 — AI ORCHESTRATOR

Todas as respostas AI com: ANSWER + DATA + SOURCES + CONFIDENCE + RISKS + TIMESTAMP

## 📚 Documentação

- `ARCHITECTURE.md` — Arquitetura detalhada
- `SECURITY.md` — Segurança
- `DATABASE.md` — Schema + Supabase
- `API.md` — Endpoints
- `AUDIT.md` — Pre-implementation audit
- `TRADING_RISK.md` — Risco legal

## 🧪 Testes

```bash
npm run build    # Build test
npm run lint     # Lint
npx tsc --noEmit # Typecheck
```

Unit, Integration, E2E e Security tests nas próximas fases.

## 🚦 Product Modes

```
DISCOVERY → ANALYSIS → PAPER_TRADING → BACKTEST → PORTFOLIO → LIVE_TRADING (locked)
```

Live Trading bloqueado até todas as fases anteriores testadas + explicit user consent.

## ⚠️ Risk Disclosure

> Informação analítica não constitui garantia de retorno financeiro. Trading envolve risco. Plataforma em modo READ + PAPER TRADING. Nunca invista mais do que pode perder.

## 📝 Phase 1 — Foundation — Status

- [x] Next.js + TypeScript + Tailwind
- [x] Env system with zod
- [x] Logger (JSON structured)
- [x] LRU Cache + Manager
- [x] RateLimiter + CircuitBreaker + ApiGovernor
- [x] Provider abstraction + Manager + Fallback
- [x] Binance adapter (real, with geo-block handling)
- [x] CoinGecko adapter (real, with rate limit handling)
- [x] DEX Screener adapter (real)
- [x] Fear & Greed adapter (real)
- [x] Supabase abstraction + schema.sql
- [x] Security validation
- [x] Health endpoint with real provider checks
- [x] Market APIs: price, global, candles
- [x] Dashboard UI dark professional
- [x] Build PASS, Typecheck PASS

Next: Phase 2 — Market Data expansion + Phase 3 — Market Dashboard + Charts

## 📄 License

Private — GOD Platform
