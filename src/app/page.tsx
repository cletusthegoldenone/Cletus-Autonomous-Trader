'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Dashboard from '@/components/Dashboard';
import TradingSignals from '@/components/TradingSignals';
import StakingDashboard from '@/components/StakingDashboard';
import AIBrainChat from '@/components/AIBrainChat';

// Dynamically import the chart to avoid SSR issues with lightweight-charts
const CandlestickChart = dynamic(() => import('@/components/CandlestickChart'), {
  ssr: false,
  loading: () => (
    <div className="trading-card h-96 flex items-center justify-center text-gray-500">
      Loading chart...
    </div>
  ),
});

type Tab = 'dashboard' | 'chart' | 'signals' | 'staking' | 'ai';

const TABS: { id: Tab; label: string; icon: string; mobileLabel: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', mobileLabel: 'Home' },
  { id: 'chart', label: 'Chart', icon: '📈', mobileLabel: 'Chart' },
  { id: 'signals', label: 'Signals', icon: '⚡', mobileLabel: 'Signals' },
  { id: 'staking', label: 'Staking', icon: '💎', mobileLabel: 'Stake' },
  { id: 'ai', label: 'AI Brain', icon: '🤖', mobileLabel: 'AI' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-trading-bg">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-trading-surface/95 backdrop-blur-md border-b border-trading-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-trading-green/20 border border-trading-green/40 flex items-center justify-center text-xs">
                🤖
              </div>
              <span className="font-bold text-sm gradient-text-green hidden sm:block">
                Cletus
              </span>
              <span className="text-xs text-gray-500 hidden md:block">Autonomous Trader</span>
            </div>

            {/* Desktop Tab Navigation */}
            <div className="hidden sm:flex items-center gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    activeTab === tab.id
                      ? 'bg-trading-green/15 text-trading-green border border-trading-green/30'
                      : 'text-gray-400 hover:text-white hover:bg-trading-card'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-trading-green status-dot-live" />
              <span className="text-trading-green hidden sm:block font-mono">LIVE</span>
              <span className="text-gray-500 hidden md:block font-mono">Solana Mainnet</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 sm:pb-6">
        {activeTab === 'dashboard' && (
          <Dashboard onNavigate={(tab) => setActiveTab(tab as Tab)} />
        )}
        {activeTab === 'chart' && <CandlestickChart />}
        {activeTab === 'signals' && <TradingSignals />}
        {activeTab === 'staking' && <StakingDashboard />}
        {activeTab === 'ai' && <AIBrainChat />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-trading-surface/95 backdrop-blur-md border-t border-trading-border">
        <div className="flex items-center justify-around h-16 px-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all duration-150 flex-1 ${
                activeTab === tab.id ? 'text-trading-green' : 'text-gray-500'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.mobileLabel}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-trading-green" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
