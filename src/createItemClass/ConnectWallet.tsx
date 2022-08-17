import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Block } from "baseui/block";
import { useEffect } from "react";
import { SubStepProps } from "../components/Wizard/FormStep"

const ConnectWallet = ({handleSubmit}: SubStepProps) => {
    const { publicKey, disconnecting } = useWallet();
    useEffect(() => {
      if (publicKey && !disconnecting) {
        handleSubmit({ connectedWallet: publicKey });
      }
    }, [publicKey, disconnecting]);
    return (
      <Block maxWidth="400px" alignSelf="center">
        <WalletMultiButton />
      </Block>
    );
}

const title = "Connect wallet"
const hash = "connect-wallet"

export {
    ConnectWallet as Component,
    title,
    hash,
}