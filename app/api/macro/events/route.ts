import { NextResponse } from "next/server";
import { macroEventsEngine } from "@/lib/engines/macro-events-engine";

export async function GET() {
  const events = macroEventsEngine.getUpcomingEvents();
  return NextResponse.json({
    status: "SUCCESS",
    count: events.length,
    events,
    timestamp: new Date().toISOString(),
  });
}
