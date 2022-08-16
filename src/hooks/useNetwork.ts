import React, { useContext, useMemo } from "react";
import { Connection } from "@raindrop-studios/sol-kit";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import Networks = Connection.Clusters;

const NetworkContext = React.createContext<NetworkContextValue>({
  network: Networks.Devnet,
});

type NetworkContextValue = {
  network: Networks;
  setNetwork?: (arg: Networks) => void;
};

export const NetworkProvider = NetworkContext.Provider;

const useNetwork = () => {
  const { network, setNetwork } = useContext(NetworkContext);
  const endpoint = useMemo(() => Connection.getClusterUrl(network), [network]);
  return { network, endpoint, setNetwork };
};

export const getNetworkForWalletAdapter = (network: Networks) => {
  switch (network) {
    case Networks.Localnet:
      console.warn("No wallet adapter equivalent for localnet");
      break;
    case Networks.Testnet:
      return WalletAdapterNetwork.Testnet;
    case Networks.Devnet:
      return WalletAdapterNetwork.Devnet;
    case Networks.Mainnet:
      return WalletAdapterNetwork.Mainnet;
    default:
      console.warn("No match found for:", network);
  }
  return undefined;
};

export default useNetwork;
export { Networks };
