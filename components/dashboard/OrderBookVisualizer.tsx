"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface OrderBookData {
  spread: number;
  spreadPercent: number;
  topBid: number;
  topAsk: number;
  bids: Array<{ price: number; qty: number }>;
  asks: Array<{ price: number; qty: number }>;
}

export function OrderBookVisualizer({ symbol = "BTC" }: { symbol?: string }) {
  const [data, setData] = useState<OrderBookData | null>(null);

  useEffect(() => {
    async function loadOrderBook() {
      try {
        const res = await fetch(`/api/market/orderbook?symbol=${symbol}&limit=10`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Orderbook load failed:", e);
      }
    }
    loadOrderBook();
  }, [symbol]);

  if (!data) return null;

  const totalBidVol = data.bids.reduce((sum, b) => sum + b.qty, 0);
  const totalAskVol = data.asks.reduce((sum, a) => sum + a.qty, 0);
  const totalVol = totalBidVol + totalAskVol || 1;

  const bidPercent = Math.round((totalBidVol / totalVol) * 100);
  const askPercent = 100 - bidPercent;

  return (
    <Card className="bg-[#0b101e] border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>📊 OrderBook Depth Pressure ({symbol})</span>
          <Badge variant="outline" className="text-[10px]">
            Spread: {data.spreadPercent.toFixed(4)}%
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-xs">
        {/* Buy/Sell Volume Pressure Bar */}
        <div>
          <div className="flex justify-between text-[11px] mb-1 font-mono">
            <span className="text-emerald-400 font-bold">BUY BIDS {bidPercent}%</span>
            <span className="text-rose-400 font-bold">SELL ASKS {askPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded flex overflow-hidden">
            <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${bidPercent}%` }} />
            <div className="bg-rose-500 transition-all duration-500" style={{ width: `${askPercent}%` }} />
          </div>
        </div>

        {/* Top Bids / Asks Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="space-y-1 bg-[#060c18] p-2 rounded">
            <span className="text-emerald-400 font-bold text-[10px] uppercase block mb-1">Bids (Buyers)</span>
            {data.bids.slice(0, 5).map((b, i) => (
              <div key={i} className="flex justify-between text-slate-300">
                <span className="text-emerald-400/90">${b.price.toLocaleString()}</span>
                <span className="text-slate-500">{b.qty.toFixed(3)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 bg-[#060c18] p-2 rounded">
            <span className="text-rose-400 font-bold text-[10px] uppercase block mb-1">Asks (Sellers)</span>
            {data.asks.slice(0, 5).map((a, i) => (
              <div key={i} className="flex justify-between text-slate-300">
                <span className="text-rose-400/90">${a.price.toLocaleString()}</span>
                <span className="text-slate-500">{a.qty.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
