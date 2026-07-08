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

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradeSignal {
  id: number;
  token: string;
  marketCap: number;
  volume24h: number;
  compositeScore: number;
  signals: {
    volumeSpike: number;
    momentum: number;
    breakout: number;
    velocitySurge: number;
    microCapHeat: number;
    nanoCapSpike: number;
    liquidityBuild: number;
    volMcapRatio: number;
  };
}

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
