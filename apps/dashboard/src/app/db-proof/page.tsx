import type { CSSProperties } from "react";
import { readDbProof } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function DbProofPage() {
  const proof = readDbProof();

  return (
    <section>
      <div style={topbar}>
        <div>
          <h1 style={title}>DB proof</h1>
          <p style={muted}>
            Phase 15 database hardening surface for hosted CRUD, migration readiness, schema drift,
            seed-data proof, and staging-secret inventory.
          </p>
        </div>
        <code style={code}>pnpm proof:db</code>
      </div>

      {!proof.present || !proof.summary ? (
        <p style={muted}>Missing DB proof artifact. Run pnpm proof:db.</p>
      ) : (
        <>
          <div style={metricGrid}>
            <Metric label="Status" value={proof.status ?? "-"} />
            <Metric
              label="Gates"
              value={`${proof.summary.gates_passed}/${proof.summary.gates_total}`}
            />
            <Metric label="Migration" value={proof.summary.migration_status} />
            <Metric label="Hosted CRUD" value={proof.summary.hosted_crud_status} />
            <Metric label="Schema drift" value={proof.summary.schema_drift_status ?? "-"} />
            <Metric label="Seed data" value={proof.summary.seed_data_status ?? "-"} />
          </div>

          <section style={panel}>
            <h2 style={h2}>Gate detail</h2>
            <div style={gateList}>
              {(proof.gates ?? []).map((gate) => (
                <div key={gate.id} style={gateRow}>
                  <span style={gate.status === "passed" ? statusOk : statusWarn}>
                    {gate.status}
                  </span>
                  <strong>{gate.label ?? gate.id}</strong>
                  <p>{gate.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={panel}>
            <h2 style={h2}>Next actions</h2>
            <div style={gateList}>
              {(proof.next_actions ?? []).map((item) => (
                <div key={`${item.phase}-${item.action}`} style={gateRow}>
                  <span style={statusOk}>{item.phase}</span>
                  <strong>{item.action}</strong>
                  <p>{item.reason}</p>
                </div>
              ))}
            </div>
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
const gateList: CSSProperties = { display: "grid", gap: "0.65rem" };
const gateRow: CSSProperties = {
  display: "grid",
  gap: "0.3rem",
  border: "1px solid #252b24",
  borderRadius: 8,
  padding: "0.75rem",
  color: "#d7d0c2",
};
const statusOk: CSSProperties = {
  color: "#5eead4",
  fontSize: "0.75rem",
  textTransform: "uppercase",
};
const statusWarn: CSSProperties = { ...statusOk, color: "#f4b740" };
