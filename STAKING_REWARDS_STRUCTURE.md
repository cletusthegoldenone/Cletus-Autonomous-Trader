# Cletus Staking Rewards Structure & Profit Sharing

## ⚠️ CRITICAL DISCLAIMER

**READ THIS BEFORE STAKING ANY CAPITAL**

Cletus is an autonomous AI trading system. **It is NOT a savings account, guarantee, or investment fund.** Everything in this document is subject to the fundamental limitations of artificial intelligence and cryptocurrency trading.

---

## AI Limitations & Honest Disclaimer

### Cletus is an AI. AI systems make mistakes.

This is not a theoretical concern — it is a certainty over any sufficiently long operating window.

### Cletus can and will:
- **Misread market signals** in unusual conditions
- **Enter positions that result in partial or total loss** — the "guaranteed" profit is NOT a guarantee
- **Fail to execute transactions** due to network congestion, RPC failures, or Solana validator issues
- **Generate pattern scores that overfit** to past data and underperform on new market regimes
- **Experience bugs, edge cases, and unexpected behavior** as the system evolves
- **Make catastrophic trading errors** during extreme market volatility
- **Get exploited** by sophisticated market makers or whale manipulation

### No AI trading system can guarantee profits.

**Any system that claims otherwise is lying to you.**

Crypto markets are adversarial, zero-sum, and frequently irrational. Even the best signals fail. Even the best risk management cannot prevent drawdowns.

---

## What This Means for Stakers

### ❌ What You Should NOT Expect

- ❌ **Guaranteed monthly profits** - Trading can lose money
- ❌ **Stable income stream** - Profits fluctuate wildly month-to-month
- ❌ **Protection from loss** - Your staked tokens could be lost if Cletus fails catastrophically
- ❌ **Consistent returns** - Some months may be +$20K, others -$10K
- ❌ **Insurance against smart contract bugs** - If the contract is hacked, funds may be lost
- ❌ **Insurance against AI failure** - If Cletus makes massive trading errors, your stake suffers
- ❌ **Principal preservation** - In worst case, you could lose your entire staked amount

### ✅ What You CAN Expect

- ✅ **Transparent monthly reports** - Real numbers, no fake claims
- ✅ **Best-effort risk management** - Cletus will try to minimize losses
- ✅ **Audited smart contracts** - Professional security review (but not perfect)
- ✅ **Emergency kill switch** - Close all positions instantly if something breaks
- ✅ **Staking rewards in SOL** - 0.5% APY regardless of trading performance (separate from profit share)
- ✅ **Liquidity to unstake** - Exit anytime if you lose confidence
- ✅ **Honest communication** - We won't hide losses or failures

---

## Staking Tiers & Profit Sharing (Not Guaranteed)

### Tier Structure

| Staked Amount | Tier Name | Expected Monthly Profit* | Staking APY | Features |
|---------------|-----------|-------------------------|------------|----------|
| 100,000 CLETUS | Starter | None | 0.5% APY (paid in SOL) | Core access (0% profit share) |
| 500,000 CLETUS | Bronze | ~$1,000* (NOT guaranteed) | 0.5% APY (paid in SOL) | 1% profit share + Limited features |
| 1,000,000 CLETUS | Silver | ~$2,000* (NOT guaranteed) | 0.5% APY (paid in SOL) | 2% profit share + Full access |
| 5,000,000 CLETUS | Gold | ~$5,000* (NOT guaranteed) | 0.5% APY (paid in SOL) | 5% profit share + Priority support |
| 10,000,000 CLETUS | Platinum | ~$10,000* (NOT guaranteed) | 0.5% APY (paid in SOL) | 10% profit share + Premium insights |
| 25,000,000 CLETUS | Diamond | ~$20,000* (NOT guaranteed) | 0.5% APY (paid in SOL) | 20% profit share + High-net-worth perks |
| 100,000,000+ CLETUS | Founder | ~$35,000* (NOT guaranteed) | 0.5% APY (paid in SOL) | 35% profit share + Board level voting |

