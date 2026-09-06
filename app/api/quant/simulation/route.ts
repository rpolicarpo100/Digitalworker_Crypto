import { NextResponse } from "next/server";
import { monteCarloEngine } from "@/lib/engines/monte-carlo-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = monteCarloEngine.runSimulation(body || {});
    return NextResponse.json(result);
  } catch {
    const result = monteCarloEngine.runSimulation({});
    return NextResponse.json(result);
  }
}
