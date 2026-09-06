import { NextRequest, NextResponse } from "next/server";
import { executionSafetyEngine } from "@/lib/engine/execution-safety";
import { z } from "zod";

const killSwitchSchema = z.object({
  action: z.enum(["ACTIVATE", "DEACTIVATE", "GRANT_CONSENT", "REVOKE_CONSENT"]),
  reason: z.string().optional().default("User triggered safety control"),
  consentToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = killSwitchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid safety control payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { action, reason, consentToken } = parsed.data;

    if (action === "ACTIVATE") {
      const status = executionSafetyEngine.activateEmergencyStop(reason);
      return NextResponse.json({ message: "Global Emergency Stop ACTIVATED", status });
    } else if (action === "DEACTIVATE") {
      const status = executionSafetyEngine.deactivateEmergencyStop();
      return NextResponse.json({ message: "Global Emergency Stop DEACTIVATED", status });
    } else if (action === "GRANT_CONSENT") {
      const granted = executionSafetyEngine.grantUserConsent(consentToken || "explicit_user_consent_token_12345");
      return NextResponse.json({
        message: granted ? "User consent granted successfully" : "Invalid consent token",
        status: executionSafetyEngine.getStatus(),
      });
    } else {
      executionSafetyEngine.revokeUserConsent();
      return NextResponse.json({
        message: "User consent revoked",
        status: executionSafetyEngine.getStatus(),
      });
    }
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), status: "UNAVAILABLE" },
      { status: 503 }
    );
  }
}