**\*These are ESTIMATES based on historical performance. They are NOT guaranteed. Actual profits could be significantly higher or lower (including negative/loss months).**

---

## How Profit Sharing Works (And How It Can Fail)

### The Model

```
Cletus generates trading profit each month
                    ↓
Treasury pools all profit from trading operations
                    ↓
Distribute to stakers based on tier (if profitable)
                    ↓
If Cletus loses money that month → no distribution, no profit
```

### Real Examples (What Actually Could Happen)

#### Scenario 1: Good Month
```
Cletus monthly trading profit: $200,000 (Total Gross Profit)

Total distribution of the total gross monthly platform profit of $200,000 (73% of gross profit is allocated directly to stakers across all profit-sharing tiers (Bronze–Founder), with Starter excluded, and the remaining 27% of gross profit is retained by the platform treasury):
- Bronze Tier (1% of gross profit): $2,000 collectively split among Bronze stakers
- Silver Tier (2% of gross profit): $4,000 collectively split among Silver stakers
- Gold Tier (5% of gross profit): $10,000 collectively split among Gold stakers
- Platinum Tier (10% of gross profit): $20,000 collectively split among Platinum stakers
- Diamond Tier (20% of gross profit): $40,000 collectively split among Diamond stakers
- Founder Tier (35% of gross profit): $70,000 collectively split among Founder stakers
- Retained Platform Treasury (27% of gross profit): $54,000

(Note: Individual payouts within each tier depend on the total number of participants in that tier. If there is only one staker in a tier, they receive the full tier-wide allocation. If there are multiple stakers, the allocation is divided proportionally based on their relative stake.)
```

#### Scenario 2: Terrible Month (AI Failure)
```
Cletus gets exploited by a pump-and-dump scheme
Losses: -$50,000
5M staker (Gold) receives: $0 (plus their 0.5% SOL reward)
10M staker (Platinum) receives: $0 (plus their 0.5% SOL reward)
25M staker (Diamond) receives: $0 (plus their 0.5% SOL reward)

Your staked tokens are still there, but no profit share that month.
```

#### Scenario 3: RPC Failure & Liquidation
```
Helius RPC goes down during major market move
Cletus can't execute trades to cut losses
Accumulates $100K in losses before network recovers
Profit pool is negative for the month
Everyone gets: $0
```

#### Scenario 4: Smart Contract Bug
```
Attacker finds vulnerability in staking contract
Exploits it and drains $500K from treasury
Cletus insurance reserve covers $50K
Remaining $450K is lost
All stakers suffer proportional loss
```

---

## Tier Details & Expected Returns (Not Guaranteed)

*The Expected Monthly Profit Share calculations below are illustrative estimates based on an assumed total gross monthly platform profit pool of $100,000 for Realistic/Expected Cases, and $200,000 for Best Case Scenarios, distributed proportionally according to each tier's profit-sharing percentage.*

**Note on Pool Distribution, On-Chain Implementation, and Platform Retained Math:**

### Monthly Gross Platform Profit Distribution (100% Total)

| Recipient / Allocation Area | Percentage of Gross Profit | Implementation Layer / Purpose |
|-----------------------------|----------------------------|--------------------------------|
| **On-Chain Treasury Fee** | 20% | On-chain contract fee (`TREASURY_FEE_BPS = 2_000`, where 10,000 BPS = 100%) reserved directly in the global treasury account for protocol liquidity and insurance. |
| **Operations Buffer** | 7% | Retained as an off-chain operations buffer to fund developer hosting infrastructure and premium RPC services. |
| **Bronze Tier** | 1% | Collectively split among Bronze stakers (on-chain profit share). |
| **Silver Tier** | 2% | Collectively split among Silver stakers (on-chain profit share). |
| **Gold Tier** | 5% | Collectively split among Gold stakers (on-chain profit share). |
| **Platinum Tier** | 10% | Collectively split among Platinum stakers (on-chain profit share). |
| **Diamond Tier** | 20% | Collectively split among Diamond stakers (on-chain profit share). |
| **Founder Tier** | 35% | Collectively split among Founder stakers (on-chain profit share). |
| **Starter Tier** | 0% | Excluded from profit sharing (Starter tier has core system access only). |
| **Total** | **100%** | **73% collective staker allocation + 27% platform-retained portion.** |

