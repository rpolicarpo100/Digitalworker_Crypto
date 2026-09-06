export interface MacroEconomicEvent {
  id: string;
  eventName: string;
  institution: "FED (Federal Reserve)" | "ECB (European Central Bank)" | "US Bureau of Labor" | "US Census Bureau";
  eventDate: string;
  forecastValue: string;
  previousValue: string;
  actualValue?: string;
  volatilityRating: "CRITICAL" | "HIGH" | "MODERATE";
  impactedAssets: string[];
  strategicAdvice: string;
}

export class MacroEventsEngine {
  private mockEvents: MacroEconomicEvent[] = [
    {
      id: "macro_001",
      eventName: "FOMC Federal Funds Rate Decision",
      institution: "FED (Federal Reserve)",
      eventDate: "2026-09-17 18:00 UTC",
      forecastValue: "5.00% (-25 bps cut)",
      previousValue: "5.25%",
      volatilityRating: "CRITICAL",
      impactedAssets: ["BTC", "ETH", "S&P 500", "EUR/USD", "GOLD"],
      strategicAdvice: "High volatility expected 30m before and after press conference. Tighten stop-losses or reduce leverage.",
    },
    {
      id: "macro_002",
      eventName: "US CPI Inflation YoY Report",
      institution: "US Bureau of Labor",
      eventDate: "2026-09-11 12:30 UTC",
      forecastValue: "2.6%",
      previousValue: "2.9%",
      volatilityRating: "HIGH",
      impactedAssets: ["BTC", "ETH", "NVDA", "ASML", "BONDS"],
      strategicAdvice: "Lower than expected CPI accelerates rate cut bets, bullish for Risk-On assets.",
    },
    {
      id: "macro_003",
      eventName: "ECB Main Refinancing Rate Decision",
      institution: "ECB (European Central Bank)",
      eventDate: "2026-09-12 12:15 UTC",
      forecastValue: "3.50%",
      previousValue: "3.75%",
      volatilityRating: "HIGH",
      impactedAssets: ["MC", "SHEL", "EUR/USD", "Euronext Stocks"],
      strategicAdvice: "Monitored for European luxury and industrial sector margin impacts.",
    },
  ];

  getUpcomingEvents(): MacroEconomicEvent[] {
    return this.mockEvents;
  }
}

export const macroEventsEngine = new MacroEventsEngine();
