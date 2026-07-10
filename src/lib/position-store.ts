/**
 * In-memory live position store.
 *
 * Positions survive for the lifetime of the Node.js process. In a serverless
 * deployment (e.g. Vercel) this resets on cold-starts — swap this module for a
 * database-backed implementation once you have PostgreSQL or Vercel KV set up.
 *
 * ⚠️  DATA LOSS WARNING: Do NOT set ENABLE_LIVE_TRADING=true in a serverless
 * environment without first replacing this store with a persistent database.
 * A cold-start will clear all open position records, which means the system
 * will have no knowledge of positions it has opened on-chain and will not be
 * able to manage them (stop-loss, take-profit, or kill-switch).
 *
 * All functions are synchronous so they can be called from any async context.
 */

import type { SignalBreakdown } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LivePosition {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  /** Buy-only for now; short-selling micro-caps is not safe */
  direction: 'LONG';
  /** Price in USD at entry */
  entryPrice: number;
  /** SOL spent on entry */
  entryAmountSol: number;
  /** Token units received */
  tokenAmount: number;
  /** Timestamp (ms) when position was opened */
  openedAt: number;
  /** Composite signal score that triggered the trade (0–1) */
  signalScore: number;
  /** Stop-loss price (entry * (1 - stopLossPct)) */
  stopLoss: number;
  /** Take-profit price (entry * (1 + takeProfitPct)) */
  takeProfit: number;
  /** Solana transaction signature for the entry */
  entrySignature: string;
  /** Most-recently observed price in USD */
  currentPrice: number;
  /** Current unrealised PnL in USD */
  pnlUsd: number;
  /** Signal breakdown that triggered the trade */
  signalBreakdown?: SignalBreakdown;
  /** True when the trade was simulated (not sent to chain) */
  isDryRun: boolean;
}

export interface ClosedPosition extends LivePosition {
  closedAt: number;
  exitPrice: number;
  exitSignature: string;
  realisedPnlUsd: number;
  closeReason: 'MANUAL' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'KILL_SWITCH';
}

// ── In-memory stores ──────────────────────────────────────────────────────────

const openPositions = new Map<string, LivePosition>();
const closedPositions: ClosedPosition[] = [];

// ── ID generator ──────────────────────────────────────────────────────────────

let _idCounter = 0;
function generateId(): string {
  return `pos_${Date.now()}_${(_idCounter++).toString(36)}`;
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Add a newly-opened position. Returns the assigned ID. */
export function openPosition(
  params: Omit<LivePosition, 'id' | 'pnlUsd'>,
): LivePosition {
  const id = generateId();
  const position: LivePosition = {
    ...params,
    id,
    pnlUsd: 0,
  };
  openPositions.set(id, position);
  return position;
}

/** Update the current market price and recalculate unrealised PnL. */
export function updatePositionPrice(id: string, currentPrice: number): LivePosition | null {
  const pos = openPositions.get(id);
  if (!pos) return null;

  const pnlUsd = (currentPrice - pos.entryPrice) * pos.tokenAmount;
  const updated: LivePosition = { ...pos, currentPrice, pnlUsd };
  openPositions.set(id, updated);
  return updated;
}

/** Close a position and move it to the closed history. */
export function closePosition(
  id: string,
  exitPrice: number,
  exitSignature: string,
  reason: ClosedPosition['closeReason'],
): ClosedPosition | null {
  const pos = openPositions.get(id);
  if (!pos) return null;

  const realisedPnlUsd = (exitPrice - pos.entryPrice) * pos.tokenAmount;
  const closed: ClosedPosition = {
    ...pos,
    closedAt: Date.now(),
    exitPrice,
    exitSignature,
    realisedPnlUsd,
    closeReason: reason,
  };
  openPositions.delete(id);
  closedPositions.unshift(closed); // Most recent first
  return closed;
}

/** Get a single open position by ID. */
export function getPosition(id: string): LivePosition | undefined {
  return openPositions.get(id);
}

/** Get all currently open positions. */
export function getOpenPositions(): LivePosition[] {
  return Array.from(openPositions.values()).sort((a, b) => b.openedAt - a.openedAt);
}

/** Get closed position history (most recent first, capped at 100). */
export function getClosedPositions(): ClosedPosition[] {
  return closedPositions.slice(0, 100);
}

/** Get all open position IDs. */
export function getOpenPositionIds(): string[] {
  return Array.from(openPositions.keys());
}

/** How many positions are currently open. */
export function getOpenCount(): number {
  return openPositions.size;
}

/** Aggregate stats across closed positions. */
export function getStats() {
  const closed = closedPositions;
  const wins = closed.filter((p) => p.realisedPnlUsd > 0);
  const losses = closed.filter((p) => p.realisedPnlUsd <= 0);
  const totalPnl = closed.reduce((sum, p) => sum + p.realisedPnlUsd, 0);
  const winRate = closed.length > 0 ? wins.length / closed.length : 0;
  const bestTrade = wins.length > 0 ? Math.max(...wins.map((p) => p.realisedPnlUsd)) : 0;
  const worstTrade = losses.length > 0 ? Math.min(...losses.map((p) => p.realisedPnlUsd)) : 0;

  return {
    totalTrades: closed.length,
    openTrades: openPositions.size,
    winRate,
    totalPnlUsd: totalPnl,
    bestTrade,
    worstTrade,
  };
}
