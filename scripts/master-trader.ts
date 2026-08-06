import * as fs from 'fs';
import * as path from 'path';
import { auditToken } from '../src/lib/pre-trade-audit';
import { buyTokenWithSol, sellTokenForSol, loadTradingKeypair, WSOL_MINT } from '../src/lib/jupiter';
import {
  openPosition,
  getOpenPositions,
  getClosedPositions,
  updatePositionPrice,
  closePosition,
  getOpenCount,
} from '../src/lib/position-store';
import { applyWeights, recordOutcome, getWeights, getSignalStats } from '../src/lib/pattern-memory';
import { runSecComplianceChecks } from '../src/lib/sec-compliance';
import type { TradeRecord } from '../src/lib/sec-compliance';
import type { SignalBreakdown } from '../src/types';

// ── Environment Variables Loader ─────────────────────────────────────────────
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  const localEnvPath = path.resolve(process.cwd(), '.env.local');

  const pathsToTry = [localEnvPath, envPath];
  let loaded = false;
  for (const p of pathsToTry) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const firstEqual = trimmed.indexOf('=');
          if (firstEqual > 0) {
            const key = trimmed.slice(0, firstEqual).trim();
            const value = trimmed.slice(firstEqual + 1).trim();
            let cleanVal = value;
            if (
              (value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))
            ) {
              cleanVal = value.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = cleanVal;
            }
          }
        }
      }
      console.log(`[Env] Loaded environment variables from: ${p}`);
      loaded = true;
      break;
    }
  }
  if (!loaded) {
    console.log('[Env] No .env or .env.local file found. Operating with existing process.env.');
  }
}

// ── DexScreener Types ─────────────────────────────────────────────────────────
interface DexPair {
  chainId: string;
  baseToken: { address: string; name: string; symbol: string };
  priceUsd: string;
  priceChange: { m5?: number; h1?: number; h24?: number };
  volume: { m5?: number; h1?: number; h24?: number };
  marketCap?: number;
  fdv?: number;
  liquidity?: { usd?: number };
  txns?: { m5?: { buys: number; sells: number } };
}

interface DexBoost {
  chainId: string;
  tokenAddress: string;
}

// ── Signal Builder ────────────────────────────────────────────────────────────
function buildBreakdown(pair: DexPair): SignalBreakdown {
  const change5m = Math.max(0, pair.priceChange?.m5 ?? 0) / 20;
  const change1h = Math.max(0, pair.priceChange?.h1 ?? 0) / 50;
  const vol5m = pair.volume?.m5 ?? 0;
  const mcap = pair.marketCap ?? pair.fdv ?? 0;
  const liq = pair.liquidity?.usd ?? 0;
  const m5txns = pair.txns?.m5;

  const volumeSpike = mcap > 0 ? Math.min(1, (vol5m / mcap) * 5) : 0.3;
  const momentum = Math.min(1, change5m + change1h * 0.5);
  const breakout = Math.min(
    1,
    (pair.priceChange?.h1 ?? 0) > 10
      ? 0.8
      : (pair.priceChange?.h1 ?? 0) > 5
        ? 0.55
        : 0.3,
  );
  const liquidityScore = Math.min(1, liq / 200_000);
  const buyRatio =
    m5txns && m5txns.buys + m5txns.sells > 0
      ? m5txns.buys / (m5txns.buys + m5txns.sells)
      : 0.5;
  const holderGrowth = buyRatio > 0.65 ? 0.75 : buyRatio > 0.5 ? 0.5 : 0.3;

  return {
    volumeSpike: parseFloat(volumeSpike.toFixed(3)),
    momentum: parseFloat(momentum.toFixed(3)),
    breakout: parseFloat(breakout.toFixed(3)),
    rsiScore: parseFloat(Math.min(1, Math.max(0, 0.3 + momentum * 0.7)).toFixed(3)),
    macdCross: parseFloat(Math.min(1, breakout * 0.8 + volumeSpike * 0.2).toFixed(3)),
    holderGrowth: parseFloat(holderGrowth.toFixed(3)),
    liquidityScore: parseFloat(liquidityScore.toFixed(3)),
    socialSentiment: parseFloat((0.4 + holderGrowth * 0.4 + volumeSpike * 0.2).toFixed(3)),
  };
}

// ── Main Controller Loops ─────────────────────────────────────────────────────

