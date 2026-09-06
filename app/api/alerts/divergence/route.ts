import { NextResponse } from "next/server";
import { divergenceEngine } from "@/lib/engines/divergence-engine";

export async function GET() {
  const alerts = divergenceEngine.getDivergenceAlerts();
  return NextResponse.json({
    status: "SUCCESS",
    count: alerts.length,
    alerts,
    timestamp: new Date().toISOString(),
  });
}
