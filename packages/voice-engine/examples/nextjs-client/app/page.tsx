"use client";

import {
  BarVisualizer,
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  VoiceAssistantControlBar,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";

type TokenResponse = { token: string; url: string; agent: string; room: string };

export default function Page() {
  const [conn, setConn] = useState<TokenResponse | null>(null);
  const [persona, setPersona] = useState("voice_coach");
  const [identity] = useState(() => `user-${crypto.randomUUID().slice(0, 8)}`);

  async function connect() {
    const res = await fetch(`/api/token?identity=${identity}&agent=${persona}`);
    if (!res.ok) {
      alert(await res.text());
      return;
    }
    setConn(await res.json());
  }

  if (!conn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 p-8 text-white">
        <h1 className="text-3xl font-semibold tracking-tight">Nexural Voice</h1>
        <p className="max-w-md text-center text-zinc-400">
          One engine, infinite personas. Pick one and start talking.
        </p>
        <select
          className="rounded-md bg-zinc-900 px-4 py-2 text-white"
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
        >
          <option value="voice_coach">Voice Coach</option>
          <option value="tutor">Tutor</option>
          <option value="therapist">Reflective Companion</option>
          <option value="sales_agent">Sales SDR</option>
          <option value="customer_support">Support Agent</option>
          <option value="interviewer">Interviewer</option>
        </select>
        <button
          onClick={connect}
          className="rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200"
        >
          Connect
        </button>
      </main>
    );
  }

  return (
    <LiveKitRoom
      token={conn.token}
      serverUrl={conn.url}
      connect
      audio
      video={false}
      className="flex min-h-screen flex-col bg-zinc-950 text-white"
    >
      <RoomAudioRenderer />
      <Conversation persona={conn.agent} onLeave={() => setConn(null)} />
    </LiveKitRoom>
  );
}

function Conversation({ persona, onLeave }: { persona: string; onLeave: () => void }) {
  const { state, audioTrack } = useVoiceAssistant();

  useEffect(() => {
    // pretty log
    if (state) console.log("agent state:", state);
  }, [state]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 p-8">
      <div className="text-sm uppercase tracking-widest text-zinc-500">
        {persona.replace("_", " ")}
      </div>
      <div className="h-40 w-full">
        <BarVisualizer state={state} trackRef={audioTrack} barCount={32} />
      </div>
      <div className="text-sm text-zinc-400">{state}</div>
      <VoiceAssistantControlBar />
      <button onClick={onLeave} className="text-xs text-zinc-500 hover:text-white">
        ← change persona
      </button>
    </div>
  );
}