The profit-sharing percentages assigned to each tier represent **direct percentages of the total gross monthly platform profit**, not percentages of a sub-pool. When summed, these tier-wide allocations total exactly 73% of the total gross monthly platform profit. The remaining 27% is retained by the platform: 20% as an on-chain treasury fee and 7% as an operations buffer for development, security insurance, and system expansion.

Each tier's profit-sharing is governed by the following rules:
- **Direct Tier Allocation:** The allocated portion of the profit pool represents a direct percentage of the total gross monthly platform profit.
- **Proportional Division:** This portion is divided proportionally among all active stakers in that specific tier, based on their individual staked amount relative to the total staked amount in that tier.
- **Illustrative Figures:** The "Expected Monthly Profit Share" figures shown in the individual tier sections below are illustrative examples assuming a single staker (or a highly sparsely populated tier).
- **Proportional Reduction:** If multiple stakers occupy the same tier, their individual payouts will be reduced proportionally. For example, if there are two equal stakers in the Gold tier, each receives a proportional share of the 5% gross profit allocation, totaling 2.5% of gross profit each instead of 5%.

### Interaction between Staker Profit-Sharing and Platform Trading Fees

To avoid confusion, the platform distinguishes between **Trading Fees** and **Staker Profit Sharing**:

1. **Trading Fees (1% Trade-by-Trade Fee):**
   - **How it works:** A 1% fee is collected in real-time on every trade executed/closed through Cletus, based on the position size, regardless of whether that trade was a profit or a loss.
   - **How it's distributed:** As detailed in `FEE_DISTRIBUTION.md`, 25% of this trading fee is routed to the Staking Rewards Fund to back and guarantee the 0.5% SOL APY, with the rest split among Developer (20%), Upgrades (30%), and Digital Bank (25%).
   - **Timing:** Collected in real-time.

2. **Staker Profit Sharing (Monthly Gross Profit Pool):**
   - **How it works:** This represents the monthly gross trading profits generated by the platform's trading algorithms. If a month is profitable, the gross profit is deposited into the staking smart contract for distribution.
   - **On-Chain Treasury Fee (20% of profits):** The 20% on-chain treasury fee (`TREASURY_FEE_BPS = 2_000`) is reserved from the gross profit pool deposited into the staking contract. It is stored directly in the global treasury account for protocol liquidity, security, and insurance reserves.
   - **Remaining Allocations:** The remainder of the gross profit pool is allocated directly to stakers (73% across all profit-sharing tiers Bronze–Founder) and 7% reserved as an off-chain operations buffer.
   - **Timing:** Calculated and distributed monthly.
   - **Risk Alignment:** If the platform has a net loss month, no gross profit pool is deposited, and stakers do not receive any profit-sharing distribution for that month (though they continue to receive their 0.5% SOL APY from the Staking Rewards Fund).

### **Tier 1: Starter (100,000 CLETUS)**

```
Investment (at $0.10/token): ~$10,000
Monthly SOL Reward: 0.5 SOL (~$5)
Profit Share: None

Realistic expectation: $5/month in SOL
Don't expect: Riches
Use for: Core access & basic testing
```

---

### **Tier 2: Bronze (500,000 CLETUS)**

```
Investment (at $0.10/token): ~$50,000
Monthly SOL Reward: 2.5 SOL (~$25)
Profit Share: 1%
Expected Monthly Profit Share: ~$1,000* (*NOT guaranteed; actual payouts depend on the total number of participants in this tier and the platform profit pool.)

Best Case Scenario (Good months):
- SOL rewards: $25
- Profit share: $2,000
- Total: $2,025/month

Realistic Case (Mixed months):
- SOL rewards: $25
- Profit share: $1,000
- Average: $1,025/month

Worst Case Scenario (Bad months):
- SOL rewards: $25
- Profit share: $0 (Cletus loses money)
- Total: $25/month

Loss Scenario (Catastrophic):
- RPC failure, contract bug, AI error
- Your staked capital: Down to $45,000 (10% loss)
- Monthly: Negative

⚠️ NEVER stake more than you can afford to lose entirely.
```

