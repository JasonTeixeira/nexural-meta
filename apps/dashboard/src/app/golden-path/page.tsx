import { readGoldenPathRuns } from "@/lib/data";
import type { GoldenPathGate, GoldenPathRun } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function GoldenPathPage() {
  const proof = readGoldenPathRuns();
  const latest = proof.runs[0];

  return (
    <section>
      <div style={topbar}>
        <div>
          <h1 style={title}>Golden Path</h1>
          <p style={muted}>
            Phase 5 proof that Sage Ideas can select resources, forge a real app, run quality gates,
            start it locally, verify the live surface, and write reusable evidence.
          </p>
        </div>
        <a href="/resources?useCase=ship-saas-app" style={secondaryLink}>
          Open resource map
        </a>
      </div>

      {!proof.present || !latest ? (
        <Empty>
          Missing golden-path evidence. Run <Code>pnpm golden:path</Code>.
        </Empty>
      ) : (
        <>
          <div style={metricGrid}>
            <Metric label="Runs" value={String(proof.totals?.runs ?? proof.runs.length)} />
            <Metric label="Passed" value={String(proof.totals?.passed_runs ?? 0)} />
            <Metric label="Latest gates" value={String(proof.totals?.latest_gate_count ?? 0)} />
            <Metric label="Wall clock" value={formatMs(proof.totals?.latest_wall_clock_ms)} />
          </div>

          <section style={panel}>
            <div style={sectionHeader}>
              <div>
                <h2 style={h2}>{latest.spec.title}</h2>
                <p style={muted}>{latest.spec.intent}</p>
              </div>
              <StatusPill status={allPassed(latest) ? "passed" : "failed"} />
            </div>

            <div style={summaryGrid}>
              <Summary label="Run ID" value={latest.run_id} />
              <Summary label="Recipe" value={latest.spec.recipe} />
              <Summary label="App slug" value={latest.spec.app_slug} />
              <Summary label="Generated files" value={String(latest.generated_app.file_count)} />
              <Summary label="Hashed files" value={String(latest.generated_app.hashed_files)} />
              <Summary label="Deploy status" value={latest.runtime.deploy_status} tone="warn" />
            </div>

            <div style={hashBox}>
              <span style={hashLabel}>Generated app tree hash</span>
              <code style={hashValue}>{latest.generated_app.tree_hash}</code>
            </div>
          </section>

          <div style={twoColumn}>
            <section style={panel}>
              <h2 style={h2}>Gates</h2>
              <div style={gateList}>
                {latest.gates.map((gate) => (
                  <GateRow key={gate.id} gate={gate} />
                ))}
              </div>
            </section>

            <section style={panel}>
              <h2 style={h2}>Evidence</h2>
              <div style={evidenceList}>
                <Summary label="Spec" value={latest.spec.path} />
                <Summary label="Public index" value={latest.evidence.public_index} />
                <Summary label="Latest report" value={latest.evidence.latest_report} />
                <Summary label="Verifier report" value={latest.evidence.gate5_report} />
                <Summary
                  label="Runtime proof"
                  value={`${latest.runtime.url}${latest.runtime.health_path}`}
                />
              </div>
              <div style={commandBox}>
                <span style={hashLabel}>Repeat command</span>
                <code style={codeBlock}>pnpm golden:path</code>
              </div>
            </section>
          </div>

          <div style={twoColumn}>
            <AssetPanel run={latest} />
            <LessonsPanel run={latest} />
          </div>
        </>
      )}
    </section>
  );
}

