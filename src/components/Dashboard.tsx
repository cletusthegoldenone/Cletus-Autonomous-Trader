"use client";

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    pnl24h: 3847.5,
    pnl24hPercent: 12.4,
    winRate: 73.2,
    activePositions: 4,
    totalTrades: 247,
    bestTrade: 2340.0,
    worstTrade: -420.0,
    sharpeRatio: 2.14,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        pnl24h: prev.pnl24h + (Math.random() - 0.48) * 50,
        activePositions: Math.max(1, prev.activePositions + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="24h P&L" value={`$${stats.pnl24h.toFixed(2)}`} change={`${stats.pnl24hPercent}%`} />
        <StatCard label="Win Rate" value={`${stats.winRate}%`} />
        <StatCard label="Active Positions" value={stats.activePositions.toString()} />
        <StatCard label="Total Trades" value={stats.totalTrades.toString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Best Trade" value={`+$${stats.bestTrade.toFixed(2)}`} />
        <StatCard label="Worst Trade" value={`-$${Math.abs(stats.worstTrade).toFixed(2)}`} />
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">System Status</h3>
        <div className="space-y-2">
          <StatusItem label="Helius RPC" status="Connected" />
          <StatusItem label="Gemini AI" status="Ready" />
          <StatusItem label="Signal Engine" status="Active" />
          <StatusItem label="Risk Manager" status="Monitoring" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change }: { label: string; value: string; change?: string }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <p className="text-sm text-gray-400 mb-2">{label}</p>
      <p className="text-2xl font-bold text-cyan-400">{value}</p>
      {change && <p className="text-sm text-green-400 mt-2">+{change}</p>}
    </div>
  );
}

function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-800">
      <span className="text-gray-300">{label}</span>
      <span className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-green-400">{status}</span>
      </span>
    </div>
  );
}
