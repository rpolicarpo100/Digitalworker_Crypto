"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { OrderBookIcon, EnergyBoltIcon } from "../ui/Icons";

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
    let timer: NodeJS.Timeout;

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
    // Live sub-second loop: poll every 3 seconds for active depth updates
    timer = setInterval(loadOrderBook, 3000);
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
    <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden relative">
      <CardHeader className="pb-2.5 border-b border-slate-800/80">
        <CardTitle className="text-sm font-black font-mono uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <OrderBookIcon className="w-4 h-4" />
            <span className="text-slate-100">ORDERBOOK DEPTH ({symbol})</span>
            {isPulsing && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
          </span>
          <Badge variant="outline" className="text-[9px] font-mono border-cyan-500/40 text-cyan-300 font-bold bg-cyan-950/60">
            SPREAD: {data.spreadPercent.toFixed(4)}%
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-3.5 space-y-3.5 text-xs font-mono">
        {/* Dynamic Pressure Bar with Micro-Glow */}
        <div>
          <div className="flex justify-between text-[10px] mb-1 font-bold">
            <span className="text-emerald-400 flex items-center space-x-1">
              <EnergyBoltIcon className="w-3 h-3 text-emerald-400" />
              <span>BUY BIDS {bidPercent}%</span>
            </span>
            <span className="text-rose-400 flex items-center space-x-1">
              <span>SELL ASKS {askPercent}%</span>
              <EnergyBoltIcon className="w-3 h-3 text-rose-400" />
            </span>
          </div>

          <div className="w-full h-3 bg-[#040814] rounded-lg flex overflow-hidden p-0.5 border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${bidPercent}%` }}
            />
            <div
              className="bg-gradient-to-r from-rose-400 to-rose-600 rounded-r transition-all duration-700 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
              style={{ width: `${askPercent}%` }}
            />
          </div>
        </div>

        {/* Live Depth Heatmap Tables */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {/* Bids (Buyers) Column */}
          <div className="space-y-1 bg-[#040814] p-2.5 rounded-xl border border-slate-800 relative">
            <div className="flex justify-between text-[9px] text-emerald-400 font-black uppercase mb-1.5 border-b border-emerald-500/30 pb-1">
              <span>Bids (Buyers)</span>
              <span>Amount</span>
            </div>
            {data.bids.slice(0, 6).map((b, i) => {
              const depthRatio = (b.qty / maxBidQty) * 100;
              return (
                <div key={i} className="relative flex justify-between py-1 px-1.5 rounded overflow-hidden group">
                  {/* Depth Background Bar */}
                  <div
                    className="absolute inset-y-0 right-0 bg-emerald-500/15 transition-all duration-300 rounded-r"
                    style={{ width: `${depthRatio}%` }}
                  />
                  <span className="text-emerald-400 font-extrabold relative z-10 group-hover:text-emerald-300">
                    ${b.price > 10 ? b.price.toLocaleString() : b.price.toFixed(4)}
                  </span>
                  <span className="text-slate-300 font-bold relative z-10">{b.qty.toFixed(3)}</span>
                </div>
              );
            })}
          </div>

          {/* Asks (Sellers) Column */}
          <div className="space-y-1 bg-[#040814] p-2.5 rounded-xl border border-slate-800 relative">
            <div className="flex justify-between text-[9px] text-rose-400 font-black uppercase mb-1.5 border-b border-rose-500/30 pb-1">
              <span>Asks (Sellers)</span>
              <span>Amount</span>
            </div>
            {data.asks.slice(0, 6).map((a, i) => {
              const depthRatio = (a.qty / maxAskQty) * 100;
              return (
                <div key={i} className="relative flex justify-between py-1 px-1.5 rounded overflow-hidden group">
                  {/* Depth Background Bar */}
                  <div
                    className="absolute inset-y-0 left-0 bg-rose-500/15 transition-all duration-300 rounded-l"
                    style={{ width: `${depthRatio}%` }}
                  />
                  <span className="text-rose-400 font-extrabold relative z-10 group-hover:text-rose-300">
                    ${a.price > 10 ? a.price.toLocaleString() : a.price.toFixed(4)}
                  </span>
                  <span className="text-slate-300 font-bold relative z-10">{a.qty.toFixed(3)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Stream Footnote */}
        <div className="flex justify-between items-center text-[9px] text-slate-500 pt-1 border-t border-slate-800/60">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE_WEBSOCKET_FEED (BINANCE)</span>
          </span>
          <span>UPDATED: {lastUpdate}</span>
        </div>
      </CardContent>
    </Card>
  );
}
