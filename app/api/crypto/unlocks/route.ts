import { NextResponse } from "next/server";
import { tokenUnlocksEngine } from "@/lib/engines/token-unlocks-engine";

export async function GET() {
  const unlocks = tokenUnlocksEngine.getUpcomingUnlocks();
  return NextResponse.json({
    status: "SUCCESS",
    count: unlocks.length,
    unlocks,
    timestamp: new Date().toISOString(),
  });
}
