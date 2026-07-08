# Local Testing Guide for Cletus-Autonomous-Trader

## Quick Start: Test Locally

Follow these steps to test Cletus locally on your machine before deploying to production.

---

## Step 1: Prerequisites

Make sure you have installed:

```bash
# Check Node.js version (must be 18+)
node --version
# Output should be: v18.x.x or higher

# Check npm version
npm --version
# Output should be: 9.x.x or higher

# Check Git
git --version
```

If any are missing:
- **Node.js**: Download from https://nodejs.org (LTS version)
- **npm**: Comes with Node.js

---

## Step 2: Clone the Repository

```bash
# Clone Cletus
git clone https://github.com/cletusthegoldenone/Cletus-Autonomous-Trader.git

# Enter the directory
cd Cletus-Autonomous-Trader

# Verify you're in the right place
ls -la
# You should see: README.md, package.json, .env.example, etc.
```

---

## Step 3: Create Local Secrets File

```bash
# Copy the example template
cp .env.example .env.local

# Open in your editor
# macOS/Linux:
nano .env.local

# Windows:
notepad .env.local
```

### Fill in Your Secrets

Edit `.env.local` with your values:

```env
# Database (if running locally)
DATABASE_URL=postgresql://user:password@localhost:5432/cletus

# Wallet (your public address)
ADMIN_WALLET_ADDRESS=9xQeKq6isj8Xu26Ku2b3FqxZsEaq5XfVhJ5dNon9Mop7

# API Keys (get from their respective services)
HELIUS_API_KEY=your_helius_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Trade fees
TRADE_FEE_SOL=0.05
FEE_WALLET_ADDRESS=9xQeKq6isj8Xu26Ku2b3FqxZsEaq5XfVhJ5dNon9Mop7

# Testing flags (IMPORTANT for local testing)
ENABLE_LIVE_TRADING=false
ENABLE_SIMULATION_MODE=true
ENABLE_DRY_RUN=true
NODE_ENV=development
LOG_LEVEL=debug
```

**⚠️ CRITICAL:**
- `ENABLE_LIVE_TRADING=false` - Do NOT execute real trades
- `ENABLE_SIMULATION_MODE=true` - Use fake data
- `ENABLE_DRY_RUN=true` - Calculate trades without executing
- `NODE_ENV=development` - Development mode

---

## Step 4: Install Dependencies

```bash
# Install all npm packages
npm install

# This downloads:
# - Next.js 14+
# - Solana Web3.js
# - Gemini AI SDK
# - PostgreSQL driver
# - And all other dependencies

# Wait for completion (2-5 minutes first time)
# You should see: "added X packages"
```

---

## Step 5: Start the Development Server

```bash
# Start Next.js dev server
npm run dev

# You should see:
# ✓ Ready in 2.5s
# ✓ Local: http://localhost:3000
```

---

## Step 6: Verify the Application

### Open in Browser

```
http://localhost:3000
```

You should see:
- ✅ Cletus landing page / dashboard
- ✅ Navigation menu
- ✅ Trading interface (in simulation mode)

### Check Logs for Errors

In your terminal, watch for:

```
✓ Connected to Solana RPC
✓ Gemini API initialized
✓ Database connection established
✓ Trading engine ready
```

### Red Flags to Watch For

```
✗ DATABASE_URL not set
✗ HELIUS_API_KEY invalid
✗ GEMINI_API_KEY invalid
✗ RPC connection failed
✗ Port 3000 already in use
```

---

## Step 7: Test Key Features

### Test 1: RPC Connection

```bash
# Terminal: You should see this in the logs
✓ Solana RPC connected to: https://mainnet.helius-rpc.com
✓ Network: mainnet-beta
✓ Latest block: 12345678
```

### Test 2: Wallet Connection

```
Browser: Visit http://localhost:3000/dashboard
- Your wallet address should display: 9xQeKq6isj8Xu26Ku2b3FqxZsEaq5XfVhJ5dNon9Mop7
- Admin access should be granted (single wallet)
```

### Test 3: AI Brain (Gemini)

```
Browser: Click "Ask Cletus" or AI chat feature
- Type: "What is micro-cap trading?"
- Expected: AI response from Gemini
- Check terminal for: ✓ Gemini API call successful
```

### Test 4: Trading Signals

```
Browser: Go to http://localhost:3000/signals
- Expected: Shows market scan results
- Should display: Token, market cap, volume, composite score
- Status: SIMULATION MODE (no real trades)

Terminal logs:
✓ Scanned 500 tokens
✓ Found 5 signals above threshold
✓ Would execute 2 trades (DRY RUN - not real)
```

### Test 5: Trading Parameters

```
Browser: Settings / Configuration page
- Update: MIN_MARKET_CAP, MAX_MARKET_CAP
- Change: DAILY_PNL_TARGET, STOP_LOSS_PERCENTAGE
- Verify: Parameters update in real-time
```

---

## Step 8: Test Database Connection (Optional)

If you have PostgreSQL installed locally:

```bash
# Start PostgreSQL
# macOS (with Homebrew):
brew services start postgresql

# Verify connection
psql -U postgres -d cletus

# Create test table
CREATE TABLE test (id SERIAL PRIMARY KEY, message TEXT);
INSERT INTO test (message) VALUES ('Cletus connection works!');
SELECT * FROM test;

# Exit
\q
```

