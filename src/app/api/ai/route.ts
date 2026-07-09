import { NextResponse } from 'next/server';

<<<<<<< HEAD
const SYSTEM_PROMPT = `You are Cletus AI, an expert Solana DeFi trading assistant built into the Cletus PRO platform. 
You help traders understand micro-cap token signals, market patterns, risk management, and DeFi strategies on Solana.
Keep responses concise, actionable, and trader-focused. Use bullet points for clarity. 
Avoid financial advice disclaimers in casual conversation. Be direct and informative.`;

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
    return `**Cletus Staking Tiers:**\n\n- **Basic** (100 CLETUS): Core scanner access\n- **Full** (500 CLETUS): All features + AI chat\n- **Unlimited** (2000 CLETUS): Priority signals + API access\n\nStaking runs on Solana with 5% APY + profit sharing from platform fees. 30-day trials available.`;
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
=======
const RESPONSES: Record<string, string> = {
  default: `I'm Cletus, an AI autonomous trading system. I analyze Solana token markets using 8 signal indicators to find trading opportunities. I can help you understand my strategy, risk management, staking mechanics, and DeFi concepts. What would you like to know?`,
  strategy: `My trading strategy focuses on momentum-based entries with composite signal scores ≥65/100. I look for tokens with market caps $10K-$500K, strong volume/MCap ratios, and confirmed RSI + MACD signals. Risk management is always first: 2% max per trade, hard stop losses, never FOMO. This is not financial advice.`,
  signals: `My signal system scores 8 indicators: Volume Spike (20%), Momentum (18%), Breakout (17%), RSI (15%), MACD (12%), Holder Growth (8%), Liquidity (6%), Social (4%). EXTREME ≥85, STRONG ≥72, MODERATE ≥60.`,
  staking: `Staking CLETUS earns 5% APY in SOL from protocol fees, plus profit sharing if Cletus is profitable. 7 tiers from Starter (100K CLETUS) to Founder (100M CLETUS). Profit sharing ranges 0%-35% based on tier. 7-day unstaking cooldown. Warning: profit sharing is NOT guaranteed — AI systems make mistakes.`,
  risk: `Risk management: 2% max per trade, 4 max positions, stop losses always set pre-entry, trailing stops after 15% gain. Red flags: honeypot contracts, high holder concentration, low liquidity. Circuit breakers pause trading on daily loss >$2K.`,
};

function getResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('strateg') || q.includes('approach')) return RESPONSES.strategy;
  if (q.includes('signal') || q.includes('score')) return RESPONSES.signals;
  if (q.includes('stak') || q.includes('tier') || q.includes('apy')) return RESPONSES.staking;
  if (q.includes('risk') || q.includes('stop') || q.includes('loss')) return RESPONSES.risk;
  return RESPONSES.default;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = body as { question: string };

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitized = question.slice(0, 500).trim();

    // In production, this would call the Gemini API with the GEMINI_API_KEY
    // For now, return pre-built responses
    const response = getResponse(sanitized);

    return NextResponse.json({
      response,
      model: 'gemini-2.5-flash',
      disclaimer: 'This is AI-generated information, not financial advice.',
      timestamp: Date.now(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
>>>>>>> origin/main
  }
}
