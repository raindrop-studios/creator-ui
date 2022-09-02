import { State } from "@raindrops-protocol/raindrops";
import { PermissivenessOption } from "./types";

export const PermissivenessOptions: {
  [permissivenessType: string]: PermissivenessOption;
} = {
  [State.PermissivenessType.TokenHolder]: {
    title: "Token Holder",
    description: "In order to do the action, the item class NFT must be held.",
    value: "tokenHolder",
  },
  [State.PermissivenessType.ParentTokenHolder]: {
    title: "Parent Token Holder",
    description:
      "In order to do the action, the parent class of this class NFT must be held.",
    value: "parentTokenHolder",
  },
  [State.PermissivenessType.UpdateAuthority]: {
    title: "Update Authority",
    description:
      "In order to do the action, the signer must be the update authority on the metadata of the item class or item.",
    value: "updateAuthority",
  },
  [State.PermissivenessType.Anybody]: {
    title: "Anybody",
    description:
      "Anybody can do this action. There are no requirements to be met.",
    value: "anybody",
  },
};

export const ChildUpdatePropagationPermissivenessOptions: {
  [permissivenessType: string]: PermissivenessOption;
} = {
  [State.ChildUpdatePropagationPermissivenessType.BuildPermissiveness]: {
    title: "Build Permissiveness",
    description: "Permissions to build items from the item class",
    value: "buildPermissiveness",
  },
  [State.ChildUpdatePropagationPermissivenessType.UpdatePermissiveness]: {
    title: "Update Permissiveness",
    description: "Permissions to update the item class",
    value: "updatePermissiveness",
  },
  [State.ChildUpdatePropagationPermissivenessType
    .BuilderMustBeHolderPermissiveness]: {
    title: "Builder Must Be Holder Permissiveness",
    description:
      "Permission to determine if the builder needs to hold the item",
    value: "builderMustBeHolderPermissiveness",
  },
  [State.ChildUpdatePropagationPermissivenessType
    .ChildUpdatePropagationPermissiveness]: {
    title: "Child Propagation Permissiveness",
    description:
      "Permissions to determine propagation to children (these questions)",
    value: "childUpdatePropagationPermissiveness",
  },
  [State.ChildUpdatePropagationPermissivenessType
    .ChildrenMustBeEditionsPermissiveness]: {
    title: "Editions Permissiveness",
    description:
      "Permissions to determine if children should be limited to editions",
    value: "childrenMustBeEditionsPermissiveness",
  },
  [State.ChildUpdatePropagationPermissivenessType.Components]: {
    title: "Componenets Permissiveness",
    description: "Permissions related to components",
    value: "components",
  },
  [State.ChildUpdatePropagationPermissivenessType.Usages]: {
    title: "Usages Permissiveness",
    description: "Permissions related to usages",
    value: "usages",
  },
  [State.ChildUpdatePropagationPermissivenessType.Namespaces]: {
    title: "Namespaces Permissiveness",
    description: "Permissions related to namespaces",
    value: "namespaces",
  },
  [State.ChildUpdatePropagationPermissivenessType.FreeBuildPermissiveness]: {
    title: "Free Build Permissiveness",
    description: "Permissions if the item requires components or not",
    value: "freeBuildPermissiveness",
  },
  [State.ChildUpdatePropagationPermissivenessType.StakingPermissiveness]: {
    title: "Staking Permissiveness",
    description: "Permissions related to staking",
    value: "stakingPermissiveness",
  },
};

