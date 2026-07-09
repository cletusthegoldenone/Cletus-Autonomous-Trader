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

export type StakingTier =
  | 'Starter'
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Founder';

export interface TierInfo {
  name: StakingTier;
  minStake: number;
  apy: number;
  profitShare: number;
  color: string;
  icon: string;
}

export interface StakingPosition {
  staked: number;
  tier: StakingTier;
  stakedAt: number;
  pendingRewards: number;
  pendingSolRewards: number;
  totalEarned: number;
  profitShareEarned: number;
}

export interface DistributionRecord {
  month: string;
  solRewards: number;
  profitShare: number;
  total: number;
  claimed: boolean;
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
