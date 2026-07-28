'use client';

import { useState, useRef, useEffect } from 'react';
import type { TierInfo } from '@/types';
import { useSimulation, MIN_STARTER_TIER_STAKE } from '@/context/SimulationContext';

const TIERS: TierInfo[] = [
  { name: 'Starter', minStake: 100_000, apy: 0.5, profitShare: 0, color: '#6b7280', icon: '🌱' },
  { name: 'Bronze', minStake: 500_000, apy: 0.5, profitShare: 1, color: '#b45309', icon: '🥉' },
  { name: 'Silver', minStake: 1_000_000, apy: 0.5, profitShare: 2, color: '#9ca3af', icon: '🥈' },
  { name: 'Gold', minStake: 5_000_000, apy: 0.5, profitShare: 5, color: '#f59e0b', icon: '🥇' },
  { name: 'Platinum', minStake: 10_000_000, apy: 0.5, profitShare: 10, color: '#22d3ee', icon: '💠' },
  { name: 'Diamond', minStake: 25_000_000, apy: 0.5, profitShare: 20, color: '#60a5fa', icon: '💎' },
  { name: 'Founder', minStake: 100_000_000, apy: 0.5, profitShare: 35, color: '#c084fc', icon: '👑' },
];

const INACTIVE_TIER_OPACITY_CLASS = 'opacity-60';
const NEXT_TIER_OPACITY_CLASS = 'opacity-80';


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
          ? `border-dashed ${NEXT_TIER_OPACITY_CLASS}`
          : INACTIVE_TIER_OPACITY_CLASS
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
          <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-gray-700 text-gray-400 animate-pulse">
            NEXT TIER
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

