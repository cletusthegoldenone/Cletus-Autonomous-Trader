import { NextResponse } from 'next/server';

export async function GET() {
  const signals = [
    {
      id: 1,
      token: 'EPjFWaLb3oc',
      name: 'USDC',
      marketCap: 145000,
      volume24h: 75000,
      compositeScore: 0.74,
      signals: {
        volumeSpike: 0.85,
        momentum: 0.72,
        breakout: 0.65,
        velocitySurge: 0.58,
        microCapHeat: 0.70,
        nanoCapSpike: 0.62,
        liquidityBuild: 0.55,
        volMcapRatio: 0.68,
      },
    },
    {
      id: 2,
      token: 'So11111111111111',
      name: 'SOL',
      marketCap: 320000,
      volume24h: 125000,
      compositeScore: 0.68,
      signals: {
        volumeSpike: 0.70,
        momentum: 0.75,
        breakout: 0.62,
        velocitySurge: 0.68,
        microCapHeat: 0.55,
        nanoCapSpike: 0.48,
        liquidityBuild: 0.72,
        volMcapRatio: 0.64,
      },
    },
  ];

  return NextResponse.json({
    signals,
    timestamp: new Date().toISOString(),
    scannedTokens: 500,
    aboveThreshold: 2,
  });
}
