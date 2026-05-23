import {
  readLatestAudit,
  readLatestBenchmarks,
  readLatestHealth,
  readLocalWarehouses,
  readRecipes,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default function HealthPage() {
  const health = readLatestHealth();
  const audit = readLatestAudit();
  const bench = readLatestBenchmarks();
  const recipes = readRecipes();
  const warehouses = readLocalWarehouses();

  return (
    <section>
      <h1 style={{ margin: 0, fontSize: "2rem" }}>Federation health</h1>
      <p style={{ color: "#a3a3a3" }}>
        Live server-side view of weekly health snapshot, last audit, V1.0 benchmarks, recipe +
        warehouse roster.
      </p>

      <Grid>
        <Card title="Weekly health snapshot">
          {!health.present || !health.summary ? (
            <Empty>
              No health report yet. Run <Code>node scripts/health-check.mjs</Code>.
            </Empty>
          ) : (
            <KvList
              rows={[
                ["Started", short(health.started_at)],
                ["Runners", String(health.summary.runners)],
                ["Avg score", `${health.summary.avg_score}/100`],
                ["Errors", String(health.summary.errors)],
                ["Warnings", String(health.summary.warnings)],
                ["Passed", health.summary.passed ? "✓ yes" : "✖ no"],
              ]}
            />
          )}
        </Card>

        <Card title="Last full audit">
          {!audit.present || !audit.summary ? (
            <Empty>
              No audit yet. Run <Code>nx audit</Code>.
            </Empty>
          ) : (
            <KvList
              rows={[
                ["Started", short(audit.started_at)],
                ["Sections", String(audit.summary.sections)],
                ["Avg score", `${audit.summary.avg_score}/100`],
                ["Errors", String(audit.summary.errors)],
                ["Warnings", String(audit.summary.warnings)],
                ["Passed", audit.summary.passed ? "✓ yes" : "✖ no"],
              ]}
            />
          )}
        </Card>

        <Card title="V1.0 performance baseline">
          {!bench.present || !bench.benchmarks ? (
            <Empty>
              No benchmark report yet. Run <Code>node scripts/bench.mjs</Code>.
            </Empty>
          ) : (
            <KvList
              rows={[
                [
                  "nx ask (live)",
                  `${bench.benchmarks.ask.avg_query_ms}ms avg (${bench.benchmarks.ask.doc_count} docs)`,
                ],
                [
                  "nx ask @ 5k docs",
                  `${bench.benchmarks.askScaling[bench.benchmarks.askScaling.length - 1]?.query_ms ?? "?"}ms`,
                ],
                ["MCP cold start", `${bench.benchmarks.mcp.cold_start_ms}ms`],
                ["MCP per-RPC", `${bench.benchmarks.mcp.avg_rpc_ms}ms`],
                ["nx audit", `${bench.benchmarks.audit.ms}ms`],
              ]}
            />
          )}
        </Card>
      </Grid>

      <h2 style={{ marginTop: "2.5rem" }}>Audit sections</h2>
      {!audit.sections ? (
        <Empty>No audit data.</Empty>
      ) : (
        <table style={tblStyle}>
          <thead>
            <tr>
              <th style={th}>Section</th>
              <th style={th}>Score</th>
              <th style={th}>Errors</th>
              <th style={th}>Warns</th>
              <th style={th}>Duration</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {audit.sections.map((s) => (
              <tr key={s.name}>
                <td style={td}>{s.name}</td>
                <td style={td}>{s.score}/100</td>
                <td style={td}>{s.findings.filter((f) => f.severity === "error").length}</td>
                <td style={td}>{s.findings.filter((f) => f.severity === "warn").length}</td>
                <td style={td}>{s.duration_ms}ms</td>
                <td style={{ ...td, color: s.passed ? "#10b981" : "#ef4444" }}>
                  {s.passed ? "✓" : "✖"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: "2.5rem" }}>Recipes ({recipes.length})</h2>
      <table style={tblStyle}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Templates</th>
            <th style={th}>THREAT_MODEL</th>
            <th style={th}>DECISIONS</th>
            <th style={th}>Fixture</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((r) => (
            <tr key={r.name}>
              <td style={{ ...td, fontWeight: 500 }}>{r.name}</td>
              <td style={td}>{r.templates_dir_exists ? "✓" : "—"}</td>
              <td style={td}>{r.has_threat_model ? "✓" : "—"}</td>
              <td style={td}>{r.has_decisions ? "✓" : "—"}</td>
              <td style={td}>{r.has_fixture ? "✓" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "2.5rem" }}>Warehouses ({warehouses.length})</h2>
      <table style={tblStyle}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Manifest</th>
            <th style={th}>Docs</th>
            <th style={th}>Templates</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((w) => (
            <tr key={w.name}>
              <td style={{ ...td, fontWeight: 500 }}>{w.name}</td>
              <td style={td}>{w.has_manifest ? "✓" : "✖"}</td>
              <td style={td}>{w.document_count}</td>
              <td style={td}>{w.template_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function short(s: string | undefined): string {
  if (!s) return "—";
  return s.replace("T", " ").replace(/\..*Z$/, "Z");
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem",
        marginTop: "1.5rem",
      }}
    >
      {children}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#171717",
        border: "1px solid #262626",
        borderRadius: "0.5rem",
        padding: "1rem 1.25rem",
      }}
    >
      <h3 style={{ margin: "0 0 0.75rem 0", fontSize: "1rem", color: "#e5e5e5" }}>{title}</h3>
      {children}
    </div>
  );
}

function KvList({ rows }: { rows: ReadonlyArray<[string, string]> }) {
  return (
    <dl style={{ margin: 0, fontSize: "0.875rem" }}>
      {rows.map(([k, v]) => (
        <div
          key={k}
          style={{ display: "flex", justifyContent: "space-between", padding: "0.25rem 0" }}
        >
          <dt style={{ color: "#a3a3a3" }}>{k}</dt>
          <dd style={{ margin: 0, color: "#e5e5e5", fontFamily: "ui-monospace, monospace" }}>
            {v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p style={{ color: "#737373", fontSize: "0.875rem", margin: 0 }}>{children}</p>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        background: "#262626",
        padding: "0.1rem 0.4rem",
        borderRadius: "0.25rem",
        fontSize: "0.8125rem",
      }}
    >
      {children}
    </code>
  );
}

const tblStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "0.75rem",
  fontSize: "0.875rem",
};
const th: React.CSSProperties = {
  textAlign: "left",
  padding: "0.5rem 0.75rem",
  borderBottom: "1px solid #262626",
  color: "#a3a3a3",
  fontWeight: 500,
};
const td: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  borderBottom: "1px solid #1a1a1a",
  color: "#d4d4d4",
};
