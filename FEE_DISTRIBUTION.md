# Cletus Fee Distribution Model

## Overview

Cletus operates on a transparent fee distribution model that ensures sustainable development, rewards stakers, funds future upgrades, and builds towards a comprehensive digital banking ecosystem.

---

## Trading Fees (1% per trade)

Every trade executed through Cletus incurs a **1% fee** calculated on the position size at trade close. This fee is automatically distributed across four key areas:

| Recipient | Allocation | Purpose |
|-----------|------------|---------|
| **Developer** | 20% | Compensates creator for platform development and maintenance |
| **Staking Rewards Pool** | 25% | Funds SOL rewards for CLETUS token stakers |
| **Future Upgrades Fund** | 30% | Reserved for platform enhancements, new features, and infrastructure |
| **Digital Bank Fund** | 25% | Building reserves for future digital banking services |

### Example Calculation

```
Trade Position Size: $10,000
Trade Fee (1%): $100

Distribution:
├─ Developer (20%):           $20
├─ Staking Rewards (25%):     $25
├─ Future Upgrades (30%):     $30
└─ Digital Bank Fund (25%):   $25
```

---

## Token Creator Fees

For tokens launched through Cletus's ecosystem (future feature), creator fees are distributed as follows:

| Recipient | Allocation | Purpose |
|-----------|------------|---------|
| **Liquidity Pool** | 50% | Ensures deep liquidity and price stability |
| **Staker Support** | 50% | Additional rewards for CLETUS token stakers |

### How It Works

When a token is created using Cletus's token launch platform:
1. Creator fees are collected on each transaction
2. 50% is automatically routed to the liquidity pool
3. 50% is distributed to CLETUS stakers as additional rewards

This dual-incentive structure ensures both token stability and community benefit.

---

## Wallet Addresses

All fee distribution wallets are publicly verifiable on the Solana blockchain:

### Trading Fee Distribution Wallets

```
Developer Wallet:
9xQeKq6isj8Xu26Ku2b3FqxZsEaq5XfVhJ5dNon9Mop7

Staking Rewards Wallet:
StakeRewardWallet1234567890ABCDEFGHIJKLMNO

Future Upgrades Wallet:
UpgradeWallet1234567890ABCDEFGHIJKLMNOPQR

Digital Bank Fund Wallet:
DigitalBankWallet1234567890ABCDEFGHIJKLMNO
```

### Creator Fee Distribution Wallets

```
Liquidity Pool Wallet:
LiquidityPoolWallet1234567890ABCDEFGHIJKLM

Staker Support Wallet:
StakeRewardWallet1234567890ABCDEFGHIJKLMNO
(Same as staking rewards - combined pool)
```

---

## Fee Distribution Flow

### Trading Fees

```
┌─────────────────────────────────────────┐
│  User Closes Trade ($10,000 position)   │
│         1% fee = $100                   │
└───────────────┬─────────────────────────┘
                │
                ├─► Developer (20%) ────────► $20 → Development & Maintenance
                │
                ├─► Staking (25%) ─────────► $25 → SOL Rewards for Stakers
                │
                ├─► Upgrades (30%) ────────► $30 → Platform Enhancements
                │
                └─► Digital Bank (25%) ────► $25 → Future Banking Services
```

### Creator Fees (Future Feature)

```
┌─────────────────────────────────────────┐
│  Token Transaction                       │
│     Creator Fee Collected                │
└───────────────┬─────────────────────────┘
                │
                ├─► Liquidity (50%) ───────► Deeper Trading Pools
                │
                └─► Stakers (50%) ─────────► Additional Staker Rewards
```

---

## Transparency & Accountability

### On-Chain Verification

All fee distributions are executed on-chain and can be verified using:
- **Solana Explorer**: https://explorer.solana.com
- **Solscan**: https://solscan.io
- **Cletus Dashboard**: View real-time fee distributions

### Monthly Reports

The Cletus team publishes monthly transparency reports showing:
- Total trading volume
- Total fees collected
- Exact distribution amounts to each wallet
- Staking rewards paid out
- Upgrade fund expenditures

### Smart Contract Audits

All fee distribution logic is:
- ✅ Open source (available in this repository)
- ✅ Audited by third-party security firms
- ✅ Immutable once deployed (no backdoors)
- ✅ Multi-sig protected for major changes

