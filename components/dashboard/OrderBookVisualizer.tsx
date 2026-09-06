"use client";

import { useEffect, useState } from "react";
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
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [isPulsing, setIsPulsing] = useState<boolean>(false);

  useEffect(() => {
    async function loadOrderBook() {
      try {
        const res = await fetch(`/api/market/orderbook?symbol=${symbol}&limit=10`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setLastUpdate(new Date().toLocaleTimeString());
          setIsPulsing(true);
          setTimeout(() => setIsPulsing(false), 300);
        }
      } catch (e) {
        console.error("Orderbook load failed:", e);
      }
    }

    loadOrderBook();
    const timer = setInterval(loadOrderBook, 3000);
    return () => clearInterval(timer);
  }, [symbol]);

  if (!data) return null;

  const totalBidVol = data.bids.reduce((sum, b) => sum + b.qty, 0);
  const totalAskVol = data.asks.reduce((sum, a) => sum + a.qty, 0);
  const maxBidQty = Math.max(...data.bids.map((b) => b.qty), 1);
  const maxAskQty = Math.max(...data.asks.map((a) => a.qty), 1);
  const totalVol = totalBidVol + totalAskVol || 1;

  const bidPercent = Math.round((totalBidVol / totalVol) * 100);
  const askPercent = 100 - bidPercent;

  return (
    <div className="bg-[#050814]/90 border border-slate-800 rounded-xl p-3 font-mono space-y-3">
      {/* Orderbook Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center space-x-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isPulsing ? "bg-sky-400" : "bg-slate-600"}`} />
          <span className="text-xs font-black tracking-wider uppercase text-slate-100">ORDERBOOK DEPTH ({symbol})</span>
        </div>
        <Badge variant="outline" className="text-[9px] font-mono border-slate-700 text-sky-400 font-bold bg-slate-900/60">
          SPREAD: {data.spreadPercent.toFixed(4)}%
        </Badge>
      </div>

      {/* Dynamic Pressure Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[9px] font-bold">
          <span className="text-emerald-400">BIDS {bidPercent}%</span>
          <span className="text-rose-400">ASKS {askPercent}%</span>
        </div>
        <div className="w-full h-2 bg-[#02040a] rounded flex overflow-hidden p-0.5 border border-slate-800/80">
          <div
            className="bg-emerald-500/80 transition-all duration-500 rounded-l"
            style={{ width: `${bidPercent}%` }}
          />
          <div
            className="bg-rose-500/80 transition-all duration-500 rounded-r"
            style={{ width: `${askPercent}%` }}
          />
        </div>
      </div>

      {/* Live Depth Tables */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        {/* Bids */}
        <div className="space-y-1 bg-[#02040a] p-2 rounded-lg border border-slate-800/80">
          <div className="flex justify-between text-[8px] text-emerald-400 font-bold uppercase pb-1 border-b border-slate-800">
            <span>Bid Price</span>
            <span>Qty</span>
          </div>
          {data.bids.slice(0, 5).map((b, i) => {
            const depthRatio = (b.qty / maxBidQty) * 100;
            return (
              <div key={i} className="relative flex justify-between py-0.5 px-1 rounded overflow-hidden">
                <div
                  className="absolute inset-y-0 right-0 bg-emerald-500/10 transition-all duration-200"
                  style={{ width: `${depthRatio}%` }}
                />
                <span className="text-emerald-400 font-bold relative z-10 tabular-nums">
                  ${b.price > 10 ? b.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : b.price.toFixed(4)}
                </span>
                <span className="text-slate-400 relative z-10 tabular-nums">{b.qty.toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        {/* Asks */}
        <div className="space-y-1 bg-[#02040a] p-2 rounded-lg border border-slate-800/80">
          <div className="flex justify-between text-[8px] text-rose-400 font-bold uppercase pb-1 border-b border-slate-800">
            <span>Ask Price</span>
            <span>Qty</span>
          </div>
          {data.asks.slice(0, 5).map((a, i) => {
            const depthRatio = (a.qty / maxAskQty) * 100;
            return (
              <div key={i} className="relative flex justify-between py-0.5 px-1 rounded overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-rose-500/10 transition-all duration-200"
                  style={{ width: `${depthRatio}%` }}
                />
                <span className="text-rose-400 font-bold relative z-10 tabular-nums">
                  ${a.price > 10 ? a.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : a.price.toFixed(4)}
                </span>
                <span className="text-slate-400 relative z-10 tabular-nums">{a.qty.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Meta */}
      <div className="flex justify-between items-center text-[8px] text-slate-500 pt-1 border-t border-slate-800/60">
        <span className="text-slate-400">FEED: BINANCE WEBSOCKET</span>
        <span>UPDATED: {lastUpdate}</span>
      </div>
    </div>
  );
}
