/**
 * @nexural/voice-engine-client-rn
 *
 * React Native client for any Nexural voice persona. Same backend
 * (token endpoint + LiveKit Cloud) that powers web and iOS.
 */

import { useCallback, useEffect, useState } from "react";
import {
  AudioSession,
  LiveKitRoom,
  registerGlobals,
  useTracks,
  useVoiceAssistant,
} from "@livekit/react-native";

// Required once at app boot to install WebRTC globals.
registerGlobals();

export type MintedToken = {
  token: string;
  url: string;
  room: string;
  identity: string;
  agent: string;
};

export type ConnectOptions = {
  tokenEndpoint: string;
  persona: string;
  identity: string;
};

/** Fetch a fresh token + start the platform audio session. */
export async function fetchVoiceToken(opts: ConnectOptions): Promise<MintedToken> {
  const url = `${opts.tokenEndpoint}?identity=${encodeURIComponent(opts.identity)}&agent=${encodeURIComponent(opts.persona)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`token endpoint ${res.status}`);
  return (await res.json()) as MintedToken;
}

/** Hook that owns connect/disconnect for a single persona. */
export function useVoiceConnection(opts: ConnectOptions) {
  const [conn, setConn] = useState<MintedToken | null>(null);
  const [state, setState] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setState("connecting");
    setError(null);
    try {
      await AudioSession.startAudioSession();
      const tok = await fetchVoiceToken(opts);
      setConn(tok);
      setState("connected");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setState("error");
    }
  }, [opts.tokenEndpoint, opts.persona, opts.identity]);

  const disconnect = useCallback(async () => {
    setConn(null);
    setState("idle");
    await AudioSession.stopAudioSession();
  }, []);

  useEffect(
    () => () => {
      void AudioSession.stopAudioSession();
    },
    [],
  );

  return { state, connection: conn, error, connect, disconnect };
}

export { LiveKitRoom, useTracks, useVoiceAssistant };
