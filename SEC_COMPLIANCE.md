# Cletus SEC & Federal Securities Law Compliance

This document describes the regulatory framework embedded into Cletus's memory and enforced before every trade.

---

## Overview

Cletus is an automated algorithmic trading system. U.S. federal securities law and CFTC commodity regulations impose compliance obligations on automated trading regardless of whether the assets traded are classified as securities or commodities. This compliance module encodes those rules directly into Cletus's pre-trade checks and AI Brain knowledge base.

---

## Regulatory Framework

### Securities Exchange Act of 1934

| Section / Rule | Topic | Cletus Enforcement |
|---|---|---|
| § 9 (15 U.S.C. § 78i) | Market Manipulation | Position concentration limits; wash-trade detection; trading velocity cap |
| § 10(b) / Rule 10b-5 | Anti-Fraud | No deceptive trades; accurate AI responses only |
| Rule 10b5-1 | Insider Trading | Cletus uses only public on-chain data; pre-programmed signal approach |
| Rule 15c3-5 | Market Access Risk Controls | Pre-trade audit; score gate; position cap; kill switch |
| Regulation SHO | Short Selling | Not applicable — Cletus is LONG-only |
| Regulation ATS | Alternative Trading Systems | Not applicable — Cletus uses AMM liquidity pools, not order matching |
| Regulation Best Execution (2023) | Best Price Routing | Jupiter Aggregator used for all swaps |

### Securities Act of 1933

| Section | Topic | Cletus Enforcement |
|---|---|---|
| § 5 | Securities Registration | $CLETUS token must be assessed under the Howey Test — consult legal counsel |
| Rule 144 | Resale of Restricted Securities | Applies if $CLETUS was issued in private placement |

### Howey Test — *SEC v. W.J. Howey Co.*, 328 U.S. 293 (1946)

An instrument is a "security" (investment contract) if it involves:

1. **Investment of money**
2. **In a common enterprise**
3. **With a reasonable expectation of profits**
4. **Derived primarily from the efforts of others**

Each token traded by Cletus should be independently assessed under this test. Most Solana DeFi utility/governance tokens with decentralised development are less likely to qualify, but the CFTC's anti-manipulation rules apply regardless of classification.

### Investment Advisers Act of 1940

Anyone providing investment advice about securities for compensation must register with the SEC. The Cletus platform's signal-sharing and AI advisory features may trigger this requirement depending on fee structure. **Platform operators should consult qualified securities law counsel.**

### Dodd-Frank Act (2010)

- § 747 extends anti-manipulation provisions to swaps and security-based swaps.
- Not currently applicable (Cletus trades spot tokens, not swaps or derivatives).

### Commodity Exchange Act (CFTC Jurisdiction)

Most Solana DeFi tokens are more likely regulated as **commodities** (CFTC) than as **securities** (SEC), though this boundary is unsettled. CEA § 9 prohibits manipulation, wash trading, and fraud in commodity markets — the same prohibitions as the SEC Exchange Act. **Both sets of rules apply.**

### Bank Secrecy Act / AML

Platform operators accepting user funds for staking or trading should assess **Money Services Business (MSB)** registration under the Bank Secrecy Act and FinCEN guidance FIN-2019-G001, including:
- Know Your Customer (KYC) procedures
- Suspicious Activity Report (SAR) filing obligations
- Transaction monitoring for money laundering indicators

---

## Pre-Trade Compliance Checks

Every trade passes through the SEC compliance gate in `src/lib/sec-compliance.ts` before execution. Three checks run automatically:

### 1. Position Concentration Check

**Rule**: Exchange Act § 9 / Rule 10b-5 — prevents market manipulation via position concentration.

| Limit | Default | Env Override |
|---|---|---|
| Max % of 24h volume | 5% | `SEC_MAX_VOLUME_SHARE` |
| Max % of pool liquidity | 10% | `SEC_MAX_LIQUIDITY_SHARE` |

A trade exceeding either limit is **blocked**.

### 2. Wash Trading Detection

**Rule**: Exchange Act § 9(a)(1) — prohibits buying and selling the same token to create artificial volume.

Cletus checks whether the same token was both bought and sold within the last 60 minutes. If yes, the new buy is **blocked** as a potential wash-trade pattern.

| Parameter | Default | Env Override |
|---|---|---|
| Look-back window | 60 min | `SEC_WASH_TRADE_WINDOW_MINUTES` |

### 3. Trading Velocity Check

**Rule**: Exchange Act § 9 — prevents creating artificial market activity through high-frequency bursts.

| Limit | Default | Env Override |
|---|---|---|
| Max trades per 5 min | 8 | `SEC_MAX_TRADES_PER_5MIN` |

Exceeding this velocity triggers a **trade block**.

---

## AI Brain Regulatory Memory

The Cletus AI Brain (Gemini 2.5 Flash) has the full SEC regulatory framework embedded in its system prompt via `getSecComplianceContext()` from `src/lib/sec-compliance.ts`. This means:

- All AI advisory responses are governed by SEC compliance knowledge
- The AI will not suggest strategies that constitute market manipulation, wash trading, insider trading, or fraud
- The AI can answer questions about SEC/CFTC regulation in the context of Solana DeFi
- The AI identifies when activities may require legal counsel (token registration, investment adviser requirements, AML obligations)

---

## Operational Controls (Rule 15c3-5 Alignment)

Cletus's existing controls align with SEC Rule 15c3-5 (Market Access Rule) requirements:

| Rule 15c3-5 Requirement | Cletus Implementation |
|---|---|
| Pre-trade risk checks | Rugcheck + DexScreener audit on every token |
| Signal quality gate | `MIN_COMPOSITE_SCORE` minimum threshold |
| Position limits | `MAX_OPEN_POSITIONS` cap |
| Position sizing | Progressive sizing tied to PnL milestones |
| Kill switch | `/api/emergency/kill-switch` closes all positions atomically |
| Best execution | Jupiter Aggregator routes all swaps for best available price |
| SEC compliance pre-trade gate | `runSecComplianceChecks()` on every `/api/trade/execute` call |

---

## Configuration Reference

Add these to your `.env.local` to tune SEC compliance thresholds:

```env
# Maximum fraction of 24h token volume per single trade (default: 5%)
SEC_MAX_VOLUME_SHARE=0.05

# Maximum fraction of pool liquidity per single trade (default: 10%)
SEC_MAX_LIQUIDITY_SHARE=0.10

# Wash trade detection window in minutes (default: 60)
SEC_WASH_TRADE_WINDOW_MINUTES=60

# Maximum number of trades in any 5-minute window (default: 8)
SEC_MAX_TRADES_PER_5MIN=8

# Approximate SOL price in USD for position-size calculations (default: 180)
# Update periodically or set to a conservative value.
SEC_DEFAULT_SOL_PRICE_USD=180
```

---

## Legal Disclaimer

This compliance framework represents a best-effort technical implementation of applicable U.S. federal securities and commodity regulations. It **does not constitute legal advice**. Cletus users and platform operators must consult qualified U.S. securities law counsel for definitive compliance guidance applicable to their specific circumstances, jurisdiction, and business activities.

The regulatory status of individual cryptocurrency tokens is unsettled law and changes frequently. Nothing in this document should be construed as a determination that any particular token is or is not a security.
