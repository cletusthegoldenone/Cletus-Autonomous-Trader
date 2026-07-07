# Cletus — Autonomous AI-Powered Trading System for Solana DeFi

**Cletus is not a human. Cletus is not a fund manager. Cletus is a machine that reads signals, learns from outcomes, and adjusts his own parameters without requiring intervention.**

He hunts low market-cap tokens in the **$10,000–$500,000 range** — the volatile micro-cap trenches where genuine alpha still exists — and executes trades based on a continuously self-improving pattern intelligence engine.

He runs **24/7**, scans the market every few seconds, and acts on data faster than any human can.

The name is intentional: **Cletus is scrappy, relentless, and slightly unhinged. That's the micro-cap market. That's the edge.**

---

## How He Works

Cletus operates across several interconnected systems:

### Scanner
Continuously scans Solana token pairs filtered to the **$10k–$500k market cap range**. High volume-to-market-cap ratio is the primary selection signal: a tiny token doing significant volume is almost always about to move.

### Pattern Intelligence
Eight live signals fire in real time:
- **Volume Spike** — Sudden surge in trading volume
- **Price Momentum** — Directional price movement acceleration
- **Breakout** — Price breaks through resistance/support
- **Velocity Surge** — Rapid price acceleration
- **Micro-Cap Heat** — Market attention on small-cap tokens
- **Nano-Cap Spike** — Extreme volatility in nano-cap range
- **Liquidity Build** — Growing depth at key price levels
- **Vol/MCap Ratio** — Volume relative to market capitalization

Each signal is weighted by a learned win rate derived from trade history.

### Self-Learning Engine
After every closed trade, Cletus updates his pattern memory:
- Signals that led to wins get amplified
- Signals that led to losses get dampened
- Weights shift continuously
- Over time, his pattern scoring improves

### Self-Healing
The operational parameter engine monitors RPC failures, slippage errors, and network congestion in real time. When failures accumulate, Cletus autonomously:
- Raises his priority fee
- Widens slippage tolerance
- Pauses trading
- All without any human coding intervention

### Security Audit
Before entering any position, Cletus screens the token contract for:
- Mint authority risk
- Freeze authority
- Liquidity lock status
- Honeypot indicators
- Holder concentration

Tokens that fail are blocked automatically.

### Progressive Trade Sizing
As Cletus hits cumulative PnL milestones, his maximum clip size scales automatically:
- 1.0× at seed level
- 1.5× at $20k tier
- 2.0× at $40k tier
- 2.5× at the $60k+ tier

---

## The AI Brain

The Cletus Brain is powered by **Google Gemini 2.5 Flash** — a frontier language model with deep reasoning capabilities.

Users can ask Cletus anything about:
- DeFi strategy
- Solana token mechanics
- Risk management
- On-chain analysis
- General market questions

The Brain has full context about Cletus's own architecture and is primed to answer questions from the perspective of an autonomous DeFi system. **It doesn't just search the web — it reasons.**

### Important: The Brain does not make live trading decisions
- All advisory and strategic questions are handled by the language model
- All trade execution is handled by the deterministic signal engine, not the language model
- This separation maintains system integrity and reduces model hallucination risk

---

## AI Limitations & Honest Disclaimer

**Cletus is an AI. AI systems make mistakes. This is not a theoretical concern — it is a certainty over any sufficiently long operating window.**

### Cletus can and will:
- Misread market signals in unusual conditions
- Enter positions that result in partial or total loss
- Fail to execute transactions due to network congestion
- Generate pattern scores that overfit to past data and underperform on new market regimes
- Experience bugs, edge cases, and unexpected behavior as the system evolves

### Critical: No guarantees
**No AI trading system can guarantee profits. Any system that claims otherwise is lying to you.**

Crypto markets are adversarial, zero-sum, and frequently irrational. Even the best signals fail. Even the best risk management cannot prevent drawdowns.

- **Profit is not guaranteed**
- **Losses are possible**
- **Only use capital you can afford to lose entirely**

### What Cletus Is
Cletus is a tool that may improve your edge over manual trading in specific market conditions. **He is not a savings account. He is not a guaranteed income stream. He is a high-risk autonomous system operating in a high-risk asset class.**

---

## Security Architecture

Cletus is designed with a security-first architecture:

### Public vs. Private Key Separation

