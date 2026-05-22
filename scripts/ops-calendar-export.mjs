#!/usr/bin/env node
/**
 * ops-calendar-export.mjs — emit .ics from OPS_CALENDAR.md per ADR-0010 §2.2.
 *
 * Sage subscribes to this file in macOS Calendar / Google Calendar:
 *   webcal://<host>/nexural-ops.ics
 *
 * For now: writes nexural-ops.ics in repo root. Phase 8 will publish to nexural.dev.
 *
 * Usage:
 *   node scripts/ops-calendar-export.mjs > nexural-ops.ics
 *   node scripts/ops-calendar-export.mjs --out=~/nexural-ops.ics
 */

import { writeFile } from "node:fs/promises";

const ARGS = parseArgs(process.argv.slice(2));

const NOW = new Date();
const NEXT_MONDAY = nextMonday(NOW);
const NEXT_QUARTER_START = nextQuarterStart(NOW);
const NEXT_BIRTHDAY = nextBirthday(NOW); // placeholder; Sage edits to real date

const EVENTS = [
  // Weekly
  {
    summary: "Review weekly digest",
    rrule: "FREQ=WEEKLY;BYDAY=MO",
    dtstart: setTime(NEXT_MONDAY, 13, 30),
    duration: 15,
    description: "Per OPS_CALENDAR §2. Open weekly Resend digest; action items.",
  },
  {
    summary: "Triage inbox (new tools / patterns spotted)",
    rrule: "FREQ=WEEKLY;BYDAY=TU",
    dtstart: setTime(addDays(NEXT_MONDAY, 1), 13, 0),
    duration: 15,
  },
  {
    summary: "Renovate PR review pass",
    rrule: "FREQ=WEEKLY;BYDAY=WE",
    dtstart: setTime(addDays(NEXT_MONDAY, 2), 13, 0),
    duration: 30,
  },
  {
    summary: "Dogfood drill — forge a throwaway app",
    rrule: "FREQ=WEEKLY;BYDAY=TH",
    dtstart: setTime(addDays(NEXT_MONDAY, 3), 13, 0),
    duration: 30,
  },
  // Monthly (last Monday)
  {
    summary: "Monthly: backup restore drill",
    rrule: "FREQ=MONTHLY;BYDAY=-1MO",
    dtstart: setTime(lastMondayOfMonth(NOW), 13, 0),
    duration: 60,
  },
  {
    summary: "Monthly: cost audit (actual vs envelope)",
    rrule: "FREQ=MONTHLY;BYDAY=-1MO",
    dtstart: setTime(lastMondayOfMonth(NOW), 14, 0),
    duration: 60,
  },
  // Quarterly (calendar Q boundary)
  {
    summary: "Quarterly: lifecycle drill",
    rrule: "FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=1",
    dtstart: setTime(NEXT_QUARTER_START, 14, 0),
    duration: 30,
  },
  {
    summary: "Quarterly: YubiKey health check",
    rrule: "FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=1",
    dtstart: setTime(NEXT_QUARTER_START, 14, 30),
    duration: 15,
  },
  {
    summary: "Quarterly: cold-start drill",
    rrule: "FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=1",
    dtstart: setTime(NEXT_QUARTER_START, 15, 0),
    duration: 60,
  },
  {
    summary: "Quarterly: tabletop security exercise",
    rrule: "FREQ=MONTHLY;INTERVAL=3;BYMONTHDAY=1",
    dtstart: setTime(NEXT_QUARTER_START, 16, 0),
    duration: 30,
  },
  // Annual (birthday placeholder)
  {
    summary: "Annual: YubiKey + age key rotation",
    rrule: "FREQ=YEARLY",
    dtstart: setTime(NEXT_BIRTHDAY, 9, 0),
    duration: 240,
    description: "Per OPS_CALENDAR §5. Rotate YubiKey pair; re-encrypt private tier.",
  },
  {
    summary: "Annual: Shamir share verification",
    rrule: "FREQ=YEARLY",
    dtstart: setTime(addDays(NEXT_BIRTHDAY, 1), 14, 0),
    duration: 60,
  },
  {
    summary: "Annual: 1Password Emergency Kit verification",
    rrule: "FREQ=YEARLY",
    dtstart: setTime(addDays(NEXT_BIRTHDAY, 2), 14, 0),
    duration: 30,
  },
  {
    summary: "Annual: SUCCESSION dry-run with Technical Executor",
    rrule: "FREQ=YEARLY",
    dtstart: setTime(addDays(NEXT_BIRTHDAY, 3), 13, 0),
    duration: 120,
  },
];

const ics = renderIcs(EVENTS);
if (ARGS.out) {
  await writeFile(ARGS.out.replace(/^~/, process.env.HOME), ics, "utf8");
  console.log(`✓ wrote ${ARGS.out}`);
} else {
  process.stdout.write(ics);
}

function parseArgs(argv) {
  const args = { out: null };
  for (const a of argv) {
    if (a.startsWith("--out=")) args.out = a.split("=")[1];
  }
  return args;
}

function renderIcs(events) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nexural//OPS Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Nexural Ops",
    "X-WR-TIMEZONE:UTC",
  ];
  let counter = 0;
  for (const e of events) {
    const uid = `nexural-ops-${++counter}@${process.env.HOSTNAME ?? "local"}`;
    const dtstart = toIcsTime(e.dtstart);
    const dtend = toIcsTime(addMinutes(e.dtstart, e.duration));
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${toIcsTime(NOW)}`);
    lines.push(`DTSTART:${dtstart}`);
    lines.push(`DTEND:${dtend}`);
    lines.push(`SUMMARY:${escapeIcs(e.summary)}`);
    if (e.rrule) lines.push(`RRULE:${e.rrule}`);
    if (e.description) lines.push(`DESCRIPTION:${escapeIcs(e.description)}`);
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

function escapeIcs(s) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function toIcsTime(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function setTime(d, hours, minutes) {
  const out = new Date(d);
  out.setUTCHours(hours, minutes, 0, 0);
  return out;
}

function addDays(d, days) {
  return new Date(d.getTime() + days * 86_400_000);
}

function addMinutes(d, mins) {
  return new Date(d.getTime() + mins * 60_000);
}

function nextMonday(from) {
  const d = new Date(from);
  const day = d.getUTCDay();
  const diff = (1 - day + 7) % 7 || 7;
  return addDays(d, diff);
}

function lastMondayOfMonth(from) {
  // Last Monday of *current* month
  const d = new Date(from);
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
  const offset = (lastDay.getUTCDay() + 6) % 7;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, -offset));
}

function nextQuarterStart(from) {
  const month = from.getUTCMonth();
  const nextQ = [0, 3, 6, 9, 12].find((m) => m > month) ?? 12;
  return new Date(Date.UTC(from.getUTCFullYear() + (nextQ === 12 ? 1 : 0), nextQ % 12, 1));
}

function nextBirthday(from) {
  // Placeholder — Sage edits to real birthday. Default: Jan 1 next year.
  return new Date(Date.UTC(from.getUTCFullYear() + 1, 0, 1));
}
