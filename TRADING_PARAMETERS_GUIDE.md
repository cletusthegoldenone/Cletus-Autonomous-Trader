# Cletus Trading Parameters Guide

## Overview

This guide explains all configurable parameters for customizing Cletus's trading behavior. Clients can tune these parameters to match their risk tolerance, availability, and profit targets.

---

## Quick Start Presets

### 1. **Conservative Earner**
Perfect for: Low-risk investors with small capital, long-term wealth building

```env
ENABLE_24_7_TRADING=false
TRADING_START_TIME=10:00
TRADING_END_TIME=16:00
AGGRESSION_LEVEL=CONSERVATIVE
DAILY_PNL_TARGET=500
DAILY_LOSS_LIMIT=-300
STOP_LOSS_PERCENTAGE=5.0
TAKE_PROFIT_PERCENTAGE=15.0
MAX_POSITION_SIZE_USD=1000
MAX_OPEN_POSITIONS=2
```

**Expected:** ~$500/day profit, minimal drawdowns, low stress

---

### 2. **Day Trader**
Perfect for: Active traders, 9-5 availability, moderate-to-high risk tolerance

```env
ENABLE_24_7_TRADING=false
TRADING_START_TIME=09:00
TRADING_END_TIME=17:00
TRADING_TIMEZONE=America/New_York
PAUSE_ON_WEEKENDS=true
AGGRESSION_LEVEL=AGGRESSIVE
DAILY_PNL_TARGET=5000
DAILY_LOSS_LIMIT=-2000
STOP_LOSS_PERCENTAGE=8.0
TAKE_PROFIT_PERCENTAGE=20.0
MAX_POSITION_SIZE_USD=15000
MAX_OPEN_POSITIONS=10
```

**Expected:** ~$5,000/day profit, 8-15% drawdowns, active trading

---

### 3. **Night Trader**
Perfect for: Evening/night availability, moderate aggression

```env
ENABLE_24_7_TRADING=false
TRADING_START_TIME=21:00
TRADING_END_TIME=05:00
AGGRESSION_LEVEL=MODERATE
DAILY_PNL_TARGET=2000
DAILY_LOSS_LIMIT=-1000
STOP_LOSS_PERCENTAGE=8.0
TAKE_PROFIT_PERCENTAGE=20.0
MAX_POSITION_SIZE_USD=5000
MAX_OPEN_POSITIONS=5
ENABLE_TRAILING_STOP=true
TRAILING_STOP_PERCENTAGE=5.0
```

**Expected:** ~$2,000/night profit, moderate volatility

---

### 4. **24/7 Alpha Hunter**
Perfect for: Maximum returns, hands-off approach, high risk tolerance

```env
ENABLE_24_7_TRADING=true
AGGRESSION_LEVEL=MAXIMUM
DAILY_PNL_TARGET=10000
DAILY_LOSS_LIMIT=-5000
STOP_LOSS_PERCENTAGE=10.0
TAKE_PROFIT_PERCENTAGE=25.0
MAX_POSITION_SIZE_USD=50000
MAX_OPEN_POSITIONS=20
MAX_DRAWDOWN_PERCENTAGE=20.0
```

**Expected:** ~$10,000/day profit, 15-20% drawdowns, maximum volatility

---

### 5. **Weekend Warrior**
Perfect for: Part-time traders, weekend trading only

```env
ENABLE_24_7_TRADING=false
TRADING_DAYS=5,6
TRADING_START_TIME=00:00
TRADING_END_TIME=23:59
AGGRESSION_LEVEL=AGGRESSIVE
DAILY_PNL_TARGET=3000
DAILY_LOSS_LIMIT=-1500
ENABLE_TRAILING_STOP=true
TRAILING_STOP_PERCENTAGE=8.0
```

**Expected:** ~$3,000 per weekend day, weekend-only activity

---

## Operating Schedule Parameters

### `ENABLE_24_7_TRADING`
- **Type:** Boolean (true/false)
- **Default:** false
- **Explanation:** If true, Cletus trades continuously. If false, use time windows.

### `TRADING_START_TIME` & `TRADING_END_TIME`
- **Type:** HH:MM (24-hour format)
- **Example:** 09:00, 17:00
- **Explanation:** Trading window in your local timezone. Cletus pauses outside these hours.

### `TRADING_DAYS`
- **Type:** Comma-separated list (0=Monday, 6=Sunday)
- **Example:** 0,1,2,3,4 (Monday-Friday only)
- **Explanation:** Which days of the week to trade

### `TRADING_TIMEZONE`
- **Type:** IANA timezone string
- **Example:** America/New_York, Europe/London, Asia/Tokyo
- **Explanation:** Timezone for interpreting start/end times

### `PAUSE_ON_WEEKENDS`
- **Type:** Boolean
- **Default:** true
- **Explanation:** Automatically pause trading on Saturdays/Sundays

---

## Aggression Level

### What is Aggression?

