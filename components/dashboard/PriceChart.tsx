"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries, CandlestickData, Time } from "lightweight-charts";
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
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [interval, setInterval] = useState("1h");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandles() {
      setLoading(true);
      try {
        const res = await fetch(`/api/market/candles?symbol=${symbol}&interval=${interval}&limit=100`);
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

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize Lightweight Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#02040a" },
        textColor: "#64748b",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.04)" },
        horzLines: { color: "rgba(255, 255, 255, 0.04)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 250,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#f43f5e",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#f43f5e",
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && candles.length > 0) {
      const formattedData: CandlestickData<Time>[] = candles.map((c) => ({
        time: Math.floor(c.openTime / 1000) as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));

      seriesRef.current.setData(formattedData);
      chartRef.current?.timeScale().fitContent();
    }
  }, [candles]);

  const lastClose = candles.length > 0 ? candles[candles.length - 1].close : 0;
  const firstClose = candles.length > 0 ? candles[0].close : 0;
  const isUp = lastClose >= firstClose;
  const changePercent = firstClose > 0 ? (((lastClose - firstClose) / firstClose) * 100).toFixed(2) : "0.00";

  return (
    <div className="bg-[#050814]/90 border border-slate-800 rounded-xl p-3 font-mono space-y-2">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black tracking-wider uppercase text-slate-100">{symbol} CANDLESTICK STRUCTURE</span>
          <Badge variant={isUp ? "success" : "destructive"} className="text-[9px] font-bold tabular-nums px-1.5 py-0.5">
            {isUp ? "+" : ""}{changePercent}%
          </Badge>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center space-x-1">
          {["15m", "1h", "4h", "1d"].map((tf) => (
            <button
              key={tf}
              onClick={() => setInterval(tf)}
              className={`px-2 py-0.5 text-[9px] font-bold rounded transition-colors ${
                interval === tf
                  ? "bg-sky-900/80 border border-sky-500/50 text-sky-200"
                  : "bg-[#02040a] text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative">
        {loading && candles.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-xs text-sky-400/80 animate-pulse font-mono">
            [SYNCING_CANDLESTICKS_{symbol}...]
          </div>
        ) : null}
        <div ref={chartContainerRef} className="w-full rounded-lg overflow-hidden border border-slate-800/80" />
      </div>
    </div>
  );
}