**Public Address (Safe to expose):**
```typescript
// Can be displayed in UI, logs, API responses
const publicAddress = process.env.TRADING_WALLET_ADDRESS;
return { walletAddress: publicAddress, balance: 15000 };
```

**Private Key (Server-side only):**
```typescript
// NEVER return to client, NEVER log, NEVER expose
const privateKey = process.env.TRADING_WALLET_PRIVATE_KEY;
// Used only for local transaction signing
const signature = await signTransaction(privateKey, transaction);
```

### Local Keypair Signing
- All transaction signing occurs locally within the isolated server environment
- Private keys are never transmitted to external RPC nodes, APIs, or third-party services
- The signing environment is fully isolated
- Transactions are signed server-side, then broadcast to Solana network

### Pre-Trade Security Audit
- Every token is screened before a single lamport is deployed
- Tokens with active mint authority, frozen liquidity, or honeypot indicators are blocked automatically
- Holder concentration analysis prevents rug pull risk

### Kill Switch
- Single-button emergency stop closes all open positions and converts to USDC instantly
- Executed in one atomic database transaction
- Cannot be partially executed

### Parameter Isolation
- Helius API keys and wallet addresses are stored server-side only
- Public address is safe to expose; private key is masked in all responses
- Private key never returned to the browser or client

---

## The Self-Perpetual Vision

The long-term vision for Cletus is a **self-perpetual AI machine**:
- A system that funds its own operational costs from trading profits
- Manages its own liquidity
- Scales its own position sizes as it accumulates capital
- Runs entirely unattended

This is the logical endpoint of every component in the system:
- The self-learning pattern engine
- The progressive trade sizing
- The self-healing operational parameters
- The persistent intelligence ledger

All compound over time toward greater autonomy.

**We are not there yet. We are building toward it — component by component, trade by trade, heal by heal. Every improvement to the system is a step toward a machine that doesn't need us.**

**That is the golden goose.**

---

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Next.js 14+ (frontend + API routes)
- **Language**: TypeScript
- **Blockchain**: Solana Web3.js, Anchor
- **RPC Provider**: Helius (with fallback to QuickNode)
- **AI Model**: Google Gemini 2.5 Flash API
- **DEX Integration**: Raydium, Jupiter Aggregator
- **Database**: PostgreSQL (for trade history, pattern memory, audit logs)
- **Deployment**: Vercel

---

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Solana wallet with devnet SOL (for testing)
- Helius API key
- Google Gemini API key
- PostgreSQL database (local or cloud)

### 1. Clone the Repository
```bash
git clone https://github.com/cletusthegoldenone/Cletus-Autonomous-Trader.git
cd Cletus-Autonomous-Trader
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file and fill in your secrets:
```bash
cp .env.example .env.local
```

See [Environment Variables](#environment-variables) below.

### 4. Set Up Database
```bash
npm run db:setup
npm run db:migrate
```

### 5. Run in Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 6. Build for Production
```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Public Variables (Safe to expose)
```env
TRADING_WALLET_ADDRESS=your_public_wallet_address_here
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY
SOLANA_RPC_FALLBACK=https://api.mainnet-beta.solana.com
```

### Private Variables (Server-side only, Vercel Secrets)
```env
TRADING_WALLET_PRIVATE_KEY=your_base58_private_key_here
HELIUS_API_KEY=your_helius_api_key
GEMINI_API_KEY=your_google_gemini_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/cletus_trader
```

### Trading Parameters
```env
MIN_MARKET_CAP=10000
MAX_MARKET_CAP=500000
MIN_VOLUME_USD=5000
SLIPPAGE_TOLERANCE=0.05
PRIORITY_FEE_LAMPORTS=100000
```

See `.env.example` for the complete list of all configuration options.

**⚠️ SECURITY NOTES:**
- Never commit `.env.local` to Git (already in `.gitignore`)
- Store all private variables in Vercel Secrets in production
- Public address (`TRADING_WALLET_ADDRESS`) is safe to log and display
- Private key (`TRADING_WALLET_PRIVATE_KEY`) is never exposed to clients

---

