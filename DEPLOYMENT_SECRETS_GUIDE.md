# Cletus Deployment Secrets Configuration Guide

## Overview

This guide walks you through creating the **secrets file** needed to deploy Cletus-Autonomous-Trader to production (Vercel). Secrets are sensitive credentials that should NEVER be committed to Git.

---

## What Are Secrets?

**Secrets** are sensitive values that your application needs but should never be exposed:
- Private keys (Solana wallet)
- API keys (Helius, Gemini, etc.)
- Database credentials
- Webhook URLs
- Authentication tokens

**Public values** (safe to commit):
- Trading parameters (market cap, volume, etc.)
- Feature flags
- Logging levels
- Configuration settings

---

## Step 1: Create Local Secrets File

### Create `.env.local` (Local Development Only)

This file is used for local development and testing. **It is already in `.gitignore` and will NEVER be committed.**

```bash
# In your project root directory, create this file:
cp .env.example .env.local
```

### Edit `.env.local` with Your Values

```env
# ============================================================================
# SOLANA CONFIGURATION
# ============================================================================
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY_HERE
SOLANA_RPC_FALLBACK=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta

# ============================================================================
# WALLET & TRADING (CRITICAL - KEEP SECRET)
# ============================================================================
# Your PUBLIC address (safe to expose)
TRADING_WALLET_ADDRESS=9xQeKq6isj8Xu26Ku2b3FqxZsEaq5XfVhJ5dNon9Mop7

# Your PRIVATE key (NEVER expose, server-side only)
# Format: Base58 encoded Solana private key
TRADING_WALLET_PRIVATE_KEY=4Zp3eCSbW8VsemnGQbgvWQK3E3T5ai2BVmxLkPhtzrj2KTzq8mjKDfXjjXVkq5zJ8qJXRK7kQ7jZNYs7Y6xK3nXj

# ============================================================================
# API KEYS & CREDENTIALS
# ============================================================================
# Helius API Key (get from https://dev.helius.xyz)
HELIUS_API_KEY=helius_rpc_key_xxxxxxxxxxxxx

# Google Gemini API Key (get from https://makersuite.google.com)
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Jupiter API Key (optional, for better routing)
JUPITER_API_KEY=your_jupiter_api_key_optional

# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================
# PostgreSQL connection string
DATABASE_URL=postgresql://username:password@db.example.com:5432/cletus_trader
DATABASE_POOL_SIZE=20
DATABASE_SSL=true
DATABASE_LOG_QUERIES=false

# ============================================================================
# TRADING PARAMETERS
# ============================================================================
MIN_MARKET_CAP=10000
MAX_MARKET_CAP=500000
MIN_VOLUME_USD=5000
SLIPPAGE_TOLERANCE=0.05
MAX_POSITION_SIZE_USD=5000
MAX_OPEN_POSITIONS=5
PRIORITY_FEE_LAMPORTS=100000

# ============================================================================
# FEATURE FLAGS
# ============================================================================
ENABLE_LIVE_TRADING=false
ENABLE_24_7_TRADING=false
SIMULATION_MODE=true
LOG_LEVEL=debug

# ============================================================================
# SERVER CONFIGURATION
# ============================================================================
PORT=3000
NODE_ENV=development
VERCEL_ENV=preview
```

---

## Step 2: Test Locally

