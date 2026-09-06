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
      }
    }
    fetchGlobal();
    const timer = setInterval(fetchGlobal, 30000);
    return () => clearInterval(timer);
  }, []);

  const mcap = data?.global ? `$${(data.global.totalMarketCap / 1e12).toFixed(2)}T` : "$2.72T";
  const vol = data?.global ? `$${(data.global.totalVolume / 1e9).toFixed(1)}B` : "$68.4B";
  const btcDom = data?.global ? `${data.global.btcDominance.toFixed(1)}%` : "58.8%";
  const ethDom = data?.global ? `${data.global.ethDominance.toFixed(1)}%` : "14.2%";

  const fg = data?.fearGreed || { value: 72, classification: "Greed" };

  return (
    <div className="bg-[#050814]/90 border border-slate-800/80 rounded-xl py-2 px-3.5 font-mono text-[11px] flex flex-wrap items-center justify-between gap-2 shadow-sm">
      <div className="flex items-center space-x-3.5">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">MARKET TELEMETRY:</span>
        </div>

        <div>
          <span className="text-slate-500 mr-1">MCAP:</span>
          <span className="font-bold text-slate-100 tabular-nums">{mcap}</span>
        </div>

        <span className="text-slate-800">|</span>

        <div>
          <span className="text-slate-500 mr-1">24H VOL:</span>
          <span className="font-bold text-slate-100 tabular-nums">{vol}</span>
        </div>

        <span className="text-slate-800">|</span>

        <div>
          <span className="text-slate-500 mr-1">BTC DOM:</span>
          <span className="font-bold text-sky-400 tabular-nums">{btcDom}</span>
        </div>

        <span className="text-slate-800">|</span>

        <div>
          <span className="text-slate-500 mr-1">ETH DOM:</span>
          <span className="font-bold text-slate-300 tabular-nums">{ethDom}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-[10px]">
        <span className="text-slate-500 font-bold">FEAR & GREED:</span>
        <Badge variant="outline" className="text-[9px] font-bold py-0.5 px-2 bg-slate-900 border-slate-700 text-emerald-400 tabular-nums">
          {fg.value} / 100 — {fg.classification.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
}
