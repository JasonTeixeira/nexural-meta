/**
 * Server-only helpers — used in Next.js route handlers / Server Actions.
 * Do NOT import this from a client component (it pulls livekit-server-sdk).
 */

import { AccessToken } from "livekit-server-sdk";

export type MintTokenOptions = {
  identity: string;
  agent: string;
  room?: string;
  ttlSeconds?: number;
  apiKey?: string;
  apiSecret?: string;
  wsUrl?: string;
};

export type MintedToken = {
  token: string;
  url: string;
  room: string;
  identity: string;
  agent: string;
};

/**
 * Mint a short-lived LiveKit access token + dispatch the matching agent.
 *
 * The worker must have been started with `agent_name === agent` (which
 * happens automatically when you `nx-voice serve --persona personas/X.yaml`).
 */
export async function mintVoiceToken(opts: MintTokenOptions): Promise<MintedToken> {
  const apiKey = opts.apiKey ?? process.env.LIVEKIT_API_KEY;
  const apiSecret = opts.apiSecret ?? process.env.LIVEKIT_API_SECRET;
  const wsUrl = opts.wsUrl ?? process.env.LIVEKIT_URL;
  if (!apiKey || !apiSecret || !wsUrl) {
    throw new Error("mintVoiceToken: missing LIVEKIT_URL/LIVEKIT_API_KEY/LIVEKIT_API_SECRET");
  }
  const room = opts.room ?? `vox-${crypto.randomUUID()}`;
  const at = new AccessToken(apiKey, apiSecret, {
    identity: opts.identity,
    ttl: opts.ttlSeconds ?? 60 * 15,
  });
  at.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });
  // Dispatch the matching agent worker into the room.
  (at as unknown as { roomConfig: unknown }).roomConfig = {
    agents: [{ agentName: opts.agent }],
  };
  return {
    token: await at.toJwt(),
    url: wsUrl,
    room,
    identity: opts.identity,
    agent: opts.agent,
  };
}
