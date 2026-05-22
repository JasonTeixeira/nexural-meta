import { readRevocations } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function Revocations() {
  const entries = readRevocations();
  return (
    <section>
      <h1>Recipe revocations</h1>
      <p style={{ color: "#a3a3a3" }}>
        Append-only revocation list per ADR-0009 §1.6. <code>nx forge</code> consults this before
        emitting any recipe.
      </p>
      {entries.length === 0 ? (
        <p style={{ color: "#737373" }}>No recipes revoked. Clean.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #262626", textAlign: "left" }}>
              <th style={{ padding: "0.5rem" }}>Recipe</th>
              <th style={{ padding: "0.5rem" }}>Version</th>
              <th style={{ padding: "0.5rem" }}>Revoked at</th>
              <th style={{ padding: "0.5rem" }}>Reason</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr
                key={`${e.recipe_name}@${e.recipe_version}`}
                style={{ borderBottom: "1px solid #1a1a1a" }}
              >
                <td style={{ padding: "0.5rem" }}>{e.recipe_name}</td>
                <td style={{ padding: "0.5rem" }}>{e.recipe_version}</td>
                <td style={{ padding: "0.5rem" }}>{e.revoked_at}</td>
                <td style={{ padding: "0.5rem" }}>{e.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
