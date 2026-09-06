import { describe, it, expect } from "vitest";
import { tokenUnlocksEngine } from "../lib/engines/token-unlocks-engine";

describe("Crypto Token Unlocks Engine", () => {
  it("should return upcoming supply pressure unlocks", () => {
    const unlocks = tokenUnlocksEngine.getUpcomingUnlocks();
    expect(unlocks.length).toBeGreaterThan(0);
    expect(unlocks[0].symbol).toBeDefined();
  });
});
