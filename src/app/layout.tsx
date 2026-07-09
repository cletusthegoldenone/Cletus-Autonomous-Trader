import type { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
        <SpeedInsights />
      </body>
    </html>
  );
}
