import { NextResponse } from "next/server";
import { etfFlowsEngine } from "@/lib/engines/etf-flows-engine";

export async function GET() {
  const flows = etfFlowsEngine.getEtfFlows();
  return NextResponse.json({
    status: "SUCCESS",
    count: flows.length,
    flows,
    timestamp: new Date().toISOString(),
  });
}
