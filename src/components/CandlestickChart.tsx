"use client";

import { useState } from 'react';

export default function CandlestickChart() {
  const [pair, setPair] = useState('SOL');
  const [timeframe, setTimeframe] = useState('1h');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="text-sm text-gray-400 block mb-2">Trading Pair</label>
          <select
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700"
          >
            <option>SOL/USDC</option>
            <option>CLETUS/SOL</option>
            <option>BTC/USDT</option>
            <option>ETH/USDT</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400 block mb-2">Timeframe</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700"
          >
            <option value="1m">1 Min</option>
            <option value="5m">5 Min</option>
            <option value="15m">15 Min</option>
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hour</option>
            <option value="1d">1 Day</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 h-96">
        <p className="text-gray-400 text-center py-20">📈 Chart for {pair} ({timeframe})</p>
      </div>
    </div>
  );
}
