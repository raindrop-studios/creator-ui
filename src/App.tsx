import React, { FC, Key, ReactNode, useEffect, useMemo, useState } from "react";

import {
  SolanaMobileWalletAdapter,
  createDefaultAuthorizationResultCache,
} from "@solana-mobile/wallet-adapter-mobile";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
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
import { BaseProvider, DarkTheme } from "baseui";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import useNetwork, { NetworkProvider } from "./hooks/useNetwork";

export const App: FC = () => {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        <Context>
          <Content />
        </Context>
      </BaseProvider>
    </StyletronProvider>
  );
};

const engine = new Styletron();

const Context: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const [selectedNetwork, setSelectedNetwork] = useState<WalletAdapterNetwork>(
    WalletAdapterNetwork.Devnet
  );
  // TODO: Add Network selector toggle
  return (
    <NetworkProvider value={selectedNetwork}>
      <ConnectedWallet>{children}</ConnectedWallet>
    </NetworkProvider>
  );
};

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
      new SolflareWalletAdapter({ network }),
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

const Content: FC = () => {
  return null;
};
