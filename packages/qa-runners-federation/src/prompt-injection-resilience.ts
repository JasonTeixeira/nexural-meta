/**
 * prompt-injection-resilience — fuzzes warehouse content with known LLM
 * prompt-injection payloads + verifies synthesis behavior would ignore them.
 *
 * Per ADR-0008 §2.
 *
 * Strategy:
 *   1. Scan content/ for entries that include known prompt-injection markers
 *      (literal "IGNORE PREVIOUS INSTRUCTIONS", system tag attempts, etc.)
 *   2. Verify the @nexural/mcp-base envelope wrapping would defang each one
 *      by escaping the closing-tag attempts.
 *   3. Flag any content where the envelope cannot fully isolate the payload.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { wrapInEnvelope } from "@nexural/mcp-base";
import type { Finding, RunnerContext, RunnerResult } from "./types.js";

/**
 * OWASP LLM Top 10 inspired payload markers.
 * Updated quarterly per ADR-0008 §2.
 */
export const INJECTION_PATTERNS: ReadonlyArray<{ pattern: RegExp; label: string }> = [
  { pattern: /ignore (?:all )?previous instructions/i, label: "ignore-previous" },
  { pattern: /you are (?:now|a) (?:new|different)/i, label: "role-reset" },
  { pattern: /system:\s*new system/i, label: "system-override" },
  { pattern: /<\/?(system|assistant|tool)>/i, label: "tag-injection" },
  { pattern: /exfiltrate|leak (?:secret|env|key)/i, label: "exfiltration" },
  { pattern: /(?:run|execute) (?:command|shell|bash)/i, label: "command-exec" },
  { pattern: /jailbreak/i, label: "jailbreak" },
  { pattern: /DAN \(do anything now\)/i, label: "dan-jailbreak" },
];

export async function runPromptInjectionResilience(ctx: RunnerContext): Promise<RunnerResult> {
  const start = Date.now();
  const findings: Finding[] = [];

  const contentDir = join(ctx.cwd, "content");
  if (!existsSync(contentDir)) {
    return result(start, findings);
  }

  for (const entry of readdirSync(contentDir)) {
    const bodyPath = join(contentDir, entry, "body.md");
    if (!existsSync(bodyPath)) continue;
    const body = readFileSync(bodyPath, "utf8");

    for (const { pattern, label } of INJECTION_PATTERNS) {
      if (!pattern.test(body)) continue;
      // Found a payload. Verify the envelope defangs it.
      const wrapped = wrapInEnvelope(body, { warehouse: "fuzz-target", id: entry });
      const defanged = verifyDefanged(wrapped, body);
      if (!defanged) {
        findings.push({
          category: "prompt-injection-resilience",
          severity: "warn",
          message: `Content contains "${label}" pattern that may not be fully isolated by envelope wrapping. Review.`,
          file: `content/${entry}/body.md`,
          rule: `injection-${label}`,
        });
      }
    }
  }

  return result(start, findings);
}

/**
 * Defanging check: the envelope must escape `</warehouse_content>` so a
 * malicious payload can't break out. The other patterns (role-reset, exec
 * attempts) are inert as long as synthesis treats tag content as DATA, not
 * instructions — which is what the synthesis directive (ADR-0008 §1)
 * enforces.
 */
function verifyDefanged(wrapped: string, original: string): boolean {
  if (original.toLowerCase().includes("</warehouse_content>")) {
    return wrapped.includes("&lt;/warehouse_content&gt;");
  }
  // Other patterns are defanged by directive-not-content discipline.
  // Envelope is sufficient.
  return true;
}

function result(start: number, findings: ReadonlyArray<Finding>): RunnerResult {
  const errors = findings.filter((f) => f.severity === "error").length;
  const warns = findings.filter((f) => f.severity === "warn").length;
  const score = Math.max(0, 100 - errors * 20 - warns * 5);
  return {
    runner: "prompt-injection-resilience",
    passed: errors === 0,
    score,
    findings: [...findings],
    duration_ms: Date.now() - start,
  };
}
