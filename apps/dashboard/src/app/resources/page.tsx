import { readEcosystemResourceMap } from "@/lib/data";
import type { EcosystemResourceAsset, EcosystemResourceUseCase } from "@/lib/data";

export const dynamic = "force-dynamic";

interface PageProps {
  readonly searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ResourcesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const resourceMap = readEcosystemResourceMap();
  const selectedId = one(params?.useCase);
  const selected =
    resourceMap.use_cases.find((useCase) => useCase.id === selectedId) ?? resourceMap.use_cases[0];

  return (
    <section>
      <div style={topbar}>
        <div>
          <h1 style={title}>Resource Factory</h1>
          <p style={muted}>
            Daily-use navigator for choosing reusable engines, kits, playbooks, and proof assets
            before starting a build.
          </p>
        </div>
        <a href="/ecosystem" style={secondaryLink}>
          Open control plane
        </a>
      </div>

      {!resourceMap.present || !resourceMap.totals || !selected ? (
        <Empty>
          Missing resource map. Run <Code>pnpm ecosystem:map</Code> or{" "}
          <Code>pnpm ecosystem:refresh</Code>.
        </Empty>
      ) : (
        <>
          <div style={metricGrid}>
            <Metric label="Use cases" value={String(resourceMap.totals.use_cases)} />
            <Metric
              label="Assets considered"
              value={String(resourceMap.totals.public_assets_considered)}
            />
            <Metric label="Recommended" value={String(resourceMap.totals.recommended_assets)} />
            <Metric
              label="Fix-first"
              value={String(resourceMap.totals.improve_first_assets)}
              tone="warn"
            />
          </div>

          <div style={layout}>
            <div style={sidePanel}>
              <h2 style={h2}>Build Question</h2>
              <p style={mutedSmall}>
                Pick the closest job. The map is regenerated from scorecard data.
              </p>
              <div style={useCaseList}>
                {resourceMap.use_cases.map((useCase) => (
                  <a
                    key={useCase.id}
                    href={`/resources?useCase=${encodeURIComponent(useCase.id)}`}
                    style={useCase.id === selected.id ? selectedUseCaseLink : useCaseLink}
                  >
                    <span style={useCaseTitle}>{useCase.title}</span>
                    <span style={useCaseQuestion}>{useCase.question}</span>
                  </a>
                ))}
              </div>
            </div>

            <div style={mainPanel}>
              <section style={panel}>
                <div style={sectionHeader}>
                  <div>
                    <h2 style={h2}>{selected.title}</h2>
                    <p style={muted}>{selected.question}</p>
                  </div>
                  <div style={scoreBox}>
                    <span style={scoreLabel}>Minimum</span>
                    <strong>{selected.minimum_maturity}</strong>
                    <strong>{selected.minimum_score}/100</strong>
                  </div>
                </div>

                <div style={layerRow}>
                  {selected.layers.map((layer) => (
                    <a
                      key={layer}
                      href={`/ecosystem?layer=${encodeURIComponent(layer)}`}
                      style={chip}
                    >
                      {layer}
                    </a>
                  ))}
                </div>

                <div style={guidanceGrid}>
                  <div>
                    <h3 style={h3}>Operator Guidance</h3>
                    <ul style={list}>
                      {selected.guidance.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 style={h3}>Commands</h3>
                    <div style={commandList}>
                      {selected.commands.map((command) => (
                        <code key={command} style={codeBlock}>
                          {command}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <AssetSection
                title="Use Now"
                description="Highest-scoring public-safe assets for this job."
                assets={selected.recommended_assets}
                empty="No recommended assets yet. Use the fix-first list before depending on this path."
              />
              <AssetSection
                title="Fix First"
                description="Load-bearing assets under 70 that block this path from looking senior-grade."
                assets={selected.improve_first}
                empty="No load-bearing assets under 70 for this job."
                warn
              />
              <AssetSection
                title="Reference Only"
                description="Useful source material, but not production-grade building blocks."
                assets={selected.reference_assets}
                empty="No reference-only assets mapped to this job."
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function AssetSection({
  title: titleText,
  description,
  assets,
  empty,
  warn = false,
}: {
  readonly title: string;
  readonly description: string;
  readonly assets: ReadonlyArray<EcosystemResourceAsset>;
  readonly empty: string;
  readonly warn?: boolean;
}) {
  return (
    <section style={panel}>
      <div style={sectionHeader}>
        <div>
          <h2 style={h2}>{titleText}</h2>
          <p style={muted}>{description}</p>
        </div>
        <span style={warn ? countPillWarn : countPill}>{assets.length}</span>
      </div>
      {assets.length === 0 ? (
        <Empty>{empty}</Empty>
      ) : (
        <div style={assetGrid}>
          {assets.map((asset) => (
            <AssetCard key={`${titleText}-${asset.name}`} asset={asset} warn={warn} />
          ))}
        </div>
      )}
    </section>
  );
}

function AssetCard({
  asset,
  warn = false,
}: {
  readonly asset: EcosystemResourceAsset;
  readonly warn?: boolean;
}) {
  return (
    <a href={asset.url} style={assetCard}>
      <div style={assetTopline}>
        <strong style={assetName}>{asset.name}</strong>
        <span style={scorePill(asset.score, warn)}>{asset.score}</span>
      </div>
      <p style={assetRole}>{asset.role}</p>
      <div style={assetMeta}>
        <span>{asset.layer}</span>
        <span>{asset.asset_type}</span>
        <span>{asset.maturity}</span>
        <span>{asset.status}</span>
      </div>
      {asset.gaps.length > 0 && <p style={gapText}>{asset.gaps.slice(0, 3).join(", ")}</p>}
    </a>
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

function Empty({ children }: { readonly children: React.ReactNode }) {
  return <p style={{ color: "#737373", fontSize: "0.9rem", margin: 0 }}>{children}</p>;
}

function Code({ children }: { readonly children: React.ReactNode }) {
  return <code style={inlineCode}>{children}</code>;
}

function one(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function scorePill(score: number, warn: boolean): React.CSSProperties {
  const color = warn ? "#f59e0b" : score >= 85 ? "#10b981" : score >= 70 ? "#84cc16" : "#ef4444";
  return {
    border: `1px solid ${color}`,
    color,
    borderRadius: 6,
    padding: "0.15rem 0.45rem",
    fontFamily: "ui-monospace, monospace",
    fontSize: "0.78rem",
  };
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
};
const mutedSmall: React.CSSProperties = { ...muted, fontSize: "0.82rem" };
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
const layout: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "1rem",
};
const sidePanel: React.CSSProperties = {
  background: "#111111",
  border: "1px solid #262626",
  borderRadius: 8,
  padding: "1rem",
  alignSelf: "start",
};
const mainPanel: React.CSSProperties = { display: "grid", gap: "1rem" };
const panel: React.CSSProperties = {
  background: "#111111",
  border: "1px solid #262626",
  borderRadius: 8,
  padding: "1rem",
};
const sectionHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  marginBottom: "1rem",
};
const h2: React.CSSProperties = { margin: 0, fontSize: "1.1rem", letterSpacing: 0 };
const h3: React.CSSProperties = { margin: "0 0 0.5rem", fontSize: "0.9rem", letterSpacing: 0 };
const useCaseList: React.CSSProperties = { display: "grid", gap: "0.5rem", marginTop: "1rem" };
const useCaseLink: React.CSSProperties = {
  display: "grid",
  gap: "0.25rem",
  padding: "0.75rem",
  border: "1px solid #262626",
  borderRadius: 8,
  color: "#d4d4d4",
  textDecoration: "none",
  background: "#171717",
};
const selectedUseCaseLink: React.CSSProperties = {
  ...useCaseLink,
  borderColor: "#f59e0b",
  background: "#1c1917",
};
const useCaseTitle: React.CSSProperties = { color: "#f5f5f5", fontWeight: 700 };
const useCaseQuestion: React.CSSProperties = { color: "#a3a3a3", fontSize: "0.78rem" };
const scoreBox: React.CSSProperties = {
  display: "grid",
  gap: "0.25rem",
  minWidth: 110,
  textAlign: "right",
  color: "#f5f5f5",
  fontFamily: "ui-monospace, monospace",
};
const scoreLabel: React.CSSProperties = { color: "#737373", fontSize: "0.72rem" };
const layerRow: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "0.5rem" };
const chip: React.CSSProperties = {
  color: "#e5e5e5",
  textDecoration: "none",
  border: "1px solid #333333",
  borderRadius: 999,
  padding: "0.3rem 0.55rem",
  fontSize: "0.78rem",
};
const guidanceGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
  gap: "1rem",
  marginTop: "1rem",
};
const list: React.CSSProperties = {
  margin: 0,
  paddingLeft: "1rem",
  color: "#d4d4d4",
  lineHeight: 1.7,
  fontSize: "0.88rem",
};
const commandList: React.CSSProperties = { display: "grid", gap: "0.5rem" };
const codeBlock: React.CSSProperties = {
  display: "block",
  background: "#0a0a0a",
  border: "1px solid #262626",
  borderRadius: 6,
  padding: "0.55rem",
  color: "#e5e5e5",
  fontSize: "0.8rem",
  whiteSpace: "normal",
};
const inlineCode: React.CSSProperties = {
  background: "#262626",
  color: "#e5e5e5",
  borderRadius: 5,
  padding: "0.15rem 0.4rem",
  fontSize: "0.78rem",
};
const assetGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "0.75rem",
};
const assetCard: React.CSSProperties = {
  display: "grid",
  gap: "0.45rem",
  minHeight: 150,
  border: "1px solid #262626",
  borderRadius: 8,
  padding: "0.85rem",
  textDecoration: "none",
  background: "#171717",
};
const assetTopline: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "0.75rem",
};
const assetName: React.CSSProperties = { color: "#f5f5f5", fontSize: "0.95rem" };
const assetRole: React.CSSProperties = {
  color: "#a3a3a3",
  fontSize: "0.8rem",
  lineHeight: 1.45,
  margin: 0,
};
const assetMeta: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.35rem",
  color: "#737373",
  fontSize: "0.72rem",
  fontFamily: "ui-monospace, monospace",
};
const gapText: React.CSSProperties = {
  color: "#f59e0b",
  fontSize: "0.75rem",
  margin: 0,
  fontFamily: "ui-monospace, monospace",
};
const countPill: React.CSSProperties = {
  border: "1px solid #404040",
  borderRadius: 6,
  padding: "0.2rem 0.45rem",
  color: "#e5e5e5",
  fontFamily: "ui-monospace, monospace",
};
const countPillWarn: React.CSSProperties = {
  ...countPill,
  borderColor: "#f59e0b",
  color: "#f59e0b",
};
