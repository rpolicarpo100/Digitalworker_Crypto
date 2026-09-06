"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { LanguageToggle } from "../../../components/ui/LanguageToggle";
import { CyberShieldIcon, RadarSweepIcon } from "../../../components/ui/Icons";
import { StressTestReport } from "../../../lib/engines/stress-test-engine";

export default function StressTestPage() {
  const [report, setReport] = useState<StressTestReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStressTest() {
      try {
        const res = await fetch("/api/quant/stress-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initialPortfolioUsd: 100000, cryptoAlloc: 40, stockAlloc: 50, cashAlloc: 10 }),
        });
        if (res.ok) {
          const json = await res.json();
          setReport(json);
        }
      } catch (e) {
        console.error("Failed to run stress test:", e);
      } finally {
        setLoading(false);
      }
    }
    loadStressTest();
  }, []);

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
            <span className="text-xl">🎲</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              HISTORICAL BLACK SWAN PORTFOLIO STRESS TESTING
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [BLACK_SWAN_SIM: READY]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageToggle />
        </div>
      </div>

      {/* Report */}
      {loading || !report ? (
        <div className="py-16 text-center text-xs font-mono text-cyan-400 animate-pulse">
          [SIMULATING_PORTFOLIO_DRAWDOWN_UNDER_HISTORICAL_CRISES...]
        </div>
      ) : (
        <div className="relative z-10 space-y-4 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.scenarios.map((sc) => (
              <Card key={sc.id} className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-white">{sc.scenarioName}</span>
                    <Badge variant={sc.survivalRating === "EXCELLENT" ? "success" : "warning"} className="text-[9px] font-bold">
                      [{sc.survivalRating}]
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">{sc.historicalPeriod}</p>

                  <div className="bg-[#040814] p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Benchmark Market Impact:</span>
                      <span className="text-rose-400 font-bold">{sc.benchmarkDropPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Simulated Portfolio Drop:</span>
                      <span className="text-emerald-400 font-extrabold">{sc.simulatedPortfolioImpactPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max Dollar Drawdown:</span>
                      <span className="text-slate-100 font-bold">-${sc.simulatedDrawdownUsd.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#040814] rounded-xl border border-slate-800 text-[10px] text-slate-300">
                    <span className="text-cyan-400 font-bold block mb-0.5 uppercase">[MITIGATION_ADVICE]:</span>
                    <p>{sc.mitigationAdvice}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
