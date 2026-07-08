"use client";

import { useState } from 'react';

export default function TradingSignals() {
  const [signals] = useState([
    {
      id: 1,
      token: 'USDC',
      marketCap: 145000,
      compositeScore: 74,
      strength: 'STRONG',
    },
    {
      id: 2,
      token: 'SOL',
      marketCap: 320000,
      compositeScore: 68,
      strength: 'MODERATE',
    },
  ]);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'EXTREME':
        return 'text-red-500';
      case 'STRONG':
        return 'text-orange-500';
      case 'MODERATE':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">Active Trading Signals</h2>
      {signals.map((signal) => (
        <div key={signal.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{signal.token}</h3>
            <span className={`font-bold ${getStrengthColor(signal.strength)}`}>
              {signal.strength}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Market Cap</p>
              <p className="text-white font-semibold">${(signal.marketCap / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-gray-400">Composite Score</p>
              <p className="text-cyan-400 font-semibold">{signal.compositeScore}%</p>
            </div>
            <div>
              <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition">
                Execute
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
