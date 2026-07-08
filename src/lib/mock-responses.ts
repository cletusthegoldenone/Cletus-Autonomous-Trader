export const scanResponse = {
  tokens: [
    {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      symbol: "USDC",
      marketCap: 150000,
      volume24h: 75000,
      volumeToMcapRatio: 0.5,
      signals: {
        volumeSpike: 0.85,
        momentum: 0.72,
        breakout: 0.65,
      },
      compositeScore: 0.74,
    },
  ],
};

export const positionsResponse = {
  positions: [
    {
      id: "pos_123",
      token: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      entryPrice: 0.0015,
      currentPrice: 0.0018,
      amount: 100000,
      pnl: 300,
      openTime: "2024-01-15T10:30:00Z",
    },
  ],
};

export const killSwitchResponse = {
  status: "EXECUTED",
  positionsClosed: 5,
  totalUsdcConverted: 15000,
  timestamp: "2024-01-15T14:32:00Z",
};

export const aiResponse = {
  answer: "Nano-cap tokens can move quickly, but position sizing and liquidity checks should stay strict.",
  confidence: 0.85,
  sources: ["placeholder_scaffold", "historical_data"],
};
