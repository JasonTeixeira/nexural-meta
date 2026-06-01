import { readPublicProofLayer } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function PublicProofPage() {
  const proof = readPublicProofLayer();
  const metrics = proof.proof_metrics;

  return (
    <section>
      <div style={topbar}>
        <div>
          <h1 style={title}>Public Proof</h1>
          <p style={muted}>
            Phase 6 export packet for publishing the Sage Ideas Engineering OS safely on
            sageideas.dev without leaking private repository details, secrets, or local paths.
          </p>
        </div>
        <a href="/golden-path" style={secondaryLink}>
          Open golden path
        </a>
      </div>

      {!proof.present || !metrics ? (
        <Empty>
          Missing public proof packet. Run <Code>pnpm proof:export</Code>.
        </Empty>
      ) : (
        <>
          <section style={heroPanel}>
            <div>
              <p style={eyebrow}>{proof.target_surface?.status ?? "unknown"}</p>
              <h2 style={heroTitle}>{proof.positioning?.system_name}</h2>
              <p style={heroCopy}>{proof.positioning?.one_liner}</p>
            </div>
            <div style={targetBox}>
              <span style={summaryLabel}>Target</span>
              <strong>{proof.target_surface?.site}</strong>
              <code style={summaryValue}>{proof.target_surface?.recommended_route}</code>
            </div>
          </section>

          <div style={metricGrid}>
            <Metric label="Public repos" value={String(metrics.public_repositories_indexed)} />
            <Metric label="Assets scored" value={String(metrics.public_assets_scored)} />
            <Metric label="Load-bearing avg" value={`${metrics.load_bearing_average_score}/100`} />
            <Metric label="Use cases" value={String(metrics.resource_use_cases)} />
            <Metric
              label="Golden path"
              value={`${metrics.golden_path_gates_passed}/${metrics.golden_path_gate_count}`}
            />
            <Metric label="Wall clock" value={`${metrics.golden_path_wall_clock_seconds}s`} />
          </div>

          <section style={panel}>
            <div style={sectionHeader}>
              <div>
                <h2 style={h2}>Public Claims</h2>
                <p style={muted}>Claims are backed by generated public-safe data files.</p>
              </div>
              <HashPill value={proof.evidence?.packet_hash ?? ""} />
            </div>
            <div style={claimGrid}>
              {(proof.public_claims ?? []).map((claim) => (
                <div key={claim.claim} style={claimCard}>
                  <strong style={claimTitle}>{claim.claim}</strong>
                  <p style={claimEvidence}>{claim.evidence}</p>
                  <code style={sourceCode}>{claim.source}</code>
                </div>
              ))}
            </div>
          </section>

          <div style={twoColumn}>
            <section style={panel}>
              <h2 style={h2}>Architecture Story</h2>
              <div style={stackList}>
                {(proof.architecture ?? []).map((item) => (
                  <div key={item.layer} style={stackRow}>
                    <span style={stackLayer}>{item.layer}</span>
                    <strong>{item.public_label}</strong>
                    <p style={mutedSmall}>{item.public_detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section style={panel}>
              <h2 style={h2}>Export Files</h2>
              <div style={fileList}>
                {(proof.evidence?.generated_files ?? []).map((file) => (
                  <code key={file} style={filePill}>
                    {file}
                  </code>
                ))}
              </div>
            </section>
          </div>

          <div style={twoColumn}>
            <section style={panel}>
              <h2 style={h2}>Recommended Public Assets</h2>
              <div style={assetGrid}>
                {(proof.recommended_assets ?? []).map((asset) => (
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

            <section style={panel}>
              <h2 style={h2}>Redaction Boundary</h2>
              <ul style={list}>
                {(proof.redaction_policy ?? []).map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </section>
          </div>

          <section style={panel}>
            <div style={sectionHeader}>
              <div>
                <h2 style={h2}>Publishable Page Sections</h2>
                <p style={muted}>These are the safe sections for the sageideas.dev proof page.</p>
              </div>
              <code style={command}>pnpm proof:export</code>
            </div>
            <div style={sectionGrid}>
              {(proof.publishable_sections ?? []).map((section) => (
                <div key={section.slug} style={sectionCard}>
                  <span style={sectionSlug}>{section.slug}</span>
                  <strong>{section.title}</strong>
                  <p style={mutedSmall}>{section.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={panel}>
            <h2 style={h2}>Still Honest</h2>
            <ul style={list}>
              {(proof.remaining_gaps ?? []).map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </section>
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

function HashPill({ value }: { readonly value: string }) {
  return <code style={hashPill}>{value || "missing-hash"}</code>;
}

function Empty({ children }: { readonly children: React.ReactNode }) {
  return <p style={{ color: "#737373", fontSize: "0.9rem", margin: 0 }}>{children}</p>;
}

function Code({ children }: { readonly children: React.ReactNode }) {
  return <code style={inlineCode}>{children}</code>;
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
  overflowWrap: "anywhere",
};
const mutedSmall: React.CSSProperties = { ...muted, fontSize: "0.8rem" };
const secondaryLink: React.CSSProperties = {
  color: "#e5e5e5",
  textDecoration: "none",
  border: "1px solid #404040",
  borderRadius: 6,
  padding: "0.45rem 0.65rem",
  fontSize: "0.85rem",
};
const heroPanel: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: "1rem",
  background: "#111111",
  border: "1px solid #262626",
  borderRadius: 8,
  padding: "1rem",
  marginBottom: "1rem",
};
const eyebrow: React.CSSProperties = {
  margin: 0,
  color: "#10b981",
  fontFamily: "ui-monospace, monospace",
  fontSize: "0.75rem",
};
const heroTitle: React.CSSProperties = {
  margin: "0.35rem 0",
  fontSize: "1.45rem",
  letterSpacing: 0,
};
const heroCopy: React.CSSProperties = {
  color: "#d4d4d4",
  margin: 0,
  lineHeight: 1.6,
  maxWidth: 760,
};
const targetBox: React.CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  alignSelf: "stretch",
  background: "#0a0a0a",
  border: "1px solid #262626",
  borderRadius: 8,
  padding: "0.85rem",
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
const claimGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "0.75rem",
};
const claimCard: React.CSSProperties = {
  display: "grid",
  gap: "0.45rem",
  background: "#171717",
  border: "1px solid #262626",
  borderRadius: 8,
  padding: "0.85rem",
};
const claimTitle: React.CSSProperties = { color: "#f5f5f5", fontSize: "0.92rem" };
const claimEvidence: React.CSSProperties = {
  color: "#cfcfcf",
  fontSize: "0.82rem",
  lineHeight: 1.55,
  margin: 0,
};
const sourceCode: React.CSSProperties = {
  color: "#a3a3a3",
  fontSize: "0.72rem",
  overflowWrap: "anywhere",
};
const twoColumn: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
};
const stackList: React.CSSProperties = { display: "grid", gap: "0.65rem", marginTop: "1rem" };
const stackRow: React.CSSProperties = {
  display: "grid",
  gap: "0.25rem",
  background: "#171717",
  border: "1px solid #262626",
  borderRadius: 8,
  padding: "0.75rem",
};
const stackLayer: React.CSSProperties = {
  color: "#10b981",
  fontFamily: "ui-monospace, monospace",
  fontSize: "0.72rem",
};
const fileList: React.CSSProperties = { display: "grid", gap: "0.5rem", marginTop: "1rem" };
const filePill: React.CSSProperties = {
  display: "block",
  color: "#e5e5e5",
  background: "#0a0a0a",
  border: "1px solid #262626",
  borderRadius: 6,
  padding: "0.55rem",
  fontSize: "0.78rem",
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
  margin: "1rem 0 0",
  paddingLeft: "1rem",
  color: "#d4d4d4",
  lineHeight: 1.7,
  fontSize: "0.88rem",
};
const sectionGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "0.75rem",
};
const sectionCard: React.CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  background: "#171717",
  border: "1px solid #262626",
  borderRadius: 8,
  padding: "0.85rem",
};
const sectionSlug: React.CSSProperties = {
  color: "#737373",
  fontFamily: "ui-monospace, monospace",
  fontSize: "0.72rem",
};
const command: React.CSSProperties = {
  color: "#e5e5e5",
  background: "#0a0a0a",
  border: "1px solid #262626",
  borderRadius: 6,
  padding: "0.45rem 0.6rem",
  fontSize: "0.78rem",
};
const hashPill: React.CSSProperties = {
  maxWidth: 360,
  display: "block",
  color: "#10b981",
  border: "1px solid #10b981",
  borderRadius: 6,
  padding: "0.3rem 0.45rem",
  fontSize: "0.72rem",
  overflowWrap: "anywhere",
};
const summaryLabel: React.CSSProperties = { color: "#737373", fontSize: "0.72rem" };
const summaryValue: React.CSSProperties = {
  color: "#e5e5e5",
  overflowWrap: "anywhere",
  fontSize: "0.78rem",
};
const inlineCode: React.CSSProperties = {
  background: "#262626",
  color: "#e5e5e5",
  borderRadius: 5,
  padding: "0.15rem 0.4rem",
  fontSize: "0.78rem",
};
