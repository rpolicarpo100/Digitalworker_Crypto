"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface Candle {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function PriceChart({ symbol = "BTC" }: { symbol?: string }) {
  const [interval, setInterval] = useState("1h");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandles() {
      setLoading(true);
      try {
        const res = await fetch(`/api/market/candles?symbol=${symbol}&interval=${interval}&limit=60`);
        if (res.ok) {
          const json = await res.json();
          setCandles(json.candles || []);
        }
      } catch (e) {
        console.error("Failed to load chart candles:", e);
      } finally {
        setLoading(false);
      }
    }
    loadCandles();
  }, [symbol, interval]);

  if (loading || candles.length < 5) {
    return (
      <Card className="bg-[#0b101e] border-slate-800 animate-pulse">
        <CardContent className="h-64 flex items-center justify-center text-xs text-slate-500">
          Loading live chart candles for {symbol}...
        </CardContent>
      </Card>
    );
  }

  const closes = candles.map((c) => c.close);
  const minPrice = Math.min(...closes);
  const maxPrice = Math.max(...closes);
  const priceRange = maxPrice - minPrice || 1;

  const width = 600;
  const height = 200;
  const padding = 20;

  const points = closes.map((price, idx) => {
    const x = padding + (idx / (closes.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(" L ")}`;
  const lastClose = closes[closes.length - 1];
  const firstClose = closes[0];
  const isUp = lastClose >= firstClose;
  const strokeColor = isUp ? "#10b981" : "#f43f5e";

  return (
    <Card className="bg-[#0b101e] border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold flex items-center space-x-2">
          <span>📈 {symbol} Live Price Chart</span>
          <Badge variant={isUp ? "success" : "destructive"} className="text-[10px]">
            {isUp ? "+" : ""}{(((lastClose - firstClose) / firstClose) * 100).toFixed(2)}%
          </Badge>
        </CardTitle>
        <div className="flex items-center space-x-1">
          {["15m", "1h", "4h", "1d"].map((tf) => (
            <button
              key={tf}
              onClick={() => setInterval(tf)}
              className={`px-2 py-0.5 text-[10px] rounded font-mono transition-colors ${
                interval === tf ? "bg-blue-600 text-white" : "bg-[#080d19] text-slate-400 hover:text-slate-200"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="relative w-full overflow-hidden bg-[#060a14] rounded p-2 border border-slate-800/80">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Background grid lines */}
            <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1={height / 4} x2={width} y2={height / 4} stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1={(3 * height) / 4} x2={width} y2={(3 * height) / 4} stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />

            {/* Area fill */}
            <path
              d={`${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
              fill="url(#chartGradient)"
            />

            {/* Price Line */}
            <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1 px-1">
            <span>Low: ${minPrice.toLocaleString()}</span>
            <span>Current: ${lastClose.toLocaleString()}</span>
            <span>High: ${maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
