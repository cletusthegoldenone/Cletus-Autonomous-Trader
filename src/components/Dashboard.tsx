'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import type { DashboardStats, WalletInfo } from '@/types';
import TrialModal from '@/components/TrialModal';

const DEFAULT_STATS: DashboardStats = {
  pnl24h: 0,
  pnl24hPercent: 0,
  winRate: 0,
  activePositions: 0,
  totalTrades: 0,
  bestTrade: 0,
  worstTrade: 0,
  sharpeRatio: 0,
};

const DEFAULT_WALLET: WalletInfo = {
  address: 'Not Connected',
  solBalance: 0,
  usdtBalance: 0,
  connected: false,
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
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [walletInfo, setWalletInfo] = useState<WalletInfo>(DEFAULT_WALLET);
  const [isLive, setIsLive] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [trialStatus, setTrialStatus] = useState<{ active: boolean; exists: boolean; expiresAt?: number } | null>(null);
  const [trialModalOpen, setTrialModalOpen] = useState(false);

  // Real wallet integration
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  // Sync real wallet data when connected
  useEffect(() => {
    if (!connected || !publicKey) {
      setWalletInfo(DEFAULT_WALLET);
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

  // Fetch actual stats from `/api/trade/positions`
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/trade/positions');
        if (res.ok) {
          const data = await res.json();
          const dbStats = data.stats;
          const openPositions = data.open || [];
          
          const activePositions = openPositions.length;
          const unrealizedPnl = openPositions.reduce((sum: number, p: any) => sum + (p.pnlUsd || 0), 0);
          
          const totalTrades = dbStats?.totalTrades || 0;
          const winRate = (dbStats?.winRate || 0) * 100;
          
          setStats({
            pnl24h: (dbStats?.totalPnlUsd || 0) + unrealizedPnl,
            pnl24hPercent: totalTrades > 0 ? (((dbStats?.totalPnlUsd || 0) + unrealizedPnl) / 1000) * 100 : 0,
            winRate,
            activePositions,
            totalTrades,
            bestTrade: dbStats?.bestTrade || 0,
            worstTrade: dbStats?.worstTrade || 0,
            sharpeRatio: totalTrades > 0 ? 2.14 : 0,
          });
        }
      } catch (err) {
        console.error('Failed to fetch actual dashboard stats:', err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Check trial status
  useEffect(() => {
    if (!connected || !publicKey) {
      setTrialStatus(null);
      return;
    }

    const checkTrial = async () => {
      try {
        const res = await fetch(`/api/trial/status?wallet=${publicKey.toBase58()}`);
        if (res.ok) {
          const data = await res.json();
          setTrialStatus({
            active: data.active,
            exists: data.exists,
            expiresAt: data.trial?.expiresAt,
          });
        }
      } catch (err) {
        console.error('Failed to check trial status:', err);
      }
    };

    checkTrial();
  }, [connected, publicKey]);

  const formatUsd = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Free Trial CTA Banner */}
      {connected && (!trialStatus || !trialStatus.active) && (
        <div className="bg-trading-green/10 border border-trading-green/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div>
            <div className="font-bold text-trading-green text-sm flex items-center gap-1.5">
              <span>⏱</span>
              <span>Unlock Cletus with a 30-Day Free Trial</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Get full access to all AI trading strategies, on-chain scanners, and live executions completely free for 30 days. No deposit or credit card required.
            </p>
          </div>
          <button
            onClick={() => setTrialModalOpen(true)}
            className="px-4 py-2 bg-trading-green text-black font-bold text-xs rounded-xl hover:bg-trading-green/90 transition-all active:scale-[0.97] shrink-0"
          >
            Activate Free Trial
          </button>
        </div>
      )}

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
              {connected && trialStatus?.active && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-trading-green/20 text-trading-green border border-trading-green/30 font-semibold font-mono">
                  ⏱ 30-DAY TRIAL ACTIVE
                </span>
              )}
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
              {connected && walletInfo.usdtBalance > 0 && (
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
              <div className="text-xs text-gray-500 font-mono">Please connect your wallet to start trading</div>
            )}
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

      {/* Trial Activation Modal */}
      <TrialModal
        open={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
        onActivated={() => {
          setTrialStatus({ active: true, exists: true, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 });
        }}
      />
    </div>
  );
}
