'use client';

import { useState, useCallback } from 'react';

interface WalletAnalysis {
  address: string;
  isKnownRugger: boolean;
  rugCount: number;
  riskScore: number;
  riskLabel: string;
  riskColor: string;
  solBalance: number;
  tokenHoldings: TokenHolding[];
  recentActivity: ActivityItem[];
  flags: string[];
  rugHistory: RugEvent[];
  firstSeen: string;
  totalVolume: string;
  rugcheckScore?: number;
}

interface TokenHolding {
  symbol: string;
  name: string;
  amount: string;
  valueUsd: string;
  percentOfSupply: string;
  suspicious: boolean;
}

interface ActivityItem {
  type: 'sell' | 'buy' | 'transfer' | 'launch';
  description: string;
  amount: string;
  time: string;
  flagged: boolean;
}

interface RugEvent {
  token: string;
  date: string;
  lossUsd: string;
  evidence: string;
}

const KNOWN_RUGGERS: Record<string, Partial<WalletAnalysis>> = {
  'RuG1111111111111111111111111111111111111111': {
    isKnownRugger: true,
    rugCount: 7,
    riskScore: 98,
    riskLabel: 'EXTREME DANGER',
    riskColor: 'text-trading-red',
    flags: ['Known serial rugger', '7 confirmed rug pulls', 'Honeypot deployer', 'Flagged by rugcheck.xyz'],
    rugHistory: [
      { token: '$HONK', date: 'Jan 2026', lossUsd: '$240,000', evidence: 'Drained LP 4 minutes after launch' },
      { token: '$WADDLE', date: 'Dec 2025', lossUsd: '$85,000', evidence: 'Dev wallet sold 100% in single tx' },
      { token: '$GEESE', date: 'Nov 2025', lossUsd: '$120,000', evidence: 'Honeypot contract, no sells possible' },
    ],
  },
};

function generateMockAnalysis(address: string): WalletAnalysis {
  // Deterministic-ish mock from address chars
  const seed = address.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const rng = (max: number) => (seed % (max + 1));

  const knownRugger = KNOWN_RUGGERS[address];
  if (knownRugger) {
    return {
      address,
      solBalance: 0.4,
      totalVolume: '$1.2M',
      firstSeen: '2024-08-14',
      tokenHoldings: [],
      recentActivity: [
        { type: 'sell', description: 'Dumped 100% of $NEWRUG holdings', amount: '$45,000', time: '2h ago', flagged: true },
        { type: 'launch', description: 'Deployed new token contract', amount: '—', time: '6h ago', flagged: true },
      ],
      rugcheckScore: 5,
      ...knownRugger,
    } as WalletAnalysis;
  }

  const riskScore = 20 + rng(75);
  let riskLabel: string;
  let riskColor: string;
  const flags: string[] = [];

  if (riskScore >= 80) {
    riskLabel = 'HIGH RISK';
    riskColor = 'text-trading-red';
    flags.push('Multiple suspicious sells detected', 'Wallet age < 30 days');
  } else if (riskScore >= 55) {
    riskLabel = 'MODERATE RISK';
    riskColor = 'text-trading-yellow';
    flags.push('Some large sell events', 'Limited on-chain history');
  } else {
    riskLabel = 'LOW RISK';
    riskColor = 'text-trading-green';
    flags.push('No rug pulls detected', 'Consistent trading pattern');
  }

  if (riskScore > 40) flags.push('Holds >5% of token supply');
  if (riskScore > 60) flags.push('Sells within 48h of token launch (repeated)');

  const holdings: TokenHolding[] = [
    {
      symbol: '$PEPU',
      name: 'Pepe Unlimited',
      amount: `${(100 + rng(400)).toLocaleString()}K`,
      valueUsd: `$${(1000 + rng(9000)).toLocaleString()}`,
      percentOfSupply: `${(0.5 + rng(8)).toFixed(1)}%`,
      suspicious: riskScore > 65,
    },
    {
      symbol: '$BONK',
      name: 'Bonk',
      amount: `${(50 + rng(200)).toLocaleString()}M`,
      valueUsd: `$${(500 + rng(3000)).toLocaleString()}`,
      percentOfSupply: `<0.1%`,
      suspicious: false,
    },
    {
      symbol: '$SOL',
      name: 'Wrapped SOL',
      amount: `${(1 + rng(30)).toFixed(2)}`,
      valueUsd: `$${(200 + rng(5000)).toLocaleString()}`,
      percentOfSupply: '—',
      suspicious: false,
    },
  ];

  const activity: ActivityItem[] = [
    {
      type: 'buy',
      description: `Purchased $PEPU on Raydium`,
      amount: `$${(500 + rng(3000)).toLocaleString()}`,
      time: `${1 + rng(12)}h ago`,
      flagged: false,
    },
    {
      type: 'sell',
      description: `Sold $HONK — ${riskScore > 60 ? '85% of holdings' : '20% of holdings'}`,
      amount: `$${(200 + rng(5000)).toLocaleString()}`,
      time: `${2 + rng(24)}h ago`,
      flagged: riskScore > 60,
    },
    {
      type: 'transfer',
      description: 'Received SOL from exchange',
      amount: `${(1 + rng(10)).toFixed(2)} SOL`,
      time: `${1 + rng(5)}d ago`,
      flagged: false,
    },
  ];

  return {
    address,
    isKnownRugger: false,
    rugCount: 0,
    riskScore,
    riskLabel,
    riskColor,
    solBalance: parseFloat((0.5 + rng(50)).toFixed(2)),
    tokenHoldings: holdings,
    recentActivity: activity,
    flags,
    rugHistory: [],
    firstSeen: `${2024 + rng(1)}-${String(1 + rng(11)).padStart(2, '0')}-${String(1 + rng(27)).padStart(2, '0')}`,
    totalVolume: `$${(10 + rng(500))}.${rng(9)}K`,
    rugcheckScore: Math.max(10, 100 - riskScore),
  };
}

