'use client';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, configureChains,    } from 'wagmi';

// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { hardhat, sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';




// const { chains, provider } = configureChains(
//   [hardhat, sepolia],
//   [
//     jsonRpcProvider({
//       rpc: (chain) => {
//         if (chain.id === hardhat.id) {
//           return { http: 'http://localhost:8545' }; // The address of your local Hardhat node
//         }
//         return { http: `https://eth-sepolia.g.alchemy.com/v2/BcIwHYicbScYCJyKTU0o9yPFyry9Q1aJ` }; // Your Sepolia RPC URL
//       },
//     }),
//   ]
// );


export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: '993b08e22e1c412bbcecfa71832a9b98',
  chains: [hardhat, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
const queryClient = new QueryClient();

const CustomRainbowKitProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default CustomRainbowKitProvider;
