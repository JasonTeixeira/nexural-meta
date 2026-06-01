import {
  readEcosystemRegistry,
  readEcosystemResourceMap,
  readEcosystemScorecard,
  readExternalMcps,
  readGoldenPathRuns,
  readPublicProofLayer,
  readRegistry,
  readRevocations,
  readScorecard,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default function Overview() {
  const factory = readRegistry("factory");
  const lifeops = readRegistry("lifeops");
  const scorecard = readScorecard();
  const revocations = readRevocations();
  const externals = readExternalMcps();
  const ecosystem = readEcosystemRegistry();
  const ecosystemScore = readEcosystemScorecard();
  const resourceMap = readEcosystemResourceMap();
  const goldenPath = readGoldenPathRuns();
  const publicProof = readPublicProofLayer();

  return (
    <section>
      <h1 style={{ margin: 0, fontSize: "2rem" }}>Engineering OS overview</h1>
      <p style={{ color: "#a3a3a3" }}>
        Live state of the Sage Ideas control plane. Generated server-side from registries,
        scorecards, evidence, and ecosystem inventory.
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
          value={scorecard.present ? `${scorecard.aggregate?.mean_score ?? 0} avg` : "-"}
        />
        <Card
          label="Revoked recipes"
          value={String(revocations.length)}
          tone={revocations.length > 0 ? "warn" : "ok"}
        />
        <Card
          label="Ecosystem repos"
          value={ecosystem.present ? String(ecosystem.totals?.total ?? 0) : "-"}
        />
        <Card
          label="Load-bearing avg"
          value={
            ecosystemScore.present
              ? `${ecosystemScore.totals?.load_bearing_average_score ?? 0}/100`
              : "-"
          }
          tone={(ecosystemScore.totals?.load_bearing_average_score ?? 0) < 70 ? "warn" : "ok"}
        />
        <Card
          label="Resource use cases"
          value={resourceMap.present ? String(resourceMap.totals?.use_cases ?? 0) : "-"}
        />
        <Card
          label="Golden path"
          value={
            goldenPath.present
              ? `${goldenPath.totals?.passed_runs ?? 0}/${goldenPath.totals?.runs ?? 0} passed`
              : "-"
          }
          tone={(goldenPath.totals?.passed_runs ?? 0) < 1 ? "warn" : "ok"}
        />
        <Card
          label="Public proof"
          value={publicProof.present ? (publicProof.target_surface?.status ?? "ready") : "-"}
          tone={publicProof.present ? "ok" : "warn"}
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
        The Ecosystem page is the service-level control plane. The Resources page is the Phase 4
        daily-use factory navigator. The Golden Path page is the Phase 5 local proof surface. The
        Public Proof page is the Phase 6 export packet for sageideas.dev.
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