---

### **Tier 3: Silver (1,000,000 CLETUS)**

```
Investment (at $0.10/token): ~$100,000
Monthly SOL Reward: 5.0 SOL (~$50)
Profit Share: 2%
Expected Monthly Profit Share: ~$2,000* (*NOT guaranteed; actual payouts depend on the total number of participants in this tier and the platform profit pool.)

Best Case Scenario (Good months):
- SOL rewards: $50
- Profit share: $4,000
- Total: $4,050/month

Realistic Case (Mixed months):
- SOL rewards: $50
- Profit share: $2,000
- Average: $2,050/month

Worst Case Scenario (Bad months):
- SOL rewards: $50
- Profit share: $0 (Cletus loses money)
- Total: $50/month

Loss Scenario (Catastrophic):
- RPC failure, contract bug, AI error
- Your staked capital: Down to $90,000 (10% loss)
- Monthly: Negative

⚠️ NEVER stake more than you can afford to lose entirely.
```

---

### **Tier 4: Gold (5,000,000 CLETUS)**

```
Investment (at $0.10/token): ~$500,000
Monthly SOL Reward: 25.0 SOL (~$250)
Profit Share: 5%
Expected Monthly Profit Share: ~$5,000* (*NOT guaranteed; actual payouts depend on the total number of participants in this tier and the platform profit pool.)

Best Case Scenario (Good months):
- SOL rewards: $250
- Profit share: $10,000
- Total: $10,250/month

Realistic Case (Mixed months):
- SOL rewards: $250
- Profit share: $5,000
- Average: $5,250/month

Worst Case Scenario (Bad months):
- SOL rewards: $250
- Profit share: $0 (Cletus loses money)
- Total: $250/month

Loss Scenario (Catastrophic):
- RPC failure, contract bug, AI error
- Your staked capital: Down to $450,000 (10% loss)
- Monthly: Negative

⚠️ NEVER stake more than you can afford to lose entirely.
```

---

### **Tier 5: Platinum (10,000,000 CLETUS)**

```
Investment (at $0.10/token): ~$1,000,000
Monthly SOL Reward: 50.0 SOL (~$500)
Profit Share: 10%
Expected Monthly Profit Share: ~$10,000* (*NOT guaranteed; actual payouts depend on the total number of participants in this tier and the platform profit pool.)

Best Case Scenario (Good months):
- SOL rewards: $500
- Profit share: $20,000
- Total: $20,500/month

Realistic Case (Mixed months):
- SOL rewards: $500
- Profit share: $10,000
- Average: $10,500/month

Worst Case Scenario (Bad months):
- SOL rewards: $500
- Profit share: $0 (Cletus loses money)
- Total: $500/month

Loss Scenario (Catastrophic):
- RPC failure, contract bug, AI error
- Your staked capital: Down to $900,000 (10% loss)
- Monthly: Negative

⚠️ NEVER stake more than you can afford to lose entirely.
```

---

### **Tier 6: Diamond (25,000,000 CLETUS)**

```
Investment (at $0.10/token): ~$2,500,000
Monthly SOL Reward: 125.0 SOL (~$1,250)
Profit Share: 20%
Expected Monthly Profit Share: ~$20,000* (*NOT guaranteed; actual payouts depend on the total number of participants in this tier and the platform profit pool.)

Best Case Scenario (Good months):
- SOL rewards: $1,250
- Profit share: $40,000
- Total: $41,250/month

Realistic Case (Mixed months):
- SOL rewards: $1,250
- Profit share: $20,000
- Average: $21,250/month

Worst Case Scenario (Bad months):
- SOL rewards: $1,250
- Profit share: $0
- Total: $1,250/month

Loss Scenario (Catastrophic):
- Cletus suffers catastrophic failure
- Your staked capital: Down to $2,250,000 (10% loss)
- Monthly: Significant losses

⚠️ This is NOT a retirement account.
```

---

