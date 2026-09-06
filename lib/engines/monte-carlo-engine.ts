export interface MonteCarloParams {
  initialPortfolioUsd?: number;
  timeHorizonDays?: number;
  simulationsCount?: number;
  annualDriftMean?: number;
  annualVolatility?: number;
}

export interface MonteCarloResult {
  initialPortfolioUsd: number;
  simulationsCount: number;
  timeHorizonDays: number;
  percentile5thUsd: number;
  percentile50thUsd: number;
  percentile95thUsd: number;
  var95PercentUsd: number;
  var99PercentUsd: number;
  maxDrawdownDistributionPercent: {
    mean: number;
    p95Worst: number;
  };
  sampleTrajectories: number[][];
  timestamp: string;
}

export class MonteCarloEngine {
  runSimulation(params: MonteCarloParams = {}): MonteCarloResult {
    const {
      initialPortfolioUsd = 10000,
      timeHorizonDays = 30,
      simulationsCount = 10000,
      annualDriftMean = 0.20,
      annualVolatility = 0.55,
    } = params;

    const dt = 1 / 365;
    const dailyDrift = (annualDriftMean - 0.5 * annualVolatility * annualVolatility) * dt;
    const dailyVol = annualVolatility * Math.sqrt(dt);

    const finalValues: number[] = [];
    const maxDrawdowns: number[] = [];
    const sampleTrajectories: number[][] = [];

    for (let sim = 0; sim < simulationsCount; sim++) {
      let currentVal = initialPortfolioUsd;
      let peakVal = currentVal;
      let maxDD = 0;
      const trajectory: number[] = [currentVal];

      for (let day = 0; day < timeHorizonDays; day++) {
        const u1 = Math.max(Math.random(), 1e-10);
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

        currentVal = currentVal * Math.exp(dailyDrift + dailyVol * z);
        if (sim < 5) trajectory.push(Math.round(currentVal * 100) / 100);

        if (currentVal > peakVal) peakVal = currentVal;
        const dd = (peakVal - currentVal) / peakVal;
        if (dd > maxDD) maxDD = dd;
      }

      finalValues.push(currentVal);
      maxDrawdowns.push(maxDD * 100);

      if (sim < 5) sampleTrajectories.push(trajectory);
    }

    finalValues.sort((a, b) => a - b);
    maxDrawdowns.sort((a, b) => a - b);

    const p5Idx = Math.floor(simulationsCount * 0.05);
    const p50Idx = Math.floor(simulationsCount * 0.50);
    const p95Idx = Math.floor(simulationsCount * 0.95);
    const p99Idx = Math.floor(simulationsCount * 0.01);

    const p5 = finalValues[p5Idx];
    const p50 = finalValues[p50Idx];
    const p95 = finalValues[p95Idx];
    const p99 = finalValues[p99Idx];

    const var95Usd = Math.max(0, initialPortfolioUsd - p5);
    const var99Usd = Math.max(0, initialPortfolioUsd - p99);

    const meanMaxDD = maxDrawdowns.reduce((a, b) => a + b, 0) / simulationsCount;
    const p95WorstDD = maxDrawdowns[Math.floor(simulationsCount * 0.95)];

    return {
      initialPortfolioUsd,
      simulationsCount,
      timeHorizonDays,
      percentile5thUsd: Math.round(p5 * 100) / 100,
      percentile50thUsd: Math.round(p50 * 100) / 100,
      percentile95thUsd: Math.round(p95 * 100) / 100,
      var95PercentUsd: Math.round(var95Usd * 100) / 100,
      var99PercentUsd: Math.round(var99Usd * 100) / 100,
      maxDrawdownDistributionPercent: {
        mean: Math.round(meanMaxDD * 100) / 100,
        p95Worst: Math.round(p95WorstDD * 100) / 100,
      },
      sampleTrajectories,
      timestamp: new Date().toISOString(),
    };
  }
}

export const monteCarloEngine = new MonteCarloEngine();
