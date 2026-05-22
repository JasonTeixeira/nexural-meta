import { describe, it, expect } from "vitest";
import { renderTemplate, lookup } from "../src/render.js";
import { EmitError, type EmitContext } from "../src/types.js";

function ctx(
  inputs: Record<string, unknown> = {},
  secrets: Record<string, string> = {},
): EmitContext {
  return {
    inputs,
    recipe: { name: "test-recipe", version: "0.1.0", description: "test" },
    secrets,
    forge: { slug: "test-app", timestamp: "2026-05-22T00:00:00Z", nexuralVersion: "0.1.0" },
  };
}

describe("renderTemplate", () => {
  it("substitutes a bare variable from inputs", () => {
    const { text } = renderTemplate("hello {{ slug }}", ctx({ slug: "world" }), {
      sourcePath: "t",
      strict: true,
    });
    expect(text).toBe("hello world");
  });

  it("substitutes a dotted path through namespaces", () => {
    const { text } = renderTemplate("{{ recipe.name }}@{{ recipe.version }}", ctx(), {
      sourcePath: "t",
      strict: true,
    });
    expect(text).toBe("test-recipe@0.1.0");
  });

  it("uses default when variable missing", () => {
    const { text, warnings } = renderTemplate(`name={{ undef | default:"fallback" }}`, ctx(), {
      sourcePath: "t",
      strict: true,
    });
    expect(text).toBe("name=fallback");
    expect(warnings.some((w) => w.code === "default_applied")).toBe(true);
  });

  it("throws in strict mode on unknown variable", () => {
    expect(() => renderTemplate("hi {{ nope }}", ctx(), { sourcePath: "t", strict: true })).toThrow(
      EmitError,
    );
  });

  it("leaves unknown variable as marker in non-strict mode", () => {
    const { text } = renderTemplate("hi {{ nope }}", ctx(), { sourcePath: "t", strict: false });
    expect(text).toBe("hi {{ nope }}");
  });

  it("resolves {{# if }} truthy block", () => {
    const tmpl = `{{# if useAuth }}enable_auth{{/if}}`;
    const { text } = renderTemplate(tmpl, ctx({ useAuth: true }), {
      sourcePath: "t",
      strict: true,
    });
    expect(text).toBe("enable_auth");
  });

  it("removes {{# if }} falsy block", () => {
    const tmpl = `before{{# if useAuth }}drop{{/if}}after`;
    const { text } = renderTemplate(tmpl, ctx({ useAuth: false }), {
      sourcePath: "t",
      strict: true,
    });
    expect(text).toBe("beforeafter");
  });

  it("resolves {{# unless }} block (truthy keeps falsy = inner)", () => {
    const tmpl = `{{# unless skip }}KEEP{{/unless}}`;
    const { text } = renderTemplate(tmpl, ctx({ skip: false }), {
      sourcePath: "t",
      strict: true,
    });
    expect(text).toBe("KEEP");
  });

  it("removes {{# unless }} when expression is truthy", () => {
    const tmpl = `{{# unless skip }}drop{{/unless}}`;
    const { text } = renderTemplate(tmpl, ctx({ skip: true }), {
      sourcePath: "t",
      strict: true,
    });
    expect(text).toBe("");
  });

  it("treats empty string, 'false', '0' as falsy", () => {
    const expectations: Array<[unknown, string]> = [
      ["", "no"],
      ["false", "no"],
      ["0", "no"],
      ["true", "yes"],
      ["1", "yes"],
      [0, "no"],
      [1, "yes"],
    ];
    for (const [val, want] of expectations) {
      const { text } = renderTemplate(
        "{{# if v }}yes{{/if}}{{# unless v }}no{{/unless}}",
        ctx({ v: val }),
        {
          sourcePath: "t",
          strict: true,
        },
      );
      expect(text).toBe(want);
    }
  });

  it("stringifies numbers, booleans, arrays", () => {
    const { text } = renderTemplate(
      "{{ n }}|{{ b }}|{{ arr }}",
      ctx({ n: 42, b: true, arr: ["a", "b"] }),
      {
        sourcePath: "t",
        strict: true,
      },
    );
    expect(text).toBe(`42|true|["a","b"]`);
  });

  it("renders into the secrets namespace by reference (not value)", () => {
    // Template referencing secrets.foo should produce the value if the
    // template author asks for it. Secret-LEAK prevention is enforced in
    // emit.ts (separate test).
    const { text } = renderTemplate("k={{ secrets.foo }}", ctx({}, { foo: "supersecret" }), {
      sourcePath: "t",
      strict: true,
    });
    expect(text).toBe("k=supersecret");
  });
});

describe("lookup", () => {
  it("returns undefined for unknown root", () => {
    expect(lookup("bogus.path", ctx())).toBe(undefined);
  });
  it("returns undefined when traversing through null", () => {
    expect(lookup("inputs.a.b", ctx({ a: null }))).toBe(undefined);
  });
});
