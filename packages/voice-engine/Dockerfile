# Multi-stage Dockerfile — one image, persona chosen at runtime.
# Build:   docker build -t nexural-voice .
# Run:     docker run --env-file .env -e VOICE_PERSONA=personas/voice_coach.yaml nexural-voice
#
# For Fly.io: see fly.toml.example. One Fly app per persona is the
# default — let the persona define the agent identity.

# ─── 1) builder — installs Python deps once, caches the layer ────────
FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /build

# System deps for onnxruntime + audio + grpc
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        libsndfile1 \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
COPY src ./src

RUN pip install --upgrade pip && pip install .

# ─── 2) runtime — slim final image ────────────────────────────────────
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    LOG_LEVEL=INFO \
    VOICE_TELEMETRY_DB=/data/telemetry.sqlite \
    VOICE_TELEMETRY_JSONL=/data/telemetry.jsonl

RUN apt-get update && apt-get install -y --no-install-recommends \
        libsndfile1 \
        ca-certificates \
        curl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -m -u 1001 voice \
    && mkdir -p /data \
    && chown -R voice:voice /data

# Copy installed site-packages + console scripts from builder.
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin/nx-voice /usr/local/bin/nx-voice

# Default to /app/personas; override by mounting or VOICE_PERSONA env var.
WORKDIR /app
COPY personas ./personas

USER voice

# Healthcheck — just verifies the CLI is importable.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD nx-voice --help > /dev/null || exit 1

# Pre-download the turn-detector model so cold start doesn't hang.
RUN python -m livekit.plugins.turn_detector.multilingual --download || true

# Entrypoint: serve the persona named in VOICE_PERSONA, default to voice_coach.
ENV VOICE_PERSONA=personas/voice_coach.yaml
ENTRYPOINT ["sh", "-c", "nx-voice serve --persona \"$VOICE_PERSONA\" -- start"]
