# NexuralVoiceEngine (iOS / macOS)

Swift Package wrapping the LiveKit Swift SDK + your Sage token endpoint.

## Add to your app

In Xcode: **File → Add Package Dependencies…** → enter the local file path
to `packages/voice-engine/clients/ios` or a git URL if you publish.

## Usage

```swift
import NexuralVoiceEngine

let client = VoiceEngineClient(config: .init(
    tokenEndpoint: URL(string: "https://your-app.com/api/voice/token")!,
    persona: "voice_coach",
    identity: "user-123"
))

try await client.connect()
// Now the user is in the room, mic published, agent will greet.

try await client.mute(true)
await client.disconnect()
```

That's it. Same backend that powers your Next.js client powers iOS too.
Add `NSMicrophoneUsageDescription` to your Info.plist.
