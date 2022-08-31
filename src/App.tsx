import { FC, ReactNode, useState } from "react";
import { BaseProvider, DarkTheme } from "baseui";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import {
  NetworkProvider,
  Networks,
} from "./hooks/useNetwork";
import { CreateItemClassWizard } from "./createItemClass";
import { Header } from "./components/Header";
import { Block } from "baseui/block";
import ConnectedWallet from "./components/ConnectedWallet";

export const App: FC = () => {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        <Context>
          <Block
            display="flex"
            flexDirection="column"
            $style={{ minWidth: "100vw", minHeight: "100vh" }}
          >
            <Header />
            <CreateItemClassWizard />
          </Block>
        </Context>
      </BaseProvider>
    </StyletronProvider>
  );
};

const engine = new Styletron();

const Context: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
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
