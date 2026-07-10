'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage } from '@/types';

const SYSTEM_CONTEXT = `You are Cletus, an AI autonomous trading system specialized in Solana token trading.
You have deep knowledge of DeFi, technical analysis, risk management, and Solana ecosystem.
You are honest about your limitations as an AI and never guarantee profits.
You provide educational information about trading strategies, market analysis, and DeFi concepts.`;

const SUGGESTED_QUESTIONS = [
  'What is your current trading strategy?',
  'Explain your signal scoring system',
  'What is the best timeframe for trading meme coins?',
  'How do you manage risk on volatile tokens?',
<<<<<<< HEAD
  'What makes a good staking decision?',
  'Explain the 7 staking tiers',
  'What are your current active positions?',
  'How does profit sharing work?',
=======
  'What are your current active positions?',
>>>>>>> origin/main
];

const CLETUS_RESPONSES: Record<string, { content: string; citations?: string[] }> = {
  strategy: {
    content: `My current trading strategy focuses on **momentum-based entry** on Solana tokens with the following criteria:

**Signal Requirements:**
- Composite score ≥ 65/100
- Market cap: $10K–$500K (sweet spot for asymmetric returns)
- Volume/MCap ratio ≥ 0.3 (healthy liquidity)
- RSI between 45–70 (not overbought)
- MACD crossover confirmation

**Risk Management:**
- Max 2% of portfolio per trade
- Stop loss: 8–15% below entry
- Take profit: 25–50% above entry
- Never FOMO — patience is the edge

⚠️ *This is not financial advice. All trading involves risk.*`,
    citations: ['TRADING_PARAMETERS.env', 'TRADING_PARAMETERS_GUIDE.md'],
  },
  signals: {
    content: `My **composite signal score** is calculated from 8 independent indicators:

| Indicator | Weight | Description |
|-----------|--------|-------------|
| Volume Spike | 20% | Unusual volume vs 7-day average |
| Momentum | 18% | Price velocity over 1h/4h |
| Breakout | 17% | Key resistance level breaks |
| RSI Signal | 15% | Divergence and oversold recovery |
| MACD Cross | 12% | Signal line crossovers |
| Holder Growth | 8% | New wallet growth rate |
| Liquidity Score | 6% | DEX liquidity depth |
| Social Sentiment | 4% | On-chain social signals |

**Strength Tiers:**
- 🔴 EXTREME (85+): High conviction, larger position
- 🟢 STRONG (72+): Standard execution
- 🟡 MODERATE (60+): Reduced size, tight stops
- ⚪ WEAK (<60): Watchlist only`,
    citations: ['TRADING_PARAMETERS.env#signal-weights'],
  },
<<<<<<< HEAD
  staking: {
    content: `**Staking in Cletus** has two reward streams:

**1. APY Rewards (5% annually in SOL)**
- Calculated on your CLETUS stake value
- Distributed monthly based on protocol fees
- NOT profit-dependent — paid from fee pool

**2. Profit Sharing**
- Only activated if Cletus generates profits
- Your share % depends on your tier (0%–35%)
- Distributed at end of each calendar month
- **Zero if Cletus has a losing month**

**Important Disclaimers:**
- Cletus is an AI. AI systems make mistakes.
- Profit sharing is NOT guaranteed
- 7-day unstaking cooldown
- Early withdrawal may incur penalties

The honest truth: staking CLETUS is a bet that an AI trading system will be profitable long-term. This is a high-risk proposition.`,
    citations: ['STAKING_REWARDS_STRUCTURE.md', 'TOKEN_ECOSYSTEM.md'],
  },
=======
>>>>>>> origin/main
  risk: {
    content: `**Risk Management Framework:**

**Position Sizing:**
- Kelly Criterion adapted for crypto volatility
- Never more than 2% of portfolio per trade
- Max 4 simultaneous positions
- Correlation-aware (avoid holding correlated tokens)

**Stop Loss Strategy:**
- Hard stops: Always set before entry
- Trailing stops: Activated after 15% gain
- Time-based exits: 72h max hold if no momentum

**Red Flags (Instant Skip):**
- Honeypot detected
- Top 10 holders > 70%
- Liquidity < $10K
- Contract not renounced
- No trading history (< 1 hour old)

**Circuit Breakers:**
- Trading paused if daily loss > $2,000
- System halt if weekly loss > $5,000
- Emergency kill switch available`,
    citations: ['TRADING_PARAMETERS.env#risk-management'],
  },
};

