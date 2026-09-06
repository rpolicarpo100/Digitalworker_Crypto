"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { LanguageToggle } from "../../components/ui/LanguageToggle";
import { RadarSweepIcon, EnergyBoltIcon } from "../../components/ui/Icons";

interface MacroEconomicEvent {
  id: string;
  eventName: string;
  institution: string;
  eventDate: string;
  forecastValue: string;
  previousValue: string;
  volatilityRating: string;
  impactedAssets: string[];
  strategicAdvice: string;
}

export default function MacroPage() {
  const [events, setEvents] = useState<MacroEconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMacro() {
      try {
        const res = await fetch("/api/macro/events");
        if (res.ok) {
          const json = await res.json();
          setEvents(json.events || []);
        }
      } catch (e) {
        console.error("Failed to load macro events:", e);
      } finally {
        setLoading(false);
      }
    }
    loadMacro();
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
            <span className="text-xl">🌐</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              CENTRAL BANK & MACROECONOMIC CALENDAR MONITOR
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [FED_ECB_STREAM: ACTIVE]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageToggle />
        </div>
      </div>

      {/* Macro Events List */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs font-mono text-cyan-400 animate-pulse">
            [MONITORING_CENTRAL_BANK_RATE_DECISIONS_AND_INFLATION_REPORTS...]
          </div>
        ) : (
          events.map((ev) => (
            <Card key={ev.id} className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden font-mono">
              <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm font-black flex items-center justify-between">
                  <span className="text-white font-bold">{ev.eventName}</span>
                  <Badge variant={ev.volatilityRating === "CRITICAL" ? "destructive" : "warning"} className="text-[9px] font-bold">
                    [{ev.volatilityRating}_VOLATILITY]
                  </Badge>
                </CardTitle>
                <p className="text-[10px] text-cyan-300 font-sans mt-0.5">{ev.institution}</p>
              </CardHeader>

              <CardContent className="pt-3 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-[#040814] p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Event Date:</span>
                    <span className="text-cyan-300 font-bold">{ev.eventDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Forecast:</span>
                    <span className="text-emerald-400 font-bold">{ev.forecastValue}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#040814] rounded-xl border border-slate-800 text-[11px]">
                  <span className="text-slate-400 font-bold block mb-0.5 uppercase text-[9px]">Impacted Assets: {ev.impactedAssets.join(", ")}</span>
                  <p className="text-slate-300 text-[10px] leading-snug">{ev.strategicAdvice}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
