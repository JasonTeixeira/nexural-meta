"""Guardrails — pattern-based filters that complement the LLM-based moderation.

Layered defence:
  1. Jailbreak detection — regex + heuristic (cheap, sync). Catches the
     common attack patterns instantly before paying for an LLM call.
  2. PII redaction — strips emails/phones/credit cards/SSNs from text
     before it's written to memory or transcripts. Applies to medical,
     financial, legal personas by default.
  3. Output shape validation — when a persona has `output_schema`, this
     module is what `submit_output` calls to enforce the Pydantic schema.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Iterable

# ─────────────────────────────────────────────────────────────────────────────
# Jailbreak detection
# ─────────────────────────────────────────────────────────────────────────────

# Patterns are over-broad on purpose — false positives are cheap (we just ask
# the user to rephrase). False negatives leak into the LLM context.
_JAILBREAK_PATTERNS = [
    r"\bignore (?:all |any |the |your |previous |prior )?(?:above|previous|prior) instructions?\b",
    r"\bdisregard (?:all |any |the )?(?:above|previous|prior) instructions?\b",
    r"\bforget (?:all |any |the )?(?:above|previous|prior) instructions?\b",
    r"\byou are now (?:a |an )?(?:DAN|jailbroken|unrestricted)\b",
    r"\bact as (?:if |though )?(?:you (?:have|had) no )?(?:restrictions|filters|guardrails|safety)\b",
    r"\bpretend (?:you are |to be )(?:not |never )?(?:bound|restricted|filtered)\b",
    r"\boverride your (?:system|safety|content|programming)\b",
    r"\benter (?:developer|debug|admin|god) mode\b",
    r"```\s*(?:system|admin|root)\s*:",
    r"<\s*\|?\s*system\s*\|?\s*>",
    r"\[\[\s*SYSTEM\s*\]\]",
]

_JAILBREAK_RE = re.compile("|".join(_JAILBREAK_PATTERNS), re.IGNORECASE)


@dataclass
class JailbreakResult:
    detected: bool
    matched_pattern: str | None = None


def detect_jailbreak(text: str) -> JailbreakResult:
    """Heuristic scan. Sync, ~microseconds. False positives acceptable."""
    if not text:
        return JailbreakResult(detected=False)
    m = _JAILBREAK_RE.search(text)
    if m:
        return JailbreakResult(detected=True, matched_pattern=m.group(0))
    return JailbreakResult(detected=False)


# ─────────────────────────────────────────────────────────────────────────────
# PII redaction
# ─────────────────────────────────────────────────────────────────────────────

_PII_PATTERNS: dict[str, re.Pattern[str]] = {
    "EMAIL": re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"),
    # US phone — loose, also matches international with country code
    "PHONE": re.compile(
        r"(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b"
    ),
    # Credit-card-shaped (13-19 digits with optional spaces/dashes)
    "CREDIT_CARD": re.compile(r"\b(?:\d[ -]?){13,19}\b"),
    # SSN
    "SSN": re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
}


@dataclass
class RedactionResult:
    text: str
    redactions: dict[str, int]  # category → count


def redact_pii(
    text: str,
    *,
    categories: Iterable[str] | None = None,
) -> RedactionResult:
    """Replace matched PII with [REDACTED_<CATEGORY>].

    `categories`: restrict to a subset (default: all known).
    """
    if not text:
        return RedactionResult(text=text, redactions={})
    keys = list(categories) if categories else list(_PII_PATTERNS.keys())
    out = text
    counts: dict[str, int] = {}
    for cat in keys:
        pat = _PII_PATTERNS.get(cat)
        if not pat:
            continue
        matches = pat.findall(out)
        if matches:
            counts[cat] = len(matches)
            out = pat.sub(f"[REDACTED_{cat}]", out)
    return RedactionResult(text=out, redactions=counts)


# ─────────────────────────────────────────────────────────────────────────────
# Friendly refusal text — used when guardrails block input
# ─────────────────────────────────────────────────────────────────────────────


REFUSAL_JAILBREAK = (
    "I'd rather stick to what we're working on together. "
    "What were you hoping to do?"
)

REFUSAL_UNSAFE_CONTENT = (
    "Let's steer this somewhere else — what else can I help with?"
)
