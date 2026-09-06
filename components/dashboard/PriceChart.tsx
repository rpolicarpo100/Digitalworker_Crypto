"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, CandlestickSeries, CandlestickData, Time } from "lightweight-charts";
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
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);

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
        background: { type: ColorType.Solid, color: "#040814" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 240,
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
    <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden font-mono">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800">
        <CardTitle className="text-sm font-black flex items-center space-x-2 text-white">
          <span>📈 {symbol} TRADINGVIEW LIGHTWEIGHT CANDLESTICK CHART</span>
          <Badge variant={isUp ? "success" : "destructive"} className="text-[9px] font-bold">
            {isUp ? "+" : ""}{changePercent}%
          </Badge>
        </CardTitle>
        <div className="flex items-center space-x-1">
          {["15m", "1h", "4h", "1d"].map((tf) => (
            <button
              key={tf}
              onClick={() => setInterval(tf)}
              className={`px-2 py-0.5 text-[10px] rounded-lg font-bold transition-all ${
                interval === tf ? "bg-cyan-600 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]" : "bg-[#040814] text-slate-400 border border-slate-800 hover:text-slate-100"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-3">
        {loading && candles.length === 0 ? (
          <div className="h-60 flex items-center justify-center text-xs text-cyan-400 animate-pulse">
            [LOADING_TRADINGVIEW_CANDLESTICKS_FOR_{symbol}...]
          </div>
        ) : null}
        <div ref={chartContainerRef} className="w-full rounded-xl overflow-hidden border border-slate-800" />
      </CardContent>
    </Card>
  );
}
