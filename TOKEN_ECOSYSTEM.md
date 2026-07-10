# Cletus Token Ecosystem & Reward System

## Overview

Cletus operates on a hybrid freemium + token-based reward system. This document outlines how users can access Cletus, earn rewards, and participate in the growing ecosystem.

---

## Access Models

### 1. **30-Day Free Trial (No Credit Card Required)**

**Perfect for:** New users wanting to test Cletus risk-free

**What's Included:**
- Full access to all trading features
- Unlimited trade executions
- Access to AI Brain (Gemini integration)
- Performance tracking & analytics
- Kill switch & security features
- Support via Discord/GitHub

**Restrictions:**
- Max position size: $5,000
- Max 3 concurrent open positions
- Max daily PnL target: $1,000
- No access to API integrations

**How to Start:**
1. Clone repository: `git clone https://github.com/cletusthegoldenone/Cletus-Autonomous-Trader.git`
2. Follow setup in README.md
3. Set `ENABLE_24_7_TRADING=false` and start with CONSERVATIVE aggression
4. No payment required for 30 days

---

### 2. **Cletus Token Staking (Ongoing Rewards)**

**Perfect for:** Long-term believers who want free usage + SOL rewards

#### Token Details
- **Token Name:** Cletus (CLETUS)
- **Total Supply:** 1,000,000,000 (1B)
- **Token Address:** [To be announced at launch]
- **Blockchain:** Solana

#### Staking Rewards Structure

**Stake Your CLETUS Tokens → Earn SOL Weekly**

| Staked Amount | Free Usage Tier | Weekly SOL Reward | Reward Rate |
|---------------|-----------------|-------------------|------------|
| 1,000 CLETUS | Starter | 0.005 SOL | 0.5% APY |
| 5,000 CLETUS | Pro | 0.030 SOL | 0.5% APY |
| 10,000 CLETUS | Elite | 0.070 SOL | 0.5% APY |
| 50,000 CLETUS | Whale | 0.350 SOL | 0.5% APY |
| 100,000+ CLETUS | Founder | 0.700+ SOL | 0.5% APY |

#### Free Usage by Tier

| Tier | Max Position | Open Positions | Daily Target | API Access |
|------|-------------|----------------|--------------|-----------|
| Starter | $5K | 3 | $1K | No |
| Pro | $15K | 10 | $5K | Read-only |
| Elite | $50K | 20 | $20K | Full |
| Whale | $100K | 50 | Unlimited | Full + Priority |
| Founder | Unlimited | Unlimited | Unlimited | Full + Priority + Custom |

#### How Staking Works

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: Buy CLETUS Tokens                              │
│ Purchase on DEX or Jupiter (link at launch)             │
│ Min 1,000 CLETUS (~$100-500 depending on price)        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 2: Stake via Cletus Dashboard                     │
│ Navigate to dashboard.cletus.com                        │
│ Connect wallet, deposit CLETUS to staking contract      │
│ Staking begins immediately                              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 3: Earn Weekly SOL Rewards                        │
│ Rewards calculated every block (~400ms on Solana)       │
│ Claim weekly or auto-compound                           │
│ SOL sent directly to your wallet                        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 4: Unlock Free Usage                              │
│ Your tier automatically upgrades based on stake         │
│ Full feature access, no monthly fees                    │
│ Upgrade/downgrade anytime                              │
└─────────────────────────────────────────────────────────┘
```

#### Staking Contract Details

```typescript
// Cletus Staking Smart Contract (SPL Staking)
// Located: [Contract Address - at launch]

interface StakingInfo {
  stakerAddress: PublicKey;
  tokensMinted: number;      // CLETUS tokens staked
  stakingStartDate: number;  // Unix timestamp
  lastRewardClaim: number;   // Last withdrawal timestamp
  accumulatedRewards: number; // Pending SOL rewards
  tier: 'STARTER' | 'PRO' | 'ELITE' | 'WHALE' | 'FOUNDER';
  unlocked: boolean;         // Free usage enabled
}