function AssetPanel({ run }: { readonly run: GoldenPathRun }) {
  return (
    <section style={panel}>
      <h2 style={h2}>Selected Resources</h2>
      <div style={assetGrid}>
        {run.selected_resources.map((asset) => (
          <a key={asset.name} href={asset.url} style={assetCard}>
            <strong style={assetName}>{asset.name}</strong>
            <span style={assetMeta}>{asset.layer}</span>
            <span style={assetMeta}>
              {asset.maturity} / {asset.score}/100
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function LessonsPanel({ run }: { readonly run: GoldenPathRun }) {
  return (
    <section style={panel}>
      <h2 style={h2}>Lessons And Gaps</h2>
      <h3 style={h3}>Fed Back</h3>
      <ul style={list}>
        {run.reusable_lessons.map((item) => (
          <li key={item.lesson}>
            {item.lesson} <span style={mutedInline}>{item.fed_back}</span>
          </li>
        ))}
      </ul>
      <h3 style={h3}>Still Honest</h3>
      <ul style={list}>
        {run.remaining_gaps.map((gap) => (
          <li key={gap}>{gap}</li>
        ))}
      </ul>
    </section>
  );
}

function GateRow({ gate }: { readonly gate: GoldenPathGate }) {
  return (
    <div style={gateRow}>
      <div>
        <strong style={gateTitle}>{gate.label}</strong>
        <p style={gateDetail}>{gate.detail}</p>
      </div>
      <div style={gateRight}>
        <StatusPill status={gate.status} />
        {gate.duration_ms !== undefined && (
          <span style={duration}>{formatMs(gate.duration_ms)}</span>
        )}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "ok",
}: {
  readonly label: string;
  readonly value: string;
  readonly tone?: "ok" | "warn";
}) {
  return (
    <div style={metric}>
      <div style={metricLabel}>{label}</div>
      <div style={{ ...metricValue, color: tone === "warn" ? "#f59e0b" : "#f5f5f5" }}>{value}</div>
    </div>
  );
}

function Summary({
  label,
  value,
  tone = "ok",
}: {
  readonly label: string;
  readonly value: string;
  readonly tone?: "ok" | "warn";
}) {
  return (
    <div style={summary}>
      <span style={summaryLabel}>{label}</span>
      <code style={{ ...summaryValue, color: tone === "warn" ? "#f59e0b" : "#e5e5e5" }}>
        {value}
      </code>
    </div>
  );
}

function StatusPill({ status }: { readonly status: string }) {
  const passed = status === "passed";
  return <span style={passed ? statusPassed : statusFailed}>{status}</span>;
}

function Empty({ children }: { readonly children: React.ReactNode }) {
  return <p style={{ color: "#737373", fontSize: "0.9rem", margin: 0 }}>{children}</p>;
}

function Code({ children }: { readonly children: React.ReactNode }) {
  return <code style={inlineCode}>{children}</code>;
}

function allPassed(run: GoldenPathRun): boolean {
  return run.gates.every((gate) => gate.status === "passed");
}

function formatMs(value: number | undefined): string {
  if (value === undefined) return "-";
  if (value < 1000) return `${value}ms`;
  return `${Math.round(value / 1000)}s`;
}

const topbar: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  marginBottom: "1.5rem",
};
const title: React.CSSProperties = { margin: 0, fontSize: "2rem", letterSpacing: 0 };
const muted: React.CSSProperties = {
  color: "#a3a3a3",
  margin: "0.45rem 0 0",
  fontSize: "0.9rem",
  lineHeight: 1.5,
};
const mutedInline: React.CSSProperties = { color: "#737373", fontSize: "0.8rem" };
const secondaryLink: React.CSSProperties = {
  color: "#e5e5e5",
  textDecoration: "none",
  border: "1px solid #404040",
  borderRadius: 6,
  padding: "0.45rem 0.65rem",
  fontSize: "0.85rem",
};
const metricGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "0.75rem",
  marginBottom: "1rem",
};
const metric: React.CSSProperties = {
  background: "#171717",
  border: "1px solid #262626",
  borderRadius: 8,
  padding: "0.85rem 1rem",
};
const metricLabel: React.CSSProperties = { color: "#a3a3a3", fontSize: "0.75rem" };
const metricValue: React.CSSProperties = {
  fontSize: "1.35rem",
  fontWeight: 700,
  marginTop: "0.25rem",
};
const panel: React.CSSProperties = {
  background: "#111111",
  border: "1px solid #262626",
  borderRadius: 8,
  padding: "1rem",
  marginBottom: "1rem",
};
const sectionHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  marginBottom: "1rem",
};
const h2: React.CSSProperties = { margin: 0, fontSize: "1.1rem", letterSpacing: 0 };
const h3: React.CSSProperties = { margin: "1rem 0 0.5rem", fontSize: "0.9rem", letterSpacing: 0 };
const summaryGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "0.75rem",
};
const summary: React.CSSProperties = {
  display: "grid",
  gap: "0.25rem",
  minWidth: 0,
};
const summaryLabel: React.CSSProperties = { color: "#737373", fontSize: "0.72rem" };
const summaryValue: React.CSSProperties = {
  overflowWrap: "anywhere",
  fontSize: "0.8rem",
  fontFamily: "ui-monospace, monospace",
};
const hashBox: React.CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  marginTop: "1rem",
  padding: "0.75rem",
  background: "#0a0a0a",
  border: "1px solid #262626",
  borderRadius: 8,
};
const hashLabel: React.CSSProperties = { color: "#737373", fontSize: "0.72rem" };
const hashValue: React.CSSProperties = {
  color: "#e5e5e5",
  fontSize: "0.8rem",
  overflowWrap: "anywhere",
};
const twoColumn: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
};
const gateList: React.CSSProperties = { display: "grid", gap: "0.65rem", marginTop: "1rem" };
const gateRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  border: "1px solid #262626",
  borderRadius: 8,
  padding: "0.75rem",
  background: "#171717",
};
const gateTitle: React.CSSProperties = { color: "#f5f5f5", fontSize: "0.9rem" };
const gateDetail: React.CSSProperties = {
  color: "#a3a3a3",
  margin: "0.25rem 0 0",
  fontSize: "0.8rem",
};
const gateRight: React.CSSProperties = {
  display: "grid",
  justifyItems: "end",
  gap: "0.35rem",
  flexShrink: 0,
};
const duration: React.CSSProperties = {
  color: "#737373",
  fontSize: "0.72rem",
  fontFamily: "ui-monospace, monospace",
};
const evidenceList: React.CSSProperties = { display: "grid", gap: "0.75rem", marginTop: "1rem" };
const commandBox: React.CSSProperties = { ...hashBox, marginBottom: 0 };
const codeBlock: React.CSSProperties = {
  color: "#e5e5e5",
  fontSize: "0.85rem",
  overflowWrap: "anywhere",
};
const assetGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "0.75rem",
  marginTop: "1rem",
};
const assetCard: React.CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  color: "#e5e5e5",
  textDecoration: "none",
  background: "#171717",
  border: "1px solid #262626",
  borderRadius: 8,
  padding: "0.85rem",
};
const assetName: React.CSSProperties = { color: "#f5f5f5", fontSize: "0.95rem" };
const assetMeta: React.CSSProperties = {
  color: "#a3a3a3",
  fontFamily: "ui-monospace, monospace",
  fontSize: "0.75rem",
};
const list: React.CSSProperties = {
  margin: 0,
  paddingLeft: "1rem",
  color: "#d4d4d4",
  lineHeight: 1.7,
  fontSize: "0.88rem",
};
const statusPassed: React.CSSProperties = {
  border: "1px solid #10b981",
  color: "#10b981",
  borderRadius: 6,
  padding: "0.2rem 0.45rem",
  fontFamily: "ui-monospace, monospace",
  fontSize: "0.75rem",
};
const statusFailed: React.CSSProperties = {
  ...statusPassed,
  borderColor: "#f59e0b",
  color: "#f59e0b",
};
const inlineCode: React.CSSProperties = {
  background: "#262626",
  color: "#e5e5e5",
  borderRadius: 5,
  padding: "0.15rem 0.4rem",
  fontSize: "0.78rem",
};
