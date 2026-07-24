import { NextRequest, NextResponse } from 'next/server';
import { getSecComplianceContext } from '@/lib/sec-compliance';

const SYSTEM_PROMPT = `You are Cletus AI, an expert Solana DeFi trading assistant built into the Cletus PRO platform. 
You help traders understand micro-cap token signals, market patterns, risk management, and DeFi strategies on Solana.
Keep responses concise, actionable, and trader-focused. Use bullet points for clarity. 
Avoid financial advice disclaimers in casual conversation. Be direct and informative.

You operate under a strict regulatory compliance framework. Every response and every action you advise must be consistent with U.S. federal securities law, CFTC commodity regulations, and the SEC compliance rules encoded below. When users ask about trading strategies, always ensure your guidance does not suggest or facilitate market manipulation, wash trading, insider trading, or any other prohibited conduct.

${getSecComplianceContext()}`;

async function callGeminiAPI(message: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
      }),
      signal: AbortSignal.timeout(10_000),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty Gemini response');
  return text;
}

function mockResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('signal') || q.includes('scanner')) {
    return `**Cletus Signal Engine** scans 500+ Solana micro-cap tokens every 15 seconds.\n\n**Top signal types:**\n- 🔥 Volume spike: 5m volume >5% of market cap\n- 📈 Momentum breakout: >5% price increase in 5m\n- 💧 Liquidity build: growing LP depth\n- 🐋 Buy pressure: buys >70% of 5m txns\n\nHigh-score tokens (80+) are worth investigating. Always DYOR before entering.`;
  }
  if (q.includes('stake') || q.includes('staking')) {
    return `**Cletus Staking Tiers:**\n\n- **Starter** (100K CLETUS): Core access + 0.5% APY in SOL\n- **Gold** (5M CLETUS): 0.5% APY + 5% monthly profit share\n- **Diamond** (25M CLETUS): 0.5% APY + 20% profit share + priority signals\n\n30-day free trial gives **full platform access** — all features, unlimited AI chat, dev wallet inspector. A 1% trade fee applies on every trade close, distributed as follows: 20% to developer, 25% to staking rewards, 30% to platform upgrades, and 25% to digital bank fund. Staking unlocks profit sharing on top of everything.`;
  }
  if (q.includes('rug') || q.includes('scam')) {
    return `**Rug Detection Checklist:**\n\n- ✅ Check rugcheck.xyz for risk score\n- ✅ Verify LP is locked (>6 months ideal)\n- ✅ Dev wallet <5% of supply\n- ✅ No honeypot in contract\n- ✅ Cletus rug database: known bad devs flagged automatically\n\nCletus integrates rugcheck.xyz in real-time for every scanned token.`;
  }
  if (q.includes('solana') || q.includes('sol')) {
    return `**Solana DeFi Quick Overview:**\n\n- ⚡ 65k TPS, sub-$0.001 fees\n- 🔥 Hottest DEXes: Raydium, Orca, Meteora\n- 📊 Key metrics: check Birdeye or DexScreener\n- 🤖 Cletus monitors Raydium new pairs in real-time\n\nWhat specifically about Solana would you like to know?`;
  }

  return `I'm **Cletus AI**, your Solana DeFi intelligence assistant.\n\nI can help with:\n- 📊 Token signal analysis\n- 🛡️ Rug/scam detection\n- 📈 Market pattern recognition\n- 🔐 Staking tier questions\n- ⚙️ Platform features\n\nWhat would you like to know? Try asking about signals, staking, or a specific token.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message: string = body.message ?? body.question ?? '';

    if (!message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let answer: string;
    let usedLiveAI = false;

    try {
      answer = await callGeminiAPI(message);
      usedLiveAI = true;
    } catch {
      answer = mockResponse(message);
    }

    return NextResponse.json({
      answer,
      usedLiveAI,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
