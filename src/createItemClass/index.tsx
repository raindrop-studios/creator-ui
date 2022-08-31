import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { Wizard } from "../components/Wizard";
import * as ConnectWallet from "./ConnectWallet";
import * as NameItem from "./NameItem";
import * as TokenSelect from "./TokenSelect";
import * as ItemClassIndex from "./ItemClassIndex";
import * as HasParent from "./HasParent";
import * as ParentItemClass from "./ParentItemClass";
import * as MetadataUpdateAuthority from "./MetadataUpdateAuthority";
import * as Freebuild from "./Freebuild";
import * as HasUses from "./HasUses";
import * as Review from "./Review";
import * as BuilderMustBeHolder from "./BuilderMustBeHolder";
import * as ChildrenMustBeEditions from "./ChildrenMustBeEditions";
import useNetwork from "../hooks/useNetwork";
import { CreateItemClassArgs } from "../hooks/useCreateItemClass";
import { State } from "@raindrops-protocol/raindrops";

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
      {data?.hasParent ? (
        <Wizard.Step
          title={ParentItemClass.title}
          hash={ParentItemClass.hash}
          Component={ParentItemClass.Component}
        />
      ) : (
        <Wizard.Step
          title={MetadataUpdateAuthority.title}
          hash={MetadataUpdateAuthority.hash}
          Component={MetadataUpdateAuthority.Component}
        />
      )}
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
        title={BuilderMustBeHolder.title}
        hash={BuilderMustBeHolder.hash}
        Component={BuilderMustBeHolder.Component}
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
    freeBuild,
    builderMustBeHolder,
    childrenMustBeEditions = null,
    parent_itemclass: parentItemClass,
  } = data;
  return {
    data: {
      settings: {
        freeBuild: {
          boolean: freeBuild,
          // @ts-ignore
          inherited: { notInherited: true }, // State.InheritanceState.NotInherited,
        },
        // @ts-ignore
        childrenMustBeEditions:
          childrenMustBeEditions === null
            ? null
            : {
                boolean: childrenMustBeEditions,
                inherited: { notInherited: true }, // State.InheritanceState.NotInherited,
              },
        builderMustBeHolder: {
          boolean: builderMustBeHolder,
          // @ts-ignore
          inherited: { notInherited: true }, // State.InheritanceState.NotInherited,
        },
        updatePermissiveness: null,
        buildPermissiveness: [
          {
            // @ts-ignore
            permissivenessType: {
              tokenHolder: true,
            },
            // @ts-ignore
            inherited: {
              notInherited: true,
            },
          },
        ],
        stakingWarmUpDuration: null,
        stakingCooldownDuration: null,
        stakingPermissiveness: null,
        unstakingPermissiveness: null,
        childUpdatePropagationPermissiveness: [],
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
    updatePermissivenessToUse: {
      tokenHolder: true,
    },
    namespaceRequirement: 1,
    totalSpaceBytes: 300,
  };
}

type ItemClassFormData = {
  connectedWallet: string;
  name?: string;
  mint: string;
  index: number;
  hasParent: boolean;
  parentItemClassKey?: string;
  freeBuild: boolean;
  hasComponents: boolean;
  hasUses: boolean;
  metadataUpdateAuthority?: string;
  builderMustBeHolder: boolean;
  childrenMustBeEditions?: boolean;
  parent?: string;
  parent_itemclass?: State.Item.ItemClass;
};

export { CreateItemClassWizard };
