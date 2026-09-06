"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TickerPrice {
  symbol: string;
  price: number;
  source: string;
  quality: string;
}

const SYMBOLS = ["BTC", "ETH", "SOL", "BNB", "PEPE", "AVAX", "LINK", "XRP"];

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
      if (items.length > 0) {
        setTickers(items);
      }
    }

    updatePrices();
    const interval = setInterval(updatePrices, 10000);
    return () => clearInterval(interval);
  }, []);

  if (tickers.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 overflow-x-auto py-1 px-0.5 scrollbar-none font-mono">
      {tickers.map((t) => (
        <Link
          key={t.symbol}
          href={`/asset/${t.symbol}`}
          className="flex items-center space-x-2 bg-[#050814]/90 hover:bg-[#0a0f24] border border-slate-800/80 hover:border-slate-700 rounded-lg px-2.5 py-1 transition-colors cursor-pointer text-[11px] shrink-0"
        >
          <span className="font-bold text-slate-100">{t.symbol}</span>
          <span className="text-emerald-400 font-bold tabular-nums">
            ${t.price > 10 ? t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : t.price.toFixed(4)}
          </span>
          <span className="text-[8px] font-bold text-slate-500 uppercase px-1 py-0.2 bg-slate-900 border border-slate-800 rounded">
            {t.source}
          </span>
        </Link>
      ))}
    </div>
  );
}