## Deployment to Vercel

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Initial Cletus setup"
git push origin main
```

### 2. Connect Repository to Vercel
- Go to [Vercel Dashboard](https://vercel.com)
- Click "Add New..." → "Project"
- Import your GitHub repository
- Select "Next.js" as the framework

### 3. Configure Environment Variables in Vercel
In the Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add secrets for production:
   - `TRADING_WALLET_PRIVATE_KEY` (Production only)
   - `HELIUS_API_KEY`
   - `GEMINI_API_KEY`
   - `DATABASE_URL`
3. Add public variables for all environments:
   - `TRADING_WALLET_ADDRESS`
   - `SOLANA_RPC_URL`
   - Other public config

### 4. Configure for Production
In `vercel.json`, environment variables reference Vercel Secrets with `@` prefix:
```json
{
  "env": {
    "TRADING_WALLET_PRIVATE_KEY": "@trading_wallet_private_key",
    "HELIUS_API_KEY": "@helius_api_key",
    "GEMINI_API_KEY": "@gemini_api_key"
  }
}
```

### 5. Deploy
Push to `main` branch or manually trigger deployment in Vercel dashboard.

---

## API Reference

### Trading Endpoints

#### `POST /api/trade/scan`
Scans the market for trading opportunities.

**Response:**
```json
{
  "tokens": [
    {
      "address": "EPjFWaLb3odcccccccccccccccccccccccccccccccc",
      "symbol": "USDC",
      "marketCap": 150000,
      "volume24h": 75000,
      "volumeToMcapRatio": 0.5,
      "signals": {
        "volumeSpike": 0.85,
        "momentum": 0.72,
        "breakout": 0.65
      },
      "compositeScore": 0.74
    }
  ]
}
```

#### `POST /api/trade/execute`
Executes a trade on a specific token.

**Body:**
```json
{
  "tokenAddress": "EPjFWaLb3odcccccccccccccccccccccccccccccccc",
  "amount": 1.5,
  "side": "buy",
  "maxSlippage": 0.05
}
```

#### `POST /api/trade/close-position`
Closes an open position.

**Body:**
```json
{
  "positionId": "abc123xyz"
}
```

#### `GET /api/trade/positions`
Retrieves all open positions.

**Response:**
```json
{
  "positions": [
    {
      "id": "pos_123",
      "token": "EPjFWaLb3odcccccccccccccccccccccccccccccccc",
      "entryPrice": 0.0015,
      "currentPrice": 0.0018,
      "amount": 100000,
      "pnl": 300,
      "openTime": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### `POST /api/emergency/kill-switch`
Activates emergency stop. Closes all positions and converts to USDC.

**Response:**
```json
{
  "status": "EXECUTED",
  "positionsClosed": 5,
  "totalUsdcConverted": 15000,
  "timestamp": "2024-01-15T14:32:00Z"
}
```

**⚠️ This action is irreversible and immediate.**

### AI Brain Endpoints

#### `POST /api/ai/ask`
Ask Cletus a question about DeFi, trading strategy, or market analysis.

**Body:**
```json
{
  "question": "What's the risk profile of nano-cap tokens in bear markets?",
  "context": "optional_trading_history_context"
}
```

**Response:**
```json
{
  "answer": "Nano-cap tokens exhibit extreme volatility...",
  "confidence": 0.85,
  "sources": ["on-chain_analysis", "historical_data"]
}
```

---

## Monitoring & Logs

Cletus maintains comprehensive logs for:
- All trade executions (entry, exit, PnL)
- Pattern signal calculations
- RPC failures and recovery attempts
- AI Brain reasoning outputs
- Security audit results

Access logs in production via Vercel Logs or connect to PostgreSQL audit tables.

---

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests (requires local Solana validator)
```bash
npm run test:integration
```

### Simulation Mode
Enable `SIMULATION_MODE=true` to run the full trading logic against historical data without executing real transactions.

---

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Write tests for all new features
- Follow TypeScript strict mode
- Document API changes
- Keep security as a priority
- Maintain public/private key separation

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Disclaimer

**This software is provided as-is for educational and research purposes. The authors and contributors are not responsible for any financial losses, damages, or consequences resulting from the use of this software.**

**By using Cletus, you acknowledge that:**
- You understand the risks of autonomous trading systems
- You understand the volatility of micro-cap tokens
- You will only deploy capital you can afford to lose entirely
- You have read and agreed to all terms above

**Cletus is a tool. Tools can break. Use at your own risk.**

---

## Support & Community

- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/cletusthegoldenone/Cletus-Autonomous-Trader/issues)
- **Discussions**: Join the community at [GitHub Discussions](https://github.com/cletusthegoldenone/Cletus-Autonomous-Trader/discussions)

---

**Built with obsession. Deployed with caution. Running with ambition.**

*The golden goose is coming.*