### **Tier 7: Founder (100,000,000+ CLETUS)**

```
Investment (at $0.10/token): ~$10,000,000
Monthly SOL Reward: 500.0 SOL (~$5,000)
Profit Share: 35%
Expected Monthly Profit Share: ~$35,000* (*NOT guaranteed; actual payouts depend on the total number of participants in this tier and the platform profit pool.)

Best Case Scenario (Good months):
- SOL rewards: $5,000
- Profit share: $70,000
- Plus: Revenue share from subscriptions
- Total: $75,000+/month

Realistic Case (Mixed months):
- SOL rewards: $5,000
- Profit share: $35,000
- Revenue share: $5,000
- Total: $45,000/month

Worst Case (Bad months):
- Cletus has losing month
- SOL rewards: $5,000
- Profit share: $0
- Revenue share: $0
- Total: $5,000/month

Catastrophic Loss:
- Smart contract exploit, AI failure, RPC disaster
- Your staked capital: Down to $9,000,000 (10% loss)
- You lose $1,000,000+

⚠️ Even large stakes are not protected from loss.
```

---

## Profit Sharing is NOT Guaranteed

### Why Profits Could Drop

1. **AI Trading Errors**
   - Cletus enters bad trades, exits too late
   - Pattern recognition fails on new market conditions
   - Losses: -$10K to -$100K+

2. **Smart Contract Bugs**
   - Exploit discovered in staking or trading contract
   - Attacker drains treasury
   - Insurance covers some, not all

3. **RPC Failures**
   - Solana network congestion or validator issues
   - Transactions don't execute, losses accumulate
   - Can't cut positions in time

4. **Market Manipulation**
   - Pump-and-dump schemes catch Cletus off-guard
   - Honeypot tokens that can't be sold
   - Significant losses possible

5. **Regulatory Crackdown**
   - Solana, Raydium, or token trading banned in jurisdiction
   - Operations shutdown, funds locked
   - Extended or permanent loss

6. **Token Crashes**
   - Micro-cap tokens Cletus trades collapse 99%
   - Slippage becomes extreme
   - Losses exceed stop-loss triggers

7. **System Failure**
   - Cletus bugs go undetected for weeks
   - Silent errors in pattern calculations
   - Trades executed based on false signals

---

## What You're Getting

### Staking Rewards (Guaranteed, separate from profit share)
- ✅ **0.5% APY in SOL** - Supported by the protocol's Staking Rewards Fund, regardless of trading performance
- ✅ **Monthly distribution** - SOL deposited to your wallet
- ✅ **Unstaking terms** - 7-day cooldown period, with a 2% early penalty if withdrawn within 30 days

### Profit Sharing (NOT Guaranteed)
- ❓ **Varies month-to-month** - Could be $0 to very high
- ❓ **Depends on Cletus performance** - Which is unpredictable
- ❓ **Subject to smart contract vulnerabilities** - Insurance covers some losses
- ❓ **Not insured by any government agency** - Crypto has no FDIC
- ❓ **Lost money if Cletus fails** - You suffer the loss

### Security (Best-Effort, Not Guaranteed)
- ✅ **Kill switch** - Emergency close all positions
- ✅ **Smart contract audit** - Professional review (not perfect)
- ✅ **Multi-sig treasury wallet** - 3 of 5 signers required for major transactions
- ✅ **Insurance reserve** - 10% emergency fund (covers SOME scenarios)
- ❌ **Perfect security** - No such thing exists

---

## Risk Scenarios

### Mild Risk (Monthly loss)
**Probability:** 30-40% of months

Cletus has a losing month. Trading loses $5,000-$20,000.
- You lose: That month's profit share ($0)
- Staked tokens: Unaffected
- Recovery: Usually bounces back next month

### Moderate Risk (Major loss)
**Probability:** 5-10% of months

