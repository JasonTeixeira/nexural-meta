import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

/**
 * Mint a short-lived LiveKit access token for the browser.
 *
 * Query params:
 *   identity   - stable user id (used for memory key in voice engine)
 *   room       - room name (one room = one conversation)
 *   agent      - persona name (matches `agent_name` in PersonaConfig)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const identity = searchParams.get("identity");
  const room = searchParams.get("room") ?? `vox-${crypto.randomUUID()}`;
  const agent = searchParams.get("agent") ?? "voice_coach";

  if (!identity) {
    return NextResponse.json({ error: "identity required" }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.LIVEKIT_URL;
  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "LIVEKIT_URL / LIVEKIT_API_KEY / LIVEKIT_API_SECRET missing" },
      { status: 500 },
    );
  }

  const at = new AccessToken(apiKey, apiSecret, { identity, ttl: 60 * 15 });
  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

  // Tell LiveKit to dispatch *this specific* agent worker into the room.
  // The worker must have been started with agent_name === <agent>.
  at.roomConfig = {
    agents: [{ agentName: agent }],
  } as never; // typed loosely across SDK versions

  return NextResponse.json({
    token: await at.toJwt(),
    url: wsUrl,
    room,
    identity,
    agent,
  });
}
