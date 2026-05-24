"use client";

import { ConnectButton, VoiceConsole, VoiceProvider } from "@nexural/voice-engine-client-react";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-950 p-8 text-white">
      <h1 className="text-3xl font-semibold tracking-tight">My Voice App</h1>
      <p className="max-w-md text-center text-zinc-400">
        Replace this page with your real product UI. The voice agent runs in the background once
        connected.
      </p>

      <VoiceProvider tokenEndpoint="/api/voice/token" persona="myapp_agent">
        <ConnectButton className="rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200">
          Talk
        </ConnectButton>
        <VoiceConsole />
      </VoiceProvider>
    </main>
  );
}
