// ============================================================
// Cletus Autonomous Trader - Type Definitions
// ============================================================

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradingSignal {
  id: string;
  tokenName: string;
  tokenAddress: string;
  marketCap: number;
  volume24h: number;
  compositeScore: number;
  priceChange24h: number;
  currentPrice: number;
  breakdown: SignalBreakdown;
  riskReward: number;
  stopLoss: number;
  takeProfit: number;
  direction: 'LONG' | 'SHORT';
  strength: 'WEAK' | 'MODERATE' | 'STRONG' | 'EXTREME';
  timestamp: number;
}

export interface SignalBreakdown {
  volumeSpike: number;
  momentum: number;
  breakout: number;
  rsiScore: number;
  macdCross: number;
  holderGrowth: number;
  liquidityScore: number;
  socialSentiment: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  citations?: string[];
}

export interface DashboardStats {
  pnl24h: number;
  pnl24hPercent: number;
  winRate: number;
  activePositions: number;
  totalTrades: number;
  bestTrade: number;
  worstTrade: number;
  sharpeRatio: number;
}

export interface WalletInfo {
  address: string;
  solBalance: number;
  usdtBalance: number;
  connected: boolean;
}

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

export interface TradeMarker {
  time: number;
  position: 'belowBar' | 'aboveBar';
  color: string;
  shape: 'arrowUp' | 'arrowDown';
  text: string;
}

// ── Simulation & Trading Config ───────────────────────────────────────────────

export type AggressionLevel = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' | 'MAX_RISK';

export interface TradingConfig {
  /** 24-hour time string "HH:MM" */
  startTime: string;
  /** 24-hour time string "HH:MM" */
  endTime: string;
  /** Mon=0 … Sun=6 */
  activeDays: boolean[];
  aggression: AggressionLevel;
  /** % of available balance allocated per trade */
  positionSizePercent: number;
  /** Min composite score (0–1) required to open a trade */
  signalThreshold: number;
  /** Per-trade stop loss in % of entry price */
  perTradeSL: number;
  /** Per-trade take profit in % of entry price */
  perTradeTP: number;
  /** Stop trading when daily profit hits this USD amount (0 = disabled) */
  dailyProfitTarget: number;
  /** Stop trading when daily loss hits this USD amount (0 = disabled) */
  dailyMaxLoss: number;
  /** Max number of concurrently open positions */
  maxPositions: number;
  /** Starting USD balance for the simulation */
  initialCapital: number;
}

export interface SimulatedPosition {
  id: string;
  tokenName: string;
  tokenAddress: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  stopLoss: number;
  takeProfit: number;
  /** USD reserved for this position at open */
  positionSizeUsd: number;
  /** Token quantity = positionSizeUsd / entryPrice */
  quantity: number;
  openedAt: number;
  pnlUsd: number;
  pnlPercent: number;
  status: 'OPEN' | 'CLOSED_TP' | 'CLOSED_SL' | 'CLOSED_MANUAL';
  closedAt?: number;
  closingPrice?: number;
  closingPnlUsd?: number;
  signalScore: number;
}
