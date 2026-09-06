import { describe, it, expect } from "vitest";
import { TokenSecurityEngine } from "../lib/engine/token-security";

describe("TokenSecurityEngine", () => {
  const engine = new TokenSecurityEngine();

  it("should mark tokens with taxes > 25% as HONEYPOT and REJECT", () => {
    const audit = engine.auditToken("0x123", "ethereum", "SCAM", 100000, 30, 30);
    expect(audit.isHoneypot).toBe(true);
    expect(audit.riskLevel).toBe("CRITICAL");
    expect(audit.recommendation).toBe("REJECT");
  });

  it("should penalize active mint and freeze authorities", () => {
    const audit = engine.auditToken("0x456", "solana", "RISKY", 50000, 0, 0, true, true);
    expect(audit.riskScore).toBeGreaterThanOrEqual(50);
    expect(audit.riskFlags.some((f) => f.includes("MINT_AUTHORITY"))).toBe(true);
    expect(audit.riskFlags.some((f) => f.includes("FREEZE_AUTHORITY"))).toBe(true);
  });

  it("should pass clean tokens with good liquidity and locked LP", () => {
    const audit = engine.auditToken("0x789", "ethereum", "CLEAN", 500000, 0, 0, false, false, true, 20);
    expect(audit.riskScore).toBeLessThan(35);
    expect(audit.recommendation).toBe("PASS");
  });
});
