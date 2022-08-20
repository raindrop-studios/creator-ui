import { BN, web3 } from "@project-serum/anchor";
import { Utils } from "@raindrops-protocol/raindrops";
import { Connection } from "@solana/web3.js";
import { Connection as ConnectionUtils } from "@raindrop-studios/sol-kit";
import { getNetworkForWalletAdapter, Networks } from "./useNetwork";

export const withCallback = async (asyncFunction: Function, callback: Function) => {
  const response = await asyncFunction();
  callback(response);
};

export enum Loading {
  Unloaded = 0,
  Loading = 1,
  Loaded = 2,
  Failed = 3,
}

export const getItemClassInfo = async (
  tokenMint: web3.PublicKey,
  index: number,
  connection: Connection
) => {
  const [itemClassKey] = await Utils.PDA.getItemPDA(tokenMint, new BN(index));
  const accountInfo = await connection.getParsedAccountInfo(itemClassKey);
  return accountInfo;
};

export type ExplorerUrl = string | undefined

export const getExplorerUrl = ({
  txId,
  network,
}: {
  txId: string;
  network: Networks;
}): ExplorerUrl => {
  const networkFilter =
    getNetworkForWalletAdapter(network) ||
    `custom&customUrl=${ConnectionUtils.getClusterUrl(network)}`;
  if (txId) {
    return `https://explorer.solana.com/tx/${txId}?cluster=${networkFilter}`;
  }
};