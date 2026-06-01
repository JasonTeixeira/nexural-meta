import type { CSSProperties } from "react";
import {
  readDbProof,
  readEcosystemRegistry,
  readEcosystemResourceMap,
  readEcosystemScorecard,
  readGoldenPathRuns,
  readProofEnvironment,
  readRecipeCatalog,
  readResourceLibrary,
} from "@/lib/data";

export const dynamic = "force-dynamic";

const PHASES = [
  {
    id: "16",
    title: "Operator Dashboard",
    status: "active",
    detail: "Cockpit, registry navigation, proof health, gap queue, and build routing.",
  },
  {
    id: "11",
    title: "Recipe Expansion",
    status: "active",
    detail: "Recipe catalog, forge readiness, proof-backed recipe count, and next recipe targets.",
  },
  {
    id: "15",
    title: "DB/Migration Hardening",
    status: "active",
    detail: "Hosted CRUD proof, migration-readiness gate, and DATABASE_URL inventory check.",
  },
  {
    id: "14",
    title: "Scheduled Proof Automation",
    status: "active",
    detail:
      "Nightly maintenance refresh with golden path, hosted deploy, DB proof, and proof packet.",
  },
  {
    id: "12/13",
    title: "Resource Library + Maturity Lift",
    status: "active",
    detail: "Unified resource catalog, operator paths, and prioritized maturity lift queue.",
  },
];

