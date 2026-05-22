import { readRegistry } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function Lifeops() {
  const warehouses = readRegistry("lifeops");
  return (
    <section>
      <h1>Lifeops federation</h1>
      <p style={{ color: "#a3a3a3" }}>
        {warehouses.length} warehouses with topic <code>nexural-lifeops</code>. Personal/strategic
        knowledge per ADR-0003.
      </p>
      {warehouses.length === 0 ? (
        <p style={{ color: "#737373" }}>
          No warehouses yet. Lifeops federation spins up alongside Phase 8 launch.
        </p>
      ) : (
        <pre>{JSON.stringify(warehouses, null, 2)}</pre>
      )}
    </section>
  );
}
