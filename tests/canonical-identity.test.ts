import { describe, it, expect } from "vitest";
import { CanonicalAssetResolver } from "../lib/identity/canonical-asset";
import { createVerifiedMetric, createUnavailableMetric } from "../lib/types/provenance";
import { ProviderHierarchyManager } from "../lib/providers/hierarchy-manager";

describe("Canonical Asset Identity & Data Provenance", () => {
  it("should resolve BTC into crypto:btc:mainnet canonical identity", () => {
    const btc = CanonicalAssetResolver.resolve("BTC");
    expect(btc.canonicalId).toBe("crypto:btc:mainnet");
    expect(btc.assetClass).toBe("CRYPTO");
    expect(btc.isCanonical).toBe(true);
  });

  it("should resolve AAPL into equity:aapl:nasdaq canonical identity with ISIN", () => {
    const aapl = CanonicalAssetResolver.resolve("AAPL");
    expect(aapl.canonicalId).toBe("equity:aapl:nasdaq");
    expect(aapl.isin).toBe("US0378331005");
    expect(aapl.assetClass).toBe("EQUITY");
  });

  it("should create verified provenance metric with dataQualityScore", () => {
    const metric = createVerifiedMetric(182.5, "SEC Form 10-K", "OFFICIAL_FILING", "USD");
    expect(metric.dataStatus).toBe("VERIFIED");
    expect(metric.dataQualityScore).toBeGreaterThanOrEqual(95);
    expect(metric.sourceType).toBe("OFFICIAL_FILING");
  });

  it("should handle unavailable metric without hallucinating", () => {
    const unavail = createUnavailableMetric("Data source unreachable");
    expect(unavail.dataStatus).toBe("UNAVAILABLE");
    expect(unavail.dataQualityScore).toBe(0);
    expect(unavail.confidence).toBe(0);
  });

  it("should select highest quality metric from provider candidates", () => {
    const best = ProviderHierarchyManager.selectBestProvider([
      {
        providerName: "Social Media",
        metric: {
          value: 100,
          timestamp: new Date().toISOString(),
          source: "X / Twitter",
          sourceType: "SOCIAL",
          freshnessMinutes: 5,
          dataQualityScore: 30,
          confidence: 20,
          dataStatus: "PROXY",
        },
      },
      {
        providerName: "SEC Official Filing",
        metric: createVerifiedMetric(105, "SEC EDGAR", "OFFICIAL_FILING"),
      },
    ]);

    expect(best.sourceType).toBe("OFFICIAL_FILING");
    expect(best.dataQualityScore).toBeGreaterThan(90);
  });
});
