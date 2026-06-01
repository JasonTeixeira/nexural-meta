import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sage Ideas Engineering OS",
  description: "Service-level control plane for registries, scorecards, gaps, and evidence.",
};

// typedRoutes regenerates the route union at `next build` time; tsc --noEmit
// can race against it for newly added routes. Cast to string at the boundary.
const NAV: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/", label: "Cockpit" },
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/resources", label: "Resources" },
  { href: "/recipes", label: "Recipes" },
  { href: "/golden-path", label: "Golden Path" },
  { href: "/proof-environment", label: "Proof Env" },
  { href: "/db-proof", label: "DB Proof" },
  { href: "/health", label: "Health" },
  { href: "/factory", label: "Factory" },
  { href: "/public-proof", label: "Proof Packet" },
  { href: "/scorecard", label: "Scorecard" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "'Space Grotesk', 'Aptos Display', 'Segoe UI', sans-serif",
          background: "#0b0d0c",
          color: "#ece7dc",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.25rem",
            padding: "1rem clamp(1rem, 4vw, 2rem)",
            borderBottom: "1px solid #242923",
            background: "#101310",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <strong style={{ fontSize: "1rem", letterSpacing: "0.02em", marginRight: "0.5rem" }}>
            Sage Ideas OS
          </strong>
          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.45rem",
              fontSize: "0.82rem",
            }}
          >
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                style={{
                  color: "#d8d1c2",
                  textDecoration: "none",
                  border: "1px solid #2a312b",
                  borderRadius: 8,
                  padding: "0.38rem 0.55rem",
                  cursor: "pointer",
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>
        </header>
        <main style={{ padding: "clamp(1rem, 3vw, 2rem)", maxWidth: 1320, margin: "0 auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
