import { describe, it, expect, beforeEach } from "vitest";
import { ExecutionSafetyEngine } from "../lib/engine/execution-safety";

describe("ExecutionSafetyEngine", () => {
  let engine: ExecutionSafetyEngine;

  beforeEach(() => {
    engine = new ExecutionSafetyEngine();
    engine.deactivateEmergencyStop();
    engine.revokeUserConsent();
    engine.resetDailyLoss();
  });

  it("should reject live order when user consent is missing", () => {
    const check = engine.validateLiveTradeExecution(500, 0.2, 20);
    expect(check.canExecute).toBe(false);
    expect(check.rejectionReason).toContain("user consent");
  });

  it("should reject order when global Emergency Stop / Kill Switch is active", () => {
    engine.grantUserConsent("explicit_user_consent_token_12345");
    engine.activateEmergencyStop("Test kill switch");

    const check = engine.validateLiveTradeExecution(500, 0.2, 20);
    expect(check.canExecute).toBe(false);
    expect(check.rejectionReason).toContain("Emergency Kill Switch is ACTIVE");
  });

  it("should reject order when order size exceeds max position size limit", () => {
    engine.grantUserConsent("explicit_user_consent_token_12345");

    const check = engine.validateLiveTradeExecution(5000, 0.2, 20); // $5k > $2k cap
    expect(check.canExecute).toBe(false);
    expect(check.rejectionReason).toContain("exceeds max position size limit");
  });
});