export default function OperatorCockpit() {
  const registry = readEcosystemRegistry();
  const scorecard = readEcosystemScorecard();
  const resourceMap = readEcosystemResourceMap();
  const goldenPath = readGoldenPathRuns();
  const proofEnv = readProofEnvironment();
  const dbProof = readDbProof();
  const recipeCatalog = readRecipeCatalog();
  const resourceLibrary = readResourceLibrary();

  const latestRun = goldenPath.runs[0];
  const latestPassed = latestRun?.gates.filter((gate) => gate.status === "passed").length ?? 0;
  const latestTotal = latestRun?.gates.length ?? 0;
  const liftQueue = resourceLibrary.maturity_lift_queue ?? [];
  const topRoutes = resourceLibrary.use_case_routes ?? [];
  const recipeActions = recipeCatalog.next_actions ?? [];
  const dbActions = dbProof.next_actions ?? [];
  const finishLineScore = score([
    proofEnv.status === "passed",
    dbProof.status === "passed",
    latestTotal > 0 && latestPassed === latestTotal,
    (recipeCatalog.totals?.forge_ready ?? 0) >= 6,
    (recipeCatalog.totals?.proof_backed ?? 0) >= 1,
    (scorecard.totals?.load_bearing_average_score ?? 0) >= 70,
    (resourceLibrary.totals?.assets ?? 0) >= 100,
  ]);

  return (
    <section style={page}>
      <div style={hero}>
        <div>
          <h1 style={title}>Operator cockpit</h1>
          <p style={lede}>
            One control plane for the resource factory: proof status, recipe readiness, DB
            hardening, scheduled automation, and the maturity queue.
          </p>
        </div>
        <div style={commandStack}>
          <code style={command}>pnpm ecosystem:maintain</code>
          <code style={command}>pnpm --filter @nexural/dashboard dev</code>
        </div>
      </div>

      <div style={statusRail}>
        <Signal
          label="Finish-line readiness"
          value={`${finishLineScore}/100`}
          detail="Composite of proof, recipes, DB, resources, and maturity gates."
          tone={finishLineScore >= 90 ? "ok" : finishLineScore >= 70 ? "warn" : "bad"}
        />
        <Signal
          label="Golden path"
          value={latestTotal > 0 ? `${latestPassed}/${latestTotal}` : "-"}
          detail={latestRun?.runtime?.deployed_url ?? "No hosted proof URL recorded."}
          href="/golden-path"
          tone={latestTotal > 0 && latestPassed === latestTotal ? "ok" : "bad"}
        />
        <Signal
          label="Proof environment"
          value={proofEnv.status ?? "-"}
          detail={`${proofEnv.summary?.required_secrets_present ?? 0}/${proofEnv.summary?.required_secrets_total ?? 0} secrets, HTTP ${proofEnv.summary?.hosted_health_status ?? "?"}`}
          href="/proof-environment"
          tone={proofEnv.status === "passed" ? "ok" : "bad"}
        />
        <Signal
          label="DB proof"
          value={dbProof.status ?? "-"}
          detail={`${dbProof.summary?.gates_passed ?? 0}/${dbProof.summary?.gates_total ?? 0} gates; migration ${dbProof.summary?.migration_status ?? "unknown"}`}
          href="/db-proof"
          tone={dbProof.status === "passed" ? "ok" : "warn"}
        />
      </div>

      <div style={dashboardGrid}>
        <section style={panelLarge}>
          <PanelHeader
            title="Finish-line phases"
            detail="The active path to a reusable app factory that can build, verify, and explain itself."
            href="/resources"
          />
          <div style={phaseList}>
            {PHASES.map((phase) => (
              <div key={phase.id} style={phaseRow}>
                <div style={phaseIndex}>{phase.id}</div>
                <div>
                  <div style={phaseTitle}>{phase.title}</div>
                  <p style={phaseDetail}>{phase.detail}</p>
                </div>
                <span style={phaseBadge}>{phase.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={panel}>
          <PanelHeader title="Resource factory" detail="What exists and what is reusable now." />
          <MetricGrid
            items={[
              ["Repos", String(registry.totals?.total ?? 0)],
              ["Assets", String(resourceLibrary.totals?.assets ?? 0)],
              ["Use cases", String(resourceMap.totals?.use_cases ?? 0)],
              ["Load-bearing", `${scorecard.totals?.load_bearing_average_score ?? 0}/100`],
            ]}
          />
          <div style={routeList}>
            {topRoutes.slice(0, 5).map((route) => (
              <a key={route.id} href={route.command} style={routeItem}>
                <strong>{route.title}</strong>
                <span>
                  {route.recommended_assets} use now / {route.improve_first_assets} fix first
                </span>
              </a>
            ))}
          </div>
        </section>

        <section style={panel}>
          <PanelHeader
            title="Recipe readiness"
            detail="Phase 11 expansion and forge confidence."
            href="/recipes"
          />
          <MetricGrid
            items={[
              ["Recipes", String(recipeCatalog.totals?.recipes ?? 0)],
              ["Forge-ready", String(recipeCatalog.totals?.forge_ready ?? 0)],
              ["Proof-backed", String(recipeCatalog.totals?.proof_backed ?? 0)],
              ["Avg score", `${recipeCatalog.totals?.average_readiness_score ?? 0}`],
            ]}
          />
          <ActionList items={recipeActions} empty="Recipe catalog has no immediate blockers." />
        </section>

        <section style={panelLarge}>
          <PanelHeader
            title="Maturity lift queue"
            detail="Phase 12/13: the highest-return cleanup work to make the ecosystem look intentional."
            href="/ecosystem?loadBearing=true"
          />
          <div style={liftGrid}>
            {liftQueue.slice(0, 10).map((item) => (
              <div key={`${item.name}-${item.layer}`} style={liftItem}>
                <div>
                  <strong>{item.name}</strong>
                  <span style={liftLayer}>{item.layer}</span>
                </div>
                <div style={liftScore}>
                  <span>{item.current_score}</span>
                  <span>{item.target_score}</span>
                </div>
                <p>{item.reason}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={panel}>
          <PanelHeader
            title="DB hardening"
            detail="Phase 15 proof state and next DB action."
            href="/db-proof"
          />
          <ActionList
            items={dbActions}
            empty="DB proof is green; next hardening is schema drift."
          />
          <div style={miniLog}>
            {(dbProof.gates ?? []).map((gate) => (
              <div key={gate.id} style={miniLogRow}>
                <span style={gate.status === "passed" ? dotOk : dotWarn} />
                <span>{gate.id}</span>
                <strong>{gate.status}</strong>
              </div>
            ))}
          </div>
        </section>

        <section style={panel}>
          <PanelHeader title="Automation loop" detail="Phase 14 scheduled proof refresh." />
          <div style={automationBox}>
            <span>Nightly</span>
            <strong>
              {"inventory -> score -> map -> recipe -> library -> proof -> DB -> packet"}
            </strong>
          </div>
          <div style={automationBox}>
            <span>Manual</span>
            <strong>GitHub Actions workflow_dispatch with deploy toggle</strong>
          </div>
          <a href="/proof-environment" style={primaryButton}>
            Open proof lock
          </a>
        </section>
      </div>
    </section>
  );
}

function Signal({
  label,
  value,
  detail,
  tone,
  href,
}: {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly tone: "ok" | "warn" | "bad";
  readonly href?: string;
}) {
  const content = (
    <>
      <span style={signalLabel}>{label}</span>
      <strong style={{ ...signalValue, color: toneColor(tone) }}>{value}</strong>
      <span style={signalDetail}>{detail}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} style={signal}>
        {content}
      </a>
    );
  }
  return <div style={signal}>{content}</div>;
}

function PanelHeader({
  title: titleText,
  detail,
  href,
}: {
  readonly title: string;
  readonly detail: string;
  readonly href?: string;
}) {
  return (
    <div style={panelHeader}>
      <div>
        <h2 style={h2}>{titleText}</h2>
        <p style={muted}>{detail}</p>
      </div>
      {href && (
        <a href={href} style={linkButton}>
          Open
        </a>
      )}
    </div>
  );
}

function MetricGrid({ items }: { readonly items: ReadonlyArray<readonly [string, string]> }) {
  return (
    <div style={metricGrid}>
      {items.map(([label, value]) => (
        <div key={label} style={metric}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

function ActionList({
  items,
  empty,
}: {
  readonly items: ReadonlyArray<{
    readonly action: string;
    readonly reason: string;
    readonly phase: string;
  }>;
  readonly empty: string;
}) {
  if (items.length === 0) return <p style={muted}>{empty}</p>;
  return (
    <div style={actionList}>
      {items.slice(0, 4).map((item) => (
        <div key={`${item.phase}-${item.action}`} style={actionItem}>
          <span>{item.phase}</span>
          <strong>{item.action}</strong>
          <p>{item.reason}</p>
        </div>
      ))}
    </div>
  );
}

function score(values: ReadonlyArray<boolean>) {
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

function toneColor(tone: "ok" | "warn" | "bad") {
  if (tone === "ok") return "#5eead4";
  if (tone === "warn") return "#f4b740";
  return "#fb7185";
}

const page: CSSProperties = { display: "grid", gap: "1rem" };
const hero: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
  gap: "1rem",
  alignItems: "end",
  borderBottom: "1px solid #242923",
  paddingBottom: "1rem",
};
const title: CSSProperties = {
  margin: 0,
  fontSize: "clamp(2rem, 5vw, 4.8rem)",
  lineHeight: 0.92,
  letterSpacing: 0,
};
const lede: CSSProperties = {
  color: "#a9a193",
  maxWidth: 760,
  lineHeight: 1.55,
  margin: "1rem 0 0",
  fontSize: "1rem",
};
const commandStack: CSSProperties = { display: "grid", gap: "0.5rem" };
const command: CSSProperties = {
  background: "#111611",
  border: "1px solid #283128",
  borderRadius: 8,
  color: "#dce8d6",
  padding: "0.7rem",
  overflowWrap: "anywhere",
};
const statusRail: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "0.75rem",
};
const signal: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  minHeight: 112,
  background: "#111611",
  border: "1px solid #283128",
  borderRadius: 8,
  padding: "0.9rem",
  color: "#ece7dc",
  textDecoration: "none",
  cursor: "pointer",
};
const signalLabel: CSSProperties = {
  color: "#8c9487",
  fontSize: "0.74rem",
  textTransform: "uppercase",
};
const signalValue: CSSProperties = { fontSize: "1.55rem", lineHeight: 1, overflowWrap: "anywhere" };
const signalDetail: CSSProperties = {
  color: "#aaa292",
  fontSize: "0.78rem",
  lineHeight: 1.4,
  overflowWrap: "anywhere",
};
const dashboardGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
  gap: "1rem",
};
const panel: CSSProperties = {
  background: "#101310",
  border: "1px solid #252b24",
  borderRadius: 8,
  padding: "1rem",
  minWidth: 0,
};
const panelLarge: CSSProperties = { ...panel };
const panelHeader: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  alignItems: "flex-start",
  marginBottom: "1rem",
};
const h2: CSSProperties = { margin: 0, fontSize: "1.05rem", letterSpacing: 0 };
const muted: CSSProperties = {
  color: "#9c9589",
  margin: "0.35rem 0 0",
  fontSize: "0.82rem",
  lineHeight: 1.45,
};
const linkButton: CSSProperties = {
  color: "#111611",
  background: "#d7f5dc",
  borderRadius: 8,
  padding: "0.38rem 0.6rem",
  textDecoration: "none",
  fontSize: "0.78rem",
  fontWeight: 800,
  cursor: "pointer",
};
const primaryButton: CSSProperties = { ...linkButton, display: "inline-flex", marginTop: "1rem" };
const phaseList: CSSProperties = { display: "grid", gap: "0.55rem" };
const phaseRow: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "52px minmax(0, 1fr) auto",
  gap: "0.75rem",
  alignItems: "center",
  border: "1px solid #252b24",
  borderRadius: 8,
  padding: "0.75rem",
  background: "#141915",
};
const phaseIndex: CSSProperties = { color: "#5eead4", fontSize: "1.2rem", fontWeight: 900 };
const phaseTitle: CSSProperties = { fontWeight: 800 };
const phaseDetail: CSSProperties = {
  color: "#aaa292",
  margin: "0.2rem 0 0",
  fontSize: "0.8rem",
  lineHeight: 1.4,
};
const phaseBadge: CSSProperties = {
  border: "1px solid #2dd4bf",
  color: "#5eead4",
  borderRadius: 8,
  padding: "0.2rem 0.45rem",
  fontSize: "0.72rem",
};
const metricGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.55rem",
};
const metric: CSSProperties = {
  display: "grid",
  gap: "0.25rem",
  background: "#141915",
  border: "1px solid #252b24",
  borderRadius: 8,
  padding: "0.7rem",
  color: "#8c9487",
  fontSize: "0.74rem",
};
const routeList: CSSProperties = { display: "grid", gap: "0.5rem", marginTop: "1rem" };
const routeItem: CSSProperties = {
  display: "grid",
  gap: "0.2rem",
  color: "#ece7dc",
  textDecoration: "none",
  border: "1px solid #252b24",
  borderRadius: 8,
  padding: "0.65rem",
  cursor: "pointer",
};
const liftGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
  gap: "0.65rem",
};
const liftItem: CSSProperties = {
  display: "grid",
  gap: "0.55rem",
  border: "1px solid #252b24",
  borderRadius: 8,
  padding: "0.75rem",
  color: "#d7d0c2",
};
const liftScore: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  borderTop: "1px solid #252b24",
  borderBottom: "1px solid #252b24",
  padding: "0.45rem 0",
  color: "#5eead4",
  fontWeight: 900,
};
const liftLayer: CSSProperties = {
  display: "block",
  color: "#8c9487",
  fontSize: "0.76rem",
  marginTop: "0.25rem",
};
const actionList: CSSProperties = { display: "grid", gap: "0.55rem" };
const actionItem: CSSProperties = {
  display: "grid",
  gap: "0.25rem",
  border: "1px solid #252b24",
  borderRadius: 8,
  padding: "0.65rem",
  color: "#d7d0c2",
};
const miniLog: CSSProperties = { display: "grid", gap: "0.4rem", marginTop: "1rem" };
const miniLogRow: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "12px minmax(0, 1fr) auto",
  gap: "0.45rem",
  alignItems: "center",
  color: "#d7d0c2",
  fontSize: "0.78rem",
};
const dotOk: CSSProperties = { width: 8, height: 8, borderRadius: 8, background: "#5eead4" };
const dotWarn: CSSProperties = { ...dotOk, background: "#f4b740" };
const automationBox: CSSProperties = {
  display: "grid",
  gap: "0.25rem",
  borderBottom: "1px solid #252b24",
  padding: "0.7rem 0",
  color: "#d7d0c2",
};
