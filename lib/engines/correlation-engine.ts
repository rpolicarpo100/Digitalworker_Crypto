import { binanceProvider } from "../providers/binance";

export interface CorrelationMatrixResult {
  assets: string[];
  matrix: number[][];
  highRiskOverExposures: Array<{ assetA: string; assetB: string; correlation: number }>;
  timestamp: string;
}

export class CorrelationEngine {
  async calculateCorrelationMatrix(assets: string[] = ["BTC", "ETH", "SOL", "BNB", "AVAX", "PEPE", "LINK", "XRP"]): Promise<CorrelationMatrixResult> {
    const priceSeriesMap = new Map<string, number[]>();

    await Promise.all(
      assets.map(async (asset) => {
        try {
          const candles = await binanceProvider.getCandles(`${asset}USDT`, "1h", 60);
          if (candles && candles.length > 5) {
            const returns: number[] = [];
            for (let i = 1; i < candles.length; i++) {
              returns.push((candles[i].close - candles[i - 1].close) / candles[i - 1].close);
            }
            priceSeriesMap.set(asset, returns);
          }
        } catch (e) {
          console.error(`Failed correlation fetch for ${asset}:`, e);
        }
      })
    );

    const validAssets = assets.filter((a) => priceSeriesMap.has(a));
    const n = validAssets.length;
    const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(1));
    const highRiskOverExposures: Array<{ assetA: string; assetB: string; correlation: number }> = [];

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const assetA = validAssets[i];
        const assetB = validAssets[j];
        const seriesA = priceSeriesMap.get(assetA)!;
        const seriesB = priceSeriesMap.get(assetB)!;

        const corr = this.pearsonCorrelation(seriesA, seriesB);
        matrix[i][j] = Math.round(corr * 100) / 100;
        matrix[j][i] = Math.round(corr * 100) / 100;

        if (corr > 0.85) {
          highRiskOverExposures.push({ assetA, assetB, correlation: Math.round(corr * 100) / 100 });
        }
      }
    }

    return {
      assets: validAssets,
      matrix,
      highRiskOverExposures,
      timestamp: new Date().toISOString(),
    };
  }

  private pearsonCorrelation(x: number[], y: number[]): number {
    const len = Math.min(x.length, y.length);
    if (len === 0) return 0;

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    for (let i = 0; i < len; i++) {
      sumX += x[i];
      sumY += y[i];
      sumXY += x[i] * y[i];
      sumX2 += x[i] * x[i];
      sumY2 += y[i] * y[i];
    }

    const numerator = len * sumXY - sumX * sumY;
    const denominator = Math.sqrt((len * sumX2 - sumX * sumX) * (len * sumY2 - sumY * sumY));

    if (denominator === 0) return 0;
    return numerator / denominator;
  }
}

export const correlationEngine = new CorrelationEngine();
