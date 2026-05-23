# ADR-0001: LiveKit Agents over Pipecat for the voice runtime

**Status:** Accepted (2026-05-22)
**Owner:** Sage
**Supersedes:** —

## Context

The engine needs an orchestration framework that handles WebRTC media,
VAD, turn detection, STT/LLM/TTS plugin contracts, interruption, and
ideally telephony. The two serious open-source options are
**LiveKit Agents** and **Pipecat** (Daily.co).

## Decision

Use **LiveKit Agents 1.5+** as the runtime. Python first.

## Rationale

- **Clients on every platform.** LiveKit ships first-class SDKs for
  Web, iOS, Android, React Native, Flutter, Unity. Pipecat clients
  exist but are less complete. We will ship voice across all surfaces
  of Sage Ideas products; uniform clients matter.
- **Built-in turn-detector model.** Open-weight multilingual model
  (97% TNR, 14 languages). Pipecat's Smart Turn v3 is comparable but
  not bundled.
- **Native MCP support.** First-class — fits our "MCP as the content
  swap layer" pattern.
- **Telephony.** LiveKit SIP is a config change, not a rewrite.
- **WebRTC ownership.** LiveKit owns the media stack end-to-end. With
  Pipecat we'd pair it with Daily or another transport — more moving
  parts.

## Trade-offs accepted

- Pipecat has a cleaner pipeline-as-frames programming model. We give
  that up. If/when we need to ship a non-WebRTC transport (raw
  WebSocket bot, in-process embedded), we'd revisit Pipecat or
  TEN-framework.
- LiveKit's plugin API has shifted between 1.4 → 1.5. Pinning at
  `==1.5.12` (ADR-0005) is our mitigation.

## Consequences

- The runtime is built around LiveKit's `AgentSession` and
  `function_tool` patterns.
- Per-app MCP servers are the recommended way to add tools; we don't
  build a separate tool DSL.
- Mobile clients are thin wrappers around the LiveKit Swift / Kotlin /
  RN SDKs (see `clients/`).

## Revisit triggers

- LiveKit Agents stops shipping new releases for 3+ months.
- A LK Agents minor version breaks our wire interface twice in a row.
- An alternative framework ships first-class clients on all platforms
  AND a turn-detector AND MCP-native tool support.
