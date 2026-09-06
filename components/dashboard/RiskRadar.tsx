"use client";

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
    <div className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-xl py-1.5 px-3.5 font-mono text-[11px] flex flex-wrap items-center justify-between gap-3 shadow-md">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 text-slate-100 font-bold">
          <RadarSweepIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>RISK RADAR ({symbol}):</span>
        </div>
        <span className="text-slate-700">|</span>
        <div>
          <span className="text-slate-400 mr-1 font-medium">Vol Regime:</span>
          <span className="font-black text-white">{volatilityRegime}</span>
        </div>
        <span className="text-slate-700">|</span>
        <div>
          <span className="text-slate-400 mr-1 font-medium">Spread:</span>
          <span className="font-black text-white">{spreadPercent.toFixed(2)}%</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 text-emerald-400 font-bold text-[10px]">
          <CyberShieldIcon className="w-3.5 h-3.5 shrink-0" />
          <span>[VETO_PASSED]</span>
        </div>
        <Badge variant={variant} className="text-[9px] font-bold py-0.5 px-2">
          {riskLevel} ({riskScore}/100)
        </Badge>
      </div>
    </div>
  );
}