async function managePositions() {
  const openPos = await getOpenPositions();
  if (openPos.length === 0) {
    console.log('[Position Manager] No open positions to monitor.');
    return;
  }

  console.log(`[Position Manager] Monitoring ${openPos.length} open position(s)...`);

  // Fetch prices for all open positions in one API call
  const addresses = openPos.map((p) => p.tokenAddress).join(',');
  const currentPrices: Record<string, number> = {};
  const currentLiquidity: Record<string, number> = {};

  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${addresses}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = (await res.json()) as { pairs?: DexPair[] };
      const pairs = data.pairs ?? [];
      for (const pair of pairs) {
        if (pair.chainId === 'solana') {
          const addr = pair.baseToken.address;
          const price = parseFloat(pair.priceUsd ?? '0');
          const liq = pair.liquidity?.usd ?? 0;
          if (!currentPrices[addr] || liq > (currentLiquidity[addr] ?? 0)) {
            currentPrices[addr] = price;
            currentLiquidity[addr] = liq;
          }
        }
      }
    }
  } catch (err) {
    console.error('[Position Manager] Failed to fetch latest market prices:', err);
  }

  const isLive = process.env.ENABLE_LIVE_TRADING === 'true';
  const hasKeypair = loadTradingKeypair() !== null;
  const slippageTolerance = parseFloat(process.env.SLIPPAGE_TOLERANCE ?? '0.05');
  const slippageBps = Math.round(slippageTolerance * 10000);

  for (const pos of openPos) {
    const latestPrice = currentPrices[pos.tokenAddress];
    if (!latestPrice) {
      console.log(`[Position Manager] No price update for ${pos.tokenSymbol}. Retaining last price: $${pos.currentPrice}`);
      continue;
    }

    // Update current price & unrealised PnL in position-store
    const updated = await updatePositionPrice(pos.id, latestPrice);
    if (!updated) continue;

    const pnlPercent = ((latestPrice - pos.entryPrice) / pos.entryPrice) * 100;
    console.log(
      `[Position Manager] ${pos.tokenSymbol}: Current $${latestPrice.toFixed(6)} | Entry $${pos.entryPrice.toFixed(6)} | PnL: ${pnlPercent.toFixed(2)}% ($${updated.pnlUsd.toFixed(2)})`,
    );

    // Check Take-Profit & Stop-Loss thresholds
    const isStopLossHit = latestPrice <= pos.stopLoss;
    const isTakeProfitHit = latestPrice >= pos.takeProfit;

    if (isStopLossHit || isTakeProfitHit) {
      const reason = isStopLossHit ? 'STOP_LOSS' : 'TAKE_PROFIT';
      const indicator = isStopLossHit ? '🚨 STOP LOSS HIT' : '🎯 TAKE PROFIT HIT';
      console.log(
        `[Position Manager] ${indicator} for ${pos.tokenSymbol}. Initiating exit swap!`,
      );

      const isDryExit = !isLive || !hasKeypair || pos.isDryRun;
      let exitSignature = 'dry-run';

      if (!isDryExit) {
        try {
          const result = await sellTokenForSol(pos.tokenAddress, pos.tokenAmount, slippageBps);
          exitSignature = result.signature;
          console.log(`[Position Manager] On-chain exit successful. Sig: ${exitSignature}`);
        } catch (err) {
          console.error(`[Position Manager] Failed to execute on-chain exit for ${pos.tokenSymbol}:`, err);
          continue; // Skip DB closing so we can retry on next cycle
        }
      } else {
        console.log(`[Position Manager] [Dry-Run] Simulating exit for ${pos.tokenSymbol} at $${latestPrice}`);
      }

      // Close position in persistent store
      const closed = await closePosition(pos.id, latestPrice, exitSignature, reason);
      if (closed) {
        console.log(
          `[Position Manager] Closed ${pos.tokenSymbol} position. Realised PnL: $${closed.realisedPnlUsd.toFixed(2)}`,
        );

        // Update pattern memory Neural EMA Weights based on win/loss outcome
        if (pos.signalBreakdown) {
          const isWin = closed.realisedPnlUsd > 0;
          recordOutcome(pos.signalBreakdown, isWin);
          console.log(
            `[Pattern Memory] Weight updated. Outcome: ${isWin ? 'WIN 🟢' : 'LOSS 🔴'}. Current neural weights adjusted.`,
          );
        }
      }
    }
  }
}

