export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";

export type AlertType =
  | "OPPORTUNITY_DETECTED"
  | "OPPORTUNITY_UPGRADED"
  | "OPPORTUNITY_INVALIDATED"
  | "PRICE_ANOMALY"
  | "VOLUME_SPIKE"
  | "TOKEN_RISK_CHANGE"
  | "LIQUIDITY_REMOVAL"
  | "ARBITRAGE_EDGE_DETECTED"
  | "PROVIDER_OUTAGE";

export interface SystemAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  symbol: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  timestamp: string;
  expiresAt: string;
}

export class AlertEngine {
  private activeAlerts: SystemAlert[] = [];
  private alertCooldowns: Map<string, number> = new Map(); // key -> lastTriggeredMs
  private cooldownMs = 60000; // 1 minute cooldown per alert type + symbol

  evaluateOpportunityAlert(
    symbol: string,
    score: number,
    riskLevel: string,
    isBreakout: boolean
  ): SystemAlert | null {
    const cooldownKey = `opp_${symbol}_${score > 75 ? "high" : "normal"}`;
    const now = Date.now();
    const lastTriggered = this.alertCooldowns.get(cooldownKey) || 0;

    if (now - lastTriggered < this.cooldownMs) {
      return null; // Suppress duplicate alert within cooldown period
    }

    let alert: SystemAlert | null = null;

    if (score >= 80) {
      alert = {
        id: `alt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: "OPPORTUNITY_DETECTED",
        severity: "INFO",
        symbol,
        title: `High GOD Score Opportunity Detected: ${symbol}`,
        message: `${symbol} reached a GOD Opportunity Score of ${score}/100 with ${riskLevel} risk level.`,
        data: { score, riskLevel, isBreakout },
        timestamp: new Date().toISOString(),
        expiresAt: new Date(now + 300000).toISOString(),
      };
    } else if (isBreakout) {
      alert = {
        id: `alt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: "PRICE_ANOMALY",
        severity: "WARNING",
        symbol,
        title: `Technical Breakout Detected: ${symbol}`,
        message: `${symbol} confirmed resistance/support breakout on current timeframe.`,
        data: { score, riskLevel, isBreakout },
        timestamp: new Date().toISOString(),
        expiresAt: new Date(now + 300000).toISOString(),
      };
    }

    if (alert) {
      this.alertCooldowns.set(cooldownKey, now);
      this.activeAlerts.unshift(alert);
      if (this.activeAlerts.length > 50) this.activeAlerts.pop();
    }

    return alert;
  }

  evaluateRiskAlert(symbol: string, riskFlags: string[], riskLevel: string): SystemAlert | null {
    if (riskFlags.length === 0 && riskLevel !== "CRITICAL") return null;

    const cooldownKey = `risk_${symbol}`;
    const now = Date.now();
    const lastTriggered = this.alertCooldowns.get(cooldownKey) || 0;

    if (now - lastTriggered < this.cooldownMs) return null;

    const alert: SystemAlert = {
      id: `alt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: "TOKEN_RISK_CHANGE",
      severity: riskLevel === "CRITICAL" ? "CRITICAL" : "WARNING",
      symbol,
      title: `Token Security Risk Flagged: ${symbol}`,
      message: `Critical risk level ${riskLevel} flagged for ${symbol}: ${riskFlags.join("; ")}`,
      data: { riskLevel, riskFlags },
      timestamp: new Date().toISOString(),
      expiresAt: new Date(now + 600000).toISOString(),
    };

    this.alertCooldowns.set(cooldownKey, now);
    this.activeAlerts.unshift(alert);
    if (this.activeAlerts.length > 50) this.activeAlerts.pop();

    return alert;
  }

  getActiveAlerts(): SystemAlert[] {
    const nowIso = new Date().toISOString();
    return this.activeAlerts.filter((a) => a.expiresAt > nowIso);
  }

  clearAlerts(): void {
    this.activeAlerts = [];
    this.alertCooldowns.clear();
  }
}

export const alertEngine = new AlertEngine();