Before deploying, test your secrets locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:3000 to verify connection
```

**Verify in your logs:**
```
✓ Connected to Solana RPC
✓ Wallet initialized: 9xQeKq6...
✓ Database connected
✓ Gemini API ready
```

---

## Step 3: Create Vercel Secrets

Do NOT copy `.env.local` to Vercel. Instead, add secrets one by one through the dashboard.

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Cletus-Autonomous-Trader project
3. Click **Settings** → **Environment Variables**
4. Add each secret individually:

```
Key: SOLANA_RPC_URL
Value: https://mainnet.helius-rpc.com/?api-key=YOUR_KEY_HERE
Environments: Production, Preview, Development
```

```
Key: TRADING_WALLET_ADDRESS
Value: 9xQeKq6isj8Xu26Ku2b3FqxZsEaq5XfVhJ5dNon9Mop7
Environments: Production, Preview, Development
```

```
Key: TRADING_WALLET_PRIVATE_KEY
Value: 4Zp3eCSbW8VsemnGQbgvWQK3E3T5ai2BVmxLkPhtzrj2KTzq8mjKDfXjjXVkq5zJ8qJXRK7kQ7jZNYs7Y6xK3nXj
Environments: Production only (CRITICAL)
```

```
Key: HELIUS_API_KEY
Value: helius_rpc_key_xxxxxxxxxxxxx
Environments: Production only
```

```
Key: GEMINI_API_KEY
Value: AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Environments: Production only
```

```
Key: DATABASE_URL
Value: postgresql://username:password@db.example.com:5432/cletus_trader
Environments: Production only
```

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add secrets
vercel env add TRADING_WALLET_PRIVATE_KEY
# Paste your private key when prompted

vercel env add HELIUS_API_KEY
# Paste your Helius API key when prompted

# ... repeat for other secrets
```

---

## Step 4: Create Secrets Script (Optional)

You can also create a script to manage secrets programmatically:

```bash
#!/bin/bash
# scripts/setup-secrets.sh

# This script helps you set up Vercel secrets
# Usage: bash scripts/setup-secrets.sh

echo "Setting up Cletus Secrets..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "Error: .env.local not found. Run: cp .env.example .env.local"
  exit 1
fi

# Array of sensitive keys to add to Vercel
SECRETS=(
  "TRADING_WALLET_PRIVATE_KEY"
  "HELIUS_API_KEY"
  "GEMINI_API_KEY"
  "DATABASE_URL"
  "JUPITER_API_KEY"
)

# Read each secret from .env.local and prompt for Vercel addition
for SECRET in "${SECRETS[@]}"; do
  VALUE=$(grep "^$SECRET=" .env.local | cut -d '=' -f 2-)
  
  if [ -z "$VALUE" ]; then
    echo "⚠️  $SECRET not found in .env.local"
  else
    echo "✓ Found $SECRET in .env.local"
    echo "  Run: vercel env add $SECRET"
  fi
done

echo ""
echo "Next steps:"
echo "1. vercel login"
echo "2. For each secret above, run: vercel env add SECRET_NAME"
echo "3. Paste the value from .env.local when prompted"
```

---

## Step 5: Environment Variable Reference

### Required Secrets (MUST BE SET)

| Variable | Type | Example | Notes |
|----------|------|---------|-------|
| `TRADING_WALLET_PRIVATE_KEY` | Private | `4Zp3eCS...` | Solana private key, PROD only |
| `HELIUS_API_KEY` | Private | `helius_...` | From helius.dev |
| `GEMINI_API_KEY` | Private | `AIzaSy...` | From makersuite.google.com |
| `DATABASE_URL` | Private | `postgresql://...` | PostgreSQL connection |
| `SOLANA_RPC_URL` | Public | `https://...` | Can be same as dev |

### Optional Secrets

| Variable | Type | Example | Notes |
|----------|------|---------|-------|
| `JUPITER_API_KEY` | Private | `jupiter_...` | For better DEX routing |
| `ALERT_WEBHOOK_URL` | Private | `https://...` | Discord/Slack alerts |

### Public Variables (Safe to Commit)

These can be in `vercel.json` or GitHub:

```json
{
  "env": {
    "SOLANA_NETWORK": "mainnet-beta",
    "MIN_MARKET_CAP": "10000",
    "MAX_MARKET_CAP": "500000",
    "LOG_LEVEL": "info",
    "NODE_ENV": "production"
  }
}
```

---

## Step 6: Verify Secrets Are Set

After deploying to Vercel, verify secrets are working:

```bash
# Check which secrets are set in Vercel
vercel env list

# Output:
# TRADING_WALLET_PRIVATE_KEY    [value hidden]    Production
# HELIUS_API_KEY                [value hidden]    Production
# GEMINI_API_KEY                [value hidden]    Production
# DATABASE_URL                  [value hidden]    Production
```

---

## Step 7: Rotate Secrets Regularly

### When to Rotate

- [ ] Every 6 months (good practice)
- [ ] After any potential exposure
- [ ] When team member leaves
- [ ] After security incident
- [ ] Before major launch

### How to Rotate