export default function StakingDashboard() {
  const {
    stakedAmount,
    cletusBalance,
    stakeTokens,
    unstakeTokens,
    faucetCletus,
  } = useSimulation();

  const [stakeInput, setStakeInput] = useState('');
  const [unstakeInput, setUnstakeInput] = useState('');
  const [stakingMode, setStakingMode] = useState<'stake' | 'unstake'>('stake');
  const [successMsg, setSuccessMsg] = useState('');
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear success message timer on unmount to prevent memory leaks
  useEffect(() => () => { if (successTimerRef.current) clearTimeout(successTimerRef.current); }, []);

  // Find active tier
  let activeTier: typeof TIERS[number] | null = null;
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (stakedAmount >= TIERS[i].minStake) {
      activeTier = TIERS[i];
      break;
    }
  }

  // Find next tier
  let nextTier: typeof TIERS[number] | null = null;
  if (!activeTier) {
    nextTier = TIERS[0];
  } else {
    const activeIndex = TIERS.findIndex((t) => t.name === activeTier?.name);
    if (activeIndex < TIERS.length - 1) {
      nextTier = TIERS[activeIndex + 1];
    }
  }

  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(stakeInput);
    if (isNaN(amount) || amount <= 0) return;
    if (amount > cletusBalance) {
      alert('Insufficient CLETUS balance!');
      return;
    }
    stakeTokens(amount);
    setStakeInput('');
    setSuccessMsg(`Successfully staked ${amount.toLocaleString()} CLETUS!`);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleUnstake = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(unstakeInput);
    if (isNaN(amount) || amount <= 0) return;
    if (amount > stakedAmount) {
      alert('Insufficient staked CLETUS balance!');
      return;
    }
    unstakeTokens(amount);
    setUnstakeInput('');
    setSuccessMsg(`Successfully unstaked ${amount.toLocaleString()} CLETUS!`);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Coming Soon Banner */}
      <div className="trading-card p-5 border-trading-yellow/40 bg-trading-yellow/5">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🚀</span>
          <div>
            <div className="font-bold text-trading-yellow text-base">$CLETUS Token — Launching Soon</div>
            <p className="text-sm text-gray-400 mt-1">
              The $CLETUS token has not yet been deployed on Solana. Staking will go live
              the moment the token launches. The tier structure, APY rates, and profit-sharing
              percentages shown below are the confirmed parameters for launch.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-trading-yellow/10 text-trading-yellow border border-trading-yellow/30 font-medium animate-pulse">
                ⏳ Token not yet deployed · Simulated Portal Active
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-trading-surface border border-trading-border text-gray-400">
                Staking contract: pending deployment
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Preview */}
      <div className="trading-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-lg">Staking Tiers</h2>
            <p className="text-sm text-gray-400">Stake $CLETUS to earn SOL APY + monthly profit share from Cletus trading</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-trading-purple/20 text-trading-purple border border-trading-purple/30 font-mono">
            {activeTier ? `${activeTier.name.toUpperCase()} TIER ACTIVE` : 'PREVIEW MODE'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {TIERS.map((tier) => {
            const isActive = activeTier?.name === tier.name;
            const isNext = nextTier?.name === tier.name;
            return (
              <TierCard key={tier.name} tier={tier} isActive={isActive} isNext={isNext} />
            );
          })}
        </div>
      </div>

      {/* Simulated Staking Form */}
      <div className="trading-card p-5 border border-trading-border/60 bg-trading-surface/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-trading-border/50">
          <div>
            <h3 className="font-bold text-base text-white">Simulated Staking Portal</h3>
            <p className="text-xs text-gray-400 mt-1">
              $CLETUS token is coming soon! Use this portal to simulate staking, test the tiers, and satisfy the Stake to Access requirement for Live Trading.
            </p>
          </div>
          <button
            onClick={faucetCletus}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-trading-green/20 text-trading-green border border-trading-green/30 hover:bg-trading-green/30 transition-all self-start md:self-center"
          >
            🚰 Request Faucet (1,000,000 $CLETUS)
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-trading-green/10 border border-trading-green/30 text-trading-green text-xs font-semibold rounded-lg animate-fade-in">
            ✅ {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Stats */}
          <div className="space-y-3 bg-trading-bg/40 p-4 rounded-xl border border-trading-border/40">
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Your Balances</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-gray-500 font-mono">Available</div>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {cletusBalance.toLocaleString()} <span className="text-[10px] text-gray-500">CLETUS</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-mono">Staked</div>
                <div className="text-sm font-bold font-mono text-trading-green mt-0.5">
                  {stakedAmount.toLocaleString()} <span className="text-[10px] text-gray-500">CLETUS</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-trading-border/40">
              <div className="text-[10px] text-gray-500 font-mono">Active Tier</div>
              <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                {activeTier ? (
                  <>
                    <span>{activeTier.icon}</span>
                    <span style={{ color: activeTier.color }}>{activeTier.name} Tier</span>
                  </>
                ) : (
                  <span className="text-gray-400">None (minimum {MIN_STARTER_TIER_STAKE.toLocaleString()} CLETUS)</span>
                )}
              </div>
            </div>
          </div>

          {/* Staking Action Panel */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex gap-2 border-b border-trading-border/40 pb-2">
              <button
                onClick={() => setStakingMode('stake')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  stakingMode === 'stake'
                    ? 'bg-trading-green text-black'
                    : 'text-gray-400 hover:text-white bg-trading-surface border border-trading-border'
                }`}
              >
                📥 Stake CLETUS
              </button>
              <button
                onClick={() => setStakingMode('unstake')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  stakingMode === 'unstake'
                    ? 'bg-trading-red/20 border border-trading-red/40 text-trading-red'
                    : 'text-gray-400 hover:text-white bg-trading-surface border border-trading-border'
                }`}
              >
                📤 Unstake CLETUS
              </button>
            </div>

            {stakingMode === 'stake' ? (
              <form onSubmit={handleStake} className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={stakeInput}
                      onChange={(e) => setStakeInput(e.target.value)}
                      placeholder="Amount of CLETUS to stake"
                      className="w-full bg-trading-surface border border-trading-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 font-mono focus:outline-none focus:border-trading-green transition-colors"
                      min="1"
                      step="1"
                    />
                    <button
                      type="button"
                      onClick={() => setStakeInput(cletusBalance.toString())}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-trading-surface/60 border border-trading-border hover:border-trading-green/40 px-2 py-0.5 rounded text-gray-400 hover:text-white"
                    >
                      MAX
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-trading-green text-black font-bold text-sm hover:bg-trading-green/90 transition-all shrink-0 active:scale-[0.97]"
                  >
                    Stake
                  </button>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {[100000, 500000, 1000000, 5000000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setStakeInput(amt.toString())}
                      className="text-[10px] font-mono bg-trading-surface/40 border border-trading-border hover:border-trading-green/40 px-2 py-1 rounded text-gray-400 hover:text-white transition-all"
                    >
                      {(amt / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </form>
            ) : (
              <form onSubmit={handleUnstake} className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={unstakeInput}
                      onChange={(e) => setUnstakeInput(e.target.value)}
                      placeholder="Amount of CLETUS to unstake"
                      className="w-full bg-trading-surface border border-trading-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 font-mono focus:outline-none focus:border-trading-red transition-colors"
                      min="1"
                      step="1"
                    />
                    <button
                      type="button"
                      onClick={() => setUnstakeInput(stakedAmount.toString())}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-trading-surface/60 border border-trading-border hover:border-trading-red/40 px-2 py-0.5 rounded text-gray-400 hover:text-white"
                    >
                      MAX
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-trading-red/20 border border-trading-red/40 text-trading-red font-bold text-sm hover:bg-trading-red/30 transition-all shrink-0 active:scale-[0.97]"
                  >
                    Unstake
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="trading-card p-5">
        <h3 className="font-bold text-sm mb-4 text-gray-400 uppercase tracking-wider">How Staking Will Work</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: '🪙',
              title: 'Acquire $CLETUS',
              desc: 'Buy $CLETUS tokens on Raydium once the token launches. No minimum for holding, minimum stake varies by tier.',
            },
            {
              icon: '🔒',
              title: 'Stake Your Tokens',
              desc: 'Lock your $CLETUS in the staking contract. Your tokens stay in your control — unstake anytime after the 7-day cooldown.',
            },
            {
              icon: '💰',
              title: 'Earn Monthly',
              desc: '0.5% SOL APY on your staked position, plus a share of Cletus\'s monthly trading profits based on your tier.',
            },
          ].map((step) => (
            <div key={step.title} className="flex gap-3">
              <span className="text-2xl shrink-0">{step.icon}</span>
              <div>
                <div className="font-semibold text-sm text-white">{step.title}</div>
                <div className="text-xs text-gray-500 mt-1">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fee distribution reminder */}
      <div className="trading-card p-4 border-trading-border/50">
        <p className="text-xs text-gray-500">
          💡 Every trade closed on Cletus generates a 1% fee that is distributed as follows:
          20% to development, 25% to staking rewards pool, 30% to platform upgrades, 25% to digital bank fund.
          Stakers at Gold tier and above receive a direct monthly profit share on top of SOL APY.
        </p>
      </div>
    </div>
  );
}
