import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FarmShield - Comprehensive Biosecurity Management",
  description: "Protect your livestock with intelligent risk assessment and compliance tracking for pig and poultry farms.",
  keywords: "farm management, biosecurity, livestock, poultry, pig farming, risk assessment",
  authors: [{ name: "FarmShield Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
