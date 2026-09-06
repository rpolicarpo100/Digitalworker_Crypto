"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { LanguageToggle } from "../../../components/ui/LanguageToggle";
import { RadarSweepIcon } from "../../../components/ui/Icons";

interface CorrelationData {
  assets: string[];
  matrix: number[][];
  highRiskOverExposures: Array<{ assetA: string; assetB: string; correlation: number }>;
}

export default function CorrelationPage() {
  const [data, setData] = useState<CorrelationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCorrelation() {
      try {
        const res = await fetch("/api/quant/correlation");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed correlation load:", e);
      } finally {
        setLoading(false);
      }
    }
    loadCorrelation();
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
            <span className="text-xl">📊</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              PEARSON ASSET CORRELATION MATRIX
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [QUANT_ENGINE: LIVE]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageToggle />
        </div>
      </div>

      {/* Correlation Matrix Card */}
      <Card className="relative z-10 bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-800/80">
          <CardTitle className="text-sm font-black font-mono uppercase tracking-wider flex items-center space-x-2">
            <RadarSweepIcon className="w-4 h-4 text-cyan-400" />
            <span>REAL RETURN PEARSON CORRELATION MATRIX (60 CICLES)</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4 font-mono text-xs">
          {loading || !data ? (
            <div className="py-12 text-center text-xs font-mono text-cyan-400 animate-pulse">
              [CALCULATING_PEARSON_CORRELATION_SERIES...]
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-[#040814] text-cyan-300 font-bold">
                      <th className="py-2.5 px-3 text-left">Asset</th>
                      {data.assets.map((a) => (
                        <th key={a} className="py-2.5 px-3 font-extrabold">{a}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data.assets.map((rowAsset, rowIdx) => (
                      <tr key={rowAsset} className="hover:bg-[#0c162e]">
                        <td className="py-2.5 px-3 font-extrabold text-left text-slate-200 bg-[#040814]">
                          {rowAsset}
                        </td>
                        {data.matrix[rowIdx].map((val, colIdx) => {
                          let bgColor = "text-slate-300";
                          if (val === 1) bgColor = "text-slate-500 font-normal";
                          else if (val > 0.85) bgColor = "text-rose-400 font-black bg-rose-950/20";
                          else if (val > 0.60) bgColor = "text-amber-400 font-bold";
                          else if (val < 0.20) bgColor = "text-emerald-400 font-bold";

                          return (
                            <td key={colIdx} className={`py-2.5 px-3 font-mono ${bgColor}`}>
                              {val.toFixed(2)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Over-Exposure Alerts */}
              {data.highRiskOverExposures.length > 0 && (
                <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-200 text-xs">
                  <span className="font-bold block mb-1">⚠️ High-Correlation Risk Over-Exposures (&gt; 0.85):</span>
                  <div className="space-y-0.5 text-[11px]">
                    {data.highRiskOverExposures.map((item, idx) => (
                      <p key={idx}>
                        • <strong>{item.assetA}</strong> & <strong>{item.assetB}</strong> correlation is <strong>{item.correlation}</strong> (avoid simultaneous long positions).
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
