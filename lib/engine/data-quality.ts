import { ConfidenceLevel, DataQualityStatus } from "../cache/lru";

export type DataIssueType =
  | "NEGATIVE_PRICE"
  | "ZERO_PRICE"
  | "NEGATIVE_VOLUME"
  | "IMPOSSIBLE_MARKET_CAP"
  | "DUPLICATE_CANDLE"
  | "TIMESTAMP_INVERSION"
  | "FUTURE_TIMESTAMP"
  | "STALE_DATA"
  | "PROVIDER_DISAGREEMENT"
  | "INVALID_OHLC";

export interface DataQualityReport {
  valid: boolean;
  quality: DataQualityStatus;
  confidence: ConfidenceLevel;
  issues: DataIssueType[];
  dataAgeMs: number;
}

export interface Candle {
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class DataQualityEngine {
  checkPrice(price: number, timestampIso?: string): DataQualityReport {
    const issues: DataIssueType[] = [];
    const now = Date.now();
    const ts = timestampIso ? new Date(timestampIso).getTime() : now;
    const dataAgeMs = now - ts;

    if (price < 0) {
      issues.push("NEGATIVE_PRICE");
    }
    if (price === 0) {
      issues.push("ZERO_PRICE");
    }
    if (ts > now + 60000) {
      issues.push("FUTURE_TIMESTAMP");
    }
    if (dataAgeMs > 300000) {
      issues.push("STALE_DATA");
    }

    const valid = issues.length === 0;
    const quality: DataQualityStatus = !valid
      ? "INVALID"
      : dataAgeMs < 15000
      ? "LIVE"
      : dataAgeMs < 60000
      ? "FRESH"
      : "STALE";

    const confidence: ConfidenceLevel = issues.length > 0 ? "Low" : dataAgeMs < 30000 ? "High" : "Medium";

    return { valid, quality, confidence, issues, dataAgeMs };
  }

  checkCandles(candles: Candle[]): DataQualityReport {
    const issues: DataIssueType[] = [];
    if (!candles || candles.length === 0) {
      return {
        valid: false,
        quality: "INVALID",
        confidence: "Low",
        issues: ["STALE_DATA"],
        dataAgeMs: 0,
      };
    }

    const seenTimes = new Set<number>();
    let prevTime = 0;

    for (const c of candles) {
      if (c.open <= 0 || c.high <= 0 || c.low <= 0 || c.close <= 0) {
        if (!issues.includes("ZERO_PRICE")) issues.push("ZERO_PRICE");
      }
      if (c.high < c.low || c.open > c.high || c.close > c.high || c.open < c.low || c.close < c.low) {
        if (!issues.includes("INVALID_OHLC")) issues.push("INVALID_OHLC");
      }
      if (c.volume < 0) {
        if (!issues.includes("NEGATIVE_VOLUME")) issues.push("NEGATIVE_VOLUME");
      }
      if (seenTimes.has(c.openTime)) {
        if (!issues.includes("DUPLICATE_CANDLE")) issues.push("DUPLICATE_CANDLE");
      }
      seenTimes.add(c.openTime);

      if (prevTime > 0 && c.openTime < prevTime) {
        if (!issues.includes("TIMESTAMP_INVERSION")) issues.push("TIMESTAMP_INVERSION");
      }
      prevTime = c.openTime;
    }

    const valid = issues.length === 0;
    return {
      valid,
      quality: valid ? "LIVE" : "INVALID",
      confidence: valid ? "High" : "Low",
      issues,
      dataAgeMs: 0,
    };
  }

  checkProviderDisagreement(priceA: number, priceB: number, maxDivergencePercent = 5): DataQualityReport {
    const issues: DataIssueType[] = [];
    if (priceA <= 0 || priceB <= 0) {
      issues.push("ZERO_PRICE");
      return { valid: false, quality: "INVALID", confidence: "Low", issues, dataAgeMs: 0 };
    }

    const diff = Math.abs(priceA - priceB);
    const avg = (priceA + priceB) / 2;
    const divergencePercent = (diff / avg) * 100;

    if (divergencePercent > maxDivergencePercent) {
      issues.push("PROVIDER_DISAGREEMENT");
    }

    const valid = issues.length === 0;
    return {
      valid,
      quality: valid ? "LIVE" : "STALE",
      confidence: valid ? "High" : divergencePercent > 10 ? "Low" : "Medium",
      issues,
      dataAgeMs: 0,
    };
  }
}

export const dataQualityEngine = new DataQualityEngine();
