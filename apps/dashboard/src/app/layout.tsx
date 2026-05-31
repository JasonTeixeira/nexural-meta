import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sage Ideas Engineering OS",
  description: "Service-level control plane for registries, scorecards, gaps, and evidence.",
};

// typedRoutes regenerates the route union at `next build` time; tsc --noEmit
// can race against it for newly added routes. Cast to string at the boundary.
const NAV: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/", label: "Overview" },
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/resources", label: "Resources" },
  { href: "/golden-path", label: "Golden Path" },
  { href: "/health", label: "Health" },
  { href: "/factory", label: "Factory" },
  { href: "/lifeops", label: "Lifeops" },
  { href: "/scorecard", label: "Scorecard" },
  { href: "/security/revocations", label: "Revocations" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial",
          background: "#0a0a0a",
          color: "#e5e5e5",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "2rem",
            padding: "1rem clamp(1rem, 4vw, 2rem)",
            borderBottom: "1px solid #262626",
            background: "#0f0f0f",
          }}
        >
          <strong style={{ fontSize: "1.1rem" }}>Sage Ideas OS</strong>
          <nav
            style={{ display: "flex", flexWrap: "wrap", gap: "1rem 1.5rem", fontSize: "0.9rem" }}
          >
            {NAV.map((n) => (
              <a key={n.href} href={n.href} style={{ color: "#e5e5e5", textDecoration: "none" }}>
                {n.label}
              </a>
            ))}
          </nav>
        </header>
        <main style={{ padding: "clamp(1rem, 4vw, 2rem)", maxWidth: 1100, margin: "0 auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
