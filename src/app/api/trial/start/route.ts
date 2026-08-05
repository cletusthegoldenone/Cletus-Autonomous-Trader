import { NextRequest, NextResponse } from 'next/server';
import { getTrial, saveTrial } from '@/lib/position-store';

function isValidSolanaAddress(addr: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const wallet = body?.wallet?.trim();

    if (!wallet || !isValidSolanaAddress(wallet)) {
      return NextResponse.json({ error: 'Invalid or missing Solana wallet address' }, { status: 400 });
    }

    const existing = await getTrial(wallet);
    if (existing) {
      return NextResponse.json({ success: true, trial: existing });
    }

    const now = Date.now();
    const duration = 30 * 24 * 60 * 60 * 1000; // 30 days
    const trial = {
      walletAddress: wallet,
      startedAt: now,
      expiresAt: now + duration,
      active: true,
    };

    const saved = await saveTrial(trial);
    return NextResponse.json({ success: true, trial: saved });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to start trial: ${msg}` }, { status: 500 });
  }
}
