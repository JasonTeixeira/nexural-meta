# @nexural/voice-engine-client-rn

React Native client for Nexural voice personas. Same token endpoint as
web + iOS.

## Install

```bash
pnpm add @nexural/voice-engine-client-rn \
         @livekit/react-native @livekit/react-native-webrtc
```

iOS pod install + add mic permission to Info.plist. Android: add
`RECORD_AUDIO` to AndroidManifest.

## Usage

```tsx
import {
  useVoiceConnection,
  LiveKitRoom,
  useVoiceAssistant,
} from "@nexural/voice-engine-client-rn";

function Coach() {
  const { state, connection, connect, disconnect } = useVoiceConnection({
    tokenEndpoint: "https://your-app.com/api/voice/token",
    persona: "voice_coach",
    identity: "user-123",
  });

  if (!connection) return <Button title="Talk" onPress={connect} />;

  return (
    <LiveKitRoom token={connection.token} serverUrl={connection.url} connect audio>
      <AgentVisualizer />
      <Button title="End" onPress={disconnect} />
    </LiveKitRoom>
  );
}

function AgentVisualizer() {
  const { state } = useVoiceAssistant();
  return <Text>{state}</Text>;
}
```

That's the whole client — same shape as the React package.
