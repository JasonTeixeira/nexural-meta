# Voice cloning — make every Sage product sound like _yours_

The shipped personas use provider default voices. "Premium" is
ultimately your own branded voice — cloned once, used everywhere.

## Which provider clones best in 2026

| Provider                                | Sample needed                     | Quality          | Latency add   | License-safe?           |
| --------------------------------------- | --------------------------------- | ---------------- | ------------- | ----------------------- |
| **Cartesia Sonic 3 — Instant Clone**    | 3 sec audio                       | Excellent        | 0 (same TTFA) | ✓ click-through         |
| **ElevenLabs Professional Voice Clone** | 30+ min audio                     | Best in industry | 0             | ✓ explicit consent flow |
| **ElevenLabs Instant Voice Clone**      | 1 min audio                       | Very good        | 0             | ✓ click-through         |
| **Hume Octave 2 voice design**          | text description                  | Good (synthetic) | 0             | ✓                       |
| **OpenAI gpt-4o-mini-tts**              | (no cloning — preset voices only) | —                | —             | —                       |

**Recommendation:** Cartesia Instant Clone for fast iteration; ElevenLabs
Professional for the _one_ voice that's your brand.

## Clone your voice (Cartesia, ~5 minutes)

1. Go to https://play.cartesia.ai/voices → Create voice → Instant clone.
2. Record or upload 3–10 seconds of clean speech. Quiet room. Native
   delivery.
3. Cartesia returns a voice ID like `f47a-…`.
4. In any persona YAML:
   ```yaml
   tts:
     provider: cartesia
     voice: f47a-9b21-… # your cloned voice ID
   ```
5. Restart the worker. Done.

## Clone your voice (ElevenLabs, ~30 minutes)

1. Go to https://elevenlabs.io/app/voice-library → Add voice →
   Professional Voice Clone.
2. Upload ≥30 minutes of clean, varied audio. Pay the consent fee
   (~$22) and verify identity.
3. ElevenLabs trains for ~24h. You receive a voice ID.
4. In the persona:
   ```yaml
   tts:
     provider: elevenlabs
     model: eleven_flash_v2_5 # fastest, for agents
     voice: your-voice-id-here
   ```

Use `eleven_multilingual_v2` if you need non-English; expect ~80ms
higher TTFA than Flash.

## A voice library for Sage Ideas

Keep brand voices in a registry — one cloned voice ID, multiple personas
referencing it. Suggested file `personas/_base/voices.yaml` (future):

```yaml
sage_warm:
  provider: cartesia
  voice: f47a-9b21-…
  notes: "Warm conversational — coaching, support, journaling"
sage_brief:
  provider: cartesia
  voice: 8c1a-…
  notes: "Brisk — sales, receptionist, fitness"
```

Persona TTS blocks can reference these via `extends:` once we add voice
registry support (TODO in P5).

## Ethics & legality

- **Cloning your own voice:** fine everywhere.
- **Cloning anyone else's voice:** requires explicit, recorded consent.
  Both Cartesia and ElevenLabs gate Professional clones behind a
  consent flow.
- **EU AI Act:** voice clones used in customer-facing products must be
  disclosed as AI to the listener. Bake "I'm an AI assistant" into the
  greeting of any persona used in a regulated jurisdiction.
- **Impersonation:** never clone a public figure, even for parody — most
  providers' ToS prohibit this and US/EU law is tightening.

## Cost shape

- Cartesia Pro: ~$50/mo + usage.
- ElevenLabs Creator: $22/mo, Pro $99/mo, Scale tiers above.
- TTS usage scales with characters spoken; see SETUP.md for $/1M chars.

For Sage Ideas internal use — one branded voice across all products —
the Cartesia $50/mo tier is the sweet spot.
