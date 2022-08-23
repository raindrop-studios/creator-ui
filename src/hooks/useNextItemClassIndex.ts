import { web3 } from "@project-serum/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { range } from "lodash";
import { getItemClassInfo, Loading, withCallback } from "./utils";

const getNextItemClassIndex = async (
  tokenMint: web3.PublicKey,
  connection: Connection,
  maxTries = 50
) => {
  let index;
  for (let i of range(maxTries)) {
    const accountInfo = await getItemClassInfo(tokenMint, i, connection);
    if (!accountInfo) {
      index = i;
      break;
    }
  }
  if (index === undefined) {
    throw RangeError(
      `Item classes were found for all indices up to ${maxTries}`
    );
  }
  return index;
};

/**
 * Finds the next available (unused) item class index for the given token mint
 * @param tokenMint Passed as string - this is to avoid re-rendering nightmares with React
 * @returns index as a number if found, else undefined
 */
const useNextItemClassIndex = (tokenMint: string | undefined) => {
  const [nextIndex, setNextIndex] = useState<number>();
  const [currentToken, setCurrentToken] = useState<web3.PublicKey>();
  const [loadingState, setLoadingState] = useState<Loading>();
  const { connection } = useConnection();
  useEffect(() => {
    setNextIndex(undefined);
    setLoadingState(Loading.Unloaded);
    if (tokenMint) {
      const tokenMintPublicKey = tokenMint
        ? new PublicKey(tokenMint)
        : undefined;
      setCurrentToken(tokenMintPublicKey);
    } else {
      setCurrentToken(undefined);
    }
  }, [tokenMint]);
  useEffect(() => {
    if (loadingState === Loading.Unloaded && currentToken) {
      setLoadingState(Loading.Loading);
      withCallback(async () => {
        let index: number | undefined;
        try {
          index = await getNextItemClassIndex(currentToken, connection);
          setLoadingState(Loading.Loaded);
        } catch (e) {
          console.log(e);
          setLoadingState(Loading.Failed);
        }
        return index;
      }, setNextIndex);
    }
  }, [connection, currentToken, loadingState]);
  return {nextIndex, loading: loadingState !== Loading.Loaded};
};

export default useNextItemClassIndex;
