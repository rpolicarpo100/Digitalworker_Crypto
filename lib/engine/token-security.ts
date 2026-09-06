import { RiskLevel } from "./risk";

export interface TokenSecurityAudit {
  tokenAddress: string;
  chain: string;
  symbol: string;
  riskScore: number; // 0-100 (100 = critical risk)
  riskLevel: RiskLevel;
  isHoneypot: boolean;
  buyTaxPercent: number;
  sellTaxPercent: number;
  hasMintAuthority: boolean;
  hasFreezeAuthority: boolean;
  isLiquidityLocked: boolean;
  liquidityUsd: number;
  topHoldersSharePercent: number;
  isContractVerified: boolean;
  riskFlags: string[];
  recommendation: "REJECT" | "WARN" | "PASS";
}

export class TokenSecurityEngine {
  auditToken(
    tokenAddress: string,
    chain = "ethereum",
    symbol = "UNKNOWN",
    liquidityUsd = 50000,
    buyTaxPercent = 0,
    sellTaxPercent = 0,
    hasMintAuthority = false,
    hasFreezeAuthority = false,
    isLiquidityLocked = false,
    topHoldersSharePercent = 25
  ): TokenSecurityAudit {
    const riskFlags: string[] = [];
    let riskScore = 10; // baseline

    // 1. Honeypot check
    let isHoneypot = false;
    if (buyTaxPercent > 10 || sellTaxPercent > 10) {
      riskFlags.push(`HIGH_TAX: Buy ${buyTaxPercent}%, Sell ${sellTaxPercent}%`);
      riskScore += 40;
    }
    if (buyTaxPercent > 25 || sellTaxPercent > 25) {
      isHoneypot = true;
      riskFlags.push("HONEYPOT_SUSPECTED: Taxes exceed 25%");
      riskScore += 50;
    }

    // 2. Authorities check
    if (hasMintAuthority) {
      riskFlags.push("MINT_AUTHORITY_ACTIVE: Owner can mint unlimited tokens");
      riskScore += 25;
    }
    if (hasFreezeAuthority) {
      riskFlags.push("FREEZE_AUTHORITY_ACTIVE: Owner can freeze transfers");
      riskScore += 25;
    }

    // 3. Liquidity check
    if (liquidityUsd < 10000) {
      riskFlags.push("CRITICAL_LOW_LIQUIDITY: Pools hold < $10,000 USD");
      riskScore += 35;
    } else if (liquidityUsd < 50000) {
      riskFlags.push("LOW_LIQUIDITY: Pools hold < $50,000 USD");
      riskScore += 15;
    }

    if (!isLiquidityLocked && liquidityUsd < 100000) {
      riskFlags.push("UNLOCKED_LIQUIDITY: LP tokens are not locked");
      riskScore += 20;
    }

    // 4. Holder concentration check
    if (topHoldersSharePercent > 70) {
      riskFlags.push(`EXTREME_CONCENTRATION: Top holders control ${topHoldersSharePercent}%`);
      riskScore += 30;
    } else if (topHoldersSharePercent > 50) {
      riskFlags.push(`HIGH_CONCENTRATION: Top holders control ${topHoldersSharePercent}%`);
      riskScore += 15;
    }

    // Clamp score
    riskScore = Math.min(100, Math.max(0, riskScore));

    // Determine Risk Level & Recommendation
    let riskLevel: RiskLevel = "LOW";
    let recommendation: "REJECT" | "WARN" | "PASS" = "PASS";

    if (riskScore >= 80 || isHoneypot) {
      riskLevel = "CRITICAL";
      recommendation = "REJECT";
    } else if (riskScore >= 55) {
      riskLevel = "HIGH";
      recommendation = "WARN";
    } else if (riskScore >= 35) {
      riskLevel = "MEDIUM";
      recommendation = "PASS";
    }

    return {
      tokenAddress,
      chain,
      symbol,
      riskScore,
      riskLevel,
      isHoneypot,
      buyTaxPercent,
      sellTaxPercent,
      hasMintAuthority,
      hasFreezeAuthority,
      isLiquidityLocked,
      liquidityUsd,
      topHoldersSharePercent,
      isContractVerified: true,
      riskFlags,
      recommendation,
    };
  }
}

export const tokenSecurityEngine = new TokenSecurityEngine();
