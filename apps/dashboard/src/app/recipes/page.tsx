import type { CSSProperties } from "react";
import { readRecipeCatalog } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function RecipesPage() {
  const catalog = readRecipeCatalog();

  return (
    <section>
      <div style={topbar}>
        <div>
          <h1 style={title}>Recipe catalog</h1>
          <p style={muted}>
            Phase 11 readiness map for every app shape the factory can generate or harden next.
          </p>
        </div>
        <code style={code}>pnpm recipe:catalog</code>
      </div>

      {!catalog.present || !catalog.totals ? (
        <p style={muted}>Missing recipe catalog. Run pnpm recipe:catalog.</p>
      ) : (
        <>
          <div style={metricGrid}>
            <Metric label="Recipes" value={String(catalog.totals.recipes)} />
            <Metric label="Forge-ready" value={String(catalog.totals.forge_ready)} />
            <Metric label="Proof-backed" value={String(catalog.totals.proof_backed)} />
            <Metric label="Avg readiness" value={`${catalog.totals.average_readiness_score}/100`} />
          </div>

          <section style={panel}>
            <h2 style={h2}>Expansion queue</h2>
            <div style={actionGrid}>
              {(catalog.next_actions ?? []).map((item) => (
                <div key={`${item.phase}-${item.action}`} style={action}>
                  <span>{item.phase}</span>
                  <strong>{item.action}</strong>
                  <p>{item.reason}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={panel}>
            <h2 style={h2}>Recipes</h2>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Recipe</th>
                  <th style={th}>Score</th>
                  <th style={th}>Band</th>
                  <th style={th}>Forge</th>
                  <th style={th}>Proof</th>
                  <th style={th}>Services</th>
                  <th style={th}>Gaps</th>
                </tr>
              </thead>
              <tbody>
                {catalog.recipes.map((recipe) => (
                  <tr key={recipe.name}>
                    <td style={tdStrong}>
                      {recipe.name}
                      <div style={description}>{recipe.description}</div>
                    </td>
                    <td style={td}>{recipe.readiness.score}</td>
                    <td style={td}>{recipe.readiness.band}</td>
                    <td style={td}>{yesNo(recipe.readiness.forge_ready)}</td>
                    <td style={td}>{yesNo(recipe.readiness.proof_backed)}</td>
                    <td style={td}>
                      {recipe.services
                        .map((service) => `${service.runtime}/${service.host}`)
                        .join(", ") || "none"}
                    </td>
                    <td style={tdMuted}>{recipe.readiness.gaps.join(", ") || "none"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </section>
  );
}

function Metric({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div style={metric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function yesNo(value: boolean) {
  return value ? "yes" : "no";
}

const topbar: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  alignItems: "flex-start",
  marginBottom: "1rem",
};
const title: CSSProperties = { margin: 0, fontSize: "2rem", letterSpacing: 0 };
const muted: CSSProperties = { color: "#9c9589", margin: "0.35rem 0 0", lineHeight: 1.5 };
const code: CSSProperties = {
  background: "#111611",
  border: "1px solid #283128",
  borderRadius: 8,
  color: "#dce8d6",
  padding: "0.55rem",
};
const metricGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "0.75rem",
  marginBottom: "1rem",
};
const metric: CSSProperties = {
  display: "grid",
  gap: "0.25rem",
  background: "#111611",
  border: "1px solid #283128",
  borderRadius: 8,
  padding: "0.85rem",
  color: "#9c9589",
};
const panel: CSSProperties = {
  background: "#101310",
  border: "1px solid #252b24",
  borderRadius: 8,
  padding: "1rem",
  marginTop: "1rem",
};
const h2: CSSProperties = { margin: "0 0 0.75rem", fontSize: "1.05rem" };
const actionGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: "0.75rem",
};
const action: CSSProperties = {
  display: "grid",
  gap: "0.25rem",
  border: "1px solid #252b24",
  borderRadius: 8,
  padding: "0.75rem",
  color: "#d7d0c2",
};
const table: CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" };
const th: CSSProperties = {
  textAlign: "left",
  color: "#8c9487",
  borderBottom: "1px solid #30372f",
  padding: "0.5rem",
};
const td: CSSProperties = {
  color: "#d7d0c2",
  borderBottom: "1px solid #20261f",
  padding: "0.55rem 0.5rem",
  verticalAlign: "top",
};
const tdStrong: CSSProperties = { ...td, color: "#f4efe4", fontWeight: 800 };
const tdMuted: CSSProperties = { ...td, color: "#aaa292", lineHeight: 1.35 };
const description: CSSProperties = {
  color: "#8c9487",
  fontSize: "0.74rem",
  lineHeight: 1.35,
  marginTop: "0.25rem",
  maxWidth: 520,
};
