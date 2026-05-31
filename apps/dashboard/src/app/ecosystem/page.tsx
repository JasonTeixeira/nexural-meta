import { readEcosystemRegistry, readEcosystemScorecard } from "@/lib/data";
import type { EcosystemScoredRepository } from "@/lib/data";

export const dynamic = "force-dynamic";

interface PageProps {
  readonly searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const LAYER_GUIDE: ReadonlyArray<{
  readonly layer: string;
  readonly useWhen: string;
  readonly ownerAction: string;
}> = [
  {
    layer: "control-plane",
    useWhen: "You need source-of-truth docs, registry data, ADRs, recipes, or governance.",
    ownerAction: "Keep it boring, versioned, and public-safe.",
  },
  {
    layer: "app-factory-runtime",
    useWhen: "You need to generate, verify, deploy, or learn from a new app.",
    ownerAction: "Prove the golden path with evidence before expanding scope.",
  },
  {
    layer: "quality-system",
    useWhen: "You need confidence gates, scorecards, test runners, or release proof.",
    ownerAction: "Make QA evidence mandatory for every reusable engine.",
  },
  {
    layer: "resource-library",
    useWhen: "You need SDK/tool/provider choices, stack recipes, or reusable playbooks.",
    ownerAction: "Promote USE verdicts into factory recipes only after repeated wins.",
  },
  {
    layer: "agent-engine",
    useWhen: "You need agent workflows, memory, RAG, evals, or background workers.",
    ownerAction: "Track contracts, evals, observability, and consumers.",
  },
  {
    layer: "quant-trading",
    useWhen: "You need futures research, validation, execution, automation, or trading proof.",
    ownerAction: "Separate product proof from research/reference material.",
  },
  {
    layer: "product-proof",
    useWhen: "You need examples that prove the factory can ship real products.",
    ownerAction: "Attach case studies, deploy URLs, test evidence, and architecture pages.",
  },
  {
    layer: "reference-library",
    useWhen: "You need implementation mining, study material, or comparison sources.",
    ownerAction: "Keep it searchable, but do not let it dilute the public story.",
  },
];

export default async function EcosystemPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const registry = readEcosystemRegistry();
  const scorecard = readEcosystemScorecard();

  const repositories = scorecard.public_repositories;
  const layers = unique(repositories.map((repo) => repo.canonical.layer));
  const maturities = unique(repositories.map((repo) => repo.canonical.maturity));
  const bands = unique(repositories.map((repo) => repo.score.band));
  const gaps = unique(repositories.flatMap((repo) => repo.score.gaps));

  const filters = {
    q: one(params?.q).toLowerCase(),
    layer: one(params?.layer),
    maturity: one(params?.maturity),
    band: one(params?.band),
    gap: one(params?.gap),
    loadBearing: one(params?.loadBearing),
  };

  const filtered = repositories
    .filter((repo) => matchesFilters(repo, filters))
    .sort((a, b) => {
      if (a.score.load_bearing !== b.score.load_bearing) return a.score.load_bearing ? -1 : 1;
      return a.score.total - b.score.total || a.name.localeCompare(b.name);
    });

  const gapQueue = repositories
    .filter((repo) => repo.score.load_bearing && repo.score.total < 70)
    .sort((a, b) => a.score.total - b.score.total)
    .slice(0, 10);

