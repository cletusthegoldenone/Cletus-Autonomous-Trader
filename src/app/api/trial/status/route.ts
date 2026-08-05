import { NextRequest, NextResponse } from 'next/server';
import { getTrial, saveTrial } from '@/lib/position-store';

function isValidSolanaAddress(addr: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet')?.trim();

    if (!wallet || !isValidSolanaAddress(wallet)) {
      return NextResponse.json({ error: 'Invalid or missing Solana wallet address' }, { status: 400 });
    }

    const trial = await getTrial(wallet);
    if (!trial) {
      return NextResponse.json({ active: false, exists: false });
    }

    const isExpired = Date.now() > trial.expiresAt;
    if (isExpired && trial.active) {
      trial.active = false;
      await saveTrial(trial);
    }

    return NextResponse.json({
      active: trial.active,
      exists: true,
      trial,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to check trial status: ${msg}` }, { status: 500 });
  }
}
