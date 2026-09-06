"use client";

import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

interface GlobalData {
  global: {
    totalMarketCap: number;
    totalVolume: number;
    btcDominance: number;
    ethDominance: number;
  } | null;
  fearGreed: {
    value: number;
    classification: string;
  } | null;
}

export function GlobalMarket() {
  const [data, setData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGlobal() {
      try {
        const res = await fetch("/api/market/global");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch global market data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchGlobal();
  }, []);

  if (loading || !data) {
    return (
      <div className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-xl py-1.5 px-3 font-mono text-[10px] text-cyan-400 animate-pulse">
        [LOADING_LIVE_GLOBAL_MARKET_TELEMETRY...]
      </div>
    );
  }

  const mcap = data.global ? `$${(data.global.totalMarketCap / 1e12).toFixed(2)}T` : "$2.70T";
  const vol = data.global ? `$${(data.global.totalVolume / 1e9).toFixed(1)}B` : "$67.3B";
  const btcDom = data.global ? `${data.global.btcDominance.toFixed(1)}%` : "59.2%";

  const fg = data.fearGreed || { value: 73, classification: "Greed" };

  return (
    <div className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-xl py-1.5 px-3.5 font-mono text-[11px] flex flex-wrap items-center justify-between gap-3 shadow-md">
      <div className="flex items-center space-x-4">
        <div>
          <span className="text-slate-400 mr-1 font-medium">Market Cap:</span>
          <span className="font-black text-white">{mcap}</span>
        </div>
        <span className="text-slate-700">|</span>
        <div>
          <span className="text-slate-400 mr-1 font-medium">24h Vol:</span>
          <span className="font-black text-white">{vol}</span>
        </div>
        <span className="text-slate-700">|</span>
        <div>
          <span className="text-slate-400 mr-1 font-medium">BTC Dom:</span>
          <span className="font-black text-amber-400">{btcDom}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-slate-400 font-medium">Fear & Greed:</span>
        <Badge variant="success" className="text-[9px] font-bold py-0.5 px-2 bg-emerald-950 text-emerald-400 border border-emerald-500/40">
          {fg.value} — {fg.classification}
        </Badge>
      </div>
    </div>
  );
}
