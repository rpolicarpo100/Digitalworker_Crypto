import { describe, it, expect } from "vitest";
import { macroEventsEngine } from "../lib/engines/macro-events-engine";

describe("Macro Economic Events Engine", () => {
  it("should return central bank rate decisions and inflation reports", () => {
    const events = macroEventsEngine.getUpcomingEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].volatilityRating).toBeDefined();
  });
});
