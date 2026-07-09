'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [tokenData, setTokenData] = useState([
    { rank: 1, name: '$PEPU', fullName: 'Pepe Unlimited', mcap: '$1.85M', vol5m: '$124k', change: '+34.2%', score: 92, signals: 'momentum · volume spike' },
    { rank: 2, name: '$MOBY', fullName: 'Moby Whale', mcap: '$3.2M', vol5m: '$87k', change: '+18.7%', score: 87, signals: 'liquidity locked · clean dev' },
    { rank: 3, name: '$VRTX', fullName: 'Vortex Sol', mcap: '$4.4M', vol5m: '$56k', change: '+9.1%', score: 78, signals: 'graduated · strong community' },
  ]);

  const simulateRefresh = () => {
    setTokenData(prev => prev.map(token => ({
      ...token,
      change: `+${(Math.random() * 40 + 5).toFixed(1)}%`,
      score: Math.floor(Math.random() * 25) + 70
    })));
  };

  const submitWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setShowWaitlist(false);
    alert('Application submitted! We\'ll review and send an invite within 48 hours.');
  };

  return (
    <div className="bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto">
          <div className="px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-3xl">
                🪿
              </div>
              <div>
                <span className="font-display text-3xl font-semibold tracking-tighter">Cletus</span>
                <span className="text-emerald-400 text-xs font-mono tracking-[3px] ml-1">PRO</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-x-9 text-sm">
              <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
              <a href="#demo" className="hover:text-emerald-400 transition-colors">Live Demo</a>
              <a href="#comparison" className="hover:text-emerald-400 transition-colors">Comparison</a>
              <a href="#tech" className="hover:text-emerald-400 transition-colors">Tech</a>
            </div>
            
            <div className="flex items-center gap-x-3">
              <button onClick={() => setShowWaitlist(true)}
                      className="px-5 py-2.5 text-sm font-medium border border-white/20 hover:bg-white/5 rounded-3xl transition-all active:scale-[0.985]">
                Join Waitlist
              </button>
              <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-6 py-2.5 text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 transition-all rounded-3xl flex items-center gap-x-2 active:scale-[0.985]">
                <span>Open Dashboard</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-screen-2xl mx-auto px-8 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-x-2 bg-white/5 border border-white/10 rounded-3xl px-4 py-1.5 text-sm mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Now in closed beta • 142 traders online</span>
            </div>
            
            <h1 className="text-7xl font-bold tracking-tighter leading-none mb-6">
              The ultimate<br />
              <span className="text-emerald-400">Solana DeFi</span><br />
              command center.
            </h1>
            
            <p className="max-w-lg text-xl text-white/70 mb-10">
              Autonomous AI scanner • Real-time market briefings • Community intelligence • Staking-gated access • Anti-tamper security.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setShowWaitlist(true)}
                      className="px-9 py-4 bg-white text-black font-semibold rounded-3xl flex items-center justify-center gap-x-3 hover:bg-zinc-100 transition-all text-lg active:scale-[0.985]">
                <span>Get Early Access</span>
              </button>
              
              <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-8 py-4 border border-white/30 hover:bg-white/5 font-medium rounded-3xl flex items-center gap-x-3 text-lg transition-all active:scale-[0.985]">
                <span>▶</span>
                <span>Watch 47s Demo</span>
              </button>
            </div>
            
            <div className="flex items-center gap-x-8 mt-10 text-sm">
              <div className="flex -space-x-3">
                {[12, 47, 28].map((n) => (
                  <div key={n} className="w-8 h-8 bg-zinc-800 border border-white/20 rounded-full overflow-hidden">
                    <Image
                      src={`https://i.pravatar.cc/32?img=${n}`}
                      className="w-full h-full object-cover"
                      alt="avatar"
                      width={32}
                      height={32}
                    />
                  </div>
                ))}
              </div>
              <div className="text-white/60">
                Trusted by <span className="font-semibold text-white">1,240+</span> degen traders
              </div>
            </div>
          </div>
          
          {/* Hero visual */}
          <div className="lg:col-span-5 relative">
            <div className="glass rounded-3xl p-2 shadow-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-20">
              <div className="bg-zinc-900 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-x-2">
                    <div className="text-emerald-400 text-xl">🤖</div>
                    <div>
                      <div className="font-semibold">Cletus AI</div>
                      <div className="text-xs text-white/50">Market Briefing • 14s ago</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded-2xl">LIVE</div>
                </div>
                
                <div className="terminal text-sm p-4 rounded-2xl border border-white/10 bg-black/60 font-mono">
                  <div className="text-emerald-400">🔥 HOT | MICRO-cap $87k | ▲34.2% | 5m vol $41k | vol/mcap 47%</div>
                  <div className="text-emerald-400/90 mt-1">Top pick: $PEPU — up 34.2% with $41k in 5m volume</div>
                  <div className="text-emerald-400/70 text-xs mt-3">Signals: momentum breakout · volume spike · dev wallet clean</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-zinc-900 border border-white/10 rounded-2xl px-4 py-2 text-xs flex items-center gap-x-2">
              <div className="text-emerald-400">🛡️</div>
              <div>Integrity: <span className="font-mono">100%</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="border-y border-white/10 py-5">
        <div className="max-w-screen-2xl mx-auto px-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-white/50 text-sm">
          <div className="flex items-center gap-x-2">◎ Solana Native</div>
          <div>Real-time WebSocket</div>
          <div>Gemini 2.5 Flash AI</div>
          <div>Staking Access Control</div>
          <div>Anti-Rug Intelligence</div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-screen-2xl mx-auto px-8 pt-20 pb-16">
        <div className="text-center mb-14">
          <div className="text-emerald-400 text-sm font-semibold tracking-widest">POWERFUL BY DEFAULT</div>
          <h2 className="text-5xl font-bold tracking-tighter mt-2">Everything you need.<br />Nothing you don&apos;t.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '📊', title: 'Real-time Scanner', desc: '15-second market briefings with pattern detection, momentum scoring, and narrative summaries.' },
            { icon: '🤖', title: 'Autonomous AI Agent', desc: 'Persistent Gemini-powered conversations. Ask anything about tokens, strategies, or positions.' },
            { icon: '👥', title: 'Live Community', desc: 'Real-time chat + social profiles. Goose-themed avatars. Messages broadcast instantly.' },
            { icon: '🛡️', title: 'Enterprise Security', desc: 'File integrity monitoring. SHA-256 baseline checks. Admin device tokens + PIN.' },
            { icon: '🔐', title: 'Smart Access Control', desc: 'Staking tiers (Basic / Full / Unlimited). 30-day trials. All enforced server-side.' },
            { icon: '🔍', title: 'Dev Rug Intelligence', desc: 'Database of known ruggers with evidence. Real-time rugcheck.xyz integration.' },
          ].map((feature, i) => (
            <div key={i} className="glass p-7 rounded-3xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2">
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="font-semibold text-2xl mb-3">{feature.title}</h3>
              <p className="text-white/70">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Demo */}
      <div id="demo" className="max-w-screen-2xl mx-auto px-8 py-16 border-t border-white/10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-emerald-400 text-sm font-semibold tracking-widest">INTERACTIVE PREVIEW</div>
            <h2 className="text-5xl font-bold tracking-tighter">Live Market Briefing</h2>
          </div>
          <div className="text-right">
            <div className="text-emerald-400 text-sm">Updated just now</div>
            <div className="font-mono text-xs text-white/50">Cycle #1842 • 14:22:09 UTC</div>
          </div>
        </div>
        
        <div className="glass rounded-3xl p-1 border border-white/10 bg-zinc-900/50 backdrop-blur-20">
          <div className="bg-zinc-900 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-x-4">
                <div>
                  <span className="font-semibold text-2xl">Scanner</span>
                  <span className="ml-3 px-3 py-1 text-xs bg-emerald-500/10 text-emerald-400 rounded-2xl">142 tokens • 19 signals</span>
                </div>
              </div>
              <div className="flex items-center gap-x-2 text-sm">
                <button onClick={simulateRefresh} className="px-4 py-2 bg-white/5 rounded-2xl flex items-center gap-x-2 hover:bg-white/10 transition">
                  <span>🔄</span>
                  <span className="font-mono text-xs">NEXT IN 11s</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-4 px-6 font-medium text-white/60">RANK</th>
                    <th className="text-left py-4 px-6 font-medium text-white/60">TOKEN</th>
                    <th className="text-right py-4 px-6 font-medium text-white/60">MCAP</th>
                    <th className="text-right py-4 px-6 font-medium text-white/60">5M VOL</th>
                    <th className="text-right py-4 px-6 font-medium text-white/60">CHANGE</th>
                    <th className="text-right py-4 px-6 font-medium text-white/60">SCORE</th>
                    <th className="text-left py-4 px-6 font-medium text-white/60">SIGNALS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {tokenData.map((token) => (
                    <tr key={token.rank} className="hover:bg-emerald-500/5 transition">
                      <td className="py-4 px-6 font-mono text-emerald-400">{token.rank}</td>
                      <td className="py-4 px-6">
                        <div className="font-semibold">{token.name}</div>
                        <div className="text-xs text-white/50">{token.fullName}</div>
                      </td>
                      <td className="py-4 px-6 text-right font-mono">{token.mcap}</td>
                      <td className="py-4 px-6 text-right font-mono">{token.vol5m}</td>
                      <td className="py-4 px-6 text-right text-emerald-400 font-mono">{token.change}</td>
                      <td className="py-4 px-6 text-right"><span className="font-mono bg-emerald-500/10 px-3 py-0.5 rounded text-emerald-400">{token.score}</span></td>
                      <td className="py-4 px-6 text-xs text-white/70">{token.signals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 text-xs text-white/50 flex justify-between items-center">
              <div>Showing top 3 of 25 high-signal tokens</div>
              <button onClick={simulateRefresh} className="flex items-center gap-x-2 hover:text-white transition-colors">
                <span>🔄</span>
                <span>Refresh now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div id="comparison" className="max-w-screen-2xl mx-auto px-8 py-16 border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold tracking-tighter">How Cletus compares</h2>
          <p className="mt-3 text-white/60 max-w-md mx-auto">Most tools are just Telegram snipers. Cletus is a full trading intelligence platform.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border border-white/10 rounded-3xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-white/5">
                <th className="text-left p-6 font-medium">Feature</th>
                <th className="p-6 text-center font-medium text-emerald-400">Cletus</th>
                <th className="p-6 text-center font-medium">Photon</th>
                <th className="p-6 text-center font-medium">Trojan</th>
                <th className="p-6 text-center font-medium">BullX / GMGN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                ['Full Web Dashboard', true, 'Partial', 'Telegram only', 'Partial'],
                ['AI Chat + Memory', true, false, false, 'Limited'],
                ['Real-time Narrative Briefings', true, false, false, false],
                ['Community Chat + Profiles', true, false, false, false],
                ['Staking-Gated Access', true, false, false, false],
                ['File Integrity + Anti-Tamper', true, false, false, false],
                ['Developer Rug Database', true, 'Basic', false, false],
                ['Self-Hostable / Open Core', true, 'Closed', 'Closed', 'Closed'],
              ].map((row, i) => (
                <tr key={i}>
                  <td className="p-6 font-medium">{row[0]}</td>
                  <td className="p-6 text-center">{row[1] === true ? '✓' : '✗'} {typeof row[1] === 'string' ? row[1] : ''}</td>
                  <td className="p-6 text-center text-white/40">{row[2]}</td>
                  <td className="p-6 text-center text-white/40">{row[3]}</td>
                  <td className="p-6 text-center text-white/40">{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tech Stack */}
      <div id="tech" className="max-w-screen-2xl mx-auto px-8 py-16 border-t border-white/10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold tracking-tighter">Built with modern, battle-tested tech</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
          {['TypeScript + Express', 'Drizzle ORM + Postgres', 'WebSocket Broadcaster', 'Gemini 2.5 Flash', 'CoinGecko + DexScreener', 'OpenID Connect ready'].map((tech, i) => (
            <div key={i} className="glass p-6 rounded-3xl hover:border-white/20 border border-white/10 transition">
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="border-t border-white/10 bg-zinc-900 py-16">
        <div className="max-w-screen-2xl mx-auto px-8 text-center">
          <div className="max-w-lg mx-auto">
            <div className="text-emerald-400 mb-2">Ready to trade smarter?</div>
            <h3 className="text-5xl font-bold tracking-tighter mb-6">Join the Cletus beta today.</h3>
            
            <button onClick={() => setShowWaitlist(true)}
                    className="px-10 py-4 bg-emerald-500 hover:bg-emerald-600 transition-all font-semibold rounded-3xl text-lg inline-flex items-center gap-x-3 active:scale-[0.985]">
              <span>Request Access</span>
              <span>→</span>
            </button>
            
            <div className="mt-4 text-xs text-white/50">Limited spots • Staking or trial required for full access</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-xs text-white/40">
        <div className="max-w-screen-2xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-y-4">
          <div>© 2026 Cletus • Built for serious Solana traders</div>
          <div className="flex gap-x-6">
            <a href="#" className="hover:text-white">Docs</a>
            <a href="#" className="hover:text-white">Discord</a>
            <a href="#" className="hover:text-white">X / Twitter</a>
            <a href="#" className="hover:text-white">GitHub</a>
          </div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div onClick={() => setShowWaitlist(false)} className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div onClick={(e) => e.stopPropagation()} className="glass max-w-md w-full rounded-3xl p-8 border border-white/10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="font-semibold text-2xl">Join the waitlist</div>
                <div className="text-white/60 text-sm">Be the first to know when we open new spots.</div>
              </div>
              <button onClick={() => setShowWaitlist(false)} className="text-white/50 hover:text-white text-2xl">×</button>
            </div>
            
            <form onSubmit={submitWaitlist}>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/60 block mb-1.5">Solana Wallet Address</label>
                  <input type="text" placeholder="Your wallet address" className="w-full bg-zinc-900 border border-white/20 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs text-white/60 block mb-1.5">Email (optional)</label>
                  <input type="email" placeholder="you@example.com" className="w-full bg-zinc-900 border border-white/20 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              
              <button type="submit" className="mt-6 w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 transition-all font-semibold rounded-3xl">
                Submit Application
              </button>
            </form>
            
            <div className="text-center mt-4 text-xs text-white/40">We&apos;ll review your wallet activity and notify you within 48 hours.</div>
          </div>
        </div>
      )}
    </div>
  );
}