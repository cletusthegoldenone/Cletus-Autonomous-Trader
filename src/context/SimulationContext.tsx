'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import type { TradingConfig, SimulatedPosition, AggressionLevel } from '@/types';

// ── Aggression presets ────────────────────────────────────────────────────────

export const AGGRESSION_PRESETS: Record<
  AggressionLevel,
  {
    positionSizePercent: number;
    signalThreshold: number;
    perTradeSL: number;
    perTradeTP: number;
    label: string;
    color: string;
    bgColor: string;
    description: string;
  }
> = {
  CONSERVATIVE: {
    positionSizePercent: 1,
    signalThreshold: 0.78,
    perTradeSL: 5,
    perTradeTP: 10,
    label: 'Conservative',
    color: 'text-trading-blue',
    bgColor: 'bg-trading-blue/20 border-trading-blue/40',
    description: '1% size · 5% SL · 10% TP · high threshold',
  },
  MODERATE: {
    positionSizePercent: 3,
    signalThreshold: 0.68,
    perTradeSL: 8,
    perTradeTP: 20,
    label: 'Moderate',
    color: 'text-trading-green',
    bgColor: 'bg-trading-green/20 border-trading-green/40',
    description: '3% size · 8% SL · 20% TP · balanced',
  },
  AGGRESSIVE: {
    positionSizePercent: 7,
    signalThreshold: 0.62,
    perTradeSL: 12,
    perTradeTP: 35,
    label: 'Aggressive',
    color: 'text-trading-yellow',
    bgColor: 'bg-trading-yellow/20 border-trading-yellow/40',
    description: '7% size · 12% SL · 35% TP · wide stops',
  },
  MAX_RISK: {
    positionSizePercent: 15,
    signalThreshold: 0.56,
    perTradeSL: 20,
    perTradeTP: 60,
    label: 'Max Risk',
    color: 'text-trading-red',
    bgColor: 'bg-trading-red/20 border-trading-red/40',
    description: '15% size · 20% SL · 60% TP · degen mode',
  },
};

// ── Default config ────────────────────────────────────────────────────────────

export const DEFAULT_CONFIG: TradingConfig = {
  startTime: '09:00',
  endTime: '17:00',
  activeDays: [true, true, true, true, true, false, false], // Mon–Fri
  aggression: 'MODERATE',
  positionSizePercent: 3,
  signalThreshold: 0.68,
  perTradeSL: 8,
  perTradeTP: 20,
  dailyProfitTarget: 0,
  dailyMaxLoss: 0,
  maxPositions: 5,
  initialCapital: 1000,
};

// ── Simulation state ──────────────────────────────────────────────────────────

export interface SimulationStats {
  /** Cash not currently in open positions */
  availableBalance: number;
  initialCapital: number;
  openPositions: SimulatedPosition[];
  /** Up to 100 most-recent closed positions, newest first */
  closedPositions: SimulatedPosition[];
  /** Realised PnL from closed trades today */
  dailyRealizedPnl: number;
  /** All-time realised PnL from closed trades */
  allTimeRealizedPnl: number;
  winCount: number;
  lossCount: number;
  isRunning: boolean;
  isWithinTradingHours: boolean;
  isPaused: boolean;
  pauseReason: string;
}

// ── Context shape ─────────────────────────────────────────────────────────────

