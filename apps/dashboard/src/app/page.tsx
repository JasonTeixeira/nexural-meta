import { readExternalMcps, readRegistry, readRevocations, readScorecard } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function Overview() {
  const factory = readRegistry("factory");
  const lifeops = readRegistry("lifeops");
  const scorecard = readScorecard();
  const revocations = readRevocations();
  const externals = readExternalMcps();

  return (
    <section>
      <h1 style={{ margin: 0, fontSize: "2rem" }}>Federation overview</h1>
      <p style={{ color: "#a3a3a3" }}>
        Live state of nexural-meta. Generated server-side from registries +{" "}
        <code>scorecard.json</code>.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        <Card label="Factory warehouses" value={String(factory.length)} />
        <Card label="Lifeops warehouses" value={String(lifeops.length)} />
        <Card label="External MCPs" value={String(externals.length)} />
        <Card
          label="Scorecard"
          value={scorecard.present ? `${scorecard.aggregate?.mean_score ?? 0} avg` : "—"}
        />
        <Card
          label="Revoked recipes"
          value={String(revocations.length)}
          tone={revocations.length > 0 ? "warn" : "ok"}
        />
      </div>

      {externals.length > 0 && (
        <>
          <h2 style={{ marginTop: "3rem" }}>External MCPs</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #262626", textAlign: "left" }}>
                <th style={{ padding: "0.5rem" }}>Name</th>
                <th style={{ padding: "0.5rem" }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {externals.map((m) => (
                <tr key={m.name} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "0.5rem" }}>{m.name}</td>
                  <td style={{ padding: "0.5rem" }}>{m.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <p style={{ marginTop: "3rem", color: "#737373", fontSize: "0.85rem" }}>
        Phase 4 dashboard — additional pages (costs, decay timeline, recipe gallery) populate as
        warehouses + recipes ship in Phases 5–7.
      </p>
    </section>
  );
}

function Card({
  label,
  value,
  tone = "ok",
}: {
  readonly label: string;
  readonly value: string;
  readonly tone?: "ok" | "warn";
}) {
  return (
    <div
      style={{
        background: "#171717",
        border: "1px solid #262626",
        borderRadius: 8,
        padding: "1rem 1.25rem",
      }}
    >
      <div style={{ fontSize: "0.8rem", color: "#a3a3a3" }}>{label}</div>
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          color: tone === "warn" ? "#f59e0b" : "#e5e5e5",
        }}
      >
        {value}
      </div>
    </div>
  );
}
