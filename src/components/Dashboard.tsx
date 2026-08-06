'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import type { DashboardStats, WalletInfo, SystemStatusService } from '@/types';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import { useSimulation, STAKING_REQUIRED_ALERT_MSG, MIN_STARTER_TIER_STAKE } from '@/context/SimulationContext';

// Reference base capital of $10,000 used to calculate a standardized 24h PnL performance percentage 
// when the actual total absolute pool/trading deposit size fluctuates or is not directly queried.
const REFERENCE_CAPITAL_USD = 10000;

const STATUS_LABELS: Record<string, string> = {
  operational: 'Operational',
  down: 'Down',
  unconfigured: 'Unconfigured',
};

const DISCONNECTED_WALLET: WalletInfo = {
  address: 'Not Connected',
  solBalance: 0,
  usdtBalance: 0,
  connected: false,
};

const INITIAL_STATS: DashboardStats = {
  pnl24h: 0,
  pnl24hPercent: 0,
  winRate: 0,
  activePositions: 0,
  totalTrades: 0,
  bestTrade: 0,
  worstTrade: 0,
  sharpeRatio: 0,
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
  trialActive: boolean | null;
  onOpenTrialModal: () => void;
}

export default function Dashboard({ onNavigate, trialActive, onOpenTrialModal }: DashboardProps) {
  const {
    stakedAmount,
    hasLiveAccess,
  } = useSimulation();

  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [walletInfo, setWalletInfo] = useState<WalletInfo>(DISCONNECTED_WALLET);
  const [isLive, setIsLive] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [systemServices, setSystemServices] = useState<SystemStatusService[]>([
    { label: 'Helius RPC', status: 'Connecting…', ok: false },
    { label: 'Gemini AI', status: 'Connecting…', ok: false },
    { label: 'Signal Engine', status: 'Connecting…', ok: false },
    { label: 'Risk Manager', status: 'Connecting…', ok: false },
    { label: 'Oracle VPS', status: 'Connecting…', ok: false },
  ]);

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
      setWalletInfo(DISCONNECTED_WALLET);
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

  // Fetch real system status and position stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch positions and stats
        const posRes = await fetch('/api/trade/positions');
        if (posRes.ok) {
          const posData = await posRes.json();
          if (posData.stats) {
            setStats({
              pnl24h: posData.stats.totalPnlUsd ?? 0,
              pnl24hPercent: ((posData.stats.totalPnlUsd ?? 0) / REFERENCE_CAPITAL_USD) * 100,
              winRate: (posData.stats.winRate ?? 0) * 100,
              activePositions: posData.stats.openTrades ?? 0,
              totalTrades: posData.stats.totalTrades ?? 0,
              bestTrade: posData.stats.bestTrade ?? 0,
              worstTrade: posData.stats.worstTrade ?? 0,
              sharpeRatio: posData.stats.sharpeRatio ?? 0,
            });
          }
        }

        // Fetch system services status
        const sysRes = await fetch('/api/system-status');
        if (sysRes.ok) {
          const sysData = await sysRes.json();
          if (sysData.services) {
            const mapped = sysData.services.map((s: SystemStatusService) => ({
              label: s.label,
              status: STATUS_LABELS[s.status] ?? s.status,
              ok: s.status === 'operational' || s.status === 'connected' || s.status === 'active' || s.status === 'monitoring',
            }));

            // Fallback default statuses for Signal Engine and Risk Manager if not explicitly in API response
            const hasSignalEngine = mapped.some((s: { label: string }) => s.label === 'Signal Engine');
            const hasRiskManager = mapped.some((s: { label: string }) => s.label === 'Risk Manager');

            const finalServices = [...mapped];
            if (!hasSignalEngine) {
              finalServices.push({ label: 'Signal Engine', status: 'Unknown', ok: false });
            }
            if (!hasRiskManager) {
              finalServices.push({ label: 'Risk Manager', status: 'Unknown', ok: false });
            }

            setSystemServices(finalServices);
          }
          if (sysData.config) {
            setIsLive(sysData.config.liveTrading);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatUsd = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Free Trial CTA Banner */}
      {connected && trialActive === false && (
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
            onClick={onOpenTrialModal}
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
              {connected && trialActive === true && (
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
            {connected && (
              <div className="flex gap-3 text-xs font-mono">
                <span className="text-gray-400">
                  <span className="text-white font-semibold">{walletInfo.solBalance.toFixed(4)}</span> SOL
                </span>
              </div>
            )}
            {connected ? (
              <div className="flex flex-col items-end gap-1">
                <div className="text-xs text-trading-green/70 font-mono mb-1">Wallet connected · Ready for live trading</div>
                <button
                  onClick={() => {
                    if (!hasLiveAccess) {
                      alert(STAKING_REQUIRED_ALERT_MSG);
                      onNavigate('staking');
                      return;
                    }
                    setIsLive((v) => !v);
                  }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold font-mono transition-all duration-200 ${
                    isLive
                      ? 'bg-trading-green/20 text-trading-green border border-trading-green/30'
                      : 'bg-trading-red/20 text-trading-red border border-trading-red/30'
                  }`}
                >
                  {isLive ? '● Trading Engine Active' : '○ Trading Engine Paused'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-start sm:items-end gap-1.5 mt-1">
                <span className="text-xs text-gray-500 font-mono">Connect wallet to begin trading:</span>
                <ConnectWalletButton />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Trading Access & Staking Status Panel */}
      <div className="trading-card p-5 relative overflow-hidden border border-trading-border/60 bg-trading-surface/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0 mt-1">
              {hasLiveAccess ? '🔓' : '🔒'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-base text-white">Live Trading Access Status</span>
                {hasLiveAccess ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-trading-purple/20 text-trading-purple border border-trading-purple/30">
                    STAKED ACCESS ACTIVE
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-trading-red/20 text-trading-red border border-trading-red/30">
                    LOCKED - STAKING REQUIRED
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-400 mt-1.5 max-w-2xl">
                {hasLiveAccess ? (
                  `Your live trading access is active because you have staked ${stakedAmount.toLocaleString()} $CLETUS tokens. Thank you for supporting the Cletus ecosystem!`
                ) : (
                  `To unlock autonomous live trading and premium on-chain signals, you must stake a minimum of ${MIN_STARTER_TIER_STAKE.toLocaleString()} $CLETUS (Starter Tier) in the Staking tab.`
                )}
              </p>

              {/* Staked Info */}
              <div className="mt-3 flex items-center gap-4 text-xs font-mono">
                <div className="text-gray-400">
                  Staked: <span className="text-white font-bold">{stakedAmount.toLocaleString()} CLETUS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 md:items-end">
            {!hasLiveAccess && (
              <button
                onClick={() => onNavigate('staking')}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-trading-green text-black hover:bg-trading-green/90 transition-all text-center w-full"
              >
                🥩 Go Stake CLETUS
              </button>
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
          {systemServices.map((item) => (
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
