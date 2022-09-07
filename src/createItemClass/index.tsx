import { useEffect, useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

import { Wizard } from "../components/Wizard";
import useNetwork from "../hooks/useNetwork";
import { CreateItemClassArgs } from "../hooks/useCreateItemClass";

import * as ConnectWallet from "./ConnectWallet";
import * as NameItem from "./NameItem";
import * as TokenSelect from "./TokenSelect";
import * as ItemClassIndex from "./ItemClassIndex";
import * as HasParent from "./HasParent";
import * as ParentItemClass from "./ParentItemClass";
import * as BuildPermissiveness from "./BuildPermissiveness";
import * as UpdatePermissiveness from "./UpdatePermissiveness";
import * as Freebuild from "./Freebuild";
import * as HasUses from "./HasUses";
import * as ChildSettings from "./ChildSettings";
import * as ChildrenMustBeEditions from "./ChildrenMustBeEditions";
import * as Review from "./Review";
import { ItemClassFormData } from "./constants";

const CreateItemClassWizard = () => {
  const { network } = useNetwork();
  const [restart, setRestart] = useState<Date>();
  const { disconnect } = useWallet();
  const [data, setData] = useState<any>({});
  const disconnectAndRestart = async () => {
    await disconnect();
    setData({});
    setRestart(new Date());
  };
  useEffect(() => {
    disconnectAndRestart();
  }, [network]);
  return (
    <Wizard values={data} setValues={setData} restartOnChange={restart}>
      <Wizard.Step
        title={ConnectWallet.title}
        hash={ConnectWallet.hash}
        Component={ConnectWallet.Component}
      />
      <Wizard.Step
        title={NameItem.title}
        hash={NameItem.hash}
        Component={NameItem.Component}
      />
      <Wizard.Step
        title={TokenSelect.title}
        hash={TokenSelect.hash}
        Component={TokenSelect.Component}
        name="mint"
      />
      <Wizard.Step
        title={ItemClassIndex.title}
        hash={ItemClassIndex.hash}
        Component={ItemClassIndex.Component}
      />
      <Wizard.Step
        title={HasParent.title}
        hash={HasParent.hash}
        Component={HasParent.Component}
      />
      {data?.hasParent && (
        <Wizard.Step
          title={ParentItemClass.title}
          hash={ParentItemClass.hash}
          Component={ParentItemClass.Component}
        />
      )}
      <Wizard.Step
        title={BuildPermissiveness.title}
        hash={BuildPermissiveness.hash}
        Component={BuildPermissiveness.Component}
      />
      <Wizard.Step
        title={UpdatePermissiveness.title}
        hash={UpdatePermissiveness.hash}
        Component={UpdatePermissiveness.Component}
      />
      <Wizard.Step
        title={Freebuild.title}
        hash={Freebuild.hash}
        Component={Freebuild.Component}
      />
      <Wizard.Step
        title={HasUses.title}
        hash={HasUses.hash}
        Component={HasUses.Component}
      />
      <Wizard.Step
        title={ChildSettings.title}
        hash={ChildSettings.hash}
        Component={ChildSettings.Component}
      />
      {data?.mint_metadata?.tokenStandard === TokenStandard.NonFungible && (
        <Wizard.Step
          title={ChildrenMustBeEditions.title}
          hash={ChildrenMustBeEditions.hash}
          Component={ChildrenMustBeEditions.Component}
        />
      )}
      <Wizard.Step
        title={Review.title}
        hash={Review.hash}
        Component={Review.Component}
        clean={prepareItemClassConfig}
      />
    </Wizard>
  );
};

function prepareItemClassConfig(
  data: ItemClassFormData
): CreateItemClassArgs["config"] {
  const {
    metadataUpdateAuthority,
    mint,
    index,
    freeBuild_inheritedboolean,
    builderMustBeHolder_inheritedboolean,
    childrenMustBeEditions_inheritedboolean,
    parent_itemclass: parentItemClass,
    parent,
    permissivenessToUse = null,
    buildPermissiveness_array,
    updatePermissiveness_array,
    childUpdatePropagationPermissiveness_array,
  } = data;
  const updatePermissivenessToUse = permissivenessToUse
    ? { [permissivenessToUse]: true }
    : null;
  return {
    data: {
      settings: {
        freeBuild: freeBuild_inheritedboolean,
        childrenMustBeEditions: childrenMustBeEditions_inheritedboolean || null,
        builderMustBeHolder: builderMustBeHolder_inheritedboolean,
        // @ts-ignore
        updatePermissiveness: updatePermissiveness_array || null,
        // @ts-ignore
        buildPermissiveness: buildPermissiveness_array || null,
        stakingWarmUpDuration: null,
        stakingCooldownDuration: null,
        stakingPermissiveness: null,
        unstakingPermissiveness: null,
        // @ts-ignore
        childUpdatePropagationPermissiveness:
          childUpdatePropagationPermissiveness_array || null,
      },
      config: {
        usageRoot: null,
        usageStateRoot: null,
        componentRoot: null,
        usages: [],
        components: [],
      },
    },
    metadataUpdateAuthority: metadataUpdateAuthority || null,
    storeMint: true,
    storeMetadataFields: true,
    mint,
    index,
    parent: parentItemClass,
    parentKey: parent,
    updatePermissivenessToUse,
    namespaceRequirement: 1,
    totalSpaceBytes: 300,
  };
}

export { CreateItemClassWizard };