If you don't have PostgreSQL:
- You can skip this for local testing
- Database features won't work, but API will
- For production, use PostgreSQL on Vercel or RDS

---

## Step 9: Monitor Real-Time Trading (Simulation)

```bash
# In another terminal, check logs
npm run dev

# Watch for trading signals in real-time
```

**Expected Terminal Output:**

```
[TRADING] Scanning 500 tokens...
[SIGNAL] Token: EPjFWaLb3oc... (USDC-like)
  - Market Cap: $145,000
  - Volume 24h: $75,000
  - Score: 0.74 (74%)
  - Status: ABOVE THRESHOLD ✓

[TRADE] Would execute BUY order:
  - Token: EPjFWaLb3oc...
  - Amount: 1.5 SOL
  - Price: $0.0015
  - Position Size: $5,000
  - Stop Loss: 10%
  - Take Profit: 25%
  
[STATUS] DRY RUN - Not executing real trade
[FEE] Would collect: 0.05 SOL

[NEXT SCAN] in 60 seconds...
```

---

## Step 10: Check API Endpoints

### Using curl or Postman:

```bash
# Scan for trading opportunities
curl http://localhost:3000/api/trade/scan

# Expected response:
{
  "tokens": [
    {
      "address": "EPjFWaLb3oc...",
      "marketCap": 145000,
      "volume24h": 75000,
      "compositeScore": 0.74,
      "signals": {
        "volumeSpike": 0.85,
        "momentum": 0.72
      }
    }
  ]
}
```

```bash
# Get current positions (should be empty in simulation)
curl http://localhost:3000/api/trade/positions

# Expected response:
{
  "positions": [],
  "status": "SIMULATION_MODE"
}
```

```bash
# Ask the AI Brain
curl -X POST http://localhost:3000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is a honeypot token?"}'

# Expected response:
{
  "answer": "A honeypot token is a scam where...",
  "confidence": 0.92
}
```

---

## Troubleshooting

### Issue: "Port 3000 already in use"

```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### Issue: "HELIUS_API_KEY not set"

```bash
# Make sure .env.local exists
ls -la .env.local

# Check it has HELIUS_API_KEY
grep HELIUS_API_KEY .env.local

# If missing, add it and restart
npm run dev
```

### Issue: "Cannot find module 'solana/web3.js'"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: "Database connection failed"

```bash
# If you don't have PostgreSQL, that's OK for testing
# Features that need DB will fail gracefully
# For full testing, set up PostgreSQL or use cloud DB

# For now, just skip DB-dependent features
# Everything else (signals, AI, RPC) will work
```

### Issue: "Gemini API error"

```bash
# Verify your API key is correct
grep GEMINI_API_KEY .env.local

# Check rate limits (free tier: 60 requests/minute)
# Wait a minute if rate limited

# If key is invalid, get a new one:
# https://makersuite.google.com
```

---

## Step 11: Run Tests (Optional)

```bash
# Run unit tests
npm run test

# Run integration tests (requires running server)
npm run test:integration

# Watch mode (rerun on file changes)
npm run test -- --watch
```

---

## Step 12: Stop the Server

```bash
# Press Ctrl+C in terminal
# Or:
# macOS/Linux:
pkill -f "next dev"

# Windows:
taskkill /F /IM node.exe
```

---

## Common Testing Scenarios

### Scenario 1: Test All 8 Trading Signals

```bash
# Terminal output should show:
✓ Volume Spike: 0.85
✓ Momentum: 0.72
✓ Breakout: 0.65
✓ Velocity Surge: 0.58
✓ Micro-Cap Heat: 0.70
✓ Nano-Cap Spike: 0.62
✓ Liquidity Build: 0.55
✓ Vol/MCap Ratio: 0.68

Composite Score: 0.67 (ABOVE 0.65 threshold - WOULD TRADE)
```

### Scenario 2: Test Risk Management

```bash
# If a trade would hit stop loss:
✓ Entry: $0.0015
✗ Current: $0.00135 (10% loss)
✗ Stop Loss Triggered
✗ Position would be closed (DRY RUN)
```

### Scenario 3: Test Profit Taking

```bash
# If a trade would hit take profit:
✓ Entry: $0.0015
✓ Current: $0.001875 (25% gain)
✓ Take Profit Triggered
✓ Position would be closed (DRY RUN)
```

---

## Next Steps After Local Testing

### ✅ If Everything Works:
1. Review the logs
2. Verify RPC connection
3. Check Gemini AI responses
4. Confirm trading signals
5. Ready to deploy to Vercel!

### ⚠️ If Something Fails:
1. Check `.env.local` for missing values
2. Verify API keys are correct
3. Check internet connection
4. Review error messages in terminal
5. Ask in GitHub Issues

---

## Production Deployment

Once local testing passes, deploy to Vercel:

```bash
# Push to GitHub
git add .
git commit -m "Cletus ready for production"
git push origin main

# Deploy to Vercel
vercel --prod

# Monitor logs
vercel logs --tail
```

---

## Support

- **GitHub Issues:** Report problems
- **Discord:** Join the community (link at launch)
- **README.md:** Full documentation
- **SECURITY.md:** Security questions
- **DEPLOYMENT_SECRETS_GUIDE.md:** Deployment help

---

**The golden goose is ready to waddle. Test it locally first!** 🦆

