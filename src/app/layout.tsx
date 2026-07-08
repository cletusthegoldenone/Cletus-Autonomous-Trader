import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cletus Autonomous Trader",
  description: "Minimal compilable Next.js scaffold for the Cletus autonomous trading system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