// Weekly reward calculation
weeklyReward = (stakedTokens / 1_000_000_000) * 50_000 * (0.5 / 52);
// Example: 10,000 CLETUS = ~0.070 SOL per week
```

#### Gas-Free Staking

- **No deposit fees** - Stake directly without costs
- **No withdrawal fees** - Unstake anytime with no penalty
- **Auto-compound option** - Reinvest rewards automatically

---

### 3. **Premium Subscription (Optional, for Maximum Users)**

**Perfect for:** Traders who don't want to buy tokens but want unlimited usage

| Plan | Price/Month | Features |
|------|-----------|----------|
| Starter | $9 | $5K positions, 3 concurrent, $1K daily target |
| Pro | $29 | $15K positions, 10 concurrent, $5K daily target, API |
| Elite | $99 | $50K positions, 20 concurrent, $20K daily target, Full API |
| Whale | $299 | $100K positions, 50 concurrent, Unlimited target |

**Note:** Staking CLETUS is significantly cheaper and includes SOL rewards.

---

## Developer Donation Add-On

### Supporting Cletus Development

Cletus is built by a small team of passionate developers working on an ambitious vision. If you believe in the project and want to accelerate development, you can contribute.

#### Donation Tiers

| Tier | Donation | Benefits |
|------|----------|----------|
| **Supporter** | $50 | Named in changelog, Discord badge, lifetime 10% discount |
| **Patron** | $250 | All above + custom trading preset, direct Slack channel |
| **Benefactor** | $1,000 | All above + advisory board seat, feature voting, whitelisted for token launch |
| **Visionary** | $5,000+ | All above + revenue share (0.1% of staking APY), custom API endpoint |

#### How to Donate

**Option 1: Direct Solana Transfer**
```
Send SOL to: [Donation Wallet - at launch]
Include memo: Your Discord username for recognition
```

**Option 2: GitHub Sponsorship**
```
Sponsor via: github.com/sponsors/cletusthegoldenone
Recurring or one-time contributions
```

**Option 3: Cryptocurrency (Other Assets)**
```
Contact: [Developer contact at launch]
We accept: ETH, USDC, USDT, other major assets
```

#### What Your Donation Funds

1. **Infrastructure & Hosting** (30%)
   - Vercel deployment & scaling
   - RPC nodes (Helius, QuickNode)
   - PostgreSQL database hosting
   - Monitoring & alerting

2. **Development & Features** (40%)
   - New signal algorithms
   - Risk management improvements
   - AI model upgrades
   - Mobile app development
   - API v2 with more integrations

3. **Security & Compliance** (20%)
   - Smart contract audits
   - Security research
   - Regulatory consulting
   - Penetration testing

4. **Community & Growth** (10%)
   - Community events
   - Documentation
   - Marketing & partnerships
   - Discord moderation

#### Tax Deductibility

Cletus operates as a decentralized project. Donations are **not tax-deductible** in most jurisdictions. Consult your accountant.

---

## Token Launch Timeline

### Phase 1: Beta Launch (Q2 2026)
- 30-day free trial available
- Staking contract deployed
- Initial token distribution: 10% of supply
- Community airdrop: Eligible for early testers

### Phase 2: Public Launch (Q3 2026)
- DEX listing (likely Jupiter)
- Full staking rewards enabled
- Premium subscription available
- Developer donation program live

### Phase 3: Ecosystem Expansion (Q4 2026)
- Governance token voting
- Revenue-sharing opportunities
- Advanced trading tools for token holders
- Cross-protocol integrations

---

## FAQ

### Q: Do I need to buy CLETUS tokens to use Cletus?
**A:** No! The 30-day free trial and premium subscription are available without tokens. However, staking CLETUS is the most cost-effective way to get ongoing free usage while earning SOL rewards.

### Q: What if I lose my staked tokens?
**A:** Tokens in the staking contract are in a smart contract you control. If the contract is hacked, it's a systemic risk (not specific to Cletus). We strongly recommend:
- Using hardware wallet for approvals
- Staking only amounts you're comfortable with
- Monitoring contract security audits (published on GitHub)

### Q: Can I unstake anytime?
**A:** Yes! Unstaking is instant with no lockup period. No penalties, no delays.

### Q: How often are staking rewards distributed?
**A:** Rewards accrue every Solana block (~400ms) but are typically claimed weekly. You can claim anytime.

### Q: What if Cletus stops being profitable?
**A:** The staking rewards are guaranteed by the protocol, separate from trading performance. Even if trading stops, staking continues generating SOL.

### Q: Is there a maximum number of CLETUS tokens I can stake?
**A:** No maximum! Larger stakes unlock higher tiers with more benefits.

### Q: Can I trade the CLETUS token?
**A:** Yes, CLETUS is a freely tradeable SPL token. Stake anytime, unstake anytime.

### Q: What's the roadmap for token utility?
**A:** 
- **Now:** Staking for free access + SOL rewards
- **Q3:** Governance voting on feature priorities
- **Q4:** Revenue-sharing mechanism for large holders

---

## Risk Disclosure

**Staking Risks:**
- Smart contract bugs (audits mitigate this)
- Token price volatility (doesn't affect staking APY)
- Regulatory changes to token classification
- Network congestion affecting reward claims

**Trading Risks:**
- AI systems can make mistakes
- Market volatility can cause losses
- Network failures can prevent execution
- Slippage and fees reduce returns

**See SECURITY.md and README.md for full disclosures.**

---

## Support & Questions

- **Discord:** [Link at launch]
- **GitHub Discussions:** github.com/cletusthegoldenone/Cletus-Autonomous-Trader/discussions
- **Email:** support@cletus.dev

---

## Timeline for Token Launch

- **6 Weeks Before Launch:** Token economics announcement
- **4 Weeks Before:** Smart contract audit begins
- **2 Weeks Before:** Testnet staking available
- **Launch Day:** Tokens on DEX, staking goes live

---

**Cletus is built by the community, for the community. We're grateful for every believer in autonomous trading.**

*The golden goose is coming. Join us.*
