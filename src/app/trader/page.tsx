'use client';

import { useState } from 'react';
import Link from 'next/link';
import Dashboard from '@/components/Dashboard';
import CandlestickChart from '@/components/CandlestickChart';
import TradingSignals from '@/components/TradingSignals';
import AIBrainChat from '@/components/AIBrainChat';
import StakingDashboard from '@/components/StakingDashboard';

type Tab = 'dashboard' | 'chart' | 'signals' | 'ai' | 'staking';

const AI_MODEL_LABEL = process.env.NEXT_PUBLIC_AI_MODEL_LABEL ?? 'Gemini AI';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'chart', label: 'Chart', icon: '📈' },
  { id: 'signals', label: 'Signals', icon: '⚡' },
  { id: 'ai', label: 'Cletus AI', icon: '🤖' },
  { id: 'staking', label: 'Staking', icon: '💎' },
];

export default function TraderPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-trading-bg text-white">
      {/* Top Header */}
      <header className="border-b border-trading-border bg-trading-bg/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="h-14 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-x-2.5">
              <div className="w-8 h-8 bg-trading-green rounded-xl flex items-center justify-center text-xl">
                🪿
              </div>
              <div className="flex items-baseline gap-x-1">
                <span className="font-bold text-lg tracking-tight">Cletus</span>
                <span className="text-trading-green text-[10px] font-mono tracking-[3px]">PRO</span>
              </div>
              <span className="text-xs text-gray-600 hidden sm:block">Autonomous Trader</span>
            </div>

            {/* Live status */}
            <div className="hidden md:flex items-center gap-x-3 text-xs">
              <div className="flex items-center gap-x-1.5 text-trading-green">
                <div className="w-2 h-2 rounded-full bg-trading-green status-dot-live" />
                <span className="font-mono">LIVE</span>
              </div>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400 font-mono">Solana Mainnet</span>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400 font-mono">AI: {AI_MODEL_LABEL}</span>
            </div>

            {/* Back to home */}
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-x-1.5 px-3 py-1.5 rounded-lg border border-trading-border hover:border-trading-border/80"
            >
              <span>←</span>
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b border-trading-border bg-trading-surface sticky top-14 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-x-2 px-4 sm:px-6 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'border-trading-green text-trading-green'
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === 'signals' && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-trading-green/20 text-trading-green rounded-full font-mono">
                    LIVE
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard onNavigate={(tab) => setActiveTab(tab as Tab)} />
        )}
        {activeTab === 'chart' && <CandlestickChart />}
        {activeTab === 'signals' && <TradingSignals />}
        {activeTab === 'ai' && <AIBrainChat />}
        {activeTab === 'staking' && <StakingDashboard />}
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 border-t border-trading-border bg-trading-surface z-50">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-y-1 py-2.5 text-xs transition-colors ${
                activeTab === tab.id ? 'text-trading-green' : 'text-gray-600'
              }`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className="font-medium leading-none">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile bottom padding */}
      <div className="md:hidden h-16" />
    </div>
  );
}
