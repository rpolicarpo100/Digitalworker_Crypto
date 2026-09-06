# GOD — PRE-IMPLEMENTATION AUDIT
## Global Opportunity Detector

**Data:** 2026-09-05 (Europe/Lisbon)
**Auditor:** Senior Full-Stack + Web3 + AI Engineer
**Workspace:** /home/user
**Modo:** PHASE 0 — AUDIT

---

### 1. INSPEÇÃO DO REPOSITÓRIO

```bash
/home/user
total 0
- No package.json
- No src/
- No apps/
- No config files
- No .env
- No README
- No git repo initialized
```

**Status:** `EMPTY REPOSITORY` — Greenfield project.

---

### 2. INSPEÇÃO DO AMBIENTE

- **Node:** v20.20.2 — VERIFIED
- **NPM:** 10.8.2 — VERIFIED
- **Python:** 3.13.14 — VERIFIED
- **PNPM/BUN:** UNAVAILABLE (not installed, npm will be used)
- **Environment Variables:**
  - No NEXT_PUBLIC_*
  - No SUPABASE_*
  - No ALCHEMY_*
  - No API keys detected
  - STATUS = CLEAN SLATE

- **Runtime:** Linux sandbox (Arena / E2B)
- **Persistência:** Apenas /home/user persiste
- **Ports:** Dinâmicos via e2b preview (https://{port}-{sandboxId}.e2b.app)

---

### 3. DEPENDÊNCIAS EXISTENTES

```
STATUS = NONE
REASON = Empty workspace
```

Nenhuma dependência instalada. Nenhum lockfile.

---

### 4. ARQUITECTURA EXISTENTE

```
STATUS = UNAVAILABLE
REASON = No code exists
```

Nenhuma arquitectura para reutilizar.

---

### 5. APIS EXISTENTES

```
STATUS = UNAVAILABLE
REASON = No implementation
```

Verificação de conectividade real será feita na Phase 2.

Teste preliminar de APIs públicas (sem chave):

- CoinGecko public API: `https://api.coingecko.com/api/v3/ping` — TO BE TESTED
- Binance public API: `https://api.binance.com/api/v3/ping` — TO BE TESTED
- DEX Screener: `https://api.dexscreener.com/latest/dex/search/?q=SOL` — TO BE TESTED
- Alternative.me Fear & Greed: `https://api.alternative.me/fng/` — TO BE TESTED
- Alchemy: Requires API KEY — STATUS = UNAVAILABLE (needs user key)
- Dune: Requires API KEY — STATUS = UNAVAILABLE (needs user key)

---

### 6. SCORES

```text
ARCHITECTURE SCORE    0/100  — No architecture
SECURITY SCORE        0/100  — No security layer
CODE QUALITY          0/100  — No code
SCALABILITY           0/100  — No infra
PERFORMANCE           0/100  — No app
WEB3 READINESS        0/100  — No Web3 integration
AI READINESS          0/100  — No AI layer
DATA QUALITY          0/100  — No data providers
PRODUCT READINESS     0/100  — No product
OVERALL SCORE         0/100  — Greenfield
```

Justificação: Workspace completamente vazio. Não existe débito técnico porque não existe código. É o cenário ideal para construir de raiz seguindo as melhores práticas sem legacy.

---

### 7. CLASSIFICAÇÃO DE ISSUES

#### P0 — BLOCKERS (Impeditivo total de progresso sem resolução)

- [P0-001] No Next.js project scaffolded
- [P0-002] No TypeScript configuration
- [P0-003] No Tailwind / UI system
- [P0-004] No environment system (.env.example, config abstraction)
- [P0-005] No database layer (Supabase client + fallback)
- [P0-006] No ProviderManager abstraction
- [P0-007] No RateLimiter / CircuitBreaker / Cache
- [P0-008] No logging / observability
- [P0-009] No authentication system
- [P0-010] No API routes structure

#### P1 — CRITICAL (Necessário para MVP funcional)

- [P1-001] Market Data Providers: CoinGecko, Binance, DEX Screener, Fear&Greed
- [P1-002] Data Normalization Layer
- [P1-003] Cache System (prices 5-15s, market 30-60s, metadata 5-30m)
- [P1-004] Global Market Dashboard (BTC, ETH, SOL, Total MCap, Dominance, F&G)
- [P1-005] Asset Search + Watchlist
- [P1-006] Technical Indicators Engine (RSI, MACD, EMA, SMA, VWAP, Bollinger, ATR, ADX)
- [P1-007] Opportunity Engine + Scoring (0-100) + Confidence + Risk
- [P1-008] Risk Engine (0-100)
- [P1-009] Invalidation Engine (Entry/Confirmation/Invalidation/Exit)
- [P1-010] Database Schema (18+ tables from spec)
- [P1-011] Security baseline (OWASP, CSP, validation, audit logs)

#### P2 — IMPORTANT (Necessário para produto completo)

- [P2-001] On-chain intelligence (Alchemy with fallback)
- [P2-002] DEX Intelligence (liquidity, pools, new tokens)
- [P2-003] Token Security / GOD SENTINEL (contract risk)
- [P2-004] Wallet Intelligence + Smart Money Tracker
- [P2-005] Whale Activity Detection
- [P2-006] AI Multi-Agent Architecture (10 agents)
- [P2-007] AI Copilot Chat (RAG + source citations)
- [P2-008] Paper Trading Engine (real data + simulated execution)
- [P2-009] Backtesting Engine + Anti-overfitting
- [P2-010] Alerts System (price, volume, whale, risk, opportunity)
- [P2-011] Portfolio Intelligence
- [P2-012] Arbitrage Engine with net edge calculation
- [P2-013] Narrative Engine + Sentiment

#### P3 — IMPROVEMENTS (Pós-MVP)

- [P3-001] PWA + offline shell
- [P3-002] Internationalization PT-PT / EN
- [P3-003] Mobile optimizations advanced
- [P3-004] Admin Panel
- [P3-005] Live Trading execution (requires explicit consent + audit)
- [P3-006] Wallet Connect (MetaMask, WalletConnect, Phantom)
- [P3-007] Telegram/Discord notifications
- [P3-008] Dune integration (requires API key)
- [P3-009] ML Engine (only if improves metrics vs baseline)

---

### 8. DECISÕES ARQUITECTURAIS — PLAN

#### Stack Escolhido (Quality/Cost/Complexity)

```
Frontend: Next.js 14+ App Router + TypeScript + Tailwind + shadcn/ui
Charts: lightweight-charts + Recharts
State: Zustand (light) + TanStack Query for data fetching
Backend: Next.js API Routes + Route Handlers
Database: Supabase (PostgreSQL) — with local fallback abstraction for free tier
Market Data: 
  1. Binance (primary price/candles/orderbook)
  2. CoinGecko (primary metadata/rankings/categories)
  3. DEX Screener (primary DEX)
  4. Alternative.me (Fear & Greed)
Blockchain: Alchemy (requires key) + direct RPC fallback (public RPCs)
On-chain Analytics: Dune (requires key) + local heuristics
AI: AIProvider abstraction (OpenAI-compatible interface, free-first routing)
Cache: In-memory LRU + optional Redis abstraction
Rate Limit: Token bucket + exponential backoff + circuit breaker
```

**Justificação FREE-FIRST:**

- CoinGecko public (no key) — suficiente para MVP baixo volume
- Binance public — no key para market data
- DEX Screener public — no key
- Alternative.me — no key
- Alchemy free tier 30M CU — requer key mas gratuito
- Supabase free 500MB — suficiente para MVP
- Next.js + Vercel/Cloudflare free tier

**Padrão Anti Vendor Lock-in:**

Todas as integrações via interface `DataProvider`:

```ts
interface DataProvider {
  getPrice(symbol: string): Promise<PriceData>
  getCandles(...): Promise<Candle[]>
  getMarketData(...): Promise<...>
  healthCheck(): Promise<ProviderHealth>
}
```

---

### 9. ESTRUTURA DE PASTAS PROPOSTA

```
/home/user/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Dashboard group
│   │   ├── page.tsx              # Global Market
│   │   ├── opportunities/page.tsx
│   │   ├── asset/[symbol]/page.tsx
│   │   ├── portfolio/page.tsx
│   │   ├── paper/page.tsx
│   │   ├── backtest/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── market/...
│   │   ├── opportunities/...
│   │   ├── ai/...
│   │   └── health/...
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                       # shadcn
│   ├── dashboard/
│   ├── opportunities/
│   ├── asset/
│   ├── ai/
│   └── charts/
├── lib/
│   ├── providers/                # DataProvider implementations
│   │   ├── base.ts
│   │   ├── binance.ts
│   │   ├── coingecko.ts
│   │   ├── dexscreener.ts
│   │   ├── feargreed.ts
│   │   ├── alchemy.ts
│   │   └── manager.ts            # ProviderManager + Fallback
│   ├── engine/
│   │   ├── technical.ts
│   │   ├── opportunity.ts
│   │   ├── risk.ts
│   │   ├── scoring.ts
│   │   ├── invalidation.ts
│   │   ├── arbitrage.ts
│   │   ├── market-regime.ts
│   │   └── anomaly.ts
│   ├── ai/
│   │   ├── provider.ts
│   │   ├── orchestrator.ts
│   │   └── agents/
│   ├── cache/
│   │   ├── lru.ts
│   │   └── manager.ts
│   ├── security/
│   ├── db/
│   │   ├── supabase.ts
│   │   └── schema.ts
│   └── utils/
├── docs/
├── tests/
└── ...
```

---

### 10. RISCOS IDENTIFICADOS

- **RISK-001:** Rate limits em APIs gratuitas → Mitigação: Cache agressivo + RateLimiter + Governor
- **RISK-002:** Alchemy/Dune sem keys → Mitigação: Marcar UNAVAILABLE + fallback público + permitir user config
- **RISK-003:** Dados divergentes entre providers → Mitigação: Cross-validation + Confidence Score
- **RISK-004:** Hallucination AI → Mitigação: RAG only + source citations obrigatórias
- **RISK-005:** Fake arbitrage → Mitigação: Cálculo net edge obrigatório (gross - fees - gas - slippage)
- **RISK-006:** Security (keys no frontend) → Mitigação: .env.example + server-only + audit
- **RISK-007:** Supabase free tier pause → Mitigação: Cache persistente + graceful degradation

---

### 11. IMPLEMENTATION PLAN — FASES

**FASE 0 — AUDIT** ✅ ESTA FASE
- Output: Este documento

**FASE 1 — FOUNDATION** (PRÓXIMA)
- Next.js 14 + TS + Tailwind + shadcn
- Supabase abstraction + schema SQL
- Env system + logging + error handling + health check
- Layout base dark professional
- Testes: build, typecheck

**FASE 2 — MARKET DATA**
- ProviderManager + RateLimiter + CircuitBreaker + Cache
- Binance adapter (price, candles, 24h ticker, orderbook)
- CoinGecko adapter (coins, market, categories, global)
- DEX Screener adapter (search, pairs, trending)
- Fear & Greed adapter
- API Routes: /api/market/*

**FASE 3 — MARKET DASHBOARD**
- Global Market (BTC, ETH, SOL, total mcap, dominance, F&G)
- Asset table + search
- Watchlist (local + supabase)
- Charts (lightweight-charts)
- Real-time via SWR / TanStack

**FASE 4 — TECHNICAL ENGINE**
- RSI, MACD, EMA, SMA, VWAP, Bollinger, ATR, ADX, Stochastic
- Support/Resistance detection
- Market structure
- Unit tests para cada indicador

**FASE 5 — OPPORTUNITY ENGINE**
- Scanner + Scoring (Market 15%, Momentum 10%, Volume 10%, Liquidity 10%, Technical 10%, On-chain 15%, Fundamentals 10%, Sentiment 5%, Narrative 5%, Risk -20%)
- Confidence Score
- Risk Engine
- Invalidation Engine
- GOD RANK

**FASE 6-14** — Conforme spec, iterativo.

---

### 12. CRITÉRIOS DE ACEITAÇÃO PARA FASE 1

```
FUNCTIONAL: Next.js app runs, dashboard renders
TESTED: npm run build PASS, tsc PASS
SECURE: No secrets in frontend, .env.example present
DOCUMENTED: README + ARCHITECTURE
OBSERVABLE: /api/health returns provider status
ERROR-HANDLED: Provider failures return structured error, not fake data
REAL-DATA VERIFIED: CoinGecko + Binance real calls in API routes
```

---

### 13. PRÓXIMA ACÇÃO

Iniciar **PHASE 1 — FOUNDATION**

```text
PLAN → IMPLEMENT → TEST → AUDIT → REPORT → NEXT
```

---

**Assinatura Auditoria:**

```
STATUS = VERIFIED
ARCHITECTURE = GREENFIELD — Ready for build
RECOMMENDATION = Proceed to Phase 1 Foundation with free-first real APIs
```
