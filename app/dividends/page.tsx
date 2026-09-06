"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { LanguageToggle } from "../../components/ui/LanguageToggle";
import { CyberShieldIcon, EnergyBoltIcon } from "../../components/ui/Icons";

interface DividendOpportunity {
  profile: {
    symbol: string;
    name: string;
    sector: string;
    currency: string;
  };
  priceUsd: number;
  change24hPercent: number;
  dividend: {
    dividendYieldPercent: number;
    annualDividendUsd: number;
    payoutRatioPercent: number;
    fcfPayoutPercent: number;
    growthStreakYears: number;
    dividendQualityScore: number;
    dividendSustainabilityScore: number;
    cutRiskLevel: string;
    redFlags: string[];
    whyYieldIsHighExplanation?: string;
  };
}

export default function DividendsPage() {
  const [opportunities, setOpportunities] = useState<DividendOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDividends() {
      try {
        const res = await fetch("/api/dividends/intelligence");
        if (res.ok) {
          const json = await res.json();
          setOpportunities(json.opportunities || []);
        }
      } catch (e) {
        console.error("Failed to load dividend intelligence:", e);
      } finally {
        setLoading(false);
      }
    }
    loadDividends();
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
            <span className="text-xl">💰</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              DIVIDEND INTELLIGENCE & YIELD TRAP SCANNER
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [RED_FLAG_DETECTOR: ARMED]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageToggle />
        </div>
      </div>

      {/* Dividend Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs font-mono text-cyan-400 animate-pulse">
            [AUDITING_PAYOUT_RATIOS_AND_DIVIDEND_SUSTAINABILITY...]
          </div>
        ) : (
          opportunities.map((item) => (
            <Card key={item.profile.symbol} className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden font-mono">
              <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm font-black flex items-center justify-between">
                  <div>
                    <span className="text-white text-base block font-bold">{item.profile.symbol}</span>
                    <span className="text-[10px] text-slate-400 font-sans block">{item.profile.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 text-lg font-black block">
                      {item.dividend.dividendYieldPercent.toFixed(2)}%
                    </span>
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Dividend Yield</span>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-3 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-[#040814] p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Payout Ratio:</span>
                    <span className="text-slate-200 font-bold">{item.dividend.payoutRatioPercent}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Quality Score:</span>
                    <span className="text-emerald-400 font-bold">{item.dividend.dividendQualityScore}/100</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Growth Streak:</span>
                    <span className="text-slate-200 font-bold">{item.dividend.growthStreakYears} Yrs</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Cut Risk:</span>
                    <span className={item.dividend.cutRiskLevel === "LOW" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                      {item.dividend.cutRiskLevel}
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                {item.dividend.whyYieldIsHighExplanation && (
                  <div className="p-2.5 bg-amber-950/30 border border-amber-500/40 rounded-xl text-amber-200 text-[11px]">
                    <span className="font-bold block mb-0.5 uppercase text-[9px]">[WHY_IS_YIELD_HIGH?]:</span>
                    <p className="text-slate-300 text-[10px] leading-snug">{item.dividend.whyYieldIsHighExplanation}</p>
                  </div>
                )}

                {/* Red flags if any */}
                {item.dividend.redFlags.length > 0 && (
                  <div className="p-2 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-[10px]">
                    <span className="font-bold block uppercase mb-0.5">⚠️ Red Flags:</span>
                    <p>• {item.dividend.redFlags[0]}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
