export interface OrderBookStreamTick {
  symbol: string;
  spread: number;
  spreadPercent: number;
  topBid: number;
  topAsk: number;
  bids: Array<{ price: number; qty: number }>;
  asks: Array<{ price: number; qty: number }>;
  updateLatencyMs: number;
  timestamp: string;
}

export class OrderBookStreamEngine {
  calculateStreamSpread(bids: Array<{ price: number; qty: number }>, asks: Array<{ price: number; qty: number }>): {
    spread: number;
    spreadPercent: number;
    topBid: number;
    topAsk: number;
  } {
    const topBid = bids[0]?.price || 0;
    const topAsk = asks[0]?.price || 0;
    const spread = Math.max(0, topAsk - topBid);
    const spreadPercent = topAsk > 0 ? (spread / topAsk) * 100 : 0;

    return {
      spread: Math.round(spread * 10000) / 10000,
      spreadPercent: Math.round(spreadPercent * 10000) / 10000,
      topBid,
      topAsk,
    };
  }
}

export const orderBookStreamEngine = new OrderBookStreamEngine();
