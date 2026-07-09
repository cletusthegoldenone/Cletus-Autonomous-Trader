import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['500', '600'],
  display: 'swap',
});

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
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}