Cletus makes a series of bad trades or encounters RPC failure. Loses $50,000-$200,000.
- You lose: 2-4 months of profit share
- Staked tokens: Unaffected (they're safe in contract)
- Recovery: Takes 6+ months to rebuild

### High Risk (Catastrophic loss)
**Probability:** <1% per year

Smart contract exploit, massive AI error, or system failure results in 50%+ loss of treasury.
- You lose: 30-50% of staked capital
- Recovery: Uncertain

### Existential Risk (Total loss)
**Probability:** <0.1% per year

Complete system meltdown, regulatory shutdown, or total smart contract failure.
- You lose: All staked CLETUS tokens
- Recovery: Impossible

---

## Real Talk: Is This a Good Investment?

### Honest Assessment

**For $100-$1,000 stakes (Starter/Pro/Elite):**
- ✅ Acceptable risk - You're only risking small amounts
- ✅ Interesting experiment - See how Cletus performs
- ✅ Staking rewards are real - SOL rewards are yours
- ⚠️ Don't expect to get rich

**For $250K-$500K stakes (Profit Sharer Tier 1-2):**
- ⚠️ This is real money
- ⚠️ AI trading is unpredictable
- ⚠️ You could lose significant portions
- ⚠️ Only stake if you can afford the loss
- ✅ If Cletus succeeds, returns are excellent
- ✅ Staking APY provides baseline income

**For $1M+ stakes (Founder):**
- ⚠️ This is institutional capital
- ⚠️ Single points of failure could ruin you
- ⚠️ Consider diversification instead
- ✅ Large stakes provide some bargaining power
- ✅ Potential returns could be 6+ figures/year
- ✅ But risk is extremely high

---

## Historical Context

**No staking system has ever run long enough to know if it's viable.**

- Cletus is new
- The staking model is untested
- We don't know if profits will materialize
- We don't know if Cletus will survive market crashes
- We don't know if regulations will kill it

**You are taking a bet on:**
1. AI trading actually works (it might not)
2. Cletus's patterns hold up (they might not)
3. Smart contracts are secure (they might not be)
4. Regulations allow this (they might not)
5. The team doesn't disappear (it could)

---

## Questions to Ask Yourself Before Staking

- [ ] Can I afford to lose this entire amount?
- [ ] Do I understand how AI trading works?
- [ ] Do I understand smart contract risks?
- [ ] Have I read SECURITY.md and README.md?
- [ ] Do I believe in Cletus's vision?
- [ ] Can I handle volatility?
- [ ] Do I need this money for the next 2+ years?
- [ ] Have I diversified my investments?
- [ ] Am I using a hardware wallet?
- [ ] Am I comfortable with 0% returns some months?

**If you answered NO to any of these, reconsider your stake size.**

---

## What Happens if Cletus Fails

### Scenario 1: Cletus Stops Working
- Kill switch activated, all positions closed
- You can unstake your CLETUS tokens
- Staking rewards stopped
- Profit sharing ended

### Scenario 2: Smart Contract Hacked
- Insurance covers some losses (maybe 10-50%)
- Remaining loss is permanent
- You're left with less CLETUS than you staked

### Scenario 3: Regulatory Ban
- Trading stops immediately
- Funds frozen pending legal resolution
- Could take months or years to recover
- You may never get your tokens back

### Scenario 4: Complete System Failure
- Cletus and staking shut down
- No mechanism to recover funds
- Total loss likely

---

## Bottom Line

**Staking CLETUS is a high-risk, high-reward bet on:**
- AI-powered trading working in practice
- Smart contracts remaining secure
- Regulations permitting this activity
- The Cletus team executing flawlessly
- Markets cooperating with your positions

**This is NOT:**
- A savings account
- An investment fund
- A guaranteed income
- Insurance
- A bond
- A retirement plan

**This IS:**
- A speculative crypto asset
- An experiment in AI trading
- Potentially very profitable
- Potentially catastrophic
- A bet on the future of autonomous trading

---

## Support & Questions

- **Discord:** [Link at launch]
- **Staking Dashboard:** dashboard.cletus.com
- **Email:** staking@cletus.dev
- **Legal:** consult your own attorney before staking

---

**Only stake capital you can afford to lose entirely. AI trading is inherently unpredictable. No guarantees exist.**

**The golden goose might lay eggs. Or it might break. You decide.**
