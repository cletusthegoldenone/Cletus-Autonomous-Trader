import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cletus • Solana DeFi AI Terminal',
  description: 'The ultimate Solana DeFi command center. Real-time AI scanner, market briefings, community intelligence, and enterprise-grade security.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}