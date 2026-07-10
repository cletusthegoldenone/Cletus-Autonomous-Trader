'use client';

import { useState, useEffect } from 'react';
import type { StakingTier, TierInfo, StakingPosition, DistributionRecord } from '@/types';

const TIERS: TierInfo[] = [
  { name: 'Starter', minStake: 100_000, apy: 0.5, profitShare: 0, color: '#6b7280', icon: '🌱' },
  { name: 'Bronze', minStake: 500_000, apy: 0.5, profitShare: 1, color: '#b45309', icon: '🥉' },
  { name: 'Silver', minStake: 1_000_000, apy: 0.5, profitShare: 2, color: '#9ca3af', icon: '🥈' },
  { name: 'Gold', minStake: 5_000_000, apy: 0.5, profitShare: 5, color: '#f59e0b', icon: '🥇' },
  { name: 'Platinum', minStake: 10_000_000, apy: 0.5, profitShare: 10, color: '#22d3ee', icon: '💠' },
  { name: 'Diamond', minStake: 25_000_000, apy: 0.5, profitShare: 20, color: '#60a5fa', icon: '💎' },
  { name: 'Founder', minStake: 100_000_000, apy: 0.5, profitShare: 35, color: '#c084fc', icon: '👑' },
];

const MOCK_POSITION: StakingPosition = {
  staked: 5_000_000,
  tier: 'Gold',
  stakedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
  pendingRewards: 0.847,
  pendingSolRewards: 1.234,
  totalEarned: 12.45,
  profitShareEarned: 8.32,
};

const MOCK_HISTORY: DistributionRecord[] = [
  { month: 'Jun 2026', solRewards: 0.847, profitShare: 3.21, total: 4.057, claimed: false },
  { month: 'May 2026', solRewards: 0.823, profitShare: 2.85, total: 3.673, claimed: true },
  { month: 'Apr 2026', solRewards: 0.801, profitShare: 1.94, total: 2.741, claimed: true },
  { month: 'Mar 2026', solRewards: 0.778, profitShare: 0, total: 0.778, claimed: true },
];

function TierCard({
  tier,
  isActive,
  isNext,
}: {
  tier: TierInfo;
  isActive: boolean;
  isNext: boolean;
}) {
  return (
    <div
      className={`trading-card p-3 transition-all duration-200 ${
        isActive
          ? 'border-2 glow-green'
          : isNext
          ? 'border-dashed opacity-80'
          : 'opacity-50'
      }`}
      style={isActive ? { borderColor: tier.color, boxShadow: `0 0 20px ${tier.color}20` } : {}}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg">{tier.icon}</span>
        {isActive && (
          <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
            style={{ background: `${tier.color}20`, color: tier.color }}>
            ACTIVE
          </span>
        )}
        {isNext && (
          <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-gray-700 text-gray-400">
            NEXT
          </span>
        )}
      </div>
      <div className="font-bold text-sm" style={{ color: isActive ? tier.color : undefined }}>
        {tier.name}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {(tier.minStake / 1e6).toFixed(1)}M CLETUS
      </div>
      <div className="text-xs text-trading-green mt-1">{tier.apy}% APY</div>
      {tier.profitShare > 0 && (
        <div className="text-xs text-trading-blue">{tier.profitShare}% profit share</div>
      )}
    </div>
  );
}

interface ClaimModalProps {
  rewards: { sol: number; profitShare: number };
  onClose: () => void;
}

