import { NextResponse } from 'next/server';

const TOKENS = [
  { name: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
  { name: 'WIF', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
  { name: 'JTO', address: 'jtojtomepa8bdoa1lvfuv42y5k5yblxeqiqv9dgb1b' },
  { name: 'PYTH', address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3' },
  { name: 'RAY', address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R' },
  { name: 'ORCA', address: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE' },
];

function generateSignal() {
  const token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
  const compositeScore = 0.55 + Math.random() * 0.45;

  let strength: string;
  if (compositeScore >= 0.85) strength = 'EXTREME';
  else if (compositeScore >= 0.72) strength = 'STRONG';
  else if (compositeScore >= 0.60) strength = 'MODERATE';
  else strength = 'WEAK';

  return {
    id: Math.random().toString(36).slice(2),
    tokenName: token.name,
    tokenAddress: token.address,
    marketCap: 10000 + Math.random() * 490000,
    volume24h: 5000 + Math.random() * 300000,
    compositeScore,
    priceChange24h: -5 + Math.random() * 25,
    currentPrice: 0.00001 + Math.random() * 5,
    breakdown: {
      volumeSpike: Math.random(),
      momentum: Math.random(),
      breakout: Math.random(),
      rsiScore: Math.random(),
      macdCross: Math.random(),
      holderGrowth: Math.random(),
      liquidityScore: Math.random(),
      socialSentiment: Math.random(),
    },
    riskReward: 1.5 + Math.random() * 3.5,
    direction: Math.random() > 0.3 ? 'LONG' : 'SHORT',
    strength,
    timestamp: Date.now() - Math.random() * 3600000,
  };
}

export async function GET() {
  const signals = Array.from({ length: 8 }, generateSignal).sort(
    (a, b) => b.compositeScore - a.compositeScore
  );

  return NextResponse.json({
    signals,
    scannedTokens: Math.floor(400 + Math.random() * 200),
    lastUpdated: Date.now(),
  });
}
