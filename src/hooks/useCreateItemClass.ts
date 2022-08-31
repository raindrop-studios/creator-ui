import { useState } from "react";

import { BN } from "@project-serum/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import cloneDeep from "lodash.clonedeep";
import { getItemProgram, State } from "@raindrops-protocol/raindrops";

import useNetwork, { Networks } from "./useNetwork";
import { getExplorerUrl, ExplorerUrl, getItemClass, Loading } from "./utils";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

export type ItemClassDefinition = {
  data: State.Item.ItemClassData;
  metadataUpdateAuthority: any | null;
  storeMint: boolean;
  storeMetadataFields: boolean;
  mint: string;
  index: number;
  updatePermissivenessToUse: State.AnchorPermissivenessType | null;
  namespaceRequirement: number;
  totalSpaceBytes: number;
  parent?: State.Item.ItemClass;
  parentKey?: string;
};

export type CreateItemClassArgs = {
  env: Networks;
  config: ItemClassDefinition;
  rpcUrl: string;
  wallet: NodeWallet;
  connection: Connection;
};

// Adapted from https://github.com/raindrops-protocol/raindrops/blob/0b52ea858ccdf3a95f2f085f0a9fc21060b33d18/js/src/cli/item.ts#L31
const createItemClass = async ({
  env,
  config,
  rpcUrl,
  wallet,
  connection,
}: CreateItemClassArgs) => {
  const anchorProgram = await getItemProgram(wallet, env, rpcUrl);
  anchorProgram.asyncSigning = true; // For client signing, set to async

  if (config.data.config.components) {
    config.data.config.components = config.data.config.components.map((c) => ({
      ...c,
      mint: new PublicKey(c.mint),
      classIndex: new BN(c.classIndex),
      amount: new BN(c.amount),
    }));
  }

  const parentOfParentClassData = config?.parent?.parent
    ? await getItemClass(config?.parent?.parent, connection)
    : null;
  const { txid } = await anchorProgram.createItemClass(
    {
      classIndex: new BN(config.index || 0),
      parentClassIndex: null,
      space: new BN(config.totalSpaceBytes),
      desiredNamespaceArraySize: config.namespaceRequirement,
      updatePermissivenessToUse: config.updatePermissivenessToUse,
      storeMint: config.storeMint,
      storeMetadataFields: config.storeMetadataFields,
      itemClassData: config.data as State.Item.ItemClassData,
      parentOfParentClassIndex: null,
    },
    {
      itemMint: new PublicKey(config.mint),
      parent: config?.parentKey ? new PublicKey(config?.parentKey) : null,
      parentMint: config?.parent?.mint
        ? new PublicKey(config?.parent?.mint)
        : null,
      // @ts-ignore
      parentOfParentClass: config?.parent?.parent || null,
      parentOfParentClassMint: parentOfParentClassData?.mint
        ? new PublicKey(parentOfParentClassData.mint)
        : null,
      metadataUpdateAuthority: config.metadataUpdateAuthority
        ? new PublicKey(config.metadataUpdateAuthority)
        : wallet.publicKey,
      parentUpdateAuthority: null, 
      // config.parent
      //  ? config.parent.metadataUpdateAuthority // QUESTION: Where can we get this from?
      //  : null,
    },
    {}
  );
  return getExplorerUrl({ txId: txid, network: env });
};

const handleCreateItemClass = async ({
  setLoadingState,
  setError,
  setTransactionUrl,
  env,
  config,
  rpcUrl,
  wallet,
  connection,
}: CreateItemClassArgs & {
  setLoadingState: Function;
  setSuccess: Function;
  setError: Function;
  setTransactionUrl: Function;
}) => {
  try {
    setLoadingState(Loading.Loading);
    setTransactionUrl(undefined);
    setError(undefined);
    const transactionUrl = await createItemClass({
      env,
      config: cloneDeep(config),
      rpcUrl,
      wallet,
      connection,
    });
    setLoadingState(Loading.Loaded);
    setTransactionUrl(transactionUrl);
  } catch (e) {
    setLoadingState(Loading.Failed);
    setError(e);
  }
};

const useCreateItemClass = () => {
  const { network, endpoint } = useNetwork();
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loadingState, setLoadingState] = useState<Loading>();
  const [transactionUrl, setTransactionUrl] = useState<ExplorerUrl>();
  const [error, setError] = useState<Error | undefined>();

  const createItemClassHandler = ({
    config,
  }: Omit<CreateItemClassArgs, "env" | "rpcUrl" | "wallet" | "connection">) =>
    handleCreateItemClass({
      setLoadingState,
      setError,
      setTransactionUrl,
      env: network,
      config,
      rpcUrl: endpoint,
      // @ts-ignore
      wallet,
      connection,
    });

  return {
    loading: loadingState === Loading.Loading,
    success: loadingState === Loading.Loaded,
    error,
    transactionUrl,
    createItemClass: createItemClassHandler,
  };
};

export default useCreateItemClass;
