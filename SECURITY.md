# GOD — Security

## Principles

- **No secrets in frontend**: Only `NEXT_PUBLIC_*` allowed in client, and only non-sensitive
- **No .env in git**: `.env.example` without real secrets
- **No private keys in plaintext**: Never store seed, mnemonic, private key
- **Input validation**: All user inputs validated with zod + custom validators
- **Zero silent failure**: Never return fake value on error, always ERROR + FALLBACK + LOG + USER STATUS

## OWASP Protections

### Implemented (Phase 1)

- [x] Input validation (symbol, interval, limit, price, volume, timestamp, wallet address)
- [x] Sanitization (strip `<>`, max length)
- [x] Rate limiting per provider + governor
- [x] Structured logging without secrets
- [x] Env validation with zod
- [x] No secrets in logs (redaction)
- [x] TypeScript strict

### Planned (Phase 2+)

- [ ] CSP headers (Next.js config)
- [ ] CSRF protection (Next.js middleware)
- [ ] XSS protection (React escaping + sanitization)
- [ ] SQL injection protection (Supabase parameterized queries)
- [ ] Authentication (Supabase Auth)
- [ ] Authorization (RLS policies)
- [ ] Audit logging (audit_logs table)
- [ ] Dependency scanning (npm audit)
- [ ] Secret management (env + Supabase Vault)

## Data Validation

```ts
// Price validation — no negative, no impossible
isValidPrice(price: number): boolean
isValidVolume(volume: number): boolean
isValidMarketCap(mcap, price, supply): boolean
isValidTimestamp(ts): boolean // no future, no 1y old
validateCandleData(candles): DataValidationResult // checks OHLC logic, duplicates, inversion
validatePriceData(price, symbol): DataValidationResult
sanitizeString(input, maxLength)
isValidEthAddress(address)
isValidSolAddress(address)
```

## Rate Limiting

- Per provider token bucket
- Daily limits to prevent exhausting free tier
- 429 handling with exponential backoff + jitter
- Governor stats in `/api/health`

## Circuit Breaker

Prevents hammering failing providers.

## Trading Permissions

Levels:

```
READ → ANALYZE → PAPER_TRADE → TESTNET → LIVE_TRADE
```

LIVE_TRADE requires explicit user consent + audit trail.

## Execution Safety (Future)

Before any real transaction:

```
CHECK BALANCE
CHECK CHAIN
CHECK TOKEN
CHECK CONTRACT
CHECK ROUTE
CHECK SLIPPAGE
CHECK GAS
CHECK PRICE IMPACT
CHECK ALLOWANCE
CHECK DESTINATION
CHECK USER CONFIRMATION

SIMULATE → CONFIRM → SIGN → BROADCAST → VERIFY
```

## Wallet Connection

- CONNECT WALLET ≠ permission to trade
- Separate steps
- Supports MetaMask, WalletConnect, Phantom (future)

## Audit Logs

Table `audit_logs`:

- user_id, action, resource, resource_id, details, ip_address, timestamp
- Never log secrets

## Reporting Vulnerabilities

If you find a vulnerability, please report via private channel, not public issue.

## Risk Disclosure

Platform distinguishes:

- market information
- analytics
- signals
- execution

Never guarantee profit. Use probabilistic language:

- "potential opportunity"
- "historical setup"
- "probabilistic scenario"
- "risk-adjusted opportunity"

Never:

- "guaranteed profit"
- "certain winner"
- "risk-free"
- "100% probability"
