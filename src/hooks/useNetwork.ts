import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import React, { useContext, useMemo } from "react";

const NetworkContext = React.createContext<NetworkContextValue>({
  network: WalletAdapterNetwork.Testnet
});

type NetworkContextValue = {
    network: WalletAdapterNetwork,
    setNetwork?: (arg: WalletAdapterNetwork) => void;
}

export const NetworkProvider = NetworkContext.Provider;

const useNetwork = () => {
  const {network, setNetwork} = useContext(NetworkContext);
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  return { network, endpoint, setNetwork };
};

export default useNetwork;
