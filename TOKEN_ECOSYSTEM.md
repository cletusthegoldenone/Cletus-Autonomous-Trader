# Cletus Token Ecosystem & Reward System

## Overview

Cletus operates on a hybrid freemium + token-based reward system. This document outlines how users can access Cletus, earn rewards, and participate in the growing ecosystem.

---

## Access Model

### Cletus Token Staking (Ongoing Rewards)

**Perfect for:** Anyone who wants platform access + SOL rewards

#### Token Details
- **Token Name:** Cletus (CLETUS)
- **Total Supply:** 1,000,000,000 (1B)
- **Token Address:** [To be announced at launch]
- **Blockchain:** Solana

#### Staking Rewards Structure

**Stake Your CLETUS Tokens → Earn SOL Monthly**

| Staked Amount | Free Usage Tier | Monthly SOL Reward | Reward Rate |
|---------------|-----------------|--------------------|------------|
| 100,000 CLETUS | Starter | 0.5 SOL | 0.5% APY |
| 500,000 CLETUS | Bronze | 2.5 SOL | 0.5% APY |
| 1,000,000 CLETUS | Silver | 5.0 SOL | 0.5% APY |
| 5,000,000 CLETUS | Gold | 25.0 SOL | 0.5% APY |
| 10,000,000 CLETUS | Platinum | 50.0 SOL | 0.5% APY |
| 25,000,000 CLETUS | Diamond | 125.0 SOL | 0.5% APY |
| 100,000,000+ CLETUS | Founder | 500.0+ SOL | 0.5% APY |

#### Free Usage by Tier

| Tier | Max Position | Open Positions | Daily Target | API Access |
|------|-------------|----------------|--------------|-----------|
| Starter | $5K | 3 | $1K | No |
| Bronze | $15K | 5 | $2.5K | No |
| Silver | $50K | 10 | $5K | Read-only |
| Gold | $100K | 15 | $10K | Read-only |
| Platinum | $250K | 25 | $25K | Full |
| Diamond | $500K | 50 | $50K | Full + Priority |
| Founder | Unlimited | Unlimited | Unlimited | Full + Priority + Custom |

#### How Staking Works

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: Buy CLETUS Tokens                              │
│ Purchase on DEX or Jupiter (link at launch)             │
│ Min 100,000 CLETUS (~$10,000 depending on price)        │
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
│ Step 3: Earn Monthly SOL Rewards                       │
│ Rewards calculated every block (~400ms on Solana)       │
│ Claim monthly or auto-compound                          │
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
  tier: 'STARTER' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'FOUNDER';
  unlocked: boolean;         // Free usage enabled
}

// Monthly reward calculation
// Constants:
// - stakedTokens: The amount of CLETUS tokens staked by the user.
// - 1_000_000_000: Total token supply of CLETUS (used as the denominator for pool share).
// - 120_000: Base annual reward pool scaling factor (in SOL).
// - 0.5: The APY reward coefficient (0.5%), yielding an annual pool of 60,000 SOL (120,000 * 0.5) at 100% staking capacity.
// - 12: Months in a year (converts the 60,000 SOL annual pool allocation to a 5,000 SOL monthly reward payout at 100% staking capacity).
// (Note: This formula assumes that rewards are distributed proportionally based on the share of total supply (1B CLETUS) that is currently staked, resulting in a maximum distribution of 5,000 SOL per month if 100% of supply is staked, corresponding to a maximum annual distribution of 60,000 SOL.)
monthlyReward = (stakedTokens / 1_000_000_000) * 120_000 * (0.5 / 12);
// Example: 1,000,000 CLETUS = ~5.0 SOL per month
```

#### Gas-Free Staking

- **No deposit fees** - Stake directly without costs
- **Standard Unstaking** - Unstake after a 7-day cooldown. A 2% penalty applies to early unstaking within 30 days.
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
**A:** Yes, staking CLETUS is the primary way to get active live trading access while earning SOL rewards.

### Q: What if I lose my staked tokens?
**A:** Tokens in the staking contract are in a smart contract you control. If the contract is hacked, it's a systemic risk (not specific to Cletus). We strongly recommend:
- Using hardware wallet for approvals
- Staking only amounts you're comfortable with
- Monitoring contract security audits (published on GitHub)

### Q: Can I unstake anytime?
**A:** Yes, but unstaking requires a 7-day cooldown period before funds are available. In addition, an early unstaking penalty of 2% is applied if you unstake within 30 days of your initial stake.

### Q: How often are staking rewards distributed?
**A:** Rewards accrue every Solana block (~400ms) but are typically claimed monthly. You can claim anytime.

### Q: What if Cletus stops being profitable?
**A:** The staking rewards are supported by the dedicated Staking Rewards Fund (funded by 25% of all platform trading fees and 50% of token creator fees), separate from trading performance. This ensures sufficient on-chain reserves exist to maintain the 0.5% APY payout even if trading stops or performance varies.

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
