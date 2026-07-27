export default function InvestorRelations() {
  return (
    <div className="glass p-8 rounded-3xl">
      <h2 className="text-3xl font-bold">Investor Relations</h2>
      <p className="text-white/70 mt-2">Where your trading fees and staking rewards go</p>
      <div className="mt-8 grid gap-6">
        {[
          { name: 'AI & Development', pct: 35 },
          { name: 'Staking Rewards', pct: 30 },
          { name: 'Liquidity', pct: 20 },
          { name: 'Community', pct: 15 }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span>{item.name}</span>
                <span className="font-mono">{item.pct}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-white/40 mt-6">On-chain verifiable. Updated weekly.</p>
    </div>
  );
}'use client';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function TrialModal({ open, onClose }) {
  const { connect, publicKey } = useWallet();
  const [active, setActive] = useState(false);

  const activate = async () => {
    if (!publicKey) await connect();
    // Backend call to start trial
    await fetch('/api/trial/start', { method: 'POST', body: JSON.stringify({ wallet: publicKey?.toBase58() }) });
    setActive(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="glass max-w-md w-full rounded-3xl p-8">
        <h2 className="text-3xl font-bold">30-Day Free Trial</h2>
        <p className="text-white/70 mt-2">Full access to Live Chat, Scanner, and Trading</p>
        <button onClick={activate} className="mt-8 w-full py-4 bg-emerald-500 rounded-3xl font-semibold">
          {publicKey ? 'Activate Trial' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
}
// src/components/GeminiLiveChat.tsx (new or replace existing)
'use client';

import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function GeminiLiveChat() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "I'm Cletus Live. What are we hunting today? 🚀" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { publicKey } = useWallet();
  const endRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/ai/route', { // or your existing /api/ai
      method: 'POST',
      body: JSON.stringify({ message: input, wallet: publicKey?.toBase58(), history: messages })
    });
    const data = await res.json();

    setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    setLoading(false);
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div className="glass h-[520px] flex flex-col rounded-3xl border border-white/10">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : ''}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-emerald-500 text-black' : 'bg-white/5'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-white/50">Cletus thinking...</div>}
        <div ref={endRef} />
      </div>
      <div className="p-4 border-t border-white/10 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} className="flex-1 bg-zinc-900 border border-white/20 rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500" placeholder="Ask about any token..." />
        <button onClick={send} className="px-6 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-semibold">Send</button>
      </div>
    </div>
  );
}
