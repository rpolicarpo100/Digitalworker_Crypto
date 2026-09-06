import { describe, it, expect, beforeEach } from "vitest";
import { AlertEngine } from "../lib/engine/alerts";

describe("AlertEngine", () => {
  let engine: AlertEngine;

  beforeEach(() => {
    engine = new AlertEngine();
    engine.clearAlerts();
  });

  it("should generate system alert for high GOD score opportunities", () => {
    const alert = engine.evaluateOpportunityAlert("BTC", 85, "LOW", false);
    expect(alert).not.toBeNull();
    expect(alert?.symbol).toBe("BTC");
    expect(alert?.severity).toBe("INFO");
    expect(engine.getActiveAlerts()).toHaveLength(1);
  });

  it("should suppress duplicate alerts within cooldown window", () => {
    const alert1 = engine.evaluateOpportunityAlert("ETH", 88, "LOW", false);
    expect(alert1).not.toBeNull();

    // Immediate duplicate call within 60s cooldown
    const alert2 = engine.evaluateOpportunityAlert("ETH", 88, "LOW", false);
    expect(alert2).toBeNull();
    expect(engine.getActiveAlerts()).toHaveLength(1);
  });

  it("should generate critical alert for severe token risk flags", () => {
    const alert = engine.evaluateRiskAlert("SCAM", ["HONEYPOT_SUSPECTED"], "CRITICAL");
    expect(alert).not.toBeNull();
    expect(alert?.severity).toBe("CRITICAL");
  });
});
