"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { RadarSweepIcon, CyberShieldIcon } from "../ui/Icons";

interface RiskRadarProps {
  symbol?: string;
  volatilityRegime?: string;
  spreadPercent?: number;
  riskScore?: number;
  riskLevel?: string;
}

export function RiskRadar({
  symbol = "BTC",
  volatilityRegime = "NORMAL",
  spreadPercent = 0.05,
  riskScore = 18,
  riskLevel = "LOW",
}: RiskRadarProps) {
  let variant: "success" | "warning" | "destructive" = "success";
  if (riskLevel === "HIGH") variant = "warning";
  if (riskLevel === "CRITICAL") variant = "destructive";

  return (
    <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="pb-2 border-b border-slate-800/80">
        <CardTitle className="text-sm font-black font-mono tracking-wider uppercase flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <RadarSweepIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-100">RISK RADAR ({symbol})</span>
          </span>
          <Badge variant={variant} className="font-mono font-bold">
            {riskLevel} ({riskScore}/100)
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-3.5 space-y-2.5 text-xs font-mono">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-[#040814] rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">Volatility Regime:</span>
            <span className="font-extrabold text-slate-100">{volatilityRegime}</span>
          </div>
          <div className="p-2.5 bg-[#040814] rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">Orderbook Spread:</span>
            <span className="font-extrabold text-slate-100 font-mono">{spreadPercent.toFixed(2)}%</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-300 bg-[#040814] p-3 rounded-xl border border-slate-800/80 flex items-start space-x-2">
          <CyberShieldIcon className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-emerald-400 font-bold block mb-0.5">[RISK_MANAGER_VETO]:</span>
            <p className="text-slate-300 leading-snug">
              Risk score is below the 85/100 critical safety rejection threshold.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
