import { NextResponse } from "next/server";
import { multiAssetResearchEngine } from "@/lib/engines/multi-asset-research-engine";
import { AnalysisMode } from "@/lib/types/multi-asset";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "NVDA";
  const mode = (searchParams.get("mode") as AnalysisMode) || "PROFESSIONAL";

  const report = await multiAssetResearchEngine.generateAnalysisReport(symbol, mode);
  return NextResponse.json(report);
}
