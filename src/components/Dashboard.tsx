'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import type { DashboardStats, WalletInfo } from '@/types';
import { useSimulation, TRIAL_EXPIRED_ALERT_MSG, MIN_STARTER_TIER_STAKE, TRIAL_DURATION_DAYS } from '@/context/SimulationContext';

// Slight upward bias to simulate realistic trending PnL in demo mode
const UPWARD_BIAS_FACTOR = 0.48;

const MOCK_STATS: DashboardStats = {
  pnl24h: 3847.5,
  pnl24hPercent: 12.4,
  winRate: 73.2,
  activePositions: 4,
  totalTrades: 247,
  bestTrade: 2340.0,
  worstTrade: -420.0,
  sharpeRatio: 2.14,
};

const MOCK_WALLET: WalletInfo = {
  address: '9xQeKq...Mop7',
  solBalance: 42.7,
  usdtBalance: 18420.0,
  connected: true,
};

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
  neutral?: boolean;
  icon: string;
}

function StatCard({ label, value, sub, positive, neutral, icon }: StatCardProps) {
  const valueColor = neutral
    ? 'text-trading-blue'
    : positive
    ? 'text-trading-green'
    : 'text-trading-red';

  return (
    <div className="trading-card p-4 flex flex-col gap-2 hover:border-trading-border/80 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
          {label}
        </span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`text-2xl font-bold font-mono ${valueColor}`}>{value}</div>
      {sub && <div className="text-xs text-gray-500">{sub}</div>}
    </div>
  );
}

interface QuickActionProps {
  icon: string;
  label: string;
  description: string;
  color: string;
  onClick: () => void;
}

