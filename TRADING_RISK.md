# GOD — Trading Risk Disclosure

## Legal Notice

**GOD — Global Opportunity Detector is an analytical platform, not financial advice.**

### Information Classification

The platform distinguishes:

- **Market Information:** Prices, volumes, market cap, liquidity — factual data from providers
- **Analytics:** Technical indicators, on-chain metrics, sentiment — calculated from real data
- **Signals:** Opportunity Score, Confidence, Risk — probabilistic assessments, not guarantees
- **Execution:** Paper trading, testnet, live trading — simulated or real execution

### No Guarantees

Never use language:

- "guaranteed profit"
- "certain winner"
- "risk-free"
- "100% probability"
- "guaranteed moon"

Use:

- "potential opportunity"
- "historical setup"
- "probabilistic scenario"
- "risk-adjusted opportunity"

### Risk Factors

Trading cryptocurrencies involves substantial risk:

- **Volatility Risk:** Prices can drop 50%+ in hours
- **Liquidity Risk:** Low liquidity → high slippage, impossible to exit
- **Smart Contract Risk:** Bugs, exploits, rug pulls, honeypots
- **Concentration Risk:** Single asset/chain exposure
- **Exchange Risk:** CEX can freeze withdrawals, DEX can have bugs
- **Counterparty Risk:** Bridge, oracle, custodian failures
- **Market Risk:** Bear markets, black swans, liquidations
- **Leverage Risk:** Liquidation, funding costs
- **Execution Risk:** Slippage, latency, failed transactions, MEV
- **Tokenomics Risk:** Unlocks, emissions, inflation, team allocation
- **Regulatory Risk:** Bans, delistings, compliance changes

### Opportunity Score ≠ Profit Probability

- **Opportunity Score 87/100** means strong setup based on data, not 87% chance of profit
- **Confidence Score** measures data quality and source agreement, not profit certainty
- **Risk Score** 100 = extremely dangerous, but low risk doesn't mean safe

### Invalidation

Every opportunity must have:

- ENTRY CONDITIONS
- CONFIRMATION CONDITIONS
- INVALIDATION CONDITIONS (when thesis is wrong)
- EXIT CONDITIONS
- RISK CONDITIONS

If price closes below resistance after breakout → invalidated. Respect invalidation.

### Paper Trading First

- Phase 1-9: READ ONLY + analysis
- Phase 10: PAPER TRADING — virtual portfolio, real market data, simulated execution with fees, slippage, latency
- Phase 11: BACKTESTING — historical, with anti-overfitting (no look-ahead bias, train/validation/test split)
- Phase 14: LIVE TRADING — only after all previous phases tested, explicit user consent, audit trail

Paper trading uses **real market data + modeled execution**, never fake data presented as real market.

### No Overfitting

Backtesting must prevent:

- Look-ahead bias
- Data leakage
- Future data contamination
- Survivorship bias
- Unrealistic fills
- Impossible execution

Separate TRAIN / VALIDATION / TEST when using ML.

### User Responsibility

- Do your own research (DYOR)
- Never invest more than you can afford to lose
- Understand smart contract risks before interacting
- Verify contract addresses, not just symbols
- Use hardware wallets for large amounts
- Start with small positions
- Use stop-loss and position sizing

### Data Sources

- CoinGecko, Binance, DEX Screener, Alternative.me, Alchemy, Dune — real APIs, but can have errors, delays, outages
- Cross-source validation: if sources agree → confidence ↑, if diverge → confidence ↓
- Data Quality: LIVE, FRESH, STALE, UNKNOWN, INVALID — check timestamp and source
- If data is STALE or UNKNOWN → lower confidence, higher risk

### Arbitrage

Arbitrage only valid if:

```
gross spread
- trading fees
- gas
- slippage
- bridge cost
- withdrawal cost
- execution latency
- estimated price impact
= net expected edge > 0
```

If net ≤ 0 → NO ARBITRAGE. Never show gross spread as profit.

### Token Risk

Never say "SAFE". Only:

- LOW RISK
- MEDIUM RISK
- HIGH RISK
- CRITICAL RISK
- UNKNOWN

Check: ownership, mint authority, freeze authority, proxy, upgradeability, liquidity, concentration, taxes, verification, creator history.

### AI Hallucination Control

- AI answers must be built from retrieved data + structured metrics + source metadata
- AI must not fill gaps with invented knowledge
- Every important claim must have SOURCE + TIMESTAMP + DATA AGE + CONFIDENCE
- If no source → UNVERIFIED
- If broken → BROKEN
- If not exists → UNAVAILABLE
- If implemented and tested → VERIFIED

### Regulatory

- Not a licensed financial advisor
- Not a broker-dealer
- Users responsible for compliance with local laws
- Privacy Policy and Terms required before live trading

### Final

> **Informação analítica não constitui garantia de retorno financeiro.**

Trading is risky. Use GOD as intelligence, not as oracle. Validate everything. Manage risk first.

