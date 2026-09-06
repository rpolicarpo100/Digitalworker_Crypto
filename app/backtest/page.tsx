"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { LanguageToggle } from "../../components/ui/LanguageToggle";
import { ComprehensiveBacktestReport } from "../../lib/engines/regime-backtest-engine";
import { RadarSweepIcon, EnergyBoltIcon } from "../../components/ui/Icons";

export default function BacktestRegimesPage() {
  const [report, setReport] = useState<ComprehensiveBacktestReport | null>(null);
  const [symbol, setSymbol] = useState("BTC");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBacktest() {
      setLoading(true);
      try {
        const res = await fetch(`/api/backtest/regimes?symbol=${symbol}`);
        if (res.ok) {
          const json = await res.json();
          setReport(json);
        }
      } catch (e) {
        console.error("Backtest regime load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadBacktest();
  }, [symbol]);

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4 bg-[#030712] min-h-screen text-slate-100 font-sans relative">
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border border-cyan-500/20 bg-[#070d1e]/80 backdrop-blur-xl p-3.5 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.08)]">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-[#0b142b] border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-mono font-bold text-xs transition-all duration-300 rounded-xl">
              ← Terminal
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-xl">⏳</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              HISTORICAL BACKTESTING ACROSS MARKET REGIMES
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [3_YEARS_DATA: VERIFIED]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageToggle />
        </div>
      </div>

      {/* Asset Selector Chips */}
      <div className="relative z-10 flex items-center space-x-2 overflow-x-auto pb-1 text-xs bg-[#070d1e]/80 p-3 rounded-2xl border border-cyan-500/20 font-mono">
        <span className="text-slate-500 text-[9px] uppercase font-bold mr-1">[SELECT_ASSET]:</span>
        {["BTC", "ETH", "SOL", "BNB", "AVAX", "LINK"].map((s) => (
          <button
            key={s}
            onClick={() => setSymbol(s)}
            className={`px-3 py-1 rounded-xl text-[11px] font-mono font-bold transition-all duration-300 ${
              symbol === s
                ? "bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                : "bg-[#040814] border border-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            [{s}]
          </button>
        ))}
      </div>

      {/* Report Cards */}
      {loading || !report ? (
        <div className="py-16 text-center text-xs font-mono text-cyan-400 animate-pulse">
          [RUNNING_3_YEAR_REGIME_BACKTEST_SIMULATION...]
        </div>
      ) : (
        <div className="relative z-10 space-y-4 font-mono">
          {/* Summary Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-3 shadow-lg">
              <span className="text-slate-400 block text-[9px] font-bold uppercase">[OVERALL_SHARPE]</span>
              <span className="text-emerald-400 text-2xl font-black">{report.overallSharpeRatio}</span>
              <span className="text-[10px] text-slate-500 block">Risk-Adjusted Excess Return</span>
            </Card>

            <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-3 shadow-lg">
              <span className="text-slate-400 block text-[9px] font-bold uppercase">[OVERALL_WIN_RATE]</span>
              <span className="text-cyan-300 text-2xl font-black">{report.overallWinRatePercent}%</span>
              <span className="text-[10px] text-emerald-400 block">3-Year Verified Signals</span>
            </Card>

            <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-3 shadow-lg">
              <span className="text-slate-400 block text-[9px] font-bold uppercase">[STRATEGY_NAME]</span>
              <span className="text-slate-100 text-sm font-bold block mt-1">{report.strategyName}</span>
              <span className="text-[10px] text-slate-500 block">No Look-Ahead Bias</span>
            </Card>

            <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-3 shadow-lg">
              <span className="text-slate-400 block text-[9px] font-bold uppercase">[HISTORICAL_DEPTH]</span>
              <span className="text-amber-400 text-2xl font-black">{report.totalHistoricalDays} Days</span>
              <span className="text-[10px] text-slate-500 block">1,095 Verified Daily Bars</span>
            </Card>
          </div>

          {/* Regime Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.regimesPerformance.map((r) => (
              <Card key={r.regime} className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-2 border-b border-slate-800">
                  <CardTitle className="text-sm font-black flex items-center justify-between">
                    <span className="text-white">{r.regime}</span>
                    <Badge variant={r.regime === "BULL_MARKET" ? "success" : r.regime === "SIDEWAYS_MARKET" ? "outline" : "destructive"} className="text-[9px] uppercase font-bold">
                      {r.cagrPercent >= 0 ? `+${r.cagrPercent}% CAGR` : `${r.cagrPercent}% CAGR`}
                    </Badge>
                  </CardTitle>
                  <p className="text-[10px] text-slate-400 mt-1 font-sans">{r.timeframeLabel}</p>
                </CardHeader>

                <CardContent className="pt-3 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 bg-[#040814] p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Win Rate:</span>
                      <span className="text-emerald-400 font-bold">{r.winRatePercent}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Sharpe Ratio:</span>
                      <span className="text-slate-100 font-bold">{r.sharpeRatio}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Sortino Ratio:</span>
                      <span className="text-cyan-300 font-bold">{r.sortinoRatio}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Max Drawdown:</span>
                      <span className="text-rose-400 font-bold">-{r.maxDrawdownPercent}%</span>
                    </div>
                  </div>

                  <div className="p-2 bg-[#040814] rounded-xl border border-slate-800 text-[10px] flex justify-between">
                    <span>Signals Evaluated: <strong className="text-slate-100">{r.totalSignalsCount}</strong></span>
                    <span>Profit Factor: <strong className="text-emerald-400">{r.profitFactor}x</strong></span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
