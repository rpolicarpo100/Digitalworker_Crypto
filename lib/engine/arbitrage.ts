export interface ArbitrageTradeSizeResult {
  tradeSizeUsd: number;
  grossSpreadPercent: number;
  grossProfitUsd: number;
  exchangeFeesUsd: number;
  dexFeesUsd: number;
  gasFeesUsd: number;
  estimatedSlippagePercent: number;
  slippageCostUsd: number;
  estimatedPriceImpactPercent: number;
  priceImpactCostUsd: number;
  bridgeFeesUsd: number;
  netEdgePercent: number;
  netProfitUsd: number;
  isValidArbitrage: boolean;
  rejectionReason?: string;
}

export interface ArbitrageOpportunity {
  symbol: string;
  sourceA: string;
  sourceB: string;
  priceA: number; // buy price
  priceB: number; // sell price
  grossSpreadPercent: number;
  evaluations: ArbitrageTradeSizeResult[];
  timestamp: string;
}

export class ArbitrageEngine {
  evaluateArbitrage(
    symbol: string,
    sourceA: string,
    sourceB: string,
    priceA: number, // Buy at lower price
    priceB: number, // Sell at higher price
    liquidityUsd = 1000000, // Default $1M liquidity pool
    isCrossChain = false
  ): ArbitrageOpportunity {
    const buyPrice = Math.min(priceA, priceB);
    const sellPrice = Math.max(priceA, priceB);

    const grossSpreadPercent = buyPrice > 0 ? ((sellPrice - buyPrice) / buyPrice) * 100 : 0;
    const tradeSizes = [10, 100, 1000, 10000, 100000];

    const evaluations: ArbitrageTradeSizeResult[] = tradeSizes.map((size) => {
      const grossProfitUsd = size * (grossSpreadPercent / 100);

      // Real fees
      const exchangeFeesUsd = size * 0.001;       // 0.1% CEX fee
      const dexFeesUsd = size * 0.003;             // 0.3% DEX fee
      const gasFeesUsd = isCrossChain ? 15 : 2.5; // $2.50 L2/DEX gas or $15 cross-chain
      const bridgeFeesUsd = isCrossChain ? 10 : 0;

      // Realistic Constant-Product AMM Price Impact: size / (2 * poolLiquidity)
      const priceImpactPercent = liquidityUsd > 0 ? Math.min(50, (size / (2 * liquidityUsd)) * 100) : 100;
      const priceImpactCostUsd = size * (priceImpactPercent / 100);

      const slippagePercent = 0.1; // 0.1% base slippage
      const slippageCostUsd = size * (slippagePercent / 100);

      const totalCostsUsd =
        exchangeFeesUsd +
        dexFeesUsd +
        gasFeesUsd +
        bridgeFeesUsd +
        slippageCostUsd +
        priceImpactCostUsd;

      const netProfitUsd = grossProfitUsd - totalCostsUsd;
      const netEdgePercent = (netProfitUsd / size) * 100;

      let isValidArbitrage = netProfitUsd > 0 && netEdgePercent > 0.05;
      let rejectionReason: string | undefined = undefined;

      if (netProfitUsd <= 0) {
        isValidArbitrage = false;
        rejectionReason = `Net profit is negative (-$${Math.abs(netProfitUsd).toFixed(2)}) due to gas, fees, and price impact`;
      } else if (size > liquidityUsd * 0.1) {
        isValidArbitrage = false;
        rejectionReason = `Trade size ($${size.toLocaleString()}) exceeds 10% pool liquidity ($${liquidityUsd.toLocaleString()})`;
      }

      return {
        tradeSizeUsd: size,
        grossSpreadPercent,
        grossProfitUsd,
        exchangeFeesUsd,
        dexFeesUsd,
        gasFeesUsd,
        estimatedSlippagePercent: slippagePercent,
        slippageCostUsd,
        estimatedPriceImpactPercent: priceImpactPercent,
        priceImpactCostUsd,
        bridgeFeesUsd,
        netEdgePercent,
        netProfitUsd,
        isValidArbitrage,
        rejectionReason,
      };
    });

    return {
      symbol,
      sourceA,
      sourceB,
      priceA: buyPrice,
      priceB: sellPrice,
      grossSpreadPercent,
      evaluations,
      timestamp: new Date().toISOString(),
    };
  }
}

export const arbitrageEngine = new ArbitrageEngine();