function QuickAction({ icon, label, description, color, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={`trading-card p-4 text-left hover:bg-trading-surface transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border ${color} group`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-sm group-hover:text-white transition-colors">
        {label}
      </div>
      <div className="text-xs text-gray-500 mt-1">{description}</div>
    </button>
  );
}

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const {
    trialStartDate,
    stakedAmount,
    trialDaysRemaining,
    isTrialActive,
    hasLiveAccess,
    resetTrial,
  } = useSimulation();

  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [walletInfo, setWalletInfo] = useState<WalletInfo>(MOCK_WALLET);
  const [isLive, setIsLive] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Auto-pause trading if access is lost
  useEffect(() => {
    if (!hasLiveAccess) {
      setIsLive(false);
    }
  }, [hasLiveAccess]);

  // Real wallet integration
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  // Sync real wallet data when connected
  useEffect(() => {
    if (!connected || !publicKey) {
      setWalletInfo(MOCK_WALLET);
      return;
    }

    const addr = publicKey.toBase58();
    setWalletInfo({
      address: `${addr.slice(0, 4)}…${addr.slice(-4)}`,
      solBalance: 0,
      usdtBalance: 0,
      connected: true,
    });

    // Fetch real SOL balance
    connection.getBalance(publicKey).then((lamports) => {
      setWalletInfo((prev) => ({
        ...prev,
        solBalance: lamports / LAMPORTS_PER_SOL,
      }));
    }).catch(() => {
      // keep zero balance on error
    });
  }, [connected, publicKey, connection]);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time PnL fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        pnl24h: prev.pnl24h + (Math.random() - UPWARD_BIAS_FACTOR) * 50,
        activePositions: Math.max(
          1,
          prev.activePositions + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)
        ),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatUsd = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header / Welcome */}
      <div className="trading-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-trading-green/5 via-transparent to-trading-blue/5 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-3 h-3 rounded-full bg-trading-green status-dot-live" />
              <span className="text-xs text-gray-400 font-mono uppercase tracking-widest">
                {isLive ? 'LIVE TRADING' : 'PAUSED'}
              </span>
              <span className="text-xs text-gray-600 font-mono">{currentTime} UTC</span>
            </div>
            <h1 className="text-3xl font-bold gradient-text-green">Cletus</h1>
            <p className="text-gray-400 text-sm mt-1">
              AI Autonomous Trader · Solana · v2.1.0
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-trading-green status-dot-live' : 'bg-gray-600'}`} />
              <span className="text-gray-300 font-mono text-xs">{walletInfo.address}</span>
              {connected && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-trading-green/20 text-trading-green border border-trading-green/30 font-semibold">
                  LIVE
                </span>
              )}
            </div>
            <div className="flex gap-3 text-xs font-mono">
              <span className="text-gray-400">
                <span className="text-white font-semibold">{walletInfo.solBalance.toFixed(connected ? 4 : 2)}</span> SOL
              </span>
              {!connected && (
                <span className="text-gray-400">
                  <span className="text-white font-semibold">
                    ${walletInfo.usdtBalance.toLocaleString()}
                  </span>{' '}
                  USDT
                </span>
              )}
            </div>
            {connected ? (
              <div className="text-xs text-trading-green/70 font-mono">Wallet connected · Simulation ready</div>
            ) : (
              <button
                onClick={() => {
                  if (!hasLiveAccess) {
                    alert(TRIAL_EXPIRED_ALERT_MSG);
                    onNavigate('staking');
                    return;
                  }
                  setIsLive((v) => !v);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isLive
                    ? 'bg-trading-red/20 text-trading-red border border-trading-red/40 hover:bg-trading-red/30'
                    : 'bg-trading-green/20 text-trading-green border border-trading-green/40 hover:bg-trading-green/30'
                }`}
              >
                {isLive ? '⏸ Pause Trading' : '▶ Resume Trading'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Access & Free Trial Management Panel */}
      <div className="trading-card p-5 relative overflow-hidden border border-trading-border/60 bg-trading-surface/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0 mt-1">
              {hasLiveAccess ? '🔓' : '🔒'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-base text-white">Live Trading Access Status</span>
                {isTrialActive ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-trading-green/20 text-trading-green border border-trading-green/30 animate-pulse">
                    FREE TRIAL ACTIVE
                  </span>
                ) : stakedAmount >= MIN_STARTER_TIER_STAKE ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-trading-purple/20 text-trading-purple border border-trading-purple/30">
                    STAKED ACCESS ACTIVE
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-trading-red/20 text-trading-red border border-trading-red/30">
                    TRIAL EXPIRED (LOCKED)
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-400 mt-1.5 max-w-2xl">
                {isTrialActive ? (
                  `You are in your ${TRIAL_DURATION_DAYS}-day free trial. All features, including autonomous live trading and premium on-chain signals, are fully unlocked. No Cletus token staking is required during your trial period.`
                ) : stakedAmount >= MIN_STARTER_TIER_STAKE ? (
                  `Your free trial has expired, but your live trading access remains active because you have staked ${stakedAmount.toLocaleString()} $CLETUS tokens. Thank you for supporting the Cletus ecosystem!`
                ) : (
                  `Your ${TRIAL_DURATION_DAYS}-day free trial has expired. To resume live trading and on-chain swaps, you must stake a minimum of ${MIN_STARTER_TIER_STAKE.toLocaleString()} $CLETUS (Starter Tier) in the Staking tab.`
                )}
              </p>

              {/* Progress bar / info */}
              <div className="mt-3 flex items-center gap-4 text-xs font-mono">
                {isTrialActive ? (
                  <div className="w-full max-w-xs space-y-1">
                    <div className="flex justify-between text-gray-500">
                      <span>Trial Time Remaining</span>
                      <span className="text-white font-bold">{trialDaysRemaining} days</span>
                    </div>
                    <div className="h-2 bg-trading-surface rounded-full overflow-hidden border border-trading-border">
                      <div 
                        className="h-full bg-trading-green rounded-full transition-all duration-500" 
                        style={{ width: `${(trialDaysRemaining / TRIAL_DURATION_DAYS) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    Staked: <span className="text-white font-bold">{stakedAmount.toLocaleString()} CLETUS</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions / Trial control (for reviewers/testers) */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 md:items-end">
            {!hasLiveAccess && (
              <button
                onClick={() => onNavigate('staking')}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-trading-green text-black hover:bg-trading-green/90 transition-all text-center w-full"
              >
                🥩 Go Stake CLETUS
              </button>
            )}
            
            {/* Testing control panel */}
            <div className="border border-trading-border/50 bg-trading-bg/60 rounded-lg p-2.5 space-y-1.5 w-full sm:w-auto min-w-[200px]">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold text-center">
                🧪 Developer Testing Panel
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => resetTrial(TRIAL_DURATION_DAYS)}
                  className="px-1 py-1 rounded bg-trading-surface border border-trading-border hover:border-trading-green/40 text-[9px] font-semibold text-gray-300"
                  title={`Reset trial to ${TRIAL_DURATION_DAYS} days`}
                >
                  {TRIAL_DURATION_DAYS}d Trial
                </button>
                <button
                  onClick={() => resetTrial(5)}
                  className="px-1 py-1 rounded bg-trading-surface border border-trading-border hover:border-trading-yellow/40 text-[9px] font-semibold text-gray-300"
                  title="Set trial to 5 days"
                >
                  5d Trial
                </button>
                <button
                  onClick={() => resetTrial(0)}
                  className="px-1 py-1 rounded bg-trading-surface border border-trading-border hover:border-trading-red/40 text-[9px] font-semibold text-trading-red"
                  title="Set trial to expired (0 days)"
                >
                  Expire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
          24h Performance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="24h PnL"
            value={formatUsd(stats.pnl24h)}
            sub={`${stats.pnl24h >= 0 ? '+' : ''}${stats.pnl24hPercent.toFixed(1)}%`}
            positive={stats.pnl24h >= 0}
            icon="💰"
          />
          <StatCard
            label="Win Rate"
            value={`${stats.winRate.toFixed(1)}%`}
            sub={`${stats.totalTrades} total trades`}
            positive={stats.winRate > 60}
            icon="🎯"
          />
          <StatCard
            label="Active Positions"
            value={stats.activePositions.toString()}
            sub="currently open"
            neutral
            icon="📊"
          />
          <StatCard
            label="Sharpe Ratio"
            value={stats.sharpeRatio.toFixed(2)}
            sub="risk-adjusted return"
            positive={stats.sharpeRatio > 1}
            icon="⚡"
          />
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Best Trade"
          value={formatUsd(stats.bestTrade)}
          positive
          icon="🚀"
        />
        <StatCard
          label="Worst Trade"
          value={formatUsd(stats.worstTrade)}
          positive={false}
          icon="📉"
        />
        <StatCard
          label="Total Trades"
          value={stats.totalTrades.toString()}
          sub="all time"
          neutral
          icon="🔢"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <QuickAction
            icon="📈"
            label="Start Trading"
            description="Launch AI trading engine"
            color="hover:border-trading-green/50"
            onClick={() => onNavigate('chart')}
          />
          <QuickAction
            icon="⚡"
            label="View Signals"
            description="Active trading opportunities"
            color="hover:border-trading-yellow/50"
            onClick={() => onNavigate('signals')}
          />
          <QuickAction
            icon="🤖"
            label="Ask Cletus"
            description="AI trading intelligence"
            color="hover:border-trading-blue/50"
            onClick={() => onNavigate('ai')}
          />
        </div>
      </div>

      {/* System Status */}
      <div className="trading-card p-4">
        <h2 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
          System Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Helius RPC', status: 'Operational', ok: true },
            { label: 'Gemini AI', status: 'Connected', ok: true },
            { label: 'Signal Engine', status: 'Active', ok: true },
            { label: 'Risk Manager', status: 'Monitoring', ok: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full status-dot-live ${
                  item.ok ? 'bg-trading-green' : 'bg-trading-red'
                }`}
              />
              <div>
                <div className="text-xs font-medium text-gray-300">{item.label}</div>
                <div
                  className={`text-xs ${item.ok ? 'text-trading-green' : 'text-trading-red'}`}
                >
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="trading-card p-3 border-trading-yellow/30">
        <p className="text-xs text-gray-500 leading-relaxed">
          ⚠️{' '}
          <span className="text-trading-yellow font-medium">Disclaimer:</span> Cletus is an AI
          trading system. Past performance does not guarantee future results. All trading
          involves significant risk. Never invest more than you can afford to lose. This is not
          financial advice.
        </p>
      </div>
    </div>
  );
}
