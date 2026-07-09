<<<<<<< HEAD
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cletus | AI Autonomous Trader',
  description:
    'Cletus is an AI-powered autonomous trading system for Solana tokens. Real-time signals, automated execution, and profit sharing.',
  keywords: ['Solana', 'AI Trading', 'Autonomous Trader', 'DeFi', 'Crypto'],
  authors: [{ name: 'Cletus AI' }],
  openGraph: {
    title: 'Cletus | AI Autonomous Trader',
    description: 'AI-powered autonomous trading system for Solana',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0b0d',
=======
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cletus • Solana DeFi AI Terminal',
  description: 'The ultimate Solana DeFi command center. Real-time AI scanner, market briefings, community intelligence, and enterprise-grade security.',
>>>>>>> origin/main
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-trading-bg text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
=======
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
>>>>>>> origin/main
