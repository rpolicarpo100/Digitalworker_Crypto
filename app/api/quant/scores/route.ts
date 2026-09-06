import { NextResponse } from "next/server";
import { ProfessionalScoreEngine } from "../../../../lib/scoring/professional-score-engine";
import { ScoreCalibrationEngine } from "../../../../lib/scoring/score-calibration-engine";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol") || "BTC";

    const scores = ProfessionalScoreEngine.calculateScores(symbol);
    const calibration = ScoreCalibrationEngine.getCalibrationHistory(symbol);
    const reliability = ScoreCalibrationEngine.getReliabilityStats();

    return NextResponse.json({
      scores,
      calibrationHistory: calibration,
      reliabilityStats: reliability,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to calculate multi-dimensional scores", details: error.message },
      { status: 500 }
    );
  }
}
