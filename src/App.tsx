// import React from 'react';
import { createConfig, http, WagmiProvider, useAccount } from 'wagmi';
// import { injected } from 'wagmi/connectors';
import { mainnet } from 'wagmi/chains';
import { Wallet, AlertCircle } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SwapInterface from './components/SwapInterface';
import ConnectWallet from './components/ConnectWallet';

// Configure wagmi
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

// Create a client for react-query
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function AppContent() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">Uniswap V4 Token Swap</h1>
            <ConnectWallet />
          </div>
          
          {isConnected ? (
            <SwapInterface />
          ) : (
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <Wallet className="mx-auto h-12 w-12 text-blue-400 mb-3" />
              <p className="text-white mb-4">Connect your wallet to start swapping tokens on Uniswap V4</p>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-start gap-2 text-yellow-400 bg-yellow-400/10 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                This is a demo application. Always verify token addresses and transaction details before swapping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;