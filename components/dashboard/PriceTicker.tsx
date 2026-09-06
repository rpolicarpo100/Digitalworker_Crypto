"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface TickerPrice {
  symbol: string;
  price: number;
  source: string;
  quality: string;
}

const SYMBOLS = ["BTC", "ETH", "SOL", "BNB", "AVAX"];

export function PriceTicker() {
  const [tickers, setTickers] = useState<TickerPrice[]>([]);

  useEffect(() => {
    async function updatePrices() {
      const results = await Promise.allSettled(
        SYMBOLS.map(async (sym) => {
          const res = await fetch(`/api/market/price?symbol=${sym}`);
          if (res.ok) return await res.json();
          throw new Error("Failed");
        })
      );

      const items: TickerPrice[] = [];
      results.forEach((r, idx) => {
        if (r.status === "fulfilled" && r.value) {
          items.push({
            symbol: SYMBOLS[idx],
            price: r.value.price,
            source: r.value.source,
            quality: r.value.quality,
          });
        }
      });
      setTickers(items);
    }

    updatePrices();
    const interval = setInterval(updatePrices, 10000); // 10s live refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-3 overflow-x-auto py-1 px-1 no-scrollbar">
      {tickers.map((t) => (
        <Link
          key={t.symbol}
          href={`/asset/${t.symbol}`}
          className="flex items-center space-x-2 bg-[#0c1220] hover:bg-[#11192e] border border-slate-800 rounded px-3 py-1.5 transition-colors cursor-pointer text-xs min-w-[130px]"
        >
          <span className="font-bold text-slate-100">{t.symbol}</span>
          <span className="font-mono text-emerald-400 font-medium">
            ${t.price > 10 ? t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : t.price.toFixed(4)}
          </span>
          <Badge variant="outline" className="text-[10px] px-1 py-0 opacity-70">
            {t.source}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
