import { readRegistry } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function Factory() {
  const warehouses = readRegistry("factory");
  return (
    <section>
      <h1>Factory federation</h1>
      <p style={{ color: "#a3a3a3" }}>
        {warehouses.length} warehouses with topic <code>nexural-factory</code>. Populates as Phase 5
        ships content.
      </p>
      <WarehouseTable warehouses={warehouses} />
    </section>
  );
}

function WarehouseTable({
  warehouses,
}: {
  readonly warehouses: ReadonlyArray<{ name: string; tier: string; status: string; repo: string }>;
}) {
  if (warehouses.length === 0) {
    return (
      <p style={{ color: "#737373" }}>
        No warehouses discovered. Run <code>pnpm discover</code>.
      </p>
    );
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: "1px solid #262626", textAlign: "left" }}>
          <th style={{ padding: "0.5rem" }}>Name</th>
          <th style={{ padding: "0.5rem" }}>Tier</th>
          <th style={{ padding: "0.5rem" }}>Status</th>
          <th style={{ padding: "0.5rem" }}>Repo</th>
        </tr>
      </thead>
      <tbody>
        {warehouses.map((w) => (
          <tr key={w.name} style={{ borderBottom: "1px solid #1a1a1a" }}>
            <td style={{ padding: "0.5rem" }}>{w.name}</td>
            <td style={{ padding: "0.5rem" }}>{w.tier}</td>
            <td style={{ padding: "0.5rem" }}>{w.status}</td>
            <td style={{ padding: "0.5rem" }}>
              <a href={w.repo} style={{ color: "#7dd3fc" }} target="_blank" rel="noreferrer">
                {w.repo}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
