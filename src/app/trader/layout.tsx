import SolanaWalletProvider from '@/components/WalletProvider';
import { SimulationProvider } from '@/context/SimulationContext';

export default function TraderLayout({ children }: { children: React.ReactNode }) {
  return (
    <SolanaWalletProvider>
      <SimulationProvider>{children}</SimulationProvider>
    </SolanaWalletProvider>
  );
}
