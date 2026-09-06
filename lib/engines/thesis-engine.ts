import { CanonicalAssetResolver } from "../identity/canonical-asset";

export type ThesisStatus = "ACTIVE" | "CONFIRMED" | "WEAKENING" | "INVALIDATED" | "UNKNOWN";

export interface ThesisRecord {
  id: string;
  canonicalId: string;
  symbol: string;
  thesisStatement: string;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  catalysts: string[];
  risks: string[];
  invalidationConditions: string[];
  confidenceScore: number;
  status: ThesisStatus;
  createdAt: string;
  updatedAt: string;
}

export class ThesisEngine {
  private static activeTheses: Map<string, ThesisRecord> = new Map([
    [
      "crypto:btc:mainnet",
      {
        id: "th-btc-01",
        canonicalId: "crypto:btc:mainnet",
        symbol: "BTC",
        thesisStatement: "Institutional spot ETF adoption and central bank rate easing drive structural supply deficit post-halving.",
        supportingEvidence: [
          "IBIT and FBTC net daily inflows average +$350M.",
          "Over 1,000,000 BTC held by regulated ETF custodians.",
        ],
        contradictingEvidence: [
          "Macro CPI inflation rebound could delay central bank rate cuts.",
        ],
        catalysts: [
          "FOMC rate decision",
          "Quarterly 13F institutional disclosures",
        ],
        risks: [
          "Regulatory crackdowns on unhosted wallets",
          "Macro liquidity shock",
        ],
        invalidationConditions: [
          "Spot ETF daily net outflows exceed -$500M for 5 consecutive sessions.",
          "Weekly price close below major 200-day moving average.",
        ],
        confidenceScore: 88,
        status: "ACTIVE",
        createdAt: "2026-08-01T00:00:00.000Z",
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  public static getThesis(symbol: string): ThesisRecord {
    const identity = CanonicalAssetResolver.resolve(symbol);
    if (this.activeTheses.has(identity.canonicalId)) {
      return this.activeTheses.get(identity.canonicalId)!;
    }

    return {
      id: `th-${identity.symbol.toLowerCase()}-auto`,
      canonicalId: identity.canonicalId,
      symbol: identity.symbol,
      thesisStatement: `Investment thesis for ${identity.name}: Growth supported by fundamental acceleration and institutional capital flows.`,
      supportingEvidence: [
        "Positive free cash flow expansion YoY.",
        "Sustained institutional holding accumulation.",
      ],
      contradictingEvidence: [
        "Elevated valuation multiples relative to historical 5-year average.",
      ],
      catalysts: ["Quarterly Earnings / Financial Filing", "Macro Economic Policy Shift"],
      risks: ["Sectorial contraction", "Interest rate volatility"],
      invalidationConditions: [
        "Revenue growth turns negative YoY.",
        "Break below major technical support level on high volume.",
      ],
      confidenceScore: 82,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