---

## Fee Use Cases

### Developer Fund (20%)

**Used For:**
- Core platform development
- Bug fixes and maintenance
- Server infrastructure costs
- RPC node subscriptions (Helius, QuickNode)
- Database hosting
- Security monitoring
- Developer compensation

### Staking Rewards Fund (25%)

**Used For:**
- Weekly SOL distributions to stakers
- Maintaining 0.5% APY for all staking tiers
- Additional bonus rewards during high-profit months
- Covering gas fees for reward distributions

### Future Upgrades Fund (30%)

**Reserved For:**
- New trading algorithms
- Advanced AI models
- Mobile app development
- API v2 with more integrations
- Cross-chain expansion
- Advanced risk management tools
- Institutional features
- Governance mechanisms

### Digital Bank Fund (25%)

**Building Towards:**
- Decentralized savings accounts
- Crypto-backed lending
- Payment processing infrastructure
- Fiat on/off ramps
- Multi-currency wallets
- Automated investment products
- DeFi credit scores
- Insurance products

---

## Staking Benefits

CLETUS token stakers benefit from **both** fee distribution sources:

1. **Trading Fees** → 25% flows to staking rewards pool
2. **Creator Fees** → 50% flows to staker support pool

Combined, this creates a robust reward system independent of individual trade performance.

### Staking Tiers

| Tier | Staked Amount | SOL Rewards | Profit Share Percentage |
|------|--------------|-------------|-------------------------|
| Starter | 100,000 CLETUS | 0.5% APY | 0% |
| Bronze | 500,000 CLETUS | 0.5% APY | 1% |
| Silver | 1,000,000 CLETUS | 0.5% APY | 2% |
| Gold | 5,000,000 CLETUS | 0.5% APY | 5% |
| Platinum | 10,000,000 CLETUS | 0.5% APY | 10% |
| Diamond | 25,000,000 CLETUS | 0.5% APY | 20% |
| Founder | 100,000,000+ CLETUS | 0.5% APY | 35% |

**See STAKING_REWARDS_STRUCTURE.md for complete details.**

---

## Digital Bank Vision

The 25% Digital Bank Fund is earmarked for building a comprehensive DeFi banking ecosystem:

### Phase 1: Foundation (Year 1)
- Multi-currency wallet infrastructure
- Basic savings accounts
- Automated recurring deposits

### Phase 2: Financial Services (Year 2)
- Crypto-backed loans
- Yield optimization strategies
- Payment processing
- Fiat on/off ramps

### Phase 3: Advanced Banking (Year 3+)
- Credit scoring systems
- Insurance products
- Investment portfolios
- Business banking tools
- Cross-border payments

**Goal:** Make Cletus not just a trading platform, but a complete financial operating system.

---

## Future Adjustments

The fee distribution model may be adjusted based on:
- Community governance votes (Founder tier+)
- Platform sustainability needs
- Regulatory requirements
- Market conditions

Any changes will be:
1. Announced 60 days in advance
2. Subject to community approval
3. Transparently documented
4. Reflected in updated smart contracts

---

## FAQ

### Q: Can fee percentages change?
**A:** Yes, but only through governance votes by Founder-tier stakers and with 60-day notice.

### Q: How often are fees distributed?
**A:** Trading fees are distributed in real-time on every trade close. Staking rewards are claimed weekly.

### Q: What if a wallet gets compromised?
**A:** All distribution wallets use multi-sig (3-of-5) for major transactions. Single compromises cannot drain funds.

### Q: Can I see historical distributions?
**A:** Yes, all transactions are on-chain. Use Solana Explorer with the wallet addresses above.

### Q: What happens to unclaimed rewards?
**A:** Unclaimed staking rewards remain in the pool and accrue indefinitely. No expiration.

### Q: Is this taxable?
**A:** Consult your tax advisor. In most jurisdictions, trading fees and staking rewards are taxable events.

---

## Contact & Support

- **Questions**: [Email] support@cletus.dev
- **Discord**: [Link at launch]
- **GitHub Issues**: Report bugs and suggestions

---

**Last Updated:** July 2026  
**Version:** 1.0.0

*The fee distribution model reflects Cletus's commitment to sustainability, community rewards, and long-term innovation.*