async function scanAndTrade() {
  const maxPositions = parseInt(process.env.MAX_OPEN_POSITIONS ?? '5', 10);
  const currentOpenCount = await getOpenCount();
  if (currentOpenCount >= maxPositions) {
    console.log(`[Scan & Trade] Max positions (${maxPositions}) reached. Skipping scan.`);
    return;
  }

  const minScore = parseFloat(process.env.MIN_COMPOSITE_SCORE ?? '0.65');
  const minMcap = parseInt(process.env.MIN_MARKET_CAP ?? '25000', 10);
  const maxMcap = parseInt(process.env.MAX_MARKET_CAP ?? '1000000000', 10);
  const tradeSizeSol = parseFloat(process.env.POSITION_SIZE_SOL ?? '0.1'); // Default size 0.1 SOL

  console.log('[Scan & Trade] Scanning top boosted Solana tokens on DexScreener...');

  try {
    // 1. Get top boosted Solana tokens
    const boostRes = await fetch('https://api.dexscreener.com/token-boosts/top/v1', {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!boostRes.ok) throw new Error(`Token boosts API returned status ${boostRes.status}`);

    const boosts = (await boostRes.json()) as DexBoost[];
    const solanaBoosts = boosts.filter((b) => b.chainId === 'solana').slice(0, 15);
    if (solanaBoosts.length === 0) {
      console.log('[Scan & Trade] No active Solana token boosts found.');
      return;
    }

    const addresses = solanaBoosts.map((b) => b.tokenAddress).join(',');

    // 2. Fetch pair details
    const detailRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${addresses}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!detailRes.ok) throw new Error(`Token details API returned status ${detailRes.status}`);

    const { pairs } = (await detailRes.json()) as { pairs: DexPair[] };
    const solPairs = (pairs ?? []).filter((p) => p.chainId === 'solana' && (p.liquidity?.usd ?? 0) > 5000);

    // 3. Score candidates with learned pattern-memory weights
    const seen = new Set<string>();
    const candidates = solPairs
      .filter((p) => {
        const mcap = p.marketCap ?? p.fdv ?? 0;
        const addr = p.baseToken.address;
        if (mcap > 0 && (mcap < minMcap || mcap > maxMcap)) return false;
        if (seen.has(addr)) return false;
        seen.add(addr);
        return true;
      })
      .map((p) => {
        const breakdown = buildBreakdown(p);
        const compositeScore = applyWeights(breakdown);
        return {
          tokenAddress: p.baseToken.address,
          tokenSymbol: p.baseToken.symbol.toUpperCase(),
          tokenName: p.baseToken.name,
          currentPrice: parseFloat(p.priceUsd ?? '0'),
          marketCap: p.marketCap ?? p.fdv ?? 0,
          volume24hUsd: p.volume?.h24 ?? 0,
          liquidityUsd: p.liquidity?.usd ?? 0,
          compositeScore: parseFloat(compositeScore.toFixed(4)),
          breakdown,
          readyToTrade: compositeScore >= minScore,
        };
      })
      .sort((a, b) => b.compositeScore - a.compositeScore);

    console.log(`[Scan & Trade] Scanned ${candidates.length} unique candidates. Filtered to trade-ready...`);

    const openPos = await getOpenPositions();
    const openAddresses = new Set(openPos.map((p) => p.tokenAddress));

    const tradeReady = candidates.filter((c) => c.readyToTrade && !openAddresses.has(c.tokenAddress));
    console.log(`[Scan & Trade] Found ${tradeReady.length} qualified opportunities (not currently open).`);

    if (tradeReady.length === 0) return;

    // Pick the top qualified candidate
    const candidate = tradeReady[0];
    console.log(
      `[Scan & Trade] Target Selected: ${candidate.tokenSymbol} (${candidate.tokenName}) | Score: ${candidate.compositeScore} | Price: $${candidate.currentPrice}`,
    );

    // 4. Pre-trade security audit (Rugcheck / heuristics)
    console.log(`[Scan & Trade] Running security audit for ${candidate.tokenSymbol}...`);
    const audit = await auditToken(candidate.tokenAddress);
    if (!audit.safe) {
      console.log(`[Scan & Trade] 🚨 Trade BLOCKED by security audit:`, audit.reasons);
      return;
    }
    console.log(`[Scan & Trade] Security audit passed successfully!`);

    // 5. SEC compliance checks
    console.log(`[Scan & Trade] Enforcing SEC regulatory compliance checks...`);
    const closedPos = await getClosedPositions();
    const recentTrades: TradeRecord[] = [
      ...openPos.map((p) => ({ tokenAddress: p.tokenAddress, side: 'buy' as const, timestamp: p.openedAt })),
      ...closedPos.map((p) => ({ tokenAddress: p.tokenAddress, side: 'buy' as const, timestamp: p.openedAt })),
      ...closedPos
        .filter((p) => p.closedAt != null)
        .map((p) => ({ tokenAddress: p.tokenAddress, side: 'sell' as const, timestamp: p.closedAt })),
    ];

    const defaultSolPrice = parseFloat(process.env.SEC_DEFAULT_SOL_PRICE_USD ?? '180');
    const amountUsd = tradeSizeSol * defaultSolPrice;

    const secCompliance = runSecComplianceChecks({
      tokenAddress: candidate.tokenAddress,
      amountUsd,
      tokenVolume24hUsd: candidate.volume24hUsd,
      tokenLiquidityUsd: candidate.liquidityUsd,
      recentTrades,
    });

    if (!secCompliance.compliant) {
      console.log(`[Scan & Trade] 🚨 Trade BLOCKED by SEC Compliance Check:`, secCompliance.violations);
      return;
    }
    console.log(`[Scan & Trade] SEC compliance gate passed. Warnings:`, secCompliance.warnings);

    // 6. Sizing stop-loss and take-profit
    const stopLossPct = parseFloat(process.env.STOP_LOSS_PERCENTAGE ?? '10') / 100;
    const takeProfitPct = parseFloat(process.env.TAKE_PROFIT_PERCENTAGE ?? '25') / 100;
    const stopLoss = candidate.currentPrice * (1 - stopLossPct);
    const takeProfit = candidate.currentPrice * (1 + takeProfitPct);

    // 7. Swap execution (or Dry-run simulation)
    const isLive = process.env.ENABLE_LIVE_TRADING === 'true';
    const hasKeypair = loadTradingKeypair() !== null;
    const isDryRun = !isLive || !hasKeypair;

    let entrySignature = 'dry-run';
    let tokensReceived = 0;

    if (!isDryRun) {
      try {
        console.log(`[Scan & Trade] Sending Jupiter swap transaction for ${tradeSizeSol} SOL...`);
        const slippageBps = Math.round(parseFloat(process.env.SLIPPAGE_TOLERANCE ?? '0.05') * 10000);
        const result = await buyTokenWithSol(candidate.tokenAddress, tradeSizeSol, slippageBps);
        entrySignature = result.signature;
        tokensReceived = result.tokensReceived;
        console.log(`[Scan & Trade] On-chain trade executed successfully. Signature: ${entrySignature}`);
      } catch (err) {
        console.error(`[Scan & Trade] Jupiter swap failed:`, err);
        return;
      }
    } else {
      tokensReceived =
        candidate.currentPrice > 0 ? Math.round((tradeSizeSol * defaultSolPrice) / candidate.currentPrice) : 0;
      console.log(
        `[Scan & Trade] [Dry-Run] Simulating position entry: ${tokensReceived} ${candidate.tokenSymbol} units`,
      );
    }

    // 8. Open position in database store
    const position = await openPosition({
      tokenAddress: candidate.tokenAddress,
      tokenSymbol: candidate.tokenSymbol,
      tokenName: candidate.tokenName,
      direction: 'LONG',
      entryPrice: candidate.currentPrice,
      entryAmountSol: tradeSizeSol,
      tokenAmount: tokensReceived,
      openedAt: Date.now(),
      signalScore: candidate.compositeScore,
      stopLoss,
      takeProfit,
      entrySignature,
      currentPrice: candidate.currentPrice,
      signalBreakdown: candidate.breakdown,
      isDryRun,
    });

    console.log(
      `[Scan & Trade] Position Opened: ID: ${position.id} | Symbol: ${position.tokenSymbol} | StopLoss: $${stopLoss.toFixed(6)} | TakeProfit: $${takeProfit.toFixed(6)}`,
    );
  } catch (error) {
    console.error('[Scan & Trade] Failed scanning cycle:', error);
  }
}

