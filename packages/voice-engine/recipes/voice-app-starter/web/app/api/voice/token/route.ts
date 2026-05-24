// Drop-in token endpoint for any Sage app using the voice engine.
// Uses the @nexural/voice-engine-client-react/server helper.
import { mintVoiceToken } from "@nexural/voice-engine-client-react/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const identity = searchParams.get("identity");
  const agent = searchParams.get("agent") ?? "myapp_agent";
  if (!identity) {
    return NextResponse.json({ error: "identity required" }, { status: 400 });
  }
  try {
    const tok = await mintVoiceToken({ identity, agent });
    return NextResponse.json(tok);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
