/**
 * Property-based fuzz tests. Phase 11.x stress hardening.
 *
 * fast-check generates thousands of random inputs; we assert invariants
 * hold regardless. The renderer is 200 lines of regex-driven substitution
 * + the security floors of forge-emit are CRITICAL — a bug here lets
 * secrets leak or unresolved variables ship to disk.
 *
 * Each property focuses on a single invariant. The runs:50 default per
 * test is conservative; CI sets FAST_CHECK_NUM_RUNS=200 for the publish
 * pipeline.
 */

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { renderTemplate, lookup } from "../src/render.js";
import { emit } from "../src/emit.js";
import { EmitError, type EmitContext, type TemplateFile } from "../src/types.js";

const NUM_RUNS = Number(process.env.FAST_CHECK_NUM_RUNS ?? 50);

function makeCtx(
  inputs: Record<string, unknown> = {},
  secrets: Record<string, string> = {},
): EmitContext {
  return {
    inputs,
    recipe: { name: "fuzz", version: "0.1.0", description: "fuzz" },
    secrets,
    forge: { slug: "fuzz", timestamp: "2026-01-01T00:00:00Z", nexuralVersion: "1.0.0" },
  };
}

// Generators ------------------------------------------------------------------

/** Generates a string that does NOT contain template markers. */
const safeText = fc
  .stringMatching(/^[^{}<>]*$/)
  .filter((s) => !s.includes("{{") && !s.includes("}}"));

/** Identifier-shaped variable name (matches the renderer's strict regex). */
const ident = fc.stringMatching(/^[a-zA-Z_$][a-zA-Z0-9_$]{0,15}$/);

/** Random string up to 200 chars including any UTF-8. */
const anyText = fc.string({ maxLength: 200 });

/** Random valid kebab-case path segment. */
const pathSegment = fc.stringMatching(/^[a-z][a-z0-9-]{0,15}$/).filter((s) => s.length > 0);

// Properties ------------------------------------------------------------------

