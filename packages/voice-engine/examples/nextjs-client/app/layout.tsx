export const metadata = {
  title: "Nexural Voice",
  description: "One engine. Infinite personas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