// ── Emergency Kill-Switch ────────────────────────────────────────────────────
async function handleKillSwitch() {
  console.log('\n🚨 EMERGENCY KILL-SWITCH ACTIVATED! CLOSING ALL OPEN POSITIONS...');
  const openPos = await getOpenPositions();
  if (openPos.length === 0) {
    console.log('No open positions to close. Exiting.');
    process.exit(0);
  }

  const isLive = process.env.ENABLE_LIVE_TRADING === 'true';
  const hasKeypair = loadTradingKeypair() !== null;
  const slippageTolerance = parseFloat(process.env.SLIPPAGE_TOLERANCE ?? '0.05');
  const slippageBps = Math.round(slippageTolerance * 10000);

  for (const pos of openPos) {
    console.log(`Closing position ${pos.tokenSymbol} (${pos.id})...`);
    const isDryExit = !isLive || !hasKeypair || pos.isDryRun;
    let exitSignature = 'kill-switch-dry-run';

    if (!isDryExit) {
      try {
        const result = await sellTokenForSol(pos.tokenAddress, pos.tokenAmount, slippageBps);
        exitSignature = result.signature;
      } catch (err) {
        console.error(`Failed to close position ${pos.tokenSymbol} during kill-switch:`, err);
      }
    }

    await closePosition(pos.id, pos.currentPrice, exitSignature, 'KILL_SWITCH');
    console.log(`Position ${pos.tokenSymbol} closed.`);
  }

  console.log('All positions closed. Exiting.');
  process.exit(0);
}

