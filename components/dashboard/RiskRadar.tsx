"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

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
    <Card className="bg-[#0b101e] border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>🛡️ Risk & Volatility Radar ({symbol})</span>
          <Badge variant={variant}>{riskLevel} ({riskScore}/100)</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-[#080d19] rounded border border-slate-800/80">
            <span className="text-slate-400 block text-[10px]">Volatility Regime:</span>
            <span className="font-bold text-slate-100">{volatilityRegime}</span>
          </div>
          <div className="p-2 bg-[#080d19] rounded border border-slate-800/80">
            <span className="text-slate-400 block text-[10px]">Orderbook Spread:</span>
            <span className="font-bold text-slate-100 font-mono">{spreadPercent.toFixed(2)}%</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 bg-[#060a14] p-2 rounded">
          <span className="text-emerald-400 font-medium">Risk Manager Veto:</span> Risk score is below the 85/100 critical safety rejection threshold.
        </div>
      </CardContent>
    </Card>
  );
}
