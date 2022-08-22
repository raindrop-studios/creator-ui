import React from "react";

import { BN } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import cloneDeep from "lodash.clonedeep";
import { getItemProgram, State, Utils } from "@raindrops-protocol/raindrops";

import useNetwork, { Networks } from "./useNetwork";
import { getExplorerUrl, ExplorerUrl } from "./utils";

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
  parent?: ItemClassDefinition;
};

export type CreateItemClassArgs = {
  env: Networks;
  config: ItemClassDefinition;
  rpcUrl: string;
  keypair: Keypair;
};

// Adapted from https://github.com/raindrops-protocol/raindrops/blob/0b52ea858ccdf3a95f2f085f0a9fc21060b33d18/js/src/cli/item.ts#L31
const createItemClass = async ({
  env,
  config,
  rpcUrl,
  keypair,
}: CreateItemClassArgs) => {
  const anchorProgram = await getItemProgram(keypair, env, rpcUrl);
  anchorProgram.asyncSigning = true;

  if (config.data.config.components)
    config.data.config.components = config.data.config.components.map((c) => ({
      ...c,
      mint: new PublicKey(c.mint),
      classIndex: new BN(c.classIndex),
      amount: new BN(c.amount),
    }));

  const {txid} = await anchorProgram.createItemClass(
    {
      classIndex: new BN(config.index || 0),
      parentClassIndex: config.parent ? new BN(config.parent.index) : null,
      space: new BN(config.totalSpaceBytes),
      desiredNamespaceArraySize: config.namespaceRequirement,
      updatePermissivenessToUse: config.updatePermissivenessToUse,
      storeMint: config.storeMint,
      storeMetadataFields: config.storeMetadataFields,
      itemClassData: config.data as State.Item.ItemClassData,
      parentOfParentClassIndex: config.parent?.parent
        ? new BN(config.parent.parent.index)
        : null,
    },
    {
      itemMint: new PublicKey(config.mint),
      parent: config.parent
        ? (
            await Utils.PDA.getItemPDA(
              new PublicKey(config.parent.mint),
              new BN(config.parent.index)
            )
          )[0]
        : null,
      parentMint: config.parent ? new PublicKey(config.parent.mint) : null,
      parentOfParentClassMint: config.parent?.parent
        ? new PublicKey(config.parent.parent.mint)
        : null,
      metadataUpdateAuthority: config.metadataUpdateAuthority
        ? new PublicKey(config.metadataUpdateAuthority)
        : keypair.publicKey,
      parentUpdateAuthority: config.parent
        ? config.parent.metadataUpdateAuthority
        : null,
    },
    {}
  );
  return getExplorerUrl({ txId: txid, network: env });
};

const handleCreateItemClass = async ({
  setLoading,
  setSuccess,
  setError,
  setTransactionUrl,
  env,
  config,
  rpcUrl,
  keypair,
}: CreateItemClassArgs & {
  setLoading: Function;
  setSuccess: Function;
  setError: Function;
  setTransactionUrl: Function;
}) => {
  try {
    setLoading(true);
    setSuccess(undefined);
    setTransactionUrl(undefined);
    setError(undefined);
    const transactionUrl = await createItemClass({
      env,
      config: cloneDeep(config),
      rpcUrl,
      keypair,
    });
    setSuccess(true);
    setTransactionUrl(transactionUrl);
  } catch (e) {
    setSuccess(false);
    setError(e);
  } finally {
    setLoading(false);
  }
};

const useCreateItemClass = () => {
  const { network, endpoint } = useNetwork();
  const wallet = useWallet();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean | undefined>();
  const [transactionUrl, setTransactionUrl] =
    React.useState<ExplorerUrl>();
  const [error, setError] = React.useState<Error | undefined>();

  const createItemClassHandler = ({
    config,
  }: Omit<CreateItemClassArgs, "env" | "rpcUrl" | "keypair">) =>
    handleCreateItemClass({
      setLoading,
      setSuccess,
      setError,
      setTransactionUrl,
      env: network,
      config,
      rpcUrl: endpoint,
      keypair: wallet as unknown as Keypair,
    }); // Urgh Typescript

  return {
    loading,
    success,
    error,
    transactionUrl,
    createItemClass: createItemClassHandler,
  };
};

export default useCreateItemClass;
