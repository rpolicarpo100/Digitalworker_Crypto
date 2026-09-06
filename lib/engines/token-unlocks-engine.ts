export interface TokenUnlockEvent {
  symbol: string;
  projectName: string;
  unlockDate: string;
  daysRemaining: number;
  unlockedAmountUsd: number;
  unlockedTokensCount: number;
  percentOfCirculatingSupply: number;
  unlockCategory: "Team & Founders" | "Early Investors / VCs" | "Ecosystem Growth" | "Community Reserve";
  sellPressureImpact: "LOW" | "MODERATE" | "HIGH" | "SEVERE";
  recommendation: string;
}

export class TokenUnlocksEngine {
  private mockUnlocks: TokenUnlockEvent[] = [
    {
      symbol: "SOL",
      projectName: "Solana Protocol",
      unlockDate: "2026-09-18",
      daysRemaining: 12,
      unlockedAmountUsd: 145000000,
      unlockedTokensCount: 1100000,
      percentOfCirculatingSupply: 0.24,
      unlockCategory: "Ecosystem Growth",
      sellPressureImpact: "LOW",
      recommendation: "Minimal market impact expected due to high daily spot volume ($2.8B).",
    },
    {
      symbol: "AVAX",
      projectName: "Avalanche Network",
      unlockDate: "2026-09-15",
      daysRemaining: 9,
      unlockedAmountUsd: 285000000,
      unlockedTokensCount: 9500000,
      percentOfCirculatingSupply: 2.35,
      unlockCategory: "Early Investors / VCs",
      sellPressureImpact: "HIGH",
      recommendation: "Elevated risk of VC distribution; monitor exchange inflows 48h prior to unlock.",
    },
    {
      symbol: "PEPE",
      projectName: "Pepe Memecoin",
      unlockDate: "2026-09-22",
      daysRemaining: 16,
      unlockedAmountUsd: 18000000,
      unlockedTokensCount: 2000000000000,
      percentOfCirculatingSupply: 0.45,
      unlockCategory: "Community Reserve",
      sellPressureImpact: "MODERATE",
      recommendation: "Community ecosystem allocation; low immediate sell pressure likelihood.",
    },
    {
      symbol: "LINK",
      projectName: "Chainlink Network",
      unlockDate: "2026-09-28",
      daysRemaining: 22,
      unlockedAmountUsd: 85000000,
      unlockedTokensCount: 4500000,
      percentOfCirculatingSupply: 0.75,
      unlockCategory: "Team & Founders",
      sellPressureImpact: "MODERATE",
      recommendation: "Scheduled corporate treasury unlock; historically non-disruptive to spot orderbook.",
    },
  ];

  getUpcomingUnlocks(): TokenUnlockEvent[] {
    return this.mockUnlocks;
  }
}

export const tokenUnlocksEngine = new TokenUnlocksEngine();
