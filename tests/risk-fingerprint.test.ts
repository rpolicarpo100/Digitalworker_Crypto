import { describe, it, expect } from "vitest";
import { RiskFingerprintEngine } from "../lib/engines/risk-fingerprint-engine";
import { DilutionEngine } from "../lib/engines/dilution-engine";

describe("Small Cap Risk Fingerprint & Dilution Engine", () => {
  it("should generate 8-dimension risk fingerprint for Crypto asset (BTC)", () => {
    const risk = RiskFingerprintEngine.generateFingerprint("BTC");
    expect(risk.canonicalId).toBe("crypto:btc:mainnet");
    expect(risk.regulatoryRisk).toBeGreaterThan(0);
    expect(risk.volatilityRisk).toBeGreaterThan(0);
    expect(risk.aggregateRiskScore).toBeGreaterThan(0);
  });

  it("should analyze dilution risk for Small Cap equities", () => {
    const dilution = DilutionEngine.analyzeDilution("SOL");
    expect(dilution.canonicalId).toBe("crypto:sol:solana");
    expect(dilution.tokenVestingSupplyPressurePercent.value).toBeGreaterThan(0);
    expect(dilution.dilutionScore).toBeGreaterThan(0);
  });
});
