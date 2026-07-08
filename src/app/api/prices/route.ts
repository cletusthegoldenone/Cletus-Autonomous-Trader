import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pair = searchParams.get('pair') || 'SOL';
  const timeframe = searchParams.get('timeframe') || '1h';

  // Generate mock candlestick data
  const candles = generateMockCandles(100);

  return NextResponse.json({
    pair,
    timeframe,
    candles,
    timestamp: new Date().toISOString(),
  });
}

function generateMockCandles(count: number) {
  const candles = [];
  let price = 100;

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.49) * 5;
    const open = price;
    const close = Math.max(50, price + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    const volume = Math.floor(Math.random() * 1000000);

    candles.push({
      time: Math.floor(Date.now() / 1000) - (count - i) * 60,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });

    price = close;
  }

  return candles;
}