  return (
    <section>
      <div style={topbar}>
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem", letterSpacing: 0 }}>
            Sage Ideas Engineering OS
          </h1>
          <p style={{ color: "#a3a3a3", margin: "0.5rem 0 0" }}>
            Service-level control plane for the repo ecosystem, maturity model, gap queue, and
            reusable asset map.
          </p>
        </div>
        <a href="/ecosystem" style={resetLink}>
          Reset filters
        </a>
      </div>

      {!registry.present || !scorecard.present || !scorecard.totals ? (
        <Empty>
          Missing generated ecosystem artifacts. Run <Code>pnpm ecosystem:refresh</Code>.
        </Empty>
      ) : (
        <>
          <div style={metricGrid}>
            <Metric label="Repos" value={String(scorecard.totals.total)} />
            <Metric
              label="Public / private"
              value={`${registry.totals?.public ?? 0} / ${registry.totals?.private ?? 0}`}
            />
            <Metric
              label="Load-bearing avg"
              value={`${scorecard.totals.load_bearing_average_score}/100`}
            />
            <Metric
              label="Private review"
              value={`${registry.private_summary?.needing_private_review ?? 0}`}
              tone="warn"
            />
            <Metric label="Below 70" value={String(gapQueue.length)} tone="warn" />
          </div>

          <section style={panel}>
            <div style={sectionHeader}>
              <div>
                <h2 style={h2}>Operator Filters</h2>
                <p style={muted}>
                  Search public-safe registry data by layer, maturity, score band, gap, or
                  load-bearing status.
                </p>
              </div>
              <code style={smallCode}>pnpm ecosystem:refresh</code>
            </div>
            <form action="/ecosystem" style={filterGrid}>
              <label style={label}>
                Search
                <input
                  name="q"
                  defaultValue={filters.q}
                  placeholder="repo, role, language"
                  style={input}
                />
              </label>
              <Select label="Layer" name="layer" value={filters.layer} values={layers} />
              <Select
                label="Maturity"
                name="maturity"
                value={filters.maturity}
                values={maturities}
              />
              <Select label="Score band" name="band" value={filters.band} values={bands} />
              <Select label="Gap" name="gap" value={filters.gap} values={gaps} />
              <label style={label}>
                Scope
                <select name="loadBearing" defaultValue={filters.loadBearing} style={input}>
                  <option value="">All assets</option>
                  <option value="true">Load-bearing only</option>
                  <option value="false">Reference/raw only</option>
                </select>
              </label>
              <button type="submit" style={button}>
                Apply
              </button>
            </form>
          </section>

          <div style={twoColumn}>
            <section style={panel}>
              <h2 style={h2}>Gap Queue</h2>
              <p style={muted}>
                Highest-priority public load-bearing assets under 70. These are the fastest wins for
                making the ecosystem look intentional.
              </p>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Asset</th>
                    <th style={th}>Layer</th>
                    <th style={th}>Score</th>
                    <th style={th}>Fix first</th>
                  </tr>
                </thead>
                <tbody>
                  {gapQueue.map((repo) => (
                    <tr key={repo.name}>
                      <td style={td}>
                        <a href={repo.url} style={repoLink}>
                          {repo.name}
                        </a>
                      </td>
                      <td style={td}>{repo.canonical.layer}</td>
                      <td style={td}>{repo.score.total}</td>
                      <td style={td}>{repo.score.gaps[0] ?? "review"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section style={panel}>
              <h2 style={h2}>Private Override Workflow</h2>
              <p style={muted}>
                Private repos stay out of committed artifacts. Review them locally, add override
                metadata, then regenerate public summaries.
              </p>
              <ol style={steps}>
                <li>
                  Open <Code>.nexural/private/ecosystem-registry.internal.json</Code>.
                </li>
                <li>
                  Create or update <Code>.nexural/private/ecosystem-overrides.json</Code>.
                </li>
                <li>Set canonical layer, asset type, maturity, and role.</li>
                <li>
                  Run <Code>pnpm ecosystem:refresh</Code>.
                </li>
              </ol>
              <div style={privateStats}>
                <Metric
                  label="Private repos"
                  value={String(registry.private_summary?.total_private ?? 0)}
                />
                <Metric
                  label="Need review"
                  value={String(registry.private_summary?.needing_private_review ?? 0)}
                  tone="warn"
                />
                <Metric
                  label="Private avg"
                  value={`${scorecard.private_summary?.average_score ?? 0}/100`}
                />
              </div>
            </section>
          </div>

          <section style={panel}>
            <h2 style={h2}>Resource Navigator</h2>
            <p style={muted}>
              Use this map before starting a build. Pick the layer that matches the job, then pull
              the highest-maturity assets from the filtered table.
            </p>
            <div style={navigatorGrid}>
              {LAYER_GUIDE.map((item) => {
                const summary = scorecard.public_layer_summary?.[item.layer];
                return (
                  <div key={item.layer} style={navigatorItem}>
                    <div style={navigatorTitle}>{item.layer}</div>
                    <p style={navigatorText}>{item.useWhen}</p>
                    <p style={navigatorAction}>{item.ownerAction}</p>
                    <div style={navigatorMeta}>
                      {summary
                        ? `${summary.count} public, ${summary.load_bearing_count} load-bearing`
                        : "private or pending"}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section style={panel}>
            <div style={sectionHeader}>
              <div>
                <h2 style={h2}>Registry Explorer</h2>
                <p style={muted}>
                  Showing {filtered.length} of {repositories.length} public-safe assets.
                </p>
              </div>
            </div>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Asset</th>
                  <th style={th}>Layer</th>
                  <th style={th}>Type</th>
                  <th style={th}>Maturity</th>
                  <th style={th}>Score</th>
                  <th style={th}>Status</th>
                  <th style={th}>Gaps</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 80).map((repo) => (
                  <tr key={repo.name}>
                    <td style={td}>
                      <a href={repo.url} style={repoLink}>
                        {repo.name}
                      </a>
                      <div style={roleText}>{repo.canonical.role}</div>
                    </td>
                    <td style={td}>{repo.canonical.layer}</td>
                    <td style={td}>{repo.canonical.asset_type}</td>
                    <td style={td}>{repo.canonical.maturity}</td>
                    <td style={td}>
                      <span style={scorePill(repo.score.total)}>{repo.score.total}</span>
                    </td>
                    <td style={td}>{repo.operational.status}</td>
                    <td style={td}>{repo.score.gaps.slice(0, 3).join(", ") || "none"}</td>
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

function matchesFilters(
  repo: EcosystemScoredRepository,
  filters: {
    readonly q: string;
    readonly layer: string;
    readonly maturity: string;
    readonly band: string;
    readonly gap: string;
    readonly loadBearing: string;
  },
): boolean {
  const haystack = [
    repo.name,
    repo.full_name,
    repo.primary_language ?? "",
    repo.canonical.role,
    repo.canonical.layer,
    repo.canonical.asset_type,
    ...repo.topics,
  ]
    .join(" ")
    .toLowerCase();
  if (filters.q && !haystack.includes(filters.q)) return false;
  if (filters.layer && repo.canonical.layer !== filters.layer) return false;
  if (filters.maturity && repo.canonical.maturity !== filters.maturity) return false;
  if (filters.band && repo.score.band !== filters.band) return false;
  if (filters.gap && !repo.score.gaps.includes(filters.gap)) return false;
  if (filters.loadBearing === "true" && !repo.score.load_bearing) return false;
  if (filters.loadBearing === "false" && repo.score.load_bearing) return false;
  return true;
}

function Select({
  label: labelText,
  name,
  value,
  values,
}: {
  readonly label: string;
  readonly name: string;
  readonly value: string;
  readonly values: ReadonlyArray<string>;
}) {
  return (
    <label style={label}>
      {labelText}
      <select name={name} defaultValue={value} style={input}>
        <option value="">All</option>
        {values.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </label>
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
  return <p style={{ color: "#737373", fontSize: "0.9rem" }}>{children}</p>;
}

function Code({ children }: { readonly children: React.ReactNode }) {
  return <code style={smallCode}>{children}</code>;
}

function one(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function unique(values: ReadonlyArray<string>): ReadonlyArray<string> {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function scorePill(score: number): React.CSSProperties {
  const color =
    score >= 85 ? "#10b981" : score >= 70 ? "#84cc16" : score >= 50 ? "#f59e0b" : "#ef4444";
  return {
    display: "inline-block",
    minWidth: 42,
    textAlign: "center",
    border: `1px solid ${color}`,
    color,
    borderRadius: 6,
    padding: "0.15rem 0.45rem",
    fontFamily: "ui-monospace, monospace",
    fontSize: "0.8rem",
  };
}

const topbar: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  marginBottom: "1.5rem",
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
  marginTop: "1rem",
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  marginBottom: "1rem",
};

const h2: React.CSSProperties = { margin: 0, fontSize: "1.1rem", letterSpacing: 0 };
const muted: React.CSSProperties = {
  color: "#a3a3a3",
  margin: "0.35rem 0 0",
  fontSize: "0.875rem",
};
const label: React.CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  color: "#a3a3a3",
  fontSize: "0.78rem",
};
const input: React.CSSProperties = {
  minHeight: 36,
  background: "#0a0a0a",
  color: "#e5e5e5",
  border: "1px solid #333333",
  borderRadius: 6,
  padding: "0.45rem 0.55rem",
  fontSize: "0.875rem",
};

const filterGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: "0.75rem",
  alignItems: "end",
};

const button: React.CSSProperties = {
  minHeight: 36,
  border: "1px solid #525252",
  borderRadius: 6,
  color: "#0a0a0a",
  background: "#e5e5e5",
  fontWeight: 700,
  cursor: "pointer",
};

const resetLink: React.CSSProperties = {
  color: "#e5e5e5",
  textDecoration: "none",
  border: "1px solid #404040",
  borderRadius: 6,
  padding: "0.45rem 0.65rem",
  fontSize: "0.85rem",
};

const twoColumn: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "1rem",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "0.75rem",
  fontSize: "0.82rem",
};

const th: React.CSSProperties = {
  textAlign: "left",
  color: "#a3a3a3",
  fontWeight: 600,
  padding: "0.5rem",
  borderBottom: "1px solid #333333",
};

const td: React.CSSProperties = {
  color: "#d4d4d4",
  padding: "0.55rem 0.5rem",
  borderBottom: "1px solid #1f1f1f",
  verticalAlign: "top",
};

const repoLink: React.CSSProperties = { color: "#f5f5f5", textDecoration: "none", fontWeight: 700 };
const roleText: React.CSSProperties = {
  color: "#737373",
  fontSize: "0.75rem",
  marginTop: "0.2rem",
  maxWidth: 360,
};
const smallCode: React.CSSProperties = {
  background: "#262626",
  color: "#e5e5e5",
  borderRadius: 5,
  padding: "0.15rem 0.4rem",
  fontSize: "0.78rem",
};

const steps: React.CSSProperties = {
  color: "#d4d4d4",
  fontSize: "0.875rem",
  lineHeight: 1.75,
  paddingLeft: "1.25rem",
};
const privateStats: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "0.5rem",
};
const navigatorGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "0.75rem",
};
const navigatorItem: React.CSSProperties = {
  border: "1px solid #262626",
  borderRadius: 8,
  padding: "0.85rem",
  background: "#171717",
};
const navigatorTitle: React.CSSProperties = {
  color: "#f5f5f5",
  fontWeight: 700,
  fontSize: "0.9rem",
};
const navigatorText: React.CSSProperties = { color: "#a3a3a3", fontSize: "0.8rem", minHeight: 48 };
const navigatorAction: React.CSSProperties = { color: "#d4d4d4", fontSize: "0.8rem" };
const navigatorMeta: React.CSSProperties = {
  color: "#737373",
  fontSize: "0.75rem",
  fontFamily: "ui-monospace, monospace",
};
