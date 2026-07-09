<<<<<<< HEAD
import { NextResponse } from 'next/server';

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
=======
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    // Mock AI response
    const response = {
      question,
      answer: `I'm Cletus, your AI trading companion. You asked: "${question}"

Here are some insights:

1. **Market Analysis**: I scan 500+ micro-cap tokens daily looking for signals
2. **Risk Management**: Every trade has a stop-loss at 10% and take-profit at 25%
3. **Staking Rewards**: Your stake earns 5% APY in SOL plus profit sharing

Would you like to know more about any specific strategy?`,
      citations: [
        "Cletus Trading Signals Documentation",
        "Solana DeFi Best Practices",
        "Risk Management Guide",
      ],
      confidence: 0.92,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
>>>>>>> origin/main
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