function ClaimModal({ rewards, onClose }: ClaimModalProps) {
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async () => {
    setClaiming(true);
    await new Promise((r) => setTimeout(r, 2000));
    setClaiming(false);
    setClaimed(true);
    setTimeout(onClose, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="trading-card w-full max-w-sm animate-slide-up">
        <div className="p-6">
          {claimed ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✅</div>
              <div className="text-xl font-bold text-trading-green">Rewards Claimed!</div>
              <div className="text-gray-400 text-sm mt-2">
                {(rewards.sol + rewards.profitShare).toFixed(4)} SOL sent to your wallet
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-6">
                <h3 className="font-bold text-lg">Claim Rewards</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">
                  ×
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="bg-trading-surface rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-500">APY Rewards (SOL)</div>
                      <div className="font-mono font-bold text-trading-green text-lg mt-1">
                        {rewards.sol.toFixed(4)} SOL
                      </div>
                    </div>
                    <span className="text-2xl">💰</span>
                  </div>
                </div>

                <div className="bg-trading-surface rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-500">Profit Share (SOL)</div>
                      <div className="font-mono font-bold text-trading-blue text-lg mt-1">
                        {rewards.profitShare.toFixed(4)} SOL
                      </div>
                    </div>
                    <span className="text-2xl">📈</span>
                  </div>
                </div>

                <div className="border-t border-trading-border pt-3 flex justify-between">
                  <span className="font-semibold text-gray-300">Total</span>
                  <span className="font-mono font-bold text-xl text-white">
                    {(rewards.sol + rewards.profitShare).toFixed(4)} SOL
                  </span>
                </div>
              </div>

              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full py-3 rounded-lg font-bold text-sm bg-trading-green text-black hover:bg-trading-green/90 transition-all disabled:opacity-50"
              >
                {claiming ? '⏳ Claiming...' : '💰 Claim All Rewards'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface UnstakeModalProps {
  position: StakingPosition;
  onClose: () => void;
}

function UnstakeModal({ position, onClose }: UnstakeModalProps) {
  const [amount, setAmount] = useState('');
  const [unstaking, setUnstaking] = useState(false);
  const [unstaked, setUnstaked] = useState(false);

  const handleUnstake = async () => {
    setUnstaking(true);
    await new Promise((r) => setTimeout(r, 2000));
    setUnstaking(false);
    setUnstaked(true);
    setTimeout(onClose, 2500);
  };

  const daysStaked = Math.floor(
    (Date.now() - position.stakedAt) / (24 * 60 * 60 * 1000)
  );
  const hasLockPenalty = daysStaked < 30;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="trading-card w-full max-w-sm animate-slide-up">
        <div className="p-6">
          {unstaked ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✅</div>
              <div className="text-xl font-bold text-white">Unstake Requested!</div>
              <div className="text-gray-400 text-sm mt-2">
                7-day cooldown period started
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-6">
                <h3 className="font-bold text-lg">Unstake CLETUS</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-trading-surface rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Staked Amount</span>
                    <span className="font-mono font-bold">
                      {position.staked.toLocaleString()} CLETUS
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Days Staked</span>
                    <span className="font-mono">{daysStaked} days</span>
                  </div>
                </div>

                {hasLockPenalty && (
                  <div className="bg-trading-red/10 border border-trading-red/30 rounded-lg p-3 text-xs text-trading-red">
                    ⚠️ Early unstake penalty: 2% of staked amount (less than 30 days)
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Amount to Unstake (CLETUS)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Max: ${position.staked.toLocaleString()}`}
                    className="w-full bg-trading-surface border border-trading-border rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-trading-green"
                  />
                  <button
                    onClick={() => setAmount(position.staked.toString())}
                    className="text-xs text-trading-green mt-1 hover:underline"
                  >
                    Use max
                  </button>
                </div>

                <div className="bg-trading-yellow/10 border border-trading-yellow/30 rounded-lg p-3 text-xs text-trading-yellow">
                  ⏱️ 7-day cooldown: Tokens locked for 7 days after unstake request.
                </div>

                <button
                  onClick={handleUnstake}
                  disabled={!amount || unstaking}
                  className="w-full py-3 rounded-lg font-bold text-sm bg-trading-red/80 text-white hover:bg-trading-red transition-all disabled:opacity-50"
                >
                  {unstaking ? '⏳ Processing...' : '📤 Unstake CLETUS'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StakingDashboard() {
  const [position, setPosition] = useState<StakingPosition>(MOCK_POSITION);
  const [history] = useState<DistributionRecord[]>(MOCK_HISTORY);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [staked, setStaked] = useState(false);

  // Simulate rewards accruing
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => ({
        ...prev,
        pendingSolRewards: prev.pendingSolRewards + 0.000001,
        pendingRewards: prev.pendingRewards + 0.0000005,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentTier = TIERS.find((t) => t.name === position.tier)!;
  const currentTierIndex = TIERS.findIndex((t) => t.name === position.tier);
  const nextTier = TIERS[currentTierIndex + 1];

  const progressToNextTier = nextTier
    ? ((position.staked - currentTier.minStake) /
        (nextTier.minStake - currentTier.minStake)) *
      100
    : 100;

  const annualSolRewards = (position.staked / 1e6) * (currentTier.apy / 100) * 0.5;
  const monthlyRewards = annualSolRewards / 12;

  const daysStaked = Math.floor(
    (Date.now() - position.stakedAt) / (24 * 60 * 60 * 1000)
  );

  const handleStake = async () => {
    if (!stakeAmount || isNaN(parseFloat(stakeAmount))) return;
    setIsStaking(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsStaking(false);
    setStaked(true);
    setTimeout(() => setStaked(false), 3000);
    setStakeAmount('');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Position Overview */}
      <div className="trading-card p-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top right, ${currentTier.color}10 0%, transparent 70%)`,
          }}
        />
        <div className="relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Current Position</div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentTier.icon}</span>
                <div>
                  <div className="text-2xl font-bold" style={{ color: currentTier.color }}>
                    {currentTier.name} Tier
                  </div>
                  <div className="text-gray-400 text-sm">
                    {position.staked.toLocaleString()} CLETUS staked
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Staked for</div>
              <div className="text-2xl font-bold font-mono text-white">{daysStaked} days</div>
              <div className="text-xs text-gray-500 mt-1">
                Since {new Date(position.stakedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Progress to next tier */}
          {nextTier && (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Progress to {nextTier.icon} {nextTier.name}</span>
                <span className="font-mono">
                  {((nextTier.minStake - position.staked) / 1e6).toFixed(1)}M more needed
                </span>
              </div>
              <div className="h-2 bg-trading-surface rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, progressToNextTier)}%`,
                    background: currentTier.color,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rewards Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="trading-card p-4">
          <div className="text-xs text-gray-500 mb-1">Pending SOL Rewards</div>
          <div className="text-xl font-bold font-mono text-trading-green">
            {position.pendingSolRewards.toFixed(4)}
          </div>
          <div className="text-xs text-gray-500">SOL</div>
        </div>
        <div className="trading-card p-4">
          <div className="text-xs text-gray-500 mb-1">Profit Share</div>
          <div className="text-xl font-bold font-mono text-trading-blue">
            {position.pendingRewards.toFixed(4)}
          </div>
          <div className="text-xs text-gray-500">SOL</div>
        </div>
        <div className="trading-card p-4">
          <div className="text-xs text-gray-500 mb-1">Monthly APY Est.</div>
          <div className="text-xl font-bold font-mono text-trading-yellow">
            {monthlyRewards.toFixed(3)}
          </div>
          <div className="text-xs text-gray-500">SOL/month</div>
        </div>
        <div className="trading-card p-4">
          <div className="text-xs text-gray-500 mb-1">Total Earned</div>
          <div className="text-xl font-bold font-mono text-white">
            {position.totalEarned.toFixed(3)}
          </div>
          <div className="text-xs text-gray-500">SOL all time</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowClaimModal(true)}
          className="trading-card p-4 text-center hover:border-trading-green/50 transition-all group active:scale-[0.98]"
        >
          <div className="text-2xl mb-1">💰</div>
          <div className="font-bold text-sm group-hover:text-trading-green transition-colors">
            Claim Rewards
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {(position.pendingSolRewards + position.pendingRewards).toFixed(4)} SOL available
          </div>
        </button>
        <button
          onClick={() => setShowUnstakeModal(true)}
          className="trading-card p-4 text-center hover:border-trading-red/50 transition-all group active:scale-[0.98]"
        >
          <div className="text-2xl mb-1">📤</div>
          <div className="font-bold text-sm group-hover:text-trading-red transition-colors">
            Unstake
          </div>
          <div className="text-xs text-gray-500 mt-0.5">7-day cooldown</div>
        </button>
      </div>

      {/* Stake More */}
      <div className="trading-card p-4">
        <div className="text-sm font-semibold mb-3">Stake More CLETUS</div>
        <div className="flex gap-2">
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Amount of CLETUS to stake"
            className="flex-1 bg-trading-surface border border-trading-border rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-trading-green"
          />
          <button
            onClick={handleStake}
            disabled={isStaking || !stakeAmount}
            className="px-4 py-2 rounded-lg bg-trading-green text-black font-bold text-sm hover:bg-trading-green/90 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {staked ? '✅ Staked!' : isStaking ? '⏳...' : 'Stake'}
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Min: 100,000 CLETUS · Current tier: {currentTier.name} ({currentTier.apy}% APY + {currentTier.profitShare}% profit share)
        </div>
      </div>

      {/* Tier Grid */}
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
          Staking Tiers
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {TIERS.map((tier, i) => (
            <TierCard
              key={tier.name}
              tier={tier}
              isActive={tier.name === position.tier}
              isNext={i === currentTierIndex + 1}
            />
          ))}
        </div>
      </div>

      {/* Distribution History */}
      <div className="trading-card p-4">
        <div className="text-sm font-semibold mb-3">Distribution History</div>
        <div className="space-y-2">
          {history.map((record) => (
            <div
              key={record.month}
              className="flex items-center gap-3 p-3 bg-trading-surface rounded-lg"
            >
              <div className="flex-1">
                <div className="text-sm font-medium">{record.month}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  APY: {record.solRewards.toFixed(3)} SOL · Profit Share: {record.profitShare.toFixed(3)} SOL
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-sm text-white">
                  {record.total.toFixed(3)} SOL
                </div>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    record.claimed
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-trading-green/20 text-trading-green'
                  }`}
                >
                  {record.claimed ? 'Claimed' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APY Disclaimer */}
      <div className="trading-card p-3 border-trading-yellow/30">
        <p className="text-xs text-gray-500 leading-relaxed">
          ⚠️ <span className="text-trading-yellow font-medium">Important:</span> Staking rewards
          are estimates only. 0.5% APY is paid in SOL from protocol fees. Profit sharing depends on
          actual trading performance — Cletus is an AI and cannot guarantee profits. Rewards may
          be zero in losing months. Past distributions do not guarantee future payments.
        </p>
      </div>

      {showClaimModal && (
        <ClaimModal
          rewards={{
            sol: position.pendingSolRewards,
            profitShare: position.pendingRewards,
          }}
          onClose={() => setShowClaimModal(false)}
        />
      )}

      {showUnstakeModal && (
        <UnstakeModal
          position={position}
          onClose={() => setShowUnstakeModal(false)}
        />
      )}
    </div>
  );
}
