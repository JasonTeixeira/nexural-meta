import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nexural Dashboard",
  description: "Federation health, scorecard, decay, costs, revocations.",
};

const NAV = [
  { href: "/" as const, label: "Overview" },
  { href: "/factory" as const, label: "Factory" },
  { href: "/lifeops" as const, label: "Lifeops" },
  { href: "/scorecard" as const, label: "Scorecard" },
  { href: "/security/revocations" as const, label: "Revocations" },
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
            gap: "2rem",
            padding: "1rem 2rem",
            borderBottom: "1px solid #262626",
            background: "#0f0f0f",
          }}
        >
          <strong style={{ fontSize: "1.1rem" }}>Nexural</strong>
          <nav style={{ display: "flex", gap: "1.5rem", fontSize: "0.9rem" }}>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} style={{ color: "#e5e5e5", textDecoration: "none" }}>
                {n.label}
              </Link>
            ))}
          </nav>
        </header>
        <main style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>{children}</main>
      </body>
    </html>
  );
}