// ── Diagnostics Display ───────────────────────────────────────────────────────
function displayWeightsDiagnostics() {
  console.log('\n========================================================================');
  console.log('📊 Neural EMA Signal Weights & Win-Rate Diagnostics');
  console.log('========================================================================');
  const stats = getSignalStats();
  for (const stat of stats) {
    const wrText = stat.winRate !== null ? `${(stat.winRate * 100).toFixed(1)}%` : 'N/A';
    console.log(
      `  • ${stat.signal.padEnd(16)} | Weight: ${(stat.weight * 100).toFixed(2).padStart(6)}% | Win Rate: ${wrText.padStart(6)} (Trades: ${stat.trials})`,
    );
  }
  console.log('========================================================================');
}

// ── Entry Point ───────────────────────────────────────────────────────────────
async function main() {
  loadEnv();

  console.log('========================================================================');
  console.log('⚡ CLETUS MASTER AUTONOMOUS TRADER - INTEGRATED CLI DAEMON ⚡');
  console.log('========================================================================');

  const keypair = loadTradingKeypair();
  const isLive = process.env.ENABLE_LIVE_TRADING === 'true';
  const hasKeypair = keypair !== null;
  const isDryRun = !isLive || !hasKeypair;

  console.log(`Live Trading Enabled : ${isLive}`);
  console.log(`Trading Wallet Key   : ${hasKeypair ? 'CONFIGURED (PublicKey: ' + keypair.publicKey.toBase58() + ')' : 'NOT CONFIGURED'}`);
  console.log(`Execution Mode       : ${isDryRun ? 'SIMULATION / DRY-RUN' : 'LIVE ON-CHAIN TRADING'}`);
  console.log(`MAX Open Positions   : ${process.env.MAX_OPEN_POSITIONS ?? '5'}`);
  console.log(`Min Signal Score     : ${process.env.MIN_COMPOSITE_SCORE ?? '0.65'}`);
  console.log('========================================================================');

  displayWeightsDiagnostics();

  // Daemon loops
  const INTERVAL_MS = 30000;
  console.log(`\nDaemon started. Executing scanning and position checks every ${INTERVAL_MS / 1000} seconds.`);
  console.log('Press Ctrl+C to terminate gracefully.');

  let cycleCount = 0;
  async function runCycle() {
    cycleCount++;
    console.log(`\n--- Loop Cycle #${cycleCount} [${new Date().toLocaleTimeString()}] ---`);
    try {
      // 1. Monitor and close target positions (Take Profit / Stop Loss)
      await managePositions();

      // 2. Scan and enter high-conviction positions
      await scanAndTrade();
      
      // Periodically print diagnostics
      if (cycleCount % 10 === 0) {
        displayWeightsDiagnostics();
      }
    } catch (err) {
      console.error('[Daemon Error] Unexpected issue in runner cycle:', err);
    }
  }

  // Handle immediate execution
  await runCycle();

  const intervalId = setInterval(runCycle, INTERVAL_MS);

  // Handle Graceful Termination Signals
  process.on('SIGINT', async () => {
    console.log('\n[Shutdown] Terminating runner gracefully...');
    clearInterval(intervalId);
    displayWeightsDiagnostics();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n[Shutdown] Received SIGTERM. Terminating runner gracefully...');
    clearInterval(intervalId);
    process.exit(0);
  });

  // Handle Emergency Kill Switch
  process.on('SIGUSR2', async () => {
    await handleKillSwitch();
  });
}

main().catch((err) => {
  console.error('[Fatal Error] Daemon crashed on startup:', err);
  process.exit(1);
});
