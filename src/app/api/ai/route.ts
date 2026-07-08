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
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