Aggression controls how aggressively Cletus pursues trades:
- **CONSERVATIVE (1):** Only high-confidence signals, small positions, long holds
- **MODERATE (2):** Balanced approach, medium positions, medium holds
- **AGGRESSIVE (3):** Chases signals more readily, larger positions, faster exits
- **MAXIMUM (4):** Extreme trades, huge positions, bleeding-edge strategy

### How It Works

Each aggression level scales multiple parameters automatically:

| Parameter | Conservative | Moderate | Aggressive | Maximum |
|-----------|--------------|----------|------------|---------|
| Min Composite Score | 0.75 | 0.65 | 0.55 | 0.45 |
| Max Position Size | $1K | $5K | $15K | $50K |
| Max Open Positions | 2 | 5 | 10 | 20 |
| Slippage Tolerance | 0.02 (2%) | 0.05 (5%) | 0.10 (10%) | 0.20 (20%) |
| Trade Frequency | Every 5 min | Every 2 min | Every 60s | Every 30s |
| Hold Time | 2 hours | 1 hour | 30 min | 10 min |

### Choosing Your Aggression Level

```
Risk Tolerance: Low ────────────────────────────────────> High
Time Available: Part-time ───────────────────────────> 24/7
Capital: <$10k ──────────────────────────────────────> $100k+
         │
      CONSERVATIVE ──> MODERATE ──> AGGRESSIVE ──> MAXIMUM
```

---

## PnL (Profit & Loss) Parameters

### `STOP_LOSS_PERCENTAGE`
- **Default:** 10.0
- **Explanation:** Exit if trade loses more than this percentage
- **Example:** 10.0 = Exit if down 10%
- **Conservative:** 5.0-8.0
- **Aggressive:** 10.0-15.0

### `TAKE_PROFIT_PERCENTAGE`
- **Default:** 25.0
- **Explanation:** Exit if trade gains this percentage
- **Example:** 25.0 = Exit when up 25%
- **Conservative:** 10.0-15.0
- **Aggressive:** 20.0-30.0

### `BREAK_EVEN_STOP`
- **Default:** 5.0
- **Explanation:** Once profit reaches 5%, move stop loss to entry price (no loss possible)
- **Effect:** Locks in profit after reaching 5% gain

### `ENABLE_TRAILING_STOP`
- **Type:** Boolean
- **Default:** true
- **Explanation:** Follow price upward and exit if it reverses

### `TRAILING_STOP_PERCENTAGE`
- **Default:** 5.0
- **Explanation:** How much price can drop from its high before exiting
- **Example:** 5.0 = Exit if price drops 5% from peak

---

## Daily/Weekly/Monthly PnL Targets & Limits

### Daily Targets

```env
DAILY_PNL_TARGET=5000          # Stop trading once this profit is hit
DAILY_LOSS_LIMIT=-2000         # Auto-pause if losses exceed this
```

**Example:**
- If `DAILY_PNL_TARGET=5000`, Cletus stops trading once it makes $5,000 profit
- If `DAILY_LOSS_LIMIT=-2000`, Cletus pauses if it loses $2,000

### Weekly/Monthly Targets

```env
WEEKLY_PNL_TARGET=30000        # Goal for the week
WEEKLY_LOSS_LIMIT=-10000       # Max loss before pause

MONTHLY_PNL_TARGET=100000      # Goal for the month
MONTHLY_LOSS_LIMIT=-30000      # Max loss before pause
```

### Setting Realistic Targets

```
Position Size    Daily Target    Weekly Target    Monthly Target
─────────────────────────────────────────────────────────────────
$1,000           $100-200        $500-1K          $2K-5K
$5,000           $500-1K         $3K-5K           $10K-20K
$10,000          $1K-2K          $5K-10K          $20K-50K
$50,000          $5K-10K         $25K-50K         $100K-200K
```

---

## Position Sizing Tiers (Scaling Based on PnL)

As Cletus accumulates profit, position sizes automatically scale up:

```
Cumulative PnL  Clip Multiplier  Max Position Size (if base=$5K)
─────────────────────────────────────────────────────────────────
$0 - $10K       1.0×             $5,000
$10K - $20K     1.5×             $6,500
$20K - $40K     2.0×             $8,000
$40K - $60K     2.5×             $10,000
$60K+           3.0×             $12,500
```

**Example:** If Cletus makes $25,000 in profit and base position is $5,000:
- It's in Tier 3 (scaling 2.0×)
- New position size = $5,000 × 2.0 = $10,000

### Why Scale Positions?

1. **Early phase:** Small positions reduce risk while learning market
2. **Mid phase:** Larger positions capture more alpha as confidence grows
3. **Late phase:** Position sizing grows with capital, maximizing returns
4. **No human intervention:** Automatic scaling based on proven performance

---

## Drawdown Management

### `MAX_DRAWDOWN_PERCENTAGE`
- **Default:** 15.0
- **Explanation:** Maximum loss from all-time high before automatic pause
- **Example:** 15.0 = Pause if equity drops 15% from peak

### `ENABLE_RECOVERY_MODE`
- **Default:** true
- **Explanation:** Automatically reduce aggression after big losses