**Example: Rotating Helius API Key**

1. Log into Helius dashboard
2. Generate a new API key
3. Copy new key
4. Go to Vercel → Settings → Environment Variables
5. Click "Edit" on `HELIUS_API_KEY`
6. Paste new key
7. Redeploy Vercel (automatic)
8. Delete old key from Helius

---

## Step 8: Security Checklist

Before going live, verify:

- [ ] `.env.local` is in `.gitignore` (NEVER commit)
- [ ] Private key is ONLY in Vercel Secrets (not in code)
- [ ] Database URL is ONLY in Vercel Secrets
- [ ] All API keys are in Vercel Secrets
- [ ] Public address (wallet) is safe to commit (if needed)
- [ ] Secrets are set to "Production" environment only
- [ ] No secrets are logged to console
- [ ] No secrets appear in error messages
- [ ] Database has SSL enabled (`DATABASE_SSL=true`)
- [ ] Private key has appropriate Solana permissions

---

## Troubleshooting

### "Error: TRADING_WALLET_PRIVATE_KEY not found"

**Solution:** Add the secret to Vercel environment variables

```bash
vercel env add TRADING_WALLET_PRIVATE_KEY
# Paste your private key
```

### "Database connection failed"

**Solution:** Verify DATABASE_URL format and credentials

```
Correct: postgresql://user:password@host:5432/dbname
Wrong:   postgresql://user:password@host:dbname
```

### "Invalid private key format"

**Solution:** Ensure key is Base58 encoded Solana format

```bash
# Test key locally
npm run dev

# Check logs for key validation error
```

### "API key rejected by Helius"

**Solution:** Verify API key is correct and has proper permissions

1. Go to https://dev.helius.xyz
2. Check API key status
3. Regenerate if needed
4. Update in Vercel

---

## Example Deployment Flow

```bash
# Step 1: Clone repo
git clone https://github.com/cletusthegoldenone/Cletus-Autonomous-Trader.git
cd Cletus-Autonomous-Trader

# Step 2: Create local secrets
cp .env.example .env.local
# Edit .env.local with your values

# Step 3: Test locally
npm install
npm run dev
# Verify connection works

# Step 4: Push to GitHub
git add -A
git commit -m "Configure Cletus for deployment"
git push origin main

# Step 5: Add secrets to Vercel
vercel login
vercel env add TRADING_WALLET_PRIVATE_KEY
vercel env add HELIUS_API_KEY
vercel env add GEMINI_API_KEY
vercel env add DATABASE_URL

# Step 6: Deploy
vercel --prod

# Step 7: Verify
# Visit your Vercel deployment URL
# Check logs for errors
# Test trading endpoints

# Step 8: Monitor
# Watch Vercel logs in dashboard
# Monitor PnL on staking dashboard
```

---

## Security Best Practices

### ✅ DO

- ✅ Use hardware wallet for production private keys
- ✅ Rotate API keys every 6 months
- ✅ Use different API keys per environment
- ✅ Store backups of private key (encrypted)
- ✅ Enable 2FA on all API accounts
- ✅ Use strong database passwords
- ✅ Limit API key permissions to minimum needed
- ✅ Monitor for unusual API activity
- ✅ Audit log all secret access
- ✅ Test recovery procedures

### ❌ DON'T

- ❌ Commit `.env.local` to Git
- ❌ Hardcode secrets in source code
- ❌ Share secrets via Slack/email
- ❌ Log secrets to console
- ❌ Use same API keys for dev/prod
- ❌ Commit `.env.production.local`
- ❌ Pass secrets in URL query parameters
- ❌ Store secrets in client-side code
- ❌ Leave old keys in Vercel when rotating
- ❌ Share deployment credentials with unnecessary people

---

## Support

If you encounter issues:

1. **Check logs:** `vercel logs`
2. **Test locally first:** `npm run dev`
3. **Verify secrets:** `vercel env list`
4. **Review SECURITY.md:** Detailed security architecture
5. **GitHub Issues:** [Report problems](https://github.com/cletusthegoldenone/Cletus-Autonomous-Trader/issues)

---

**Remember: Your private key is the crown jewel. Protect it like your life depends on it.**

*The golden goose doesn't share its keys.*
