/**
 * @nexural/voice-engine-client-react
 *
 * Drop-in React kit for any Sage app that needs a voice agent.
 *
 *   import { VoiceProvider, useVoice, ConnectButton } from "@nexural/voice-engine-client-react";
 *
 *   <VoiceProvider tokenEndpoint="/api/voice/token" persona="voice_coach">
 *     <ConnectButton>Talk to the coach</ConnectButton>
 *   </VoiceProvider>
 *
 * Bring your own backend: a route handler that calls `mintVoiceToken`
 * (see `./server`) and returns the JSON.
 */

"use client";

import {
  BarVisualizer,
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  VoiceAssistantControlBar,
} from "@livekit/components-react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type MintedToken = {
  token: string;
  url: string;
  room: string;
  identity: string;
  agent: string;
};

export type VoiceState = "idle" | "connecting" | "connected" | "error";

export type VoiceContextValue = {
  state: VoiceState;
  persona: string;
  connection: MintedToken | null;
  error: string | null;
  connect: (opts?: { persona?: string; identity?: string }) => Promise<void>;
  disconnect: () => void;
};

const VoiceCtx = createContext<VoiceContextValue | null>(null);

export type VoiceProviderProps = {
  tokenEndpoint: string;
  persona: string;
  /** Stable identity for this user — used for memory and analytics. */
  identity?: string;
  children: ReactNode;
};

export function VoiceProvider({
  tokenEndpoint,
  persona: initialPersona,
  identity: initialIdentity,
  children,
}: VoiceProviderProps) {
  const [persona, setPersona] = useState(initialPersona);
  const [conn, setConn] = useState<MintedToken | null>(null);
  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState<string | null>(null);
  const fallbackIdentity = useMemo(
    () => initialIdentity ?? `user-${crypto.randomUUID().slice(0, 8)}`,
    [initialIdentity],
  );

  const connect = useCallback(
    async (opts?: { persona?: string; identity?: string }) => {
      const targetPersona = opts?.persona ?? persona;
      const targetIdentity = opts?.identity ?? fallbackIdentity;
      setPersona(targetPersona);
      setState("connecting");
      setError(null);
      try {
        const url = `${tokenEndpoint}?identity=${encodeURIComponent(targetIdentity)}&agent=${encodeURIComponent(targetPersona)}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`token endpoint ${res.status}: ${await res.text()}`);
        }
        const data = (await res.json()) as MintedToken;
        setConn(data);
        setState("connected");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
        setState("error");
      }
    },
    [persona, fallbackIdentity, tokenEndpoint],
  );

  const disconnect = useCallback(() => {
    setConn(null);
    setState("idle");
  }, []);

  const value = useMemo<VoiceContextValue>(
    () => ({ state, persona, connection: conn, error, connect, disconnect }),
    [state, persona, conn, error, connect, disconnect],
  );

  return (
    <VoiceCtx.Provider value={value}>
      {conn ? (
        <LiveKitRoom token={conn.token} serverUrl={conn.url} connect audio video={false}>
          <RoomAudioRenderer />
          {children}
        </LiveKitRoom>
      ) : (
        children
      )}
    </VoiceCtx.Provider>
  );
}

export function useVoice(): VoiceContextValue {
  const v = useContext(VoiceCtx);
  if (!v) throw new Error("useVoice() must be used inside <VoiceProvider>");
  return v;
}

/** Drop-in button: connect on click, label changes per state. */
export function ConnectButton(props: { children?: ReactNode; className?: string }) {
  const { state, connect, disconnect } = useVoice();
  const label =
    state === "connected"
      ? "End"
      : state === "connecting"
        ? "Connecting…"
        : (props.children ?? "Talk");
  return (
    <button
      className={props.className}
      onClick={() => (state === "connected" ? disconnect() : connect())}
      disabled={state === "connecting"}
    >
      {label}
    </button>
  );
}

/** Voice visualiser + control bar — same shape as the example app. */
export function VoiceConsole() {
  const { state: connState } = useVoice();
  const { state: agentState, audioTrack } = useVoiceAssistant();
  useEffect(() => {
    if (agentState) console.log("[voice] agent state:", agentState);
  }, [agentState]);
  if (connState !== "connected") return null;
  return (
    <div>
      <BarVisualizer state={agentState} trackRef={audioTrack} barCount={32} />
      <VoiceAssistantControlBar />
    </div>
  );
}
