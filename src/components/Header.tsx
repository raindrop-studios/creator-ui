import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationItem as NavigationItem,
  StyledNavigationList as NavigationList,
} from 'baseui/header-navigation';
import {StyledLink as Link} from 'baseui/link';
import { Button, SIZE } from "baseui/button";
import { ChevronDown } from "baseui/icon";
import { StatefulPopover, PLACEMENT } from "baseui/popover";
import { StatefulMenu } from "baseui/menu";
import useNetwork from '../hooks/useNetwork';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

function Header() {
  const {network, setNetwork} = useNetwork();
  return (
    <HeaderNavigation>
      <NavigationList $align={ALIGN.left}>
        <NavigationItem>Raindrop Protocol: Creator</NavigationItem>
      </NavigationList>
      <NavigationList $align={ALIGN.center}>
        <NavigationItem>
          <Link href="/">Create Item Class</Link>
        </NavigationItem>
        <NavigationItem>
          <Link href="https://long-banana.gitbook.io/raindrops/">
            Documentation
          </Link>
        </NavigationItem>
      </NavigationList>
      <NavigationList $align={ALIGN.right}>
        <NavigationItem $style={{ marginRight: "40px" }}>
          <NetworkDropdown selectedNetwork={network} setNetwork={setNetwork} />
        </NavigationItem>
      </NavigationList>
    </HeaderNavigation>
  );
}

function NetworkDropdown({selectedNetwork, setNetwork}: {selectedNetwork: WalletAdapterNetwork, setNetwork?: (arg: WalletAdapterNetwork) => void;}) {
    const button = (
      <Button size={SIZE.compact} endEnhancer={<ChevronDown size={24} />}>{selectedNetwork}</Button>
    );
    return setNetwork ? (
      <StatefulPopover
        focusLock
        placement={PLACEMENT.bottomLeft}
        content={({ close }) => (
          <StatefulMenu
            items={[
              {
                label: WalletAdapterNetwork.Devnet,
                value: WalletAdapterNetwork.Devnet,
              },
              {
                label: WalletAdapterNetwork.Mainnet,
                value: WalletAdapterNetwork.Mainnet,
                disabled: true,
              },
            ]}
            onItemSelect={({ item }) => {
              setNetwork(item.value);
              close();
            }}
          />
        )}
      >
        {button}
      </StatefulPopover>
    ) : button;
}

export {Header}