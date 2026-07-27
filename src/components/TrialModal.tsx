'use client';
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
