import { NextResponse } from "next/server";
import { correlationEngine } from "@/lib/engines/correlation-engine";

export async function GET() {
  const data = await correlationEngine.calculateCorrelationMatrix();
  return NextResponse.json(data);
}
