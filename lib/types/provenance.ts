export type SourceType =
  | "OFFICIAL_FILING"
  | "REGULATORY"
  | "REPUTABLE_PROVIDER"
  | "REPUTABLE_MEDIA"
  | "SPECIALIST"
  | "SOCIAL"
  | "DERIVED";

export type DataStatus =
  | "VERIFIED"
  | "STALE"
  | "ESTIMATED"
  | "PROXY"
  | "DATA_CONFLICT"
  | "UNAVAILABLE";

export interface DataProvenanceMetric<T = number | string | boolean> {
  value: T;
  unit?: string;
  currency?: string;
  timestamp: string;
  period?: string;
  source: string;
  sourceType: SourceType;
  freshnessMinutes: number;
  dataQualityScore: number; // 0 - 100
  confidence: number; // 0 - 100
  dataStatus: DataStatus;
  evidenceNotes?: string;
}

export function createVerifiedMetric<T>(
  value: T,
  source: string,
  sourceType: SourceType,
  unit?: string,
  currency: string = "USD"
): DataProvenanceMetric<T> {
  return {
    value,
    unit,
    currency,
    timestamp: new Date().toISOString(),
    source,
    sourceType,
    freshnessMinutes: 0,
    dataQualityScore: sourceType === "OFFICIAL_FILING" ? 98 : sourceType === "REGULATORY" ? 95 : 85,
    confidence: 90,
    dataStatus: "VERIFIED",
  };
}

export function createUnavailableMetric<T>(
  reason: string,
  currency: string = "USD"
): DataProvenanceMetric<T> {
  return {
    value: null as unknown as T,
    currency,
    timestamp: new Date().toISOString(),
    source: "NONE",
    sourceType: "DERIVED",
    freshnessMinutes: 999999,
    dataQualityScore: 0,
    confidence: 0,
    dataStatus: "UNAVAILABLE",
    evidenceNotes: reason,
  };
}
