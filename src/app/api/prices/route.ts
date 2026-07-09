import { NextResponse } from 'next/server';

function generateCandle(basePrice: number, volatility: number, time: number) {
  const change = (Math.random() - 0.49) * volatility;
  const open = basePrice;
  const close = Math.max(0.00001, basePrice + change);
  return {
    time,
    open,
    high: Math.max(open, close) * (1 + Math.random() * 0.005),
    low: Math.min(open, close) * (1 - Math.random() * 0.005),
    close,
    volume: Math.random() * 500000 + 50000,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pair = searchParams.get('pair') || 'SOL/USDT';
  const timeframe = searchParams.get('timeframe') || '15m';
  const count = parseInt(searchParams.get('count') || '200');

  const pairs: Record<string, { base: number; vol: number }> = {
    'SOL/USDT': { base: 185, vol: 2.5 },
    'JTO/USDT': { base: 3.2, vol: 0.08 },
    'WIF/USDT': { base: 2.8, vol: 0.07 },
    'BONK/USDT': { base: 0.000035, vol: 0.0000008 },
    'PYTH/USDT': { base: 0.42, vol: 0.012 },
    'JUP/USDT': { base: 1.15, vol: 0.03 },
  };

  const timeframeSeconds: Record<string, number> = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '1h': 3600,
    '4h': 14400,
    '1d': 86400,
  };

  const pairConfig = pairs[pair] || pairs['SOL/USDT'];
  const tfSeconds = timeframeSeconds[timeframe] || 900;
  const now = Math.floor(Date.now() / 1000);

  const candles = [];
  let price = pairConfig.base;

  for (let i = count; i >= 0; i--) {
    const candle = generateCandle(price, pairConfig.vol, now - i * tfSeconds);
    candles.push(candle);
    price = candle.close;
  }

  return NextResponse.json({
    pair,
    timeframe,
    candles,
    lastUpdated: Date.now(),
  });
}
