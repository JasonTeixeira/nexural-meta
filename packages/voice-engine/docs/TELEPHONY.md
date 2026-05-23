# Telephony — call your AI on the phone

LiveKit Cloud bridges SIP ↔ WebRTC natively. The same agent that
answers a web browser answers a phone call — **no code change** to the
engine or the persona. Only the trunk + dispatch rule change.

This guide gets you from "deployed voice agent" to "phone number that
calls it" in ~20 minutes.

## What you need

- A deployed worker (see [DEPLOY.md](../DEPLOY.md)) — let's assume
  `receptionist` is live as `nexural-voice-receptionist` on Fly.
- A SIP trunk provider. Cheapest serious options:
  - **Telnyx** (recommended) — best LiveKit integration, cheapest US.
  - **Twilio** — most carrier reach, expensive.
  - **Plivo** — Twilio alternative.

## Telnyx + LiveKit (recommended, ~$0.005/min)

### 1. Telnyx side

1. Sign up at https://telnyx.com.
2. **Numbers** → buy a US local or toll-free number (~$1/mo).
3. **SIP Connections** → create a Credentials connection. Note the
   username + password.
4. **Outbound Voice Profile** → create one, attach the connection.
5. Bind the number to the SIP connection's inbound rule.

### 2. LiveKit side

Use `livekit-cli` (or the dashboard):

```bash
# Inbound trunk — accept Telnyx → LiveKit.
lk sip inbound create \
  --name "receptionist-inbound" \
  --numbers "+15558675309"

# Dispatch rule — every call goes into a fresh room running the
# `receptionist` agent.
lk sip dispatch create \
  --rule '{"type":"individual","roomPrefix":"reception-"}' \
  --agent receptionist
```

### 3. Telnyx outbound to LiveKit

In Telnyx **Outbound Voice Profile** SIP setting, point to LiveKit's
SIP URI (from the dashboard, e.g. `sip:<project>.sip.livekit.cloud`).

### 4. Test

Call your Telnyx number. Within ~2 seconds, the agent greets you in
your ear.

## Twilio (use only if Telnyx isn't an option)

Same flow with Twilio Elastic SIP Trunking. LiveKit has a step-by-step
guide: https://docs.livekit.io/sip/quickstarts/twilio/

## Telephony-specific tuning

Phone audio is narrowband (8kHz) and noisy. Tweak in the persona:

```yaml
turn_detection:
  use_noise_cancellation: true # essential on phone
  min_endpointing_delay:
    0.4 # slightly tighter than web — callers
    # expect snappier turn-taking on phone
```

Realtime personas are usually fine. Cascaded personas: Deepgram Nova-3
handles narrowband well out of the box.

## DTMF (touch-tone) input

LiveKit emits DTMF as room events. If you need IVR-style menus, listen
for them in a custom Agent subclass — or skip menus entirely and let
the LLM handle "press 1 for…" verbally. Voice agents make IVR feel
ancient; consider whether you need DTMF at all.

## Cost shape

- Telnyx US local minute: ~$0.005 in, ~$0.012 out.
- LiveKit SIP: included in LiveKit Cloud minutes.
- Voice engine providers: as cascaded ($0.04/min) or realtime
  ($0.10/min).

Realistic blended cost for inbound `receptionist` at 1k mins/mo: ~$60.

## When you need PSTN compliance (US)

For US business use you may need:

- Caller ID name registration (Telnyx + STIR/SHAKEN).
- TCPA consent flow if you initiate outbound calls — handle in your
  app layer before dispatching the worker.
- 911 service if you publish numbers as primary contact.

The engine doesn't enforce any of this; treat telephony compliance as
an app-layer concern.
