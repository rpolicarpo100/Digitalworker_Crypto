import { NextResponse } from "next/server";
import { sectorEngine } from "@/lib/engines/sector-engine";

export async function GET() {
  const sectors = sectorEngine.getSectorRotationData();
  return NextResponse.json({
    status: "SUCCESS",
    count: sectors.length,
    sectors,
    timestamp: new Date().toISOString(),
  });
}
