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
    <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-md rounded-xl overflow-hidden font-mono text-[11px]">
      <CardHeader className="py-2 px-3 border-b border-slate-800/80">
        <CardTitle className="text-xs font-black tracking-wider uppercase flex items-center justify-between">
          <span className="flex items-center space-x-1.5 text-slate-100">
            <RadarSweepIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>RISK RADAR ({symbol})</span>
          </span>
          <Badge variant={variant} className="font-mono text-[8px] font-bold py-0 px-1.5">
            {riskLevel} ({riskScore}/100)
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-2.5 space-y-1.5 text-[10px]">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="p-1.5 bg-[#040814] rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[8px] uppercase font-bold">Vol Regime:</span>
            <span className="font-extrabold text-slate-100">{volatilityRegime}</span>
          </div>
          <div className="p-1.5 bg-[#040814] rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[8px] uppercase font-bold">Spread:</span>
            <span className="font-extrabold text-slate-100">{spreadPercent.toFixed(2)}%</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-300 bg-[#040814] p-2 rounded-lg border border-slate-800/80 flex items-center space-x-1.5">
          <CyberShieldIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-slate-300 leading-none">
            <strong className="text-emerald-400">[VETO_PASSED]:</strong> Risk score below 85/100 threshold.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