interface SimulationContextValue {
  config: TradingConfig;
  stats: SimulationStats;
  /** Total portfolio value (cash + open positions mark-to-market) */
  portfolioValue: number;
  /** Total unrealised PnL across open positions */
  unrealizedPnl: number;
  updateConfig: (updates: Partial<TradingConfig>) => void;
  applyAggressionPreset: (level: AggressionLevel) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  closePosition: (id: string) => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

// ── Helpers ───────────────────────────────────────────────────────────────────

const SIM_TOKENS = [
  { name: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
  { name: 'WIF', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
  { name: 'JTO', address: 'jtojtomepa8bdoa1lvfuv42y5k5yblxeqiqv9dgb1b' },
  { name: 'PYTH', address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3' },
  { name: 'RAY', address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R' },
  { name: 'ORCA', address: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE' },
  { name: 'MNGO', address: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac' },
  { name: 'STEP', address: 'StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT' },
];

function isWithinTradingHours(config: TradingConfig): boolean {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun … 6=Sat (JS convention)
  const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // convert to Mon=0 … Sun=6 for activeDays array
  if (!config.activeDays[dayIndex]) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = config.startTime.split(':').map(Number);
  const [eh, em] = config.endTime.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;

  if (startMin <= endMin) return currentMinutes >= startMin && currentMinutes < endMin;
  // Spans midnight
  return currentMinutes >= startMin || currentMinutes < endMin;
}

function makeInitialStats(config: TradingConfig): SimulationStats {
  return {
    availableBalance: config.initialCapital,
    initialCapital: config.initialCapital,
    openPositions: [],
    closedPositions: [],
    dailyRealizedPnl: 0,
    allTimeRealizedPnl: 0,
    winCount: 0,
    lossCount: 0,
    isRunning: false,
    isWithinTradingHours: false,
    isPaused: false,
    pauseReason: '',
  };
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<TradingConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    try {
      const saved = localStorage.getItem('cletus_trading_config');
      if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch {
      // ignore malformed saved config
    }
    return DEFAULT_CONFIG;
  });

  const [stats, setStats] = useState<SimulationStats>(() => makeInitialStats(DEFAULT_CONFIG));

  // Refs so the interval callback always reads current values without re-subscribing
  const configRef = useRef(config);
  const statsRef = useRef(stats);
  useEffect(() => { configRef.current = config; }, [config]);
  useEffect(() => { statsRef.current = stats; }, [stats]);

  // Derived values
  const unrealizedPnl = stats.openPositions.reduce((sum, p) => sum + p.pnlUsd, 0);
  const portfolioValue =
    stats.availableBalance +
    stats.openPositions.reduce((sum, p) => sum + p.positionSizeUsd + p.pnlUsd, 0);

  // ── Public actions ──────────────────────────────────────────────────────────

  const updateConfig = useCallback((updates: Partial<TradingConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      try { localStorage.setItem('cletus_trading_config', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const applyAggressionPreset = useCallback(
    (level: AggressionLevel) => {
      const p = AGGRESSION_PRESETS[level];
      updateConfig({
        aggression: level,
        positionSizePercent: p.positionSizePercent,
        signalThreshold: p.signalThreshold,
        perTradeSL: p.perTradeSL,
        perTradeTP: p.perTradeTP,
      });
    },
    [updateConfig],
  );

  const startSimulation = useCallback(() => {
    setStats((prev) => ({ ...prev, isRunning: true, isPaused: false, pauseReason: '' }));
  }, []);

  const pauseSimulation = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: true,
      pauseReason: 'Manually paused',
    }));
  }, []);

  const resetSimulation = useCallback(() => {
    setStats(makeInitialStats(configRef.current));
  }, []);

  const closePosition = useCallback((id: string) => {
    setStats((prev) => {
      const pos = prev.openPositions.find((p) => p.id === id);
      if (!pos) return prev;

      const pnl = pos.pnlUsd;
      const closedPos: SimulatedPosition = {
        ...pos,
        status: 'CLOSED_MANUAL',
        closedAt: Date.now(),
        closingPrice: pos.currentPrice,
        closingPnlUsd: pnl,
      };

      const newDailyPnl = prev.dailyRealizedPnl + pnl;
      const newAllTimePnl = prev.allTimeRealizedPnl + pnl;

      return {
        ...prev,
        availableBalance: prev.availableBalance + pos.positionSizeUsd + pnl,
        openPositions: prev.openPositions.filter((p) => p.id !== id),
        closedPositions: [closedPos, ...prev.closedPositions].slice(0, 100),
        dailyRealizedPnl: newDailyPnl,
        allTimeRealizedPnl: newAllTimePnl,
        winCount: pnl > 0 ? prev.winCount + 1 : prev.winCount,
        lossCount: pnl <= 0 ? prev.lossCount + 1 : prev.lossCount,
      };
    });
  }, []);

  // ── Simulation loop ─────────────────────────────────────────────────────────

  useEffect(() => {
    // Price update every 3s
    const priceInterval = setInterval(() => {
      const s = statsRef.current;
      if (!s.isRunning || s.openPositions.length === 0) return;

      setStats((prev) => {
        if (!prev.isRunning) return prev;

        const stillOpen: SimulatedPosition[] = [];
        const newlyClosed: SimulatedPosition[] = [];
        let realizedPnlDelta = 0;
        let newWins = 0;
        let newLosses = 0;
        let releasedCash = 0;

        for (const pos of prev.openPositions) {
          // Realistic random walk: ±0.3%–2.5% per tick, slight upward bias
          const volatility = 0.003 + Math.random() * 0.022;
          const direction = Math.random() < 0.52 ? 1 : -1;
          const newPrice = Math.max(pos.currentPrice * (1 + volatility * direction), 0.000001);

          const pnlMult =
            pos.direction === 'LONG'
              ? (newPrice - pos.entryPrice) / pos.entryPrice
              : (pos.entryPrice - newPrice) / pos.entryPrice;

          const updatedPos: SimulatedPosition = {
            ...pos,
            currentPrice: newPrice,
            pnlUsd: pos.positionSizeUsd * pnlMult,
            pnlPercent: pnlMult * 100,
          };

          const hitTP =
            pos.direction === 'LONG'
              ? newPrice >= pos.takeProfit
              : newPrice <= pos.takeProfit;
          const hitSL =
            pos.direction === 'LONG'
              ? newPrice <= pos.stopLoss
              : newPrice >= pos.stopLoss;

          if (hitTP || hitSL) {
            const closingPrice = hitTP ? pos.takeProfit : pos.stopLoss;
            const closingMult =
              pos.direction === 'LONG'
                ? (closingPrice - pos.entryPrice) / pos.entryPrice
                : (pos.entryPrice - closingPrice) / pos.entryPrice;
            const closingPnl = pos.positionSizeUsd * closingMult;

            newlyClosed.push({
              ...updatedPos,
              currentPrice: closingPrice,
              pnlUsd: closingPnl,
              pnlPercent: closingMult * 100,
              status: hitTP ? 'CLOSED_TP' : 'CLOSED_SL',
              closedAt: Date.now(),
              closingPrice,
              closingPnlUsd: closingPnl,
            });
            realizedPnlDelta += closingPnl;
            releasedCash += pos.positionSizeUsd + closingPnl;
            if (closingPnl > 0) newWins++; else newLosses++;
          } else {
            stillOpen.push(updatedPos);
          }
        }

        const newDailyPnl = prev.dailyRealizedPnl + realizedPnlDelta;
        const newAllTimePnl = prev.allTimeRealizedPnl + realizedPnlDelta;
        const cfg = configRef.current;

        // Check daily PnL limits
        let isRunning: boolean = prev.isRunning;
        let isPaused: boolean = prev.isPaused;
        let pauseReason: string = prev.pauseReason;

        if (cfg.dailyProfitTarget > 0 && newDailyPnl >= cfg.dailyProfitTarget) {
          isRunning = false;
          isPaused = true;
          pauseReason = `🎯 Daily profit target of $${cfg.dailyProfitTarget.toFixed(0)} reached!`;
        } else if (cfg.dailyMaxLoss > 0 && newDailyPnl <= -cfg.dailyMaxLoss) {
          isRunning = false;
          isPaused = true;
          pauseReason = `🛑 Daily max loss of $${cfg.dailyMaxLoss.toFixed(0)} hit. Trading paused.`;
        }

        return {
          ...prev,
          availableBalance: prev.availableBalance + releasedCash,
          openPositions: stillOpen,
          closedPositions: [...newlyClosed, ...prev.closedPositions].slice(0, 100),
          dailyRealizedPnl: newDailyPnl,
          allTimeRealizedPnl: newAllTimePnl,
          winCount: prev.winCount + newWins,
          lossCount: prev.lossCount + newLosses,
          isRunning,
          isPaused,
          pauseReason,
        };
      });
    }, 3000);

    // New-trade check every 20s
    const tradeInterval = setInterval(() => {
      const s = statsRef.current;
      const cfg = configRef.current;

      if (!s.isRunning) return;

      const withinHours = isWithinTradingHours(cfg);

      setStats((prev) => ({ ...prev, isWithinTradingHours: withinHours }));

      if (!withinHours) return;
      if (s.openPositions.length >= cfg.maxPositions) return;

      // Random 45% chance of a new trade opportunity this cycle
      if (Math.random() > 0.45) return;

      // Generate a signal score and check threshold
      const signalScore = cfg.signalThreshold + Math.random() * (1 - cfg.signalThreshold);
      if (signalScore < cfg.signalThreshold) return;

      setStats((prev) => {
        if (!prev.isRunning) return prev;
        if (prev.openPositions.length >= cfg.maxPositions) return prev;

        // Pick a token not already in an open position
        const usedTokens = new Set(prev.openPositions.map((p) => p.tokenName));
        const available = SIM_TOKENS.filter((t) => !usedTokens.has(t.name));
        if (available.length === 0) return prev;

        const token = available[Math.floor(Math.random() * available.length)];
        const entryPrice = 0.00001 + Math.random() * 5;
        const direction: 'LONG' | 'SHORT' = Math.random() > 0.3 ? 'LONG' : 'SHORT';
        const slDist = entryPrice * (cfg.perTradeSL / 100);
        const tpDist = entryPrice * (cfg.perTradeTP / 100);
        const stopLoss = direction === 'LONG' ? entryPrice - slDist : entryPrice + slDist;
        const takeProfit = direction === 'LONG' ? entryPrice + tpDist : entryPrice - tpDist;
        const positionSizeUsd = prev.availableBalance * (cfg.positionSizePercent / 100);

        if (positionSizeUsd < 0.01 || prev.availableBalance < positionSizeUsd) return prev;

        const newPos: SimulatedPosition = {
          id: Math.random().toString(36).slice(2),
          tokenName: token.name,
          tokenAddress: token.address,
          direction,
          entryPrice,
          currentPrice: entryPrice,
          stopLoss,
          takeProfit,
          positionSizeUsd,
          quantity: positionSizeUsd / entryPrice,
          openedAt: Date.now(),
          pnlUsd: 0,
          pnlPercent: 0,
          status: 'OPEN',
          signalScore,
        };

        return {
          ...prev,
          availableBalance: prev.availableBalance - positionSizeUsd,
          openPositions: [...prev.openPositions, newPos],
          isWithinTradingHours: true,
        };
      });
    }, 20000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(tradeInterval);
    };
  }, []); // only run once; reads live values via refs

  return (
    <SimulationContext.Provider
      value={{
        config,
        stats,
        portfolioValue,
        unrealizedPnl,
        updateConfig,
        applyAggressionPreset,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        closePosition,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation(): SimulationContextValue {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used inside <SimulationProvider>');
  return ctx;
}
