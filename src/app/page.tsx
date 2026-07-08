"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import CandlestickChart from "@/components/CandlestickChart";
import TradingSignals from "@/components/TradingSignals";
import StakingDashboard from "@/components/StakingDashboard";
import AIBrainChat from "@/components/AIBrainChat";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "chart" | "signals" | "staking" | "ai">("dashboard");

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950 p-4">
        <h1 className="text-2xl font-bold text-cyan-400">🦆 Cletus Autonomous Trader</h1>
        <p className="text-sm text-gray-400">AI-powered micro-cap trading on Solana</p>
      </header>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex border-b border-gray-800 bg-gray-950 overflow-x-auto">
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "chart", label: "Chart" },
          { id: "signals", label: "Signals" },
          { id: "staking", label: "Staking" },
          { id: "ai", label: "Ask Cletus" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <div className="p-4 md:p-8">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "chart" && <CandlestickChart />}
        {activeTab === "signals" && <TradingSignals />}
        {activeTab === "staking" && <StakingDashboard />}
        {activeTab === "ai" && <AIBrainChat />}
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t border-gray-800 bg-gray-950 flex justify-around">
        {[
          { id: "dashboard", label: "📊", title: "Dashboard" },
          { id: "chart", label: "📈", title: "Chart" },
          { id: "signals", label: "⚡", title: "Signals" },
          { id: "staking", label: "💰", title: "Staking" },
          { id: "ai", label: "🤖", title: "AI" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 text-center transition-colors ${
              activeTab === tab.id
                ? "text-cyan-400 bg-cyan-400/10"
                : "text-gray-400 hover:text-white"
            }`}
            title={tab.title}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Mobile spacing */}
      <div className="md:hidden h-20" />
    </main>
  );
}