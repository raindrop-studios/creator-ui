import { FC, ReactNode, useMemo, useState } from "react";

import {
  SolanaMobileWalletAdapter,
  createDefaultAuthorizationResultCache,
} from "@solana-mobile/wallet-adapter-mobile";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import useNetwork, {
  getNetworkForWalletAdapter,
  NetworkProvider,
  Networks,
} from "../../hooks/useNetwork";

const ConnectedWallet = ({ children }: { children: ReactNode }) => {
  const { endpoint, network } = useNetwork();

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new SolanaMobileWalletAdapter({
        appIdentity: { name: "Raindrops Creator" },
        authorizationResultCache: createDefaultAuthorizationResultCache(),
      }),
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({
        network: getNetworkForWalletAdapter(network),
      }),
      new TorusWalletAdapter(),
    ],
    [network]
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const ConnectedContext: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<Networks>(
    Networks.Devnet
  );
  return (
    <NetworkProvider
      value={{ network: selectedNetwork, setNetwork: setSelectedNetwork }}
    >
      <ConnectedWallet>{children}</ConnectedWallet>
    </NetworkProvider>
  );
};

export default ConnectedContext;