function findBestResponse(question: string): { content: string; citations?: string[] } {
  const q = question.toLowerCase();

  if (q.includes('strateg') || q.includes('current') || q.includes('approach')) {
    return CLETUS_RESPONSES.strategy;
  }
  if (q.includes('signal') || q.includes('score') || q.includes('indicator')) {
    return CLETUS_RESPONSES.signals;
  }
<<<<<<< HEAD
  if (q.includes('stak') || q.includes('tier') || q.includes('reward') || q.includes('apy')) {
    return CLETUS_RESPONSES.staking;
  }
=======
>>>>>>> origin/main
  if (q.includes('risk') || q.includes('stop') || q.includes('position') || q.includes('manag')) {
    return CLETUS_RESPONSES.risk;
  }
  if (q.includes('timeframe') || q.includes('meme') || q.includes('memecoin')) {
    return {
      content: `**Optimal Timeframes for Meme Coins on Solana:**

**Primary:** 15m & 1h charts
- Meme coins move fast — 1h gives cleaner signals
- 15m for precise entry timing after 1h confirmation

**Secondary:** 4h for trend direction
- Never trade against the 4h trend
- "The trend is your friend" applies doubly to meme coins

**What I Watch:**
- 15m Volume spike = potential entry signal
- 1h RSI crossing 50 from below = momentum confirmation
- 4h showing higher lows = bullish structure

⚠️ **Meme coin reality:** 80% of them go to zero eventually. Position sizing and stop losses are non-negotiable. I never hold meme coins overnight without tight stops.`,
    };
  }
<<<<<<< HEAD
  if (q.includes('profit shar') || q.includes('how does profit')) {
    return {
      content: `**Profit Sharing Mechanism:**

Every month, here's what happens:

1. **Calculate Net Profit** from all trades
2. **Reserve Treasury** (20% of profits)
3. **Pay APY** from fee pool (SOL rewards)
4. **Distribute Remaining** to tier-eligible stakers

**Your Share Calculation:**
\`\`\`
Your Share = (Your Stake / Total Eligible Stake) × Tier Multiplier × Monthly Profit Pool
\`\`\`

**Honest Warning:** 
- If Cletus has a losing month → $0 profit share
- If Cletus loses big → no distributions until recovered
- This has happened to real AI trading systems before

The 5% APY SOL rewards are separate and more reliable (paid from fees, not profits).`,
      citations: ['STAKING_REWARDS_STRUCTURE.md'],
    };
  }
=======
>>>>>>> origin/main

  // Default response
  return {
    content: `That's a great question about **"${question}"**. 

As Cletus, I can tell you that I'm continuously analyzing the Solana ecosystem to find optimal trading opportunities. 

**What I can help you with:**
- Trading strategy explanations
- Signal analysis and interpretation
- Risk management concepts
<<<<<<< HEAD
- Staking and tokenomics
=======
>>>>>>> origin/main
- DeFi education

**What I cannot do:**
- Guarantee profits (no one can)
- Predict the future with certainty
- Give personalized financial advice

<<<<<<< HEAD
Try asking me about my signal scoring system, risk management approach, or how staking tiers work!
=======
Try asking me about my signal scoring system or risk management approach!
>>>>>>> origin/main

*Remember: Cletus is an AI. Always DYOR and never invest more than you can afford to lose.*`,
  };
}

function parseMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-trading-surface px-1 py-0.5 rounded text-trading-green text-xs font-mono">$1</code>')
    .replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/```\w*\n?/, '').replace(/```$/, '');
      return `<pre class="bg-trading-surface rounded-lg p-3 my-2 text-xs font-mono text-trading-green overflow-x-auto whitespace-pre">${code}</pre>`;
    })
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br/>')
    .replace(/\|(.*?)\|/g, (match) => {
      if (match.includes('---')) return '';
      const cells = match.split('|').filter(Boolean);
      return `<div class="flex gap-4 text-xs">${cells.map((c) => `<span class="flex-1">${c.trim()}</span>`).join('')}</div>`;
    });
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const timeStr = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-slide-up`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
          isUser ? 'bg-trading-blue/30 border border-trading-blue/50' : 'bg-trading-green/20 border border-trading-green/40'
        }`}
      >
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Content */}
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'chat-bubble-user text-white'
              : 'chat-bubble-ai text-gray-200'
          }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div
              className="prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
            />
          )}
        </div>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-1 px-1">
            {message.citations.map((cite) => (
              <span
                key={cite}
                className="text-xs bg-trading-surface border border-trading-border px-2 py-0.5 rounded-full text-gray-500"
              >
                📄 {cite}
              </span>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-600 px-1">{timeStr}</div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-trading-green/20 border border-trading-green/40 flex items-center justify-center text-sm shrink-0">
        🤖
      </div>
      <div className="chat-bubble-ai px-4 py-3 rounded-2xl">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-400"
              style={{
                animation: `pulseGreen 1s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AIBrainChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `**Greetings. I am Cletus.** 🤖

I'm an AI autonomous trading system operating on Solana. I analyze market signals, execute trades, and manage risk — all autonomously.

**I can help you understand:**
- My trading strategy and signal detection
- Risk management and position sizing
<<<<<<< HEAD
- Staking tiers and reward mechanics
=======
>>>>>>> origin/main
- DeFi concepts and Solana ecosystem
- Current market conditions

**What I am NOT:**
- A financial advisor
- A guarantee of profits
- Infallible — I make mistakes

Ask me anything about trading, DeFi, or how I work. What would you like to know?`,
      timestamp: Date.now() - 5000,
      citations: ['SECURITY.md'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);

      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content.trim() }),
          signal: AbortSignal.timeout(12_000),
        });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        const answer = typeof data?.answer === 'string' && data.answer
          ? data.answer
          : findBestResponse(content).content;
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: answer,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        const response = findBestResponse(content);
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content + '\n\n*⚠️ Running in offline mode — AI API unavailable.*',
          timestamp: Date.now(),
          citations: response.citations,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px] animate-fade-in">
      {/* Header */}
      <div className="trading-card p-4 mb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-trading-green/20 border border-trading-green/40 flex items-center justify-center">
              🤖
            </div>
            <div>
              <div className="font-bold">Cletus AI Brain</div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-trading-green status-dot-live" />
                <span className="text-trading-green">Online · Gemini 2.5 Flash</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setMessages([
                {
                  id: 'new-session',
                  role: 'assistant',
                  content: 'Session cleared. How can I help you?',
                  timestamp: Date.now(),
                },
              ]);
            }}
            className="text-xs text-gray-500 hover:text-white bg-trading-surface border border-trading-border px-3 py-1.5 rounded-lg transition-colors"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="mb-4 shrink-0">
          <div className="text-xs text-gray-500 mb-2">Suggested questions:</div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs bg-trading-surface border border-trading-border rounded-full px-3 py-1.5 text-gray-400 hover:text-white hover:border-trading-green/50 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="shrink-0">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
<<<<<<< HEAD
            placeholder="Ask Cletus about trading, signals, staking, DeFi..."
=======
            placeholder="Ask Cletus about trading, signals, DeFi..."
>>>>>>> origin/main
            rows={1}
            className="flex-1 bg-trading-card border border-trading-border rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-trading-green resize-none transition-all"
            style={{ maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-4 py-3 rounded-xl bg-trading-green text-black font-bold text-sm hover:bg-trading-green/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shrink-0"
          >
            {isTyping ? '⏳' : '↑'}
          </button>
        </div>
        <div className="text-xs text-gray-600 mt-2 text-center">
          Press Enter to send · Shift+Enter for new line · Not financial advice
        </div>
      </form>
    </div>
  );
}