describe("renderTemplate — property-based fuzz", () => {
  it("never crashes on arbitrary text input + arbitrary inputs map", () => {
    fc.assert(
      fc.property(anyText, fc.dictionary(ident, fc.string({ maxLength: 50 })), (body, inputs) => {
        const ctx = makeCtx(inputs);
        // strict:false because random text rarely matches all referenced vars
        expect(() =>
          renderTemplate(body, ctx, { sourcePath: "fuzz", strict: false }),
        ).not.toThrow();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("strict mode throws EmitError (never a generic throw) on unresolved vars", () => {
    fc.assert(
      fc.property(ident, ident, (var1, var2) => {
        fc.pre(var1 !== var2);
        const body = `prefix {{ ${var1} }} suffix`;
        const ctx = makeCtx({ [var2]: "irrelevant" });
        try {
          renderTemplate(body, ctx, { sourcePath: "fuzz", strict: true });
          // If no throw, that's a bug — var1 is undefined
          throw new Error("renderer should have thrown");
        } catch (err) {
          expect(err).toBeInstanceOf(EmitError);
          expect((err as EmitError).code).toBe("unresolved_variable");
        }
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("after rendering with all vars defined, no `{{ ident }}` shape remains", () => {
    fc.assert(
      fc.property(
        fc.array(ident, { minLength: 1, maxLength: 5 }),
        fc.string({ maxLength: 30 }).filter((s) => !s.includes("{{") && !s.includes("}}")),
        (idents, val) => {
          const inputs: Record<string, string> = {};
          for (const id of idents) inputs[id] = val;
          const body = idents.map((id) => `{{ ${id} }}`).join(" ");
          const { text } = renderTemplate(body, makeCtx(inputs), {
            sourcePath: "fuzz",
            strict: true,
          });
          // No template-marker shape should remain (allow stray non-ident braces)
          const STRICT_MARKER = /\{\{\s*[a-zA-Z_$][a-zA-Z0-9_$.]*\s*\}\}/;
          expect(STRICT_MARKER.test(text)).toBe(false);
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it("JSX inline styles (`{{ key: value }}`) are NEVER mistaken for variables", () => {
    fc.assert(
      fc.property(
        fc.array(fc.tuple(ident, fc.integer({ min: 0, max: 9999 })), {
          minLength: 1,
          maxLength: 3,
        }),
        (pairs) => {
          // Build a JSX-shaped style object inside double-braces
          const styleBody = pairs.map(([k, v]) => `${k}: ${v}`).join(", ");
          const body = `<main style={{ ${styleBody} }}>x</main>`;
          const { text } = renderTemplate(body, makeCtx({}), {
            sourcePath: "fuzz",
            strict: true,
          });
          // The JSX should be left untouched.
          expect(text).toBe(body);
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it("if/unless blocks always remove their content when expression is empty/false/0", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("", "false", "0", "null", "undefined"),
        safeText.filter((s) => s.length > 0 && !s.includes("\n")),
        (falsy, inner) => {
          const body = `before{{# if flag }}${inner}{{/if}}after`;
          const { text } = renderTemplate(body, makeCtx({ flag: falsy }), {
            sourcePath: "fuzz",
            strict: true,
          });
          expect(text).toBe("beforeafter");
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it("default values fire only when var is missing", () => {
    fc.assert(
      fc.property(ident, fc.string({ maxLength: 20 }), (id, dflt) => {
        fc.pre(!dflt.includes('"') && !dflt.includes("\\"));
        // No value for the ident → default should fire
        const body = `value={{ ${id} | default:"${dflt}" }}`;
        const { text } = renderTemplate(body, makeCtx({}), { sourcePath: "fuzz", strict: true });
        expect(text).toBe(`value=${dflt}`);
      }),
      { numRuns: NUM_RUNS },
    );
  });
});

describe("emit() — property-based fuzz", () => {
  it("never silently leaks a secret value into emitted content", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 8, maxLength: 80 }), // secret value
        ident, // secret name
        (secret, name) => {
          // Build a template that DIRECTLY contains the literal secret value
          const tmpl: TemplateFile = {
            sourcePath: "leak.ts",
            targetPath: "leak.ts",
            body: `const k = "${secret}";`,
          };
          try {
            emit([tmpl], makeCtx({}, { [name]: secret }));
            // If we reach here, the secret was emitted — that's a bug
            throw new Error(`secret leaked through: ${name}=${secret.slice(0, 8)}…`);
          } catch (err) {
            expect(err).toBeInstanceOf(EmitError);
            expect((err as EmitError).code).toBe("secret_leak");
          }
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it("rejects any path containing traversal segments", () => {
    fc.assert(
      fc.property(fc.array(pathSegment, { minLength: 0, maxLength: 3 }), (segments) => {
        const target = ["..", ...segments].join("/");
        const tmpl: TemplateFile = { sourcePath: "x", targetPath: target, body: "x" };
        expect(() => emit([tmpl], makeCtx())).toThrow(EmitError);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("rejects absolute target paths", () => {
    fc.assert(
      fc.property(fc.array(pathSegment, { minLength: 1, maxLength: 3 }), (segments) => {
        const target = "/" + segments.join("/");
        const tmpl: TemplateFile = { sourcePath: "x", targetPath: target, body: "x" };
        expect(() => emit([tmpl], makeCtx())).toThrow(EmitError);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("rejects duplicate target paths regardless of source ordering", () => {
    fc.assert(
      fc.property(
        fc.array(pathSegment, { minLength: 1, maxLength: 3 }),
        fc.string({ maxLength: 30 }),
        fc.string({ maxLength: 30 }),
        (segments, body1, body2) => {
          const target = segments.join("/");
          const tmpls: TemplateFile[] = [
            { sourcePath: "a", targetPath: target, body: body1 },
            { sourcePath: "b", targetPath: target, body: body2 },
          ];
          expect(() => emit(tmpls, makeCtx())).toThrow(EmitError);
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it("with valid inputs, emit() always succeeds and file count = template count", () => {
    fc.assert(
      fc.property(fc.array(pathSegment, { minLength: 1, maxLength: 5 }), (paths) => {
        const seen = new Set<string>();
        const tmpls: TemplateFile[] = [];
        for (const p of paths) {
          if (seen.has(p)) continue;
          seen.add(p);
          tmpls.push({ sourcePath: p, targetPath: `${p}.ts`, body: "// content" });
        }
        if (tmpls.length === 0) return;
        const result = emit(tmpls, makeCtx());
        expect(result.files.length).toBe(tmpls.length);
      }),
      { numRuns: NUM_RUNS },
    );
  });
});

describe("lookup — property-based", () => {
  it("returns undefined for any unknown root", () => {
    fc.assert(
      fc.property(ident, ident, (root, leaf) => {
        // Skip the four known roots
        fc.pre(!["inputs", "recipe", "secrets", "forge"].includes(root));
        const ctx = makeCtx({});
        const result = lookup(`${root}.${leaf}`, ctx);
        // Bare names default to inputs.* — also undefined here
        expect(result).toBeUndefined();
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it("retrieves any value placed under inputs", () => {
    fc.assert(
      fc.property(
        ident,
        fc.oneof(fc.string({ maxLength: 30 }), fc.integer(), fc.boolean()),
        (key, value) => {
          const ctx = makeCtx({ [key]: value });
          expect(lookup(`inputs.${key}`, ctx)).toBe(value);
          expect(lookup(key, ctx)).toBe(value); // bare-name access
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });
});
