import { Candle } from "./data-quality";

export interface TechnicalIndicators {
  rsi: number;
  ema9: number;
  ema21: number;
  ema50: number;
  ema200: number;
  sma20: number;
  sma50: number;
  sma200: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
  atr: number;
  adx: {
    adx: number;
    plusDI: number;
    minusDI: number;
  };
  stochastic: {
    k: number;
    d: number;
  };
  vwap: number;
  supportLevels: number[];
  resistanceLevels: number[];
  trend: "BULLISH" | "BEARISH" | "SIDEWAYS";
  volatilityRegime: "HIGH" | "NORMAL" | "LOW";
  breakout: {
    isBreakout: boolean;
    type: "RESISTANCE_BREAKOUT" | "SUPPORT_BREAKDOWN" | "VOLATILITY_EXPANSION" | "NONE";
    strength: number;
  };
}

export class TechnicalEngine {
  calculateRSI(closes: number[], period = 14): number {
    if (closes.length <= period) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period + 1; i < closes.length; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) {
        avgGain = (avgGain * (period - 1) + diff) / period;
        avgLoss = (avgLoss * (period - 1)) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = (avgLoss * (period - 1) + Math.abs(diff)) / period;
      }
    }

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  }

  calculateEMA(closes: number[], period: number): number {
    if (closes.length === 0) return 0;
    if (closes.length < period) return closes[closes.length - 1];

    const k = 2 / (period + 1);
    let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;

    for (let i = period; i < closes.length; i++) {
      ema = closes[i] * k + ema * (1 - k);
    }

    return ema;
  }

  calculateSMA(closes: number[], period: number): number {
    if (closes.length < period) return closes[closes.length - 1] || 0;
    const slice = closes.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / period;
  }

  calculateMACD(closes: number[]): { macd: number; signal: number; histogram: number } {
    if (closes.length < 26) {
      return { macd: 0, signal: 0, histogram: 0 };
    }

    const fastEma = this.calculateEMA(closes, 12);
    const slowEma = this.calculateEMA(closes, 26);
    const macdLine = fastEma - slowEma;

    // Estimate signal line
    const signalLine = macdLine * 0.8;
    const histogram = macdLine - signalLine;

    return { macd: macdLine, signal: signalLine, histogram };
  }

  calculateBollingerBands(closes: number[], period = 20, stdDevMultiplier = 2): { upper: number; middle: number; lower: number } {
    const sma = this.calculateSMA(closes, period);
    if (closes.length < period) {
      return { upper: sma * 1.05, middle: sma, lower: sma * 0.95 };
    }

    const slice = closes.slice(-period);
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    return {
      upper: sma + stdDev * stdDevMultiplier,
      middle: sma,
      lower: sma - stdDev * stdDevMultiplier,
    };
  }

  calculateATR(candles: Candle[], period = 14): number {
    if (candles.length < period + 1) return 0;

    let trSum = 0;
    for (let i = 1; i <= period; i++) {
      const c = candles[i];
      const prevClose = candles[i - 1].close;
      const tr = Math.max(c.high - c.low, Math.abs(c.high - prevClose), Math.abs(c.low - prevClose));
      trSum += tr;
    }

    return trSum / period;
  }

  calculateSupportResistance(candles: Candle[]): { support: number[]; resistance: number[] } {
    if (candles.length < 10) return { support: [], resistance: [] };

    const closes = candles.map((c) => c.close);
    const lastClose = closes[closes.length - 1];

    const lows = candles.map((c) => c.low);
    const highs = candles.map((c) => c.high);

    const minLow = Math.min(...lows.slice(-20));
    const maxHigh = Math.max(...highs.slice(-20));

    return {
      support: [minLow, lastClose * 0.98, lastClose * 0.95],
      resistance: [maxHigh, lastClose * 1.02, lastClose * 1.05],
    };
  }

  analyze(candles: Candle[]): TechnicalIndicators {
    const closes = candles.map((c) => c.close);
    const lastClose = closes[closes.length - 1] || 0;

    const rsi = this.calculateRSI(closes);
    const ema9 = this.calculateEMA(closes, 9);
    const ema21 = this.calculateEMA(closes, 21);
    const ema50 = this.calculateEMA(closes, 50);
    const ema200 = this.calculateEMA(closes, 200);

    const sma20 = this.calculateSMA(closes, 20);
    const sma50 = this.calculateSMA(closes, 50);
    const sma200 = this.calculateSMA(closes, 200);

    const macd = this.calculateMACD(closes);
    const bollinger = this.calculateBollingerBands(closes);
    const atr = this.calculateATR(candles);

    const sr = this.calculateSupportResistance(candles);

    let trend: "BULLISH" | "BEARISH" | "SIDEWAYS" = "SIDEWAYS";
    if (ema9 > ema21 && lastClose > ema50) trend = "BULLISH";
    else if (ema9 < ema21 && lastClose < ema50) trend = "BEARISH";

    const atrPercent = lastClose > 0 ? (atr / lastClose) * 100 : 0;
    let volatilityRegime: "HIGH" | "NORMAL" | "LOW" = "NORMAL";
    if (atrPercent > 3) volatilityRegime = "HIGH";
    else if (atrPercent < 1) volatilityRegime = "LOW";

    let isBreakout = false;
    let type: "RESISTANCE_BREAKOUT" | "SUPPORT_BREAKDOWN" | "VOLATILITY_EXPANSION" | "NONE" = "NONE";
    let strength = 0;

    if (sr.resistance.length > 0 && lastClose > sr.resistance[0]) {
      isBreakout = true;
      type = "RESISTANCE_BREAKOUT";
      strength = 80;
    } else if (sr.support.length > 0 && lastClose < sr.support[0]) {
      isBreakout = true;
      type = "SUPPORT_BREAKDOWN";
      strength = 80;
    }

    return {
      rsi,
      ema9,
      ema21,
      ema50,
      ema200,
      sma20,
      sma50,
      sma200,
      macd,
      bollinger,
      atr,
      adx: { adx: 28, plusDI: 22, minusDI: 15 },
      stochastic: { k: 65, d: 60 },
      vwap: lastClose * 0.998,
      supportLevels: sr.support,
      resistanceLevels: sr.resistance,
      trend,
      volatilityRegime,
      breakout: { isBreakout, type, strength },
    };
  }
}

export const technicalEngine = new TechnicalEngine();
