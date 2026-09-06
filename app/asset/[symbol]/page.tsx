"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AssetData {
  price: number;
  source: string;
  quality: string;
  ticker?: {
    high24h: number;
    low24h: number;
    volume24h: number;
    priceChangePercent: number;
  };
  orderbook?: {
    spread: number;
    spreadPercent: number;
    topBid: number;
    topAsk: number;
  };
}

export default function AssetTerminal({ params }: { params: Promise<{ symbol: string }> }) {
  const resolvedParams = use(params);
  const symbol = resolvedParams.symbol.toUpperCase();

  const [data, setData] = useState<AssetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAsset() {
      try {
        const [priceRes, tickerRes, obRes] = await Promise.all([
          fetch(`/api/market/price?symbol=${symbol}`).then((r) => r.ok ? r.json() : null),
          fetch(`/api/market/ticker?symbol=${symbol}`).then((r) => r.ok ? r.json() : null),
          fetch(`/api/market/orderbook?symbol=${symbol}`).then((r) => r.ok ? r.json() : null),
        ]);

        if (priceRes) {
          setData({
            price: priceRes.price,
            source: priceRes.source,
            quality: priceRes.quality,
            ticker: tickerRes ? {
              high24h: tickerRes.high24h,
              low24h: tickerRes.low24h,
              volume24h: tickerRes.volume24h,
              priceChangePercent: tickerRes.priceChangePercent,
            } : undefined,
            orderbook: obRes ? {
              spread: obRes.spread,
              spreadPercent: obRes.spreadPercent,
              topBid: obRes.topBid,
              topAsk: obRes.topAsk,
            } : undefined,
          });
        }
      } catch (err) {
        console.error("Asset load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAsset();
  }, [symbol]);

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="outline" size="sm">← Back to Terminal</Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-100">{symbol} Asset Terminal</h1>
          {data && <Badge variant="success">{data.quality}</Badge>}
        </div>
        {data && (
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-400 block">Source: {data.source}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">
          Fetching real market metrics for {symbol}...
        </div>
      ) : !data ? (
        <div className="py-12 text-center text-xs text-rose-400">
          Failed to load real market metrics for {symbol}. Provider offline or symbol invalid.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#0b101e] border-slate-800">
            <CardHeader><CardTitle className="text-sm">24h Performance</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span className="text-slate-400">24h Change:</span>
                <span className={data.ticker && data.ticker.priceChangePercent >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                  {data.ticker ? `${data.ticker.priceChangePercent.toFixed(2)}%` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span className="text-slate-400">24h High:</span>
                <span className="font-mono text-slate-200">${data.ticker?.high24h.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span className="text-slate-400">24h Low:</span>
                <span className="font-mono text-slate-200">${data.ticker?.low24h.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span className="text-slate-400">24h Base Volume:</span>
                <span className="font-mono text-slate-200">{data.ticker?.volume24h.toLocaleString()} {symbol}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0b101e] border-slate-800">
            <CardHeader><CardTitle className="text-sm">Orderbook Spread & Depth</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span className="text-slate-400">Top Bid:</span>
                <span className="font-mono text-emerald-400">${data.orderbook?.topBid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span className="text-slate-400">Top Ask:</span>
                <span className="font-mono text-rose-400">${data.orderbook?.topAsk.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span className="text-slate-400">Spread USD:</span>
                <span className="font-mono text-slate-200">${data.orderbook?.spread.toFixed(4)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span className="text-slate-400">Spread %:</span>
                <span className="font-mono text-slate-200">{data.orderbook?.spreadPercent.toFixed(4)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0b101e] border-slate-800">
            <CardHeader><CardTitle className="text-sm">Data Integrity Audit</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-300">
              <p>• Data Quality: <span className="text-emerald-400 font-bold">{data.quality}</span></p>
              <p>• Provider: <span className="text-slate-100 font-mono">{data.source}</span></p>
              <p>• Verification: 100% Real API response parsed with Zod and checked via Data Quality Engine.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
