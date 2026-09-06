import { describe, it, expect } from "vitest";
import { tier1NewsEngine } from "../lib/engines/tier1-news-engine";

describe("Tier 1 Verified News Engine", () => {
  it("should return regulatory & Tier 1 headlines", () => {
    const news = tier1NewsEngine.getLatestNews();
    expect(news.length).toBeGreaterThan(0);
    expect(news[0].materialityScore).toBeGreaterThan(80);
  });
});
