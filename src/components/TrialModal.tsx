'use client';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

interface TrialModalProps {
  open: boolean;
  onClose: () => void;
  onActivated?: () => void;
}

export default function TrialModal({ open, onClose, onActivated }: TrialModalProps) {
  const { connect, publicKey, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const activate = async () => {
    if (!publicKey) {
      if (!wallet) {
        setVisible(true);
        return;
      }
      try {
        await connect();
      } catch (err) {
        setError('Please connect your wallet first.');
        return;
      }
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/trial/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: publicKey.toBase58() }),
      });
      if (res.ok) {
        setActive(true);
        if (onActivated) {
          onActivated();
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to start free trial.');
      }
    } catch {
      setError('Network error, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[100] backdrop-blur-sm">
      <div className="trading-card max-w-md w-full rounded-3xl p-8 border border-trading-border relative overflow-hidden bg-trading-bg/95">
        <div className="absolute inset-0 bg-gradient-to-br from-trading-green/5 via-transparent to-trading-blue/5 pointer-events-none" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl"
        >
          ✕
        </button>

        {active ? (
          <div className="text-center py-4 space-y-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl font-bold text-trading-green">Trial Activated!</h2>
            <p className="text-gray-300 text-sm">
              Your 30-Day Free Trial is now active. You have full access to Live Chat, AI Scanner, and Autonomous Trading.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full py-3 bg-trading-green text-black rounded-xl font-bold text-sm hover:bg-trading-green/90 transition-all active:scale-[0.98]"
            >
              Let's Trade!
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-4xl">⏱</span>
              <h2 className="text-2xl font-bold text-white mt-2">30-Day Free Trial</h2>
              <p className="text-gray-400 text-sm mt-1">No credit card or deposit required</p>
            </div>
            
            <div className="bg-trading-surface rounded-xl p-4 border border-trading-border space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-trading-green">✓</span>
                <span>Full access to all AI Trading features</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-trading-green">✓</span>
                <span>Real-time On-Chain Signals & Scanner</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-trading-green">✓</span>
                <span>Cletus AI Brain (Gemini Integration)</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Activate your trial to unlock the autonomous trading suite. Standard tier limit applies ($5,000 max position, 3 concurrent trades).
            </p>

            {error && <p className="text-xs text-trading-red text-center">{error}</p>}

            <button
              onClick={activate}
              disabled={isLoading}
              className="mt-4 w-full py-3.5 bg-trading-green text-black rounded-xl font-bold text-sm hover:bg-trading-green/90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'Activating…' : publicKey ? 'Activate 30-Day Trial' : 'Connect Wallet to Activate'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

