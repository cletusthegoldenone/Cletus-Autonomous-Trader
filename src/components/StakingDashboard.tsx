"use client";

import { useState } from 'react';

export default function StakingDashboard() {
  const [stake] = useState({
    amount: 2500000,
    tier: 'Profit Sharer Tier 1',
    apy: 5.0,
    monthlyProfit: 5000,
    totalRewards: 12500,
  });

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Your Staking Position</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Staked Amount</p>
            <p className="text-2xl font-bold text-white">{(stake.amount / 1000000).toFixed(1)}M CLETUS</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Tier</p>
            <p className="text-2xl font-bold text-cyan-400">{stake.tier}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">APY</p>
            <p className="text-2xl font-bold text-green-400">{stake.apy}%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Monthly Profit Share</p>
            <p className="text-2xl font-bold text-green-400">~${stake.monthlyProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Total Rewards</h3>
        <p className="text-3xl font-bold text-green-400 mb-4">${stake.totalRewards.toLocaleString()}</p>
        <div className="flex gap-4">
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition">
            Claim Rewards
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition">
            Stake More
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-400 p-4 bg-gray-900 rounded border border-gray-800">
        <p>⚠️ Disclaimer: Staking rewards are not guaranteed. See STAKING_REWARDS_STRUCTURE.md for full terms.</p>
      </div>
    </div>
  );
}