### Recovery Mode Example

**Scenario:**
- Max drawdown = 15%
- Aggression drops to 50% intensity
- Requires 5 winning trades to exit recovery mode

**Effect:** Cletus becomes cautious after losses, rebuilds confidence gradually

---

## Market Condition Filters

These prevent Cletus from trading in risky conditions:

### `MIN_TOKEN_AGE_HOURS`
- **Default:** 1
- **Explanation:** Skip tokens less than 1 hour old (prevents rugpulls)

### `MAX_HOLDER_CONCENTRATION`
- **Default:** 0.30
- **Explanation:** Skip if top holder owns >30% (rug risk)

### `MAX_HOURLY_PRICE_MOVEMENT`
- **Default:** 50.0
- **Explanation:** Skip if price moved >50% in last hour (likely pump-and-dump)

### `REQUIRE_LIQUIDITY_LOCK`
- **Default:** true
- **Explanation:** Only trade tokens with verified liquidity locks

### `MIN_MARKET_VOLUME_24H`
- **Default:** 100,000,000 (100M SOL)
- **Explanation:** Only trade on tokens with substantial daily volume

---

## Risk Management Parameters

### `RISK_PER_TRADE_PERCENTAGE`
- **Default:** 2.0
- **Explanation:** Risk 2% of account on each trade
- **Formula:** Position Size = (Account × 2%) / (Stop Loss %)

### Example Calculation
```
Account: $50,000
Risk per trade: 2.0%
Stop loss: 10%

Position size = ($50,000 × 2%) / 10% = $1,000 × 2 = $10,000 position
```

### `MAX_TOTAL_EXPOSURE_PERCENTAGE`
- **Default:** 25.0
- **Explanation:** Never have >25% of account in open trades total

---

## Complete Parameter Checklist

### Before Going Live

- [ ] Choose your aggression level (CONSERVATIVE/MODERATE/AGGRESSIVE/MAXIMUM)
- [ ] Set operating hours (24/7 or specific times)
- [ ] Set daily PnL target and loss limit
- [ ] Set stop loss and take profit percentages
- [ ] Set max position size and open positions
- [ ] Enable/disable trailing stops
- [ ] Set maximum drawdown tolerance
- [ ] Test in simulation mode first

### Tuning Your Strategy

1. **Start conservative:** Use CONSERVATIVE aggression, small position sizes
2. **Monitor:** Run for 1 week, analyze results
3. **Adjust:** If profitable, increase aggression slightly
4. **Repeat:** Continue adjusting until you find your sweet spot

### Example Progression

```
Week 1: CONSERVATIVE, $1K positions, 2 max open
        → Results: $200 profit

Week 2: MODERATE, $3K positions, 5 max open
        → Results: $800 profit

Week 3: AGGRESSIVE, $10K positions, 10 max open
        → Results: $5,000 profit (hitting sweet spot)

Week 4+: Stay at AGGRESSIVE, monitor drawdowns, adjust as needed
```

---

## Advanced: Custom Configuration

### Creating Your Own Preset

```env
# My Custom Strategy (based on my availability & risk tolerance)
ENABLE_24_7_TRADING=false
TRADING_START_TIME=14:00
TRADING_END_TIME=22:00
TRADING_TIMEZONE=America/Los_Angeles
AGGRESSION_LEVEL=MODERATE

# PnL Management
DAILY_PNL_TARGET=2500
DAILY_LOSS_LIMIT=-1250
STOP_LOSS_PERCENTAGE=7.0
TAKE_PROFIT_PERCENTAGE=20.0

# Position Management
MAX_POSITION_SIZE_USD=8000
MAX_OPEN_POSITIONS=6
ENABLE_TRAILING_STOP=true
TRAILING_STOP_PERCENTAGE=6.0

# Risk
RISK_PER_TRADE_PERCENTAGE=2.0
MAX_DRAWDOWN_PERCENTAGE=12.0

# Recovery
ENABLE_RECOVERY_MODE=true
RECOVERY_MODE_AGGRESSION_MULTIPLIER=0.6
```

---

## Monitoring & Adjusting

### Weekly Review Checklist

- [ ] Total PnL for the week (vs. target)
- [ ] Win rate (% of profitable trades)
- [ ] Average trade duration
- [ ] Maximum drawdown experienced
- [ ] Largest single trade loss
- [ ] Largest single trade gain

### Red Flags (Time to Adjust Down)

- Win rate drops below 30%
- Drawdown exceeds your tolerance
- Frequent stop losses on aggression level
- Emotional stress from volatility

### Green Flags (Time to Increase Aggression)

- Win rate consistently >50%
- Drawdowns staying within limits
- Reaching PnL targets easily
- Confident in current settings

---

## Support & Questions

For detailed explanations of any parameter, refer to:
- `README.md` — System overview
- `SECURITY.md` — Key management
- `.env.example` — All available variables

---

**Remember:** The best strategy is one you can stick with. Start conservative, adjust gradually, and let data guide your decisions.
