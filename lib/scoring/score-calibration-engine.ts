import { MultiScoreBreakdown } from "./professional-score-engine";

export interface ScoreCalibrationLog {
  id: string;
  symbol: string;
  canonicalId: string;
  scoreDate: string;
  opportunityScore: number;
  qualityScore: number;
  marketRegime: "RISK_ON" | "RISK_OFF" | "HIGH_VOLATILITY" | "SIDEWAYS";
  horizonDays: number;
  actualReturnPercent?: number;
  maxDrawdownPercent?: number;
  outcomeStatus: "SUCCESS" | "UNDERPERFORMED" | "PENDING";
}

export class ScoreCalibrationEngine {
  private static calibrationLogs: ScoreCalibrationLog[] = [
    {
      id: "calib-001",
      symbol: "NVDA",
      canonicalId: "equity:nvda:nasdaq",
      scoreDate: "2026-03-15",
      opportunityScore: 88,
      qualityScore: 92,
      marketRegime: "RISK_ON",
      horizonDays: 90,
      actualReturnPercent: 24.8,
      maxDrawdownPercent: -5.2,
      outcomeStatus: "SUCCESS",
    },
    {
      id: "calib-002",
      symbol: "BTC",
      canonicalId: "crypto:btc:mainnet",
      scoreDate: "2026-04-01",
      opportunityScore: 84,
      qualityScore: 88,
      marketRegime: "RISK_ON",
      horizonDays: 90,
      actualReturnPercent: 18.2,
      maxDrawdownPercent: -8.4,
      outcomeStatus: "SUCCESS",
    },
    {
      id: "calib-003",
      symbol: "O",
      canonicalId: "reit:o:nyse",
      scoreDate: "2026-05-10",
      opportunityScore: 76,
      qualityScore: 85,
      marketRegime: "SIDEWAYS",
      horizonDays: 90,
      actualReturnPercent: 6.4,
      maxDrawdownPercent: -2.1,
      outcomeStatus: "SUCCESS",
    },
  ];

  public static getCalibrationHistory(symbol?: string): ScoreCalibrationLog[] {
    if (symbol) {
      const upper = symbol.toUpperCase();
      return this.calibrationLogs.filter((log) => log.symbol === upper);
    }
    return this.calibrationLogs;
  }

  public static getReliabilityStats(): {
    totalEvaluated: number;
    successRatePercent: number;
    averageReturnPercent: number;
    averageDrawdownPercent: number;
  } {
    const completed = this.calibrationLogs.filter((l) => l.outcomeStatus !== "PENDING");
    if (completed.length === 0) {
      return { totalEvaluated: 0, successRatePercent: 0, averageReturnPercent: 0, averageDrawdownPercent: 0 };
    }

    const successes = completed.filter((l) => l.outcomeStatus === "SUCCESS").length;
    const totalReturn = completed.reduce((acc, l) => acc + (l.actualReturnPercent || 0), 0);
    const totalDrawdown = completed.reduce((acc, l) => acc + (l.maxDrawdownPercent || 0), 0);

    return {
      totalEvaluated: completed.length,
      successRatePercent: Math.round((successes / completed.length) * 100),
      averageReturnPercent: parseFloat((totalReturn / completed.length).toFixed(2)),
      averageDrawdownPercent: parseFloat((totalDrawdown / completed.length).toFixed(2)),
    };
  }
}