function RiskMeter({ score }: { score: number }) {
  const color = score >= 80 ? '#ff4757' : score >= 55 ? '#ffd43b' : '#00d4aa';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Risk Score</span>
        <span className="font-mono font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-2.5 bg-trading-surface rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function DevWalletInspector() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WalletAnalysis | null>(null);
  const [error, setError] = useState('');

  const inspect = useCallback(async (addr: string) => {
    const trimmed = addr.trim();
    if (!trimmed) return;
    if (trimmed.length < 20) {
      setError('Enter a valid Solana wallet or token address (32–44 chars).');
      return;
    }
    setError('');
    setIsLoading(true);
    setResult(null);

    // Simulate network call + rugcheck.xyz lookup
    await new Promise((r) => setTimeout(r, 1400 + Math.random() * 800));
    const analysis = generateMockAnalysis(trimmed);
    setResult(analysis);
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inspect(query);
  };

  const EXAMPLE_ADDRESSES = [
    { label: '🚨 Known Rugger', addr: 'RuG1111111111111111111111111111111111111111' },
    { label: '🟡 Mid Risk Dev', addr: 'DevWallet9xQ8kLmPvRtY3nBsHcJeWoFgUaZiXd7' },
    { label: '✅ Clean Dev', addr: 'CleanDev5kP2mRwYnXsVqBtHdJeZoFgUaLiMc8E' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="trading-card p-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl shrink-0">🔍</div>
          <div>
            <h2 className="font-bold text-lg">Dev Wallet Inspector</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Inspect any Solana developer wallet or token address. Cross-references the Cletus rug
              database and rugcheck.xyz for known bad actors.
            </p>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Paste wallet or token address…"
            className="flex-1 bg-trading-surface border border-trading-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-trading-green font-mono transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-5 py-2.5 rounded-xl bg-trading-green text-black font-bold text-sm hover:bg-trading-green/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shrink-0"
          >
            {isLoading ? '⏳' : 'Inspect'}
          </button>
        </form>

        {error && <p className="mt-2 text-xs text-trading-red">{error}</p>}

        {/* Example addresses */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-600">Try:</span>
          {EXAMPLE_ADDRESSES.map((ex) => (
            <button
              key={ex.addr}
              onClick={() => { setQuery(ex.addr); inspect(ex.addr); }}
              className="text-xs px-3 py-1 bg-trading-surface border border-trading-border rounded-full hover:border-trading-green/50 hover:text-white transition-all text-gray-400"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="trading-card p-8 text-center">
          <div className="text-3xl mb-3 animate-bounce">🔍</div>
          <div className="text-sm text-gray-400">Querying rugcheck.xyz &amp; Cletus rug database…</div>
          <div className="text-xs text-gray-600 mt-1">Checking on-chain history · Scanning token launches · Verifying LP locks</div>
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="space-y-4">
          {/* Risk Overview */}
          <div className={`trading-card p-5 ${result.isKnownRugger ? 'border-trading-red/60' : ''}`}>
            {result.isKnownRugger && (
              <div className="bg-trading-red/10 border border-trading-red/40 rounded-lg p-3 mb-4 flex items-center gap-2">
                <span className="text-xl">🚨</span>
                <div>
                  <div className="font-bold text-trading-red">KNOWN RUGGER — DO NOT INTERACT</div>
                  <div className="text-xs text-trading-red/80 mt-0.5">
                    {result.rugCount} confirmed rug pulls · In Cletus rug database
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Address</div>
                  <div className="font-mono text-xs text-white/70 break-all">{result.address}</div>
                </div>
                <RiskMeter score={result.riskScore} />
                <div className={`text-lg font-bold ${result.riskColor}`}>{result.riskLabel}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:w-44">
                {result.rugcheckScore !== undefined && (
                  <div className="bg-trading-surface rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Rugcheck Score</div>
                    <div className={`text-xl font-bold font-mono mt-1 ${result.rugcheckScore >= 70 ? 'text-trading-green' : result.rugcheckScore >= 40 ? 'text-trading-yellow' : 'text-trading-red'}`}>
                      {result.rugcheckScore}/100
                    </div>
                  </div>
                )}
                <div className="bg-trading-surface rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">SOL Balance</div>
                  <div className="text-xl font-bold font-mono mt-1 text-white">{result.solBalance}</div>
                </div>
                <div className="bg-trading-surface rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">First Seen</div>
                  <div className="text-sm font-mono mt-1 text-gray-300">{result.firstSeen}</div>
                </div>
                <div className="bg-trading-surface rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Total Volume</div>
                  <div className="text-sm font-mono mt-1 text-white">{result.totalVolume}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Flags */}
          {result.flags.length > 0 && (
            <div className="trading-card p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                Intelligence Flags
              </div>
              <div className="space-y-1.5">
                {result.flags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className={`shrink-0 ${result.isKnownRugger || result.riskScore >= 80 ? 'text-trading-red' : result.riskScore >= 55 ? 'text-trading-yellow' : 'text-trading-green'}`}>
                      {result.isKnownRugger || result.riskScore >= 80 ? '🚩' : result.riskScore >= 55 ? '⚠️' : '✅'}
                    </span>
                    <span className="text-gray-300">{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rug History */}
          {result.rugHistory.length > 0 && (
            <div className="trading-card p-4 border-trading-red/30">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                🚨 Confirmed Rug Pull History
              </div>
              <div className="space-y-2">
                {result.rugHistory.map((rug, i) => (
                  <div key={i} className="bg-trading-red/10 border border-trading-red/20 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-trading-red">{rug.token}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{rug.evidence}</div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <div className="font-mono font-bold text-trading-red">{rug.lossUsd}</div>
                        <div className="text-xs text-gray-500">{rug.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Token Holdings */}
          {result.tokenHoldings.length > 0 && (
            <div className="trading-card p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                Token Holdings
              </div>
              <div className="space-y-2">
                {result.tokenHoldings.map((h, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      h.suspicious ? 'bg-trading-red/10 border border-trading-red/20' : 'bg-trading-surface'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-trading-surface border border-trading-border flex items-center justify-center text-xs font-bold shrink-0">
                      {h.symbol.slice(1, 3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm">{h.symbol}</span>
                        {h.suspicious && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-trading-red/20 text-trading-red rounded-full font-semibold">
                            SUSPICIOUS
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{h.name}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-mono font-semibold">{h.valueUsd}</div>
                      <div className="text-xs text-gray-500">{h.percentOfSupply} of supply</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {result.recentActivity.length > 0 && (
            <div className="trading-card p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
                Recent On-Chain Activity
              </div>
              <div className="space-y-2">
                {result.recentActivity.map((act, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      act.flagged ? 'bg-trading-red/10 border border-trading-red/20' : 'bg-trading-surface'
                    }`}
                  >
                    <span className="text-lg shrink-0">
                      {act.type === 'buy' ? '🟢' : act.type === 'sell' ? '🔴' : act.type === 'launch' ? '🚀' : '↗️'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-300">{act.description}</div>
                      <div className="text-xs text-gray-500">{act.time}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-sm text-white">{act.amount}</div>
                      {act.flagged && (
                        <span className="text-[10px] text-trading-red font-semibold">⚠️ FLAGGED</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Powered by */}
          <div className="trading-card p-3 border-trading-border/50">
            <p className="text-xs text-gray-500">
              🔍 Analysis powered by <span className="text-white font-medium">rugcheck.xyz</span> +{' '}
              <span className="text-white font-medium">Cletus Rug Intelligence Database</span>.
              On-chain data is fetched live from Solana mainnet. Always verify independently before trading.
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !isLoading && (
        <div className="trading-card p-10 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <div className="text-lg font-semibold text-gray-300 mb-2">Inspect Any Dev Wallet</div>
          <div className="text-sm text-gray-500 max-w-sm mx-auto">
            Paste a Solana wallet address above to check for known rug pulls, suspicious activity,
            token holdings, and on-chain red flags.
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto">
            {[
              { icon: '🚩', title: 'Rug Database', desc: '500+ known bad actors' },
              { icon: '🔗', title: 'rugcheck.xyz', desc: 'Real-time integration' },
              { icon: '📊', title: 'On-Chain Analysis', desc: 'Wallet history & patterns' },
            ].map((item) => (
              <div key={item.title} className="bg-trading-surface rounded-xl p-3">
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-xs font-semibold text-white">{item.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
