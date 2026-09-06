"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
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
      <Card className="animate-pulse">
        <CardContent className="py-2 text-xs text-slate-400">Loading live market data...</CardContent>
      </Card>
    );
  }

  const mcap = data.global ? `$${(data.global.totalMarketCap / 1e12).toFixed(2)}T` : "N/A";
  const vol = data.global ? `$${(data.global.totalVolume / 1e9).toFixed(1)}B` : "N/A";
  const btcDom = data.global ? `${data.global.btcDominance.toFixed(1)}%` : "N/A";

  const fg = data.fearGreed;
  let fgVariant: "success" | "warning" | "destructive" | "default" = "default";
  if (fg) {
    if (fg.value >= 60) fgVariant = "success";
    else if (fg.value <= 35) fgVariant = "destructive";
    else fgVariant = "warning";
  }

  return (
    <Card className="bg-[#0b101d] border-slate-800">
      <CardContent className="py-2.5 px-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-6">
          <div>
            <span className="text-slate-400 mr-1.5">Market Cap:</span>
            <span className="font-semibold text-slate-100">{mcap}</span>
          </div>
          <div>
            <span className="text-slate-400 mr-1.5">24h Vol:</span>
            <span className="font-semibold text-slate-100">{vol}</span>
          </div>
          <div>
            <span className="text-slate-400 mr-1.5">BTC Dom:</span>
            <span className="font-semibold text-amber-400">{btcDom}</span>
          </div>
        </div>

        {fg && (
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Fear & Greed:</span>
            <Badge variant={fgVariant}>
              {fg.value} — {fg.classification}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
