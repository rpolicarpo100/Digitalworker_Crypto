export interface OpportunityConditions {
  entryConditions: string[];
  confirmationConditions: string[];
  invalidationConditions: string[];
  exitConditions: string[];
  riskConditions: string[];
}

export class InvalidationEngine {
  generateConditions(
    symbol: string,
    currentPrice: number,
    trend: "BULLISH" | "BEARISH" | "SIDEWAYS",
    supportPrice: number,
    resistancePrice: number
  ): OpportunityConditions {
    const isBull = trend === "BULLISH";

    return {
      entryConditions: [
        `Observed price level at $${currentPrice.toLocaleString()} with active ${trend.toLowerCase()} structure`,
        `Volume expansion verified on current timeframe`,
      ],
      confirmationConditions: [
        `Price holds above support at $${supportPrice.toLocaleString()}`,
        `Cross-provider price divergence < 0.5%`,
      ],
      invalidationConditions: [
        `4-hour candle close below invalidation key level $${(supportPrice * 0.985).toFixed(2)}`,
        `DEX/CEX liquidity drops below $50,000 within 1 hour`,
      ],
      exitConditions: [
        `Primary target zone reached at $${(resistancePrice * 1.02).toFixed(2)}`,
        `RSI momentum divergence above 80`,
      ],
      riskConditions: [
        `Position sizing restricted to max 2% portfolio risk`,
        `Stop-loss strictly enforced at invalidation threshold`,
      ],
    };
  }
}

export const invalidationEngine = new InvalidationEngine();
