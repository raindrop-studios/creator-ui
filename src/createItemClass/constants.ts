import { State } from "@raindrops-protocol/raindrops";
import { PermissivenessArray } from "../components/Wizard/Inputs/Permissiveness";
import { ChildUpdatePropagationPermissivenessArray } from "../components/Wizard/Inputs/Permissiveness/types";

export type ItemClassFormData = {
  connectedWallet: string;
  name?: string;
  mint: string;
  index: number;
  hasParent: boolean;
  parentItemClassKey?: string;
  freeBuild: boolean;
  freeBuild_inheritedboolean: State.InheritedBoolean;
  hasComponents: boolean;
  hasUses: boolean;
  metadataUpdateAuthority?: string;
  builderMustBeHolder: boolean;
  builderMustBeHolder_inheritedboolean: State.InheritedBoolean;
  childrenMustBeEditions?: boolean;
  childrenMustBeEditions_inheritedboolean?: State.InheritedBoolean;
  parent?: string;
  parent_itemclass?: State.Item.ItemClass;
  permissivenessToUse: State.PermissivenessType;
  buildPermissiveness_array: PermissivenessArray;
  updatePermissiveness_array: PermissivenessArray;
  childUpdatePropagationPermissiveness_array: ChildUpdatePropagationPermissivenessArray;
};

export const InheritedProperties = [
  "freeBuild",
  "freeBuild_inheritedboolean",
  "builderMustBeHolder",
  "builderMustBeHolder_inheritedboolean",
  "childrenMustBeEditions",
  "childrenMustBeEditions_inheritedboolean",
  "metadataUpdateAuthority",
  "buildPermissiveness",
  "buildPermissiveness_array",
  "updatePermissiveness",
  "updatePermissiveness_array",
  "childUpdatePropagationPermissiveness",
  "childUpdatePropagationPermissiveness_array",
  "permissivenessToUse",
];
