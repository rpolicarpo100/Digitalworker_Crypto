import { SourceType, DataStatus, DataProvenanceMetric } from "../types/provenance";

export interface ProviderPriorityConfig {
  name: string;
  sourceType: SourceType;
  priority: number; // 1 = highest
}

export class ProviderHierarchyManager {
  private static providers: ProviderPriorityConfig[] = [
    { name: "SEC EDGAR / Official Filing", sourceType: "OFFICIAL_FILING", priority: 1 },
    { name: "Central Bank / Regulatory", sourceType: "REGULATORY", priority: 2 },
    { name: "Binance / CoinGecko Primary", sourceType: "REPUTABLE_PROVIDER", priority: 3 },
    { name: "Bloomberg / Reuters Financial Media", sourceType: "REPUTABLE_MEDIA", priority: 4 },
    { name: "DEX On-Chain Specialist", sourceType: "SPECIALIST", priority: 5 },
    { name: "Social Media / Community Sentiment", sourceType: "SOCIAL", priority: 6 },
  ];

  public static selectBestProvider<T>(
    candidates: Array<{ providerName: string; metric: DataProvenanceMetric<T> }>
  ): DataProvenanceMetric<T> {
    if (!candidates || candidates.length === 0) {
      return {
        value: null as unknown as T,
        timestamp: new Date().toISOString(),
        source: "UNKNOWN",
        sourceType: "DERIVED",
        freshnessMinutes: 9999,
        dataQualityScore: 0,
        confidence: 0,
        dataStatus: "UNAVAILABLE",
        evidenceNotes: "No candidate providers responded",
      };
    }

    // Filter out unavailable candidates
    const valid = candidates.filter((c) => c.metric.dataStatus !== "UNAVAILABLE");
    if (valid.length === 0) {
      return candidates[0].metric;
    }

    // Sort by data quality score descending, then provider priority
    valid.sort((a, b) => b.metric.dataQualityScore - a.metric.dataQualityScore);

    return valid[0].metric;
  }
}
