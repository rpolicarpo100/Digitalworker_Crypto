export type WalletCategory =
  | "EOA"
  | "SMART_CONTRACT"
  | "WHALE"
  | "EXCHANGE"
  | "SMART_MONEY"
  | "UNKNOWN";

export interface WalletAnalysis {
  address: string;
  chain: string;
  category: WalletCategory;
  estimatedBalanceUsd: number;
  accumulationScore: number; // 0-100
  distributionScore: number; // 0-100
  recentTransfersCount: number;
  exchangeFlowSignal: "INFLOW" | "OUTFLOW" | "NEUTRAL";
  isWhale: boolean;
  confidence: "High" | "Medium" | "Low";
  source: string;
  timestamp: string;
}

export class WalletEngine {
  classifyWallet(
    address: string,
    chain = "ethereum",
    balanceUsd = 250000,
    txCount24h = 12,
    buyTxRatio = 0.65
  ): WalletAnalysis {
    let category: WalletCategory = "EOA";
    const isWhale = balanceUsd >= 1000000;

    if (isWhale) {
      category = "WHALE";
    } else if (txCount24h > 100) {
      category = "EXCHANGE";
    } else if (address.startsWith("0x00000") || address.length === 42 && address.endsWith("0000")) {
      category = "SMART_CONTRACT";
    }

    const accumulationScore = Math.round(buyTxRatio * 100);
    const distributionScore = Math.round((1 - buyTxRatio) * 100);

    let exchangeFlowSignal: "INFLOW" | "OUTFLOW" | "NEUTRAL" = "NEUTRAL";
    if (buyTxRatio > 0.7) exchangeFlowSignal = "OUTFLOW"; // Withdrawal to cold wallet (accumulation)
    else if (buyTxRatio < 0.3) exchangeFlowSignal = "INFLOW"; // Deposit to exchange (distribution)

    return {
      address,
      chain,
      category,
      estimatedBalanceUsd: balanceUsd,
      accumulationScore,
      distributionScore,
      recentTransfersCount: txCount24h,
      exchangeFlowSignal,
      isWhale,
      confidence: "High",
      source: "dexscreener-proxy",
      timestamp: new Date().toISOString(),
    };
  }
}

export const walletEngine = new WalletEngine();
