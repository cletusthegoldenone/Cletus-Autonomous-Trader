'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

interface TokenData {
  rank: number;
  name: string;
  fullName: string;
  address: string;
  mcap: string;
  vol5m: string;
  change: string;
  changeRaw: number;
  score: number;
  signals: string;
  changePositive: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_TOKENS: TokenData[] = [
  { rank: 1, name: '$PEPU', fullName: 'Pepe Unlimited', address: '', mcap: '$1.85M', vol5m: '$124k', change: '+34.2%', changeRaw: 34.2, score: 92, signals: 'momentum · volume spike', changePositive: true },
  { rank: 2, name: '$MOBY', fullName: 'Moby Whale', address: '', mcap: '$3.2M', vol5m: '$87k', change: '+18.7%', changeRaw: 18.7, score: 87, signals: 'liquidity locked · clean dev', changePositive: true },
  { rank: 3, name: '$VRTX', fullName: 'Vortex Sol', address: '', mcap: '$4.4M', vol5m: '$56k', change: '+9.1%', changeRaw: 9.1, score: 78, signals: 'graduated · strong community', changePositive: true },
  { rank: 4, name: '$BONK', fullName: 'Bonk', address: '', mcap: '$12.1M', vol5m: '$203k', change: '+5.3%', changeRaw: 5.3, score: 74, signals: 'high volume · community driven', changePositive: true },
  { rank: 5, name: '$WIF', fullName: 'dogwifhat', address: '', mcap: '$8.9M', vol5m: '$91k', change: '-2.1%', changeRaw: -2.1, score: 71, signals: 'consolidating · watch for breakout', changePositive: false },
];

export default function Home() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData[]>(INITIAL_TOKENS);
  const [isLiveData, setIsLiveData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [countdown, setCountdown] = useState(20);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hey! I'm **Cletus AI**, your Solana DeFi intelligence assistant. Ask me about token signals, market patterns, staking, or anything DeFi-related. 🚀",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTokenData = useCallback(async () => {
    try {
      const res = await fetch('/api/tokens');
      if (res.ok) {
        const data = await res.json();
        setTokenData(data.tokens ?? INITIAL_TOKENS);
        setIsLiveData(data.isLive ?? false);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch {
      // keep existing data
    }
    setCountdown(20);
  }, []);

  useEffect(() => {
    fetchTokenData();
    const dataInterval = setInterval(fetchTokenData, 20_000);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 20 : c - 1));
    }, 1_000);
    return () => {
      clearInterval(dataInterval);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [fetchTokenData]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendChat = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setChatLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.answer ?? 'Something went wrong. Please try again.' },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please try again.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  };

  const submitWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setShowWaitlist(false);
    alert("Application submitted! We'll review and send an invite within 48 hours.");
  };

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#demo', label: 'Live Demo' },
    { href: '#ai-chat', label: 'AI Chat' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#token', label: '$CLETUS' },
    { href: '#comparison', label: 'Compare' },
    { href: '#tech', label: 'Tech' },
  ];

  // Simple markdown-ish renderer for bold text
  const renderMessage = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-zinc-950/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-x-2.5 flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl">
                🪿
              </div>
              <div className="flex items-baseline">
                <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tighter">Cletus</span>
                <span className="text-emerald-400 text-xs font-mono tracking-[3px] ml-1">PRO</span>
              </div>
              <span className="font-bold text-sm gradient-text-green hidden sm:block">
                Cletus
              </span>
              <span className="text-xs text-gray-500 hidden md:block">Autonomous Trader</span>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-x-7 text-sm">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-white/70 hover:text-emerald-400 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA buttons */}
            <div className="hidden md:flex items-center gap-x-3">
              <button
                onClick={() => setShowWaitlist(true)}
                className="px-5 py-2.5 text-sm font-medium border border-white/20 hover:bg-white/5 rounded-3xl transition-all active:scale-[0.985]"
              >
                Join Waitlist
              </button>
              <Link
                href="/trader"
                className="px-5 py-2.5 text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 transition-all rounded-3xl flex items-center gap-x-2 active:scale-[0.985]"
              >
                <span>Launch App</span>
                <span>→</span>
              </Link>
            </div>

            {/* Mobile: hamburger + CTA */}
            <div className="flex items-center gap-x-2 md:hidden">
              <Link
                href="/trader"
                className="px-4 py-2 text-xs font-medium bg-emerald-500 hover:bg-emerald-600 rounded-2xl transition-all active:scale-[0.985]"
              >
                Launch App
              </Link>
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`block h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-3 pb-4">
              <div className="flex flex-col gap-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 pt-10 sm:pt-14 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-x-2 bg-white/5 border border-white/10 rounded-3xl px-4 py-1.5 text-xs sm:text-sm mb-5 sm:mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
              <span className="font-medium">Now in closed beta · 142 traders online</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] mb-5 sm:mb-6">
              The ultimate<br />
              <span className="text-emerald-400">Solana DeFi</span><br />
              command center.
            </h1>

            <p className="max-w-lg mx-auto lg:mx-0 text-base sm:text-lg md:text-xl text-white/70 mb-8 sm:mb-10">
              Autonomous AI scanner · Real-time market briefings · Community intelligence · Staking-gated access · Anti-tamper security.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                href="/trader"
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-3xl flex items-center justify-center gap-x-2 transition-all text-base sm:text-lg active:scale-[0.985]"
              >
                <span>🚀</span>
                <span>Launch Trading App</span>
              </Link>
              <button
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-7 py-3.5 sm:py-4 border border-white/30 hover:bg-white/5 font-medium rounded-3xl flex items-center justify-center gap-x-2 text-base sm:text-lg transition-all active:scale-[0.985]"
              >
                <span>▶</span>
                <span>Watch 47s Demo</span>
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-x-6 mt-8 sm:mt-10 text-sm">
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
              <div className="text-white/60 text-sm">
                Trusted by <span className="font-semibold text-white">1,240+</span> degen traders
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="glass rounded-3xl p-2 shadow-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
              <div className="bg-zinc-900 rounded-2xl p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-x-2">
                    <div className="text-emerald-400 text-xl">🤖</div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">Cletus AI</div>
                      <div className="text-xs text-white/50">Market Briefing · 14s ago</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded-2xl">LIVE</div>
                </div>
                <div className="terminal text-xs sm:text-sm p-3 sm:p-4 rounded-2xl border border-white/10 bg-black/60 font-mono">
                  <div className="text-emerald-400">🔥 HOT | MICRO-cap $87k | ▲34.2% | 5m vol $41k | vol/mcap 47%</div>
                  <div className="text-emerald-400/90 mt-1">Top pick: $PEPU — up 34.2% with $41k in 5m volume</div>
                  <div className="text-emerald-400/70 text-xs mt-3">Signals: momentum breakout · volume spike · dev wallet clean</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-zinc-900 border border-white/10 rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 text-xs flex items-center gap-x-2">
              <div className="text-emerald-400">🛡️</div>
              <div>Integrity: <span className="font-mono">100%</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="border-y border-white/10 py-4 sm:py-5">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white/50 text-xs sm:text-sm">
          <div className="flex items-center gap-x-2">◎ Solana Native</div>
          <div>Real-time WebSocket</div>
          <div>Gemini 2.0 Flash AI</div>
          <div>Staking Access Control</div>
          <div>Anti-Rug Intelligence</div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="text-center mb-10 sm:mb-14">
          <div className="text-emerald-400 text-xs sm:text-sm font-semibold tracking-widest">POWERFUL BY DEFAULT</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mt-2">
            Everything you need.<br />Nothing you don&apos;t.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: '📊', title: 'Real-time Scanner', desc: '15-second market briefings with pattern detection, momentum scoring, and narrative summaries.' },
            { icon: '🤖', title: 'Autonomous AI Agent', desc: 'Persistent Gemini-powered conversations. Ask anything about tokens, strategies, or positions.' },
            { icon: '👥', title: 'Live Community', desc: 'Real-time chat + social profiles. Goose-themed avatars. Messages broadcast instantly.' },
            { icon: '🛡️', title: 'Enterprise Security', desc: 'File integrity monitoring. SHA-256 baseline checks. Admin device tokens + PIN.' },
            { icon: '🔐', title: 'Smart Access Control', desc: 'Staking tiers (Basic / Full / Unlimited). 30-day trials. All enforced server-side.' },
            { icon: '🔍', title: 'Dev Rug Intelligence', desc: 'Database of known ruggers with evidence. Real-time rugcheck.xyz integration.' },
          ].map((feature, i) => (
            <div key={i} className="glass p-5 sm:p-7 rounded-3xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 sm:hover:-translate-y-2">
              <div className="text-3xl sm:text-4xl mb-4 sm:mb-6">{feature.icon}</div>
              <h3 className="font-semibold text-lg sm:text-2xl mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-white/70 text-sm sm:text-base">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Demo / Scanner */}
      <div id="demo" className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-6 sm:mb-8">
          <div>
            <div className="text-emerald-400 text-xs sm:text-sm font-semibold tracking-widest">INTERACTIVE PREVIEW</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">Live Market Scanner</h2>
          </div>
          <div className="text-left sm:text-right">
            <div className="flex items-center gap-x-2 sm:justify-end">
              {isLiveData ? (
                <div className="flex items-center gap-x-1.5 text-emerald-400 text-xs sm:text-sm font-medium">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Live DexScreener data
                </div>
              ) : (
                <div className="text-white/50 text-xs sm:text-sm">Demo data</div>
              )}
            </div>
            {lastUpdated && (
              <div className="font-mono text-xs text-white/40 mt-0.5">
                Updated {lastUpdated} · next in {countdown}s
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-3xl p-1 border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
          <div className="bg-zinc-900 rounded-3xl p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-x-2 sm:gap-x-4">
                <span className="font-semibold text-lg sm:text-2xl">Scanner</span>
                <span className="px-2 sm:px-3 py-1 text-xs bg-emerald-500/10 text-emerald-400 rounded-2xl">
                  {tokenData.length} tokens · {tokenData.filter(t => t.changePositive).length} signals
                </span>
              </div>
              <button
                onClick={fetchTokenData}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 rounded-2xl flex items-center gap-x-1.5 sm:gap-x-2 hover:bg-white/10 transition text-xs sm:text-sm"
              >
                <span>🔄</span>
                <span className="font-mono hidden sm:inline">REFRESH</span>
              </button>
            </div>

            {/* Scrollable table wrapper */}
            <div className="overflow-x-auto -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-medium text-white/60 text-xs sm:text-sm">#</th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-medium text-white/60 text-xs sm:text-sm">TOKEN</th>
                    <th className="text-right py-3 sm:py-4 px-3 sm:px-6 font-medium text-white/60 text-xs sm:text-sm">MCAP</th>
                    <th className="text-right py-3 sm:py-4 px-3 sm:px-6 font-medium text-white/60 text-xs sm:text-sm">5M VOL</th>
                    <th className="text-right py-3 sm:py-4 px-3 sm:px-6 font-medium text-white/60 text-xs sm:text-sm">CHG</th>
                    <th className="text-right py-3 sm:py-4 px-3 sm:px-6 font-medium text-white/60 text-xs sm:text-sm">SCORE</th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-medium text-white/60 text-xs sm:text-sm hidden md:table-cell">SIGNALS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {tokenData.map((token) => (
                    <tr key={token.rank} className="hover:bg-emerald-500/5 transition">
                      <td className="py-3 sm:py-4 px-3 sm:px-6 font-mono text-emerald-400 text-xs sm:text-sm">{token.rank}</td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6">
                        <div className="font-semibold text-sm sm:text-base">{token.name}</div>
                        <div className="text-xs text-white/50 hidden sm:block">{token.fullName}</div>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-right font-mono text-xs sm:text-sm">{token.mcap}</td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-right font-mono text-xs sm:text-sm">{token.vol5m}</td>
                      <td className={`py-3 sm:py-4 px-3 sm:px-6 text-right font-mono text-xs sm:text-sm font-semibold ${token.changePositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {token.change}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-right">
                        <span className={`font-mono text-xs sm:text-sm px-2 sm:px-3 py-0.5 rounded ${token.score >= 85 ? 'bg-emerald-500/20 text-emerald-300' : token.score >= 70 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/60'}`}>
                          {token.score}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs text-white/70 hidden md:table-cell">{token.signals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 sm:mt-6 text-xs text-white/50 flex justify-between items-center">
              <div>
                {isLiveData ? 'Live Solana data via DexScreener' : `Showing top ${tokenData.length} high-signal tokens`}
              </div>
              <button onClick={fetchTokenData} className="flex items-center gap-x-1.5 hover:text-white transition-colors">
                <span>🔄</span>
                <span className="hidden sm:inline">Refresh now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat */}
      <div id="ai-chat" className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 border-t border-white/10">
        <div className="text-center mb-8 sm:mb-10">
          <div className="text-emerald-400 text-xs sm:text-sm font-semibold tracking-widest">POWERED BY GEMINI</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mt-2">Ask Cletus AI</h2>
          <p className="mt-3 text-white/60 text-sm sm:text-base max-w-md mx-auto">
            Real-time AI assistant for Solana DeFi. Ask about signals, tokens, strategies, or market conditions.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center gap-x-3 px-4 sm:px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-lg">🤖</div>
              <div>
                <div className="font-semibold text-sm">Cletus AI</div>
                <div className="text-xs text-emerald-400 flex items-center gap-x-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Online
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div className="h-64 sm:h-80 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-emerald-500 text-white rounded-br-sm'
                        : 'bg-white/10 text-white/90 rounded-bl-sm'
                    }`}
                  >
                    {msg.content.split('\n').map((line, li) => (
                      <p key={li} className={li > 0 ? 'mt-1' : ''}>
                        {renderMessage(line)}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-x-1">
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-2">
              {['How do signals work?', 'Explain staking tiers', 'What is rug detection?'].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setChatInput(prompt); }}
                  className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat input */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="flex gap-x-2 sm:gap-x-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKey}
                  placeholder="Ask about tokens, signals, staking..."
                  className="flex-1 bg-zinc-900 border border-white/20 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder-white/30"
                />
                <button
                  onClick={sendChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl text-sm font-semibold transition-all active:scale-[0.985]"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing / Subscription */}
      <div id="pricing" className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 border-t border-white/10">
        <div className="text-center mb-10 sm:mb-14">
          <div className="text-emerald-400 text-xs sm:text-sm font-semibold tracking-widest">PLANS &amp; PRICING</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mt-2">Start free. Scale with staking.</h2>
          <p className="mt-3 text-white/60 max-w-md mx-auto text-sm sm:text-base">
            Every plan includes a 30-day free trial. Full access is gated by on-chain staking — the more you stake, the more you earn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {/* Free Trial */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col">
            <div className="text-2xl mb-3">⏱️</div>
            <div className="font-bold text-xl mb-1">Free Trial</div>
            <div className="text-3xl font-bold tracking-tighter mb-1">$0</div>
            <div className="text-white/50 text-xs mb-5">30 days · No credit card</div>
            <ul className="space-y-2 text-sm text-white/70 flex-1 mb-6">
              {['Live Market Scanner', 'AI Chat (25 msgs/day)', 'Basic signal alerts', 'Community read access', 'Candlestick charts'].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
              {['Dev wallet inspector', 'Profit sharing', 'Priority signals'].map((f) => (
                <li key={f} className="flex items-start gap-2 opacity-40">
                  <span className="shrink-0">✗</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowWaitlist(true)}
              className="w-full py-3 border border-white/20 hover:bg-white/5 transition-all font-medium rounded-2xl text-sm active:scale-[0.985]"
            >
              Start Free Trial →
            </button>
          </div>

          {/* Starter Staking */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col">
            <div className="text-2xl mb-3">🌱</div>
            <div className="font-bold text-xl mb-1">Starter</div>
            <div className="text-3xl font-bold tracking-tighter mb-1">100K <span className="text-lg font-normal text-white/50">CLETUS</span></div>
            <div className="text-white/50 text-xs mb-5">Stake to unlock · 5% APY</div>
            <ul className="space-y-2 text-sm text-white/70 flex-1 mb-6">
              {['Everything in Trial', 'Unlimited AI Chat', 'Full signal access', 'Dev wallet inspector', 'Community write access'].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
              {['Profit sharing', 'Priority alerts'].map((f) => (
                <li key={f} className="flex items-start gap-2 opacity-40">
                  <span className="shrink-0">✗</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/trader?tab=staking" className="w-full py-3 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition-all font-medium rounded-2xl text-sm text-center active:scale-[0.985] block">
              Stake Now →
            </Link>
          </div>

          {/* Gold / Pro — highlighted */}
          <div className="glass p-6 sm:p-8 rounded-3xl border-2 border-emerald-500 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 rounded-full text-xs font-bold text-black whitespace-nowrap">
              MOST POPULAR
            </div>
            <div className="text-2xl mb-3">🥇</div>
            <div className="font-bold text-xl mb-1">Gold</div>
            <div className="text-3xl font-bold tracking-tighter mb-1">5M <span className="text-lg font-normal text-white/50">CLETUS</span></div>
            <div className="text-white/50 text-xs mb-5">Stake to unlock · 5% APY + 5% profit share</div>
            <ul className="space-y-2 text-sm text-white/70 flex-1 mb-6">
              {['Everything in Starter', '5% monthly profit share', 'Priority signal alerts', 'Advanced AI analysis', 'Tier badge in community', 'Early feature access'].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/trader?tab=staking" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 transition-all font-semibold rounded-2xl text-sm text-center active:scale-[0.985] block">
              Stake for Gold →
            </Link>
          </div>

          {/* Diamond / Unlimited */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col">
            <div className="text-2xl mb-3">💎</div>
            <div className="font-bold text-xl mb-1">Diamond</div>
            <div className="text-3xl font-bold tracking-tighter mb-1">25M <span className="text-lg font-normal text-white/50">CLETUS</span></div>
            <div className="text-white/50 text-xs mb-5">Stake to unlock · 5% APY + 20% profit share</div>
            <ul className="space-y-2 text-sm text-white/70 flex-1 mb-6">
              {['Everything in Gold', '20% monthly profit share', 'API access', 'Custom signal parameters', 'Direct dev support', 'Diamond badge + perks'].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/trader?tab=staking" className="w-full py-3 border border-blue-400/40 text-blue-400 hover:bg-blue-400/10 transition-all font-medium rounded-2xl text-sm text-center active:scale-[0.985] block">
              Go Diamond →
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-white/40 max-w-lg mx-auto">
          Staking provides platform access, not guaranteed returns. All profit sharing depends on Cletus's actual trading performance.
          7-day unstaking cooldown. <span className="text-white/60 underline cursor-pointer" onClick={() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })}>Full tier comparison →</span>
        </div>
      </div>

      {/* $CLETUS Token — Coming Soon */}
      <div id="token" className="border-t border-white/10 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-x-2 bg-yellow-500/10 border border-yellow-500/30 rounded-3xl px-4 py-1.5 text-xs sm:text-sm mb-5 sm:mb-6">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse flex-shrink-0" />
              <span className="font-semibold text-yellow-400 tracking-widest">COMING SOON · Q3 2026</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4">
              <span className="text-yellow-400">$CLETUS</span> Token
            </h2>
            <p className="text-white/60 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
              The native token powering the entire Cletus ecosystem. Stake to earn SOL, unlock features, and govern the future of autonomous trading.
            </p>
          </div>

          {/* Token Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-12 sm:mb-16">
            {[
              { label: 'Total Supply', value: '1,000,000,000', sub: 'fixed forever', icon: '🪙' },
              { label: 'Blockchain', value: 'Solana', sub: '~400ms blocks', icon: '◎' },
              { label: 'APY Yield', value: '5%', sub: 'in SOL rewards', icon: '💰' },
              { label: 'Token Address', value: 'TBA', sub: 'at public launch', icon: '📋' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-yellow-500/20 bg-yellow-500/5 text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="font-bold text-base sm:text-xl tracking-tight text-white">{stat.value}</div>
                <div className="text-xs text-white/50 mt-0.5 font-medium">{stat.label}</div>
                <div className="text-xs text-yellow-400/70 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Three Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 max-w-5xl mx-auto">
            <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-yellow-500/30 transition-all group">
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:bg-yellow-500/20 transition-all">
                💎
              </div>
              <h3 className="font-bold text-lg sm:text-xl mb-2">Stake to Earn SOL</h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                Lock your $CLETUS and earn real SOL weekly. 5% APY calculated every Solana block. Claim anytime, no lockup period.
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5 text-sm">
                {[
                  ['100K CLETUS', '0.05 SOL / week'],
                  ['1M CLETUS', '0.50 SOL / week'],
                  ['10M CLETUS', '5.00 SOL / week'],
                ].map(([stake, reward]) => (
                  <div key={stake} className="flex justify-between text-xs font-mono">
                    <span className="text-white/50">{stake}</span>
                    <span className="text-yellow-400">{reward}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6 sm:p-8 border border-emerald-500/30 hover:border-emerald-500/50 transition-all group bg-emerald-500/5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-emerald-500 rounded-full text-xs font-bold text-black whitespace-nowrap">
                MOST VALUABLE
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:bg-emerald-500/20 transition-all">
                🔓
              </div>
              <h3 className="font-bold text-lg sm:text-xl mb-2">Unlock Full Access</h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                Your stake tier determines your trading limits — position sizes, concurrent trades, daily targets, and API access. No monthly fees.
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5">
                {[
                  { tier: 'Starter', stake: '100K', color: 'text-gray-400' },
                  { tier: 'Gold', stake: '5M', color: 'text-yellow-400' },
                  { tier: 'Diamond', stake: '25M', color: 'text-blue-300' },
                  { tier: 'Founder', stake: '100M', color: 'text-purple-300' },
                ].map(({ tier, stake, color }) => (
                  <div key={tier} className="flex justify-between text-xs font-mono">
                    <span className={color}>{tier}</span>
                    <span className="text-white/50">{stake} CLETUS</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-yellow-500/30 transition-all group">
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:bg-yellow-500/20 transition-all">
                🗳️
              </div>
              <h3 className="font-bold text-lg sm:text-xl mb-2">Govern the Protocol</h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                Token holders vote on signal algorithms, fee structures, and feature priorities. The more you stake, the more your vote counts.
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm text-white/50">
                {[
                  '⚡ Signal parameter voting',
                  '💸 Revenue-sharing splits',
                  '🛠️ Feature roadmap priorities',
                  '🤝 Partnership decisions',
                ].map((item) => (
                  <div key={item} className="text-xs">{item}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Launch Timeline */}
          <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-10">
              <div className="text-yellow-400 text-xs sm:text-sm font-semibold tracking-widest mb-2">LAUNCH ROADMAP</div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tighter">Three phases to full launch</h3>
            </div>
            <div className="relative">
              {/* Connector line */}
              <div className="hidden sm:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-emerald-500/50 via-yellow-500/50 to-blue-500/50" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative">
                {[
                  {
                    phase: 'Phase 1',
                    title: 'Beta Launch',
                    date: 'Q2 2026',
                    status: 'LIVE NOW',
                    statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
                    dotColor: 'bg-emerald-500',
                    items: ['30-day free trial live', 'Trading simulation active', 'Staking contract deployed', '10% supply distributed', 'Community airdrop eligible'],
                  },
                  {
                    phase: 'Phase 2',
                    title: 'Public Token Launch',
                    date: 'Q3 2026',
                    status: 'COMING SOON',
                    statusColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
                    dotColor: 'bg-yellow-500',
                    items: ['DEX listing on Jupiter', 'Full staking rewards live', 'Token address revealed', 'Premium subscriptions', 'CoinGecko / CMC listing'],
                  },
                  {
                    phase: 'Phase 3',
                    title: 'Ecosystem Expansion',
                    date: 'Q4 2026',
                    status: 'PLANNED',
                    statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
                    dotColor: 'bg-blue-500',
                    items: ['On-chain governance voting', 'Revenue-sharing mechanism', 'Advanced tools for holders', 'Cross-protocol integrations', 'Mobile app release'],
                  },
                ].map((phase) => (
                  <div key={phase.phase} className="glass rounded-3xl p-6 border border-white/10 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/40 font-mono">{phase.phase}</div>
                        <div className="font-bold text-base">{phase.title}</div>
                        <div className="text-sm text-white/50 font-mono">{phase.date}</div>
                      </div>
                      <div className={`relative z-10 w-4 h-4 rounded-full border-2 border-zinc-950 ${phase.dotColor} hidden sm:block`} />
                    </div>
                    <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full border ${phase.statusColor}`}>
                      {phase.status}
                    </span>
                    <ul className="space-y-1.5 text-sm text-white/60">
                      {phase.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-white/30 shrink-0 mt-0.5">›</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tokenomics */}
          <div className="max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="text-center mb-6 sm:mb-8">
              <div className="text-yellow-400 text-xs sm:text-sm font-semibold tracking-widest mb-2">TOKENOMICS</div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tighter">1,000,000,000 total supply</h3>
              <p className="text-white/50 text-sm mt-2">Fixed supply. No minting. No inflation.</p>
            </div>
            <div className="glass rounded-3xl border border-white/10 overflow-hidden">
              {[
                { label: 'Community & Staking Rewards', pct: 40, color: 'bg-emerald-500', desc: 'Distributed to stakers over 4 years' },
                { label: 'Public Sale / DEX Liquidity', pct: 25, color: 'bg-yellow-400', desc: 'Initial DEX offering + liquidity pool' },
                { label: 'Team & Advisors', pct: 15, color: 'bg-blue-400', desc: '2-year vesting, 6-month cliff' },
                { label: 'Ecosystem & Partnerships', pct: 10, color: 'bg-purple-400', desc: 'Grants, integrations, BD' },
                { label: 'Early Testers Airdrop', pct: 10, color: 'bg-orange-400', desc: 'Beta users & early believers' },
              ].map((item) => (
                <div key={item.label} className="p-4 sm:p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between mb-2 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${item.color}`} />
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-white/40">{item.desc}</div>
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white shrink-0">{item.pct}%</div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} opacity-70`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA — Get Notified */}
          <div className="text-center">
            <div className="inline-block glass rounded-3xl border border-yellow-500/30 bg-yellow-500/5 p-8 sm:p-10 max-w-lg w-full">
              <div className="text-4xl mb-4">🪿</div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tighter mb-3">Be first in line</h3>
              <p className="text-white/60 text-sm sm:text-base mb-6">
                Early testers get 10% of supply via airdrop. Join the waitlist now to secure your allocation before public launch.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowWaitlist(true)}
                  className="px-7 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-2xl transition-all active:scale-[0.985] text-sm sm:text-base"
                >
                  🎯 Claim Early Allocation
                </button>
                <Link
                  href="/trader?tab=staking"
                  className="px-7 py-3.5 border border-white/20 hover:bg-white/5 font-medium rounded-2xl transition-all active:scale-[0.985] text-sm sm:text-base text-center"
                >
                  View Staking Tiers →
                </Link>
              </div>
              <p className="text-xs text-white/30 mt-4">
                No purchase required to join waitlist · Token address revealed at launch · Airdrop for beta testers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div id="comparison" className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 border-t border-white/10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">How Cletus compares</h2>
          <p className="mt-3 text-white/60 max-w-md mx-auto text-sm sm:text-base">Most tools are just Telegram snipers. Cletus is a full trading intelligence platform.</p>
        </div>

        <div className="overflow-x-auto -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0">
          <table className="w-full min-w-[640px] border border-white/10 rounded-3xl overflow-hidden text-xs sm:text-sm">
            <thead>
              <tr className="bg-white/5">
                <th className="text-left p-4 sm:p-6 font-medium">Feature</th>
                <th className="p-4 sm:p-6 text-center font-medium text-emerald-400">Cletus</th>
                <th className="p-4 sm:p-6 text-center font-medium">Photon</th>
                <th className="p-4 sm:p-6 text-center font-medium">Trojan</th>
                <th className="p-4 sm:p-6 text-center font-medium">BullX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                ['Full Web Dashboard', true, 'Partial', 'TG only', 'Partial'],
                ['AI Chat + Memory', true, false, false, 'Limited'],
                ['Real-time Narrative Briefings', true, false, false, false],
                ['Community Chat + Profiles', true, false, false, false],
                ['Staking-Gated Access', true, false, false, false],
                ['File Integrity + Anti-Tamper', true, false, false, false],
                ['Developer Rug Database', true, 'Basic', false, false],
                ['Self-Hostable / Open Core', true, 'Closed', 'Closed', 'Closed'],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition">
                  <td className="p-4 sm:p-6 font-medium">{row[0]}</td>
                  <td className="p-4 sm:p-6 text-center text-emerald-400">
                    {row[1] === true ? '✓' : typeof row[1] === 'string' ? row[1] : '✗'}
                  </td>
                  <td className="p-4 sm:p-6 text-center text-white/40">{row[2] === false ? '✗' : row[2]}</td>
                  <td className="p-4 sm:p-6 text-center text-white/40">{row[3] === false ? '✗' : row[3]}</td>
                  <td className="p-4 sm:p-6 text-center text-white/40">{row[4] === false ? '✗' : row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tech Stack */}
      <div id="tech" className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 border-t border-white/10">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">Built with modern, battle-tested tech</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 text-center">
          {['TypeScript + Express', 'Drizzle ORM + Postgres', 'WebSocket Broadcaster', 'Gemini 2.0 Flash', 'CoinGecko + DexScreener', 'OpenID Connect ready'].map((tech, i) => (
            <div key={i} className="glass p-4 sm:p-6 rounded-3xl hover:border-white/20 border border-white/10 transition text-xs sm:text-sm">
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="border-t border-white/10 bg-zinc-900 py-12 sm:py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <div className="max-w-lg mx-auto">
            <div className="text-emerald-400 mb-2 text-sm sm:text-base">Ready to trade smarter?</div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-6">Join the Cletus beta today.</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/trader"
                className="px-8 sm:px-10 py-3.5 sm:py-4 bg-emerald-500 hover:bg-emerald-600 transition-all font-semibold rounded-3xl text-base sm:text-lg inline-flex items-center gap-x-2 sm:gap-x-3 active:scale-[0.985]"
              >
                <span>🚀 Launch Trading App</span>
                <span>→</span>
              </Link>
              <button
                onClick={() => setShowWaitlist(true)}
                className="px-8 sm:px-10 py-3.5 sm:py-4 border border-white/20 hover:bg-white/5 transition-all font-medium rounded-3xl text-base sm:text-lg inline-flex items-center gap-x-2 sm:gap-x-3 active:scale-[0.985]"
              >
                <span>Join Waitlist</span>
              </button>
            </div>
            <div className="mt-4 text-xs text-white/50">Limited spots · Staking or trial required for full access</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 sm:py-8 text-xs text-white/40">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-y-3 sm:gap-y-4">
          <div>© 2026 Cletus · Built for serious Solana traders</div>
          <div className="flex gap-x-5 sm:gap-x-6">
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">X / Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div
          onClick={() => setShowWaitlist(false)}
          className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-6 sm:p-8 border border-white/10 bg-zinc-950"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="font-semibold text-xl sm:text-2xl">Join the waitlist</div>
                <div className="text-white/60 text-sm mt-1">Be the first to know when we open new spots.</div>
              </div>
              <button onClick={() => setShowWaitlist(false)} className="text-white/50 hover:text-white text-2xl leading-none ml-4">×</button>
            </div>
            <form onSubmit={submitWaitlist}>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/60 block mb-1.5">Solana Wallet Address</label>
                  <input
                    type="text"
                    placeholder="Your wallet address"
                    className="w-full bg-zinc-900 border border-white/20 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 block mb-1.5">Email (optional)</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-zinc-900 border border-white/20 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 transition-all font-semibold rounded-3xl active:scale-[0.985]"
              >
                Submit Application
              </button>
            </form>
            <div className="text-center mt-4 text-xs text-white/40">
              We&apos;ll review your wallet activity and notify you within 48 hours.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
