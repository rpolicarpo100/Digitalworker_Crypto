export interface SectorData {
  sector: string;
  performance30dPercent: number;
  momentumScore: number; // 0 - 100
  valuationStatus: "UNDERVALUED" | "FAIR" | "OVERVALUED";
  capitalFlowsStatus: "INFLOW" | "NEUTRAL" | "OUTFLOW";
  rotationState: "STRONGEST" | "WEAKEST" | "IMPROVING" | "DETERIORATING";
  topConstituent: string;
}

export class SectorEngine {
  getSectorRotationData(): SectorData[] {
    return [
      {
        sector: "Technology",
        performance30dPercent: 6.8,
        momentumScore: 88,
        valuationStatus: "OVERVALUED",
        capitalFlowsStatus: "INFLOW",
        rotationState: "STRONGEST",
        topConstituent: "NVDA",
      },
      {
        sector: "Cryptocurrency",
        performance30dPercent: 9.4,
        momentumScore: 92,
        valuationStatus: "FAIR",
        capitalFlowsStatus: "INFLOW",
        rotationState: "STRONGEST",
        topConstituent: "BTC",
      },
      {
        sector: "Energy",
        performance30dPercent: 4.2,
        momentumScore: 74,
        valuationStatus: "UNDERVALUED",
        capitalFlowsStatus: "INFLOW",
        rotationState: "IMPROVING",
        topConstituent: "SHEL",
      },
      {
        sector: "Healthcare",
        performance30dPercent: 1.8,
        momentumScore: 58,
        valuationStatus: "FAIR",
        capitalFlowsStatus: "NEUTRAL",
        rotationState: "IMPROVING",
        topConstituent: "LLY",
      },
      {
        sector: "Financials",
        performance30dPercent: 2.5,
        momentumScore: 66,
        valuationStatus: "UNDERVALUED",
        capitalFlowsStatus: "INFLOW",
        rotationState: "IMPROVING",
        topConstituent: "JPM",
      },
      {
        sector: "Real Estate (REITs)",
        performance30dPercent: -3.2,
        momentumScore: 35,
        valuationStatus: "UNDERVALUED",
        capitalFlowsStatus: "OUTFLOW",
        rotationState: "DETERIORATING",
        topConstituent: "PLD",
      },
      {
        sector: "Consumer Discretionary",
        performance30dPercent: -1.5,
        momentumScore: 42,
        valuationStatus: "FAIR",
        capitalFlowsStatus: "OUTFLOW",
        rotationState: "WEAKEST",
        topConstituent: "MC",
      },
    ];
  }
}

export const sectorEngine = new SectorEngine();
