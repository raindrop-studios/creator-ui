import { web3 } from "@project-serum/anchor";
import { State } from "@raindrops-protocol/raindrops";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Loading, withCallback } from "./utils";

const getItemClass = async (
  itemClassKey: web3.PublicKey,
  connection: Connection,
) => {
  const accountInfo = await connection.getAccountInfo(itemClassKey);
  if (!accountInfo?.data) return undefined
  return State.Item.decodeItemClass(accountInfo?.data)
};

/**
 * Returns the item class for the given item class key if it exists, else undefined
 * @param itemClassKey Passed as string - this is to avoid re-rendering nightmares with React
 * @returns itemClass if found, else undefined
 */
const useItemClass = (itemClassKey: string | undefined) => {
  const [itemClass, setItemClass] = useState<State.Item.ItemClass>();
  const [currentItemClassKey, setCurrentItemClassKey] = useState<web3.PublicKey>();
  const [loadingState, setLoadingState] = useState<Loading>();
  const { connection } = useConnection();
  useEffect(() => {
    setItemClass(undefined);
    setLoadingState(Loading.Unloaded);
    try {
      if (itemClassKey) {
        const itemClassKeyPublicKey = itemClassKey
          ? new PublicKey(itemClassKey)
          : undefined;
        setCurrentItemClassKey(itemClassKeyPublicKey);
      } else {
        setCurrentItemClassKey(undefined);
      }
    } catch (e) {
        setCurrentItemClassKey(undefined);
    }
  }, [itemClassKey]);
  useEffect(() => {
    if (loadingState === Loading.Unloaded && currentItemClassKey) {
      setLoadingState(Loading.Loading);
      withCallback(async () => {
        let fetchedItemClass: State.Item.ItemClass | undefined;
        try {
          fetchedItemClass = await getItemClass(
            currentItemClassKey,
            connection
          );
          setLoadingState(Loading.Loaded);
        } catch (e) {
          setLoadingState(Loading.Failed);
          setItemClass(undefined)
        }
        return fetchedItemClass;
      }, setItemClass);
    }
  }, [connection, currentItemClassKey, loadingState]);
  return {itemClass, loading: loadingState === Loading.Loading, failed: loadingState === Loading.Failed};
};

export default useItemClass;
