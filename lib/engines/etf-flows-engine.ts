export interface EtfFlowData {
  etfTicker: string;
  etfName: string;
  underlyingAsset: string;
  netFlow24hUsd: number;
  netFlow7dUsd: number;
  totalAumUsd: number;
  creationUnitsCount: number;
  flowTrend: "HEAVY_INFLOW" | "MODERATE_INFLOW" | "NEUTRAL" | "OUTFLOW";
}

export class EtfFlowsEngine {
  getEtfFlows(): EtfFlowData[] {
    return [
      {
        etfTicker: "IBIT",
        etfName: "iShares Bitcoin Trust (BlackRock)",
        underlyingAsset: "BTC",
        netFlow24hUsd: 320000000,
        netFlow7dUsd: 1450000000,
        totalAumUsd: 22400000000,
        creationUnitsCount: 8200,
        flowTrend: "HEAVY_INFLOW",
      },
      {
        etfTicker: "FBTC",
        etfName: "Fidelity Wise Origin Bitcoin Fund",
        underlyingAsset: "BTC",
        netFlow24hUsd: 145000000,
        netFlow7dUsd: 620000000,
        totalAumUsd: 11800000000,
        creationUnitsCount: 3700,
        flowTrend: "HEAVY_INFLOW",
      },
      {
        etfTicker: "ETHA",
        etfName: "iShares Ethereum Trust (BlackRock)",
        underlyingAsset: "ETH",
        netFlow24hUsd: 85000000,
        netFlow7dUsd: 310000000,
        totalAumUsd: 2100000000,
        creationUnitsCount: 2100,
        flowTrend: "MODERATE_INFLOW",
      },
      {
        etfTicker: "QQQ",
        etfName: "Invesco QQQ Trust (Nasdaq 100)",
        underlyingAsset: "Nasdaq 100 Tech",
        netFlow24hUsd: 680000000,
        netFlow7dUsd: 2800000000,
        totalAumUsd: 285000000000,
        creationUnitsCount: 14500,
        flowTrend: "HEAVY_INFLOW",
      },
    ];
  }
}

export const etfFlowsEngine = new EtfFlowsEngine();
