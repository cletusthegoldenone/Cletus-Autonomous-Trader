import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cletus PRO - Solana DeFi Command Center',
  description: 'AI-powered autonomous trading system for Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}