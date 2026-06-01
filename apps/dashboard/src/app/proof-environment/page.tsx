import type { CSSProperties } from "react";
import { readProofEnvironment } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function ProofEnvironmentPage() {
  const proof = readProofEnvironment();

  return (
    <section>
      <div style={topbar}>
        <div>
          <h1 style={title}>Proof environment</h1>
          <p style={muted}>
            Phase 9 lock for hosted proof readiness: secret inventory, hosted health, and latest
            evidence linkage.
          </p>
        </div>
        <code style={code}>pnpm proof:env</code>
      </div>

      {!proof.present || !proof.summary ? (
        <p style={muted}>Missing proof environment artifact. Run pnpm proof:env.</p>
      ) : (
        <>
          <div style={metricGrid}>
            <Metric label="Status" value={proof.status ?? "-"} />
            <Metric
              label="Gates"
              value={`${proof.summary.gates_passed}/${proof.summary.gates_total}`}
            />
            <Metric
              label="Secrets"
              value={`${proof.summary.required_secrets_present}/${proof.summary.required_secrets_total}`}
            />
            <Metric label="Hosted HTTP" value={String(proof.summary.hosted_health_status)} />
          </div>

          <section style={panel}>
            <h2 style={h2}>Hosted proof</h2>
            <dl style={details}>
              <Row label="URL" value={proof.summary.hosted_url} />
              <Row label="Latest run" value={proof.summary.latest_run_id} />
              <Row label="App hash" value={proof.summary.latest_app_hash} />
              <Row label="Gate count" value={String(proof.summary.latest_gate_count)} />
            </dl>
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

function Row({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <>
      <dt style={dt}>{label}</dt>
      <dd style={dd}>{value}</dd>
    </>
  );
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
};
const h2: CSSProperties = { margin: "0 0 0.75rem", fontSize: "1.05rem" };
const details: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "160px minmax(0, 1fr)",
  gap: "0.65rem",
  margin: 0,
};
const dt: CSSProperties = { color: "#8c9487", fontSize: "0.78rem" };
const dd: CSSProperties = {
  color: "#ece7dc",
  margin: 0,
  overflowWrap: "anywhere",
  fontFamily: "'JetBrains Mono', 'Cascadia Code', monospace",
  fontSize: "0.78rem",
};
