"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { LanguageToggle } from "../../components/ui/LanguageToggle";
import { RadarSweepIcon, EnergyBoltIcon } from "../../components/ui/Icons";

interface SectorData {
  sector: string;
  performance30dPercent: number;
  momentumScore: number;
  valuationStatus: string;
  capitalFlowsStatus: string;
  rotationState: string;
  topConstituent: string;
}

export default function SectorsPage() {
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSectors() {
      try {
        const res = await fetch("/api/sectors/rotation");
        if (res.ok) {
          const json = await res.json();
          setSectors(json.sectors || []);
        }
      } catch (e) {
        console.error("Failed to load sectors:", e);
      } finally {
        setLoading(false);
      }
    }
    loadSectors();
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
            <span className="text-xl">📈</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              SECTOR ROTATION & CAPITAL FLOWS INTELLIGENCE
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [11_SECTORS_MONITORED]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageToggle />
        </div>
      </div>

      {/* Sector Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs font-mono text-cyan-400 animate-pulse">
            [TRACKING_GLOBAL_CAPITAL_FLOWS_AND_SECTOR_ROTATION...]
          </div>
        ) : (
          sectors.map((sec) => (
            <Card key={sec.sector} className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden font-mono">
              <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm font-black flex items-center justify-between">
                  <span className="text-white text-base">{sec.sector}</span>
                  <Badge variant={sec.rotationState === "STRONGEST" || sec.rotationState === "IMPROVING" ? "success" : "destructive"} className="text-[9px] uppercase font-bold">
                    {sec.rotationState}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-3 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-[#040814] p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">30D Return:</span>
                    <span className={sec.performance30dPercent >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                      {sec.performance30dPercent >= 0 ? `+${sec.performance30dPercent}%` : `${sec.performance30dPercent}%`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Momentum Score:</span>
                    <span className="text-slate-100 font-bold">{sec.momentumScore}/100</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Capital Flows:</span>
                    <span className="text-cyan-400 font-bold">{sec.capitalFlowsStatus}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Valuation:</span>
                    <span className="text-slate-200 font-bold">{sec.valuationStatus}</span>
                  </div>
                </div>

                <div className="pt-1 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Top Constituent: <strong className="text-cyan-300">{sec.topConstituent}</strong></span>
                  <Link href={`/research?symbol=${sec.topConstituent}`} className="text-cyan-400 hover:underline">
                    Research →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
