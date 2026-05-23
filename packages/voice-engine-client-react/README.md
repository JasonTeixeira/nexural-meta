# @nexural/voice-engine-client-react

Drop-in React + Next.js client for any Nexural voice persona. One
`<VoiceProvider>`, one `<ConnectButton>`, your app talks to the engine.

## Install

```bash
pnpm add @nexural/voice-engine-client-react \
         @livekit/components-react livekit-client livekit-server-sdk
```

## Wire a token route (Next.js 15)

```ts
// app/api/voice/token/route.ts
import { mintVoiceToken } from "@nexural/voice-engine-client-react/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const identity = searchParams.get("identity");
  const agent = searchParams.get("agent") ?? "voice_coach";
  if (!identity) return NextResponse.json({ error: "identity required" }, { status: 400 });
  const tok = await mintVoiceToken({ identity, agent });
  return NextResponse.json(tok);
}
```

## Drop into a page

```tsx
"use client";
import { VoiceProvider, ConnectButton, VoiceConsole } from "@nexural/voice-engine-client-react";

export default function Page() {
  return (
    <VoiceProvider tokenEndpoint="/api/voice/token" persona="voice_coach">
      <ConnectButton className="rounded-full bg-black px-6 py-3 text-white">
        Talk to your coach
      </ConnectButton>
      <VoiceConsole />
    </VoiceProvider>
  );
}
```

That's it. The persona switches by changing `persona="..."`.

## What you get

- `<VoiceProvider>` — manages token mint, LiveKit room, connection state.
- `useVoice()` — `{ state, persona, connection, connect, disconnect, error }`.
- `<ConnectButton>` — toggle the call; label tracks state.
- `<VoiceConsole>` — visualiser + mic/end controls (shows only when connected).
- `mintVoiceToken()` — server-only helper to back your token endpoint.

## Customise

Both `<VoiceProvider>` children and `<VoiceConsole>` are unstyled — bring
your own classes. Or compose your own UI on top of `useVoice()` + the
LiveKit `useVoiceAssistant()` hook re-exported from
`@livekit/components-react`.